import prisma from '../config/prisma.js';

export const AnalyticsController = {
    getBudgetForecast: async (req, res) => {
        try {
            const inflationRate = parseFloat(req.query.inflationRate) || 0.03; // Default 3%

            // Get total payments (expenditures)
            // We assume 'payment' table represents expenses/revenue.
            // We'll try to get payments from the last year to base our projection on.

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            // Check if we have date in payment? No, date is in ride.
            const payments = await prisma.payment.findMany({
                where: {
                    ride: {
                        date: {
                            gte: oneYearAgo
                        }
                    }
                },
                include: {
                    ride: true
                }
            });

            let baseAmount = 0;
            if (payments.length > 0) {
                baseAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
            } else {
                // Fallback if no data in last year: get ALL payments
                const allPayments = await prisma.payment.findMany();
                baseAmount = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
            }

            const forecast = [];
            let currentAmount = baseAmount;

            for (let i = 1; i <= 3; i++) {
                currentAmount = currentAmount * (1 + inflationRate);
                forecast.push({
                    year: `Year +${i}`,
                    amount: currentAmount.toFixed(2),
                    inflationRate: (inflationRate * 100).toFixed(1) + '%'
                });
            }

            res.json({
                baseAmount: baseAmount.toFixed(2),
                inflationRate: (inflationRate * 100).toFixed(1) + '%',
                forecast: forecast,
                note: "Based on total payments from the last year (or all time if limited data)."
            });

        } catch (error) {
            console.error("Error in getBudgetForecast:", error);
            res.status(500).json({ error: 'Failed to generate forecast' });
        }
    },

    getTopDrivers: async (req, res) => {
        try {
            const n = parseInt(req.query.n) || 5;
            const type = req.query.type || 'best'; // 'best' or 'worst'

            const order = type === 'worst' ? 'ASC' : 'DESC';

            // Raw Query to join driver -> ride -> rating
            // We need to be careful with SQL injection if we were injecting strings, but 'n' is int and order is controlled.

            // Note: Prisma raw query returns BigInt for counts, we need to handle serialization if needed, 
            // but here we map it.

            const query = `
                SELECT d.name, d.email, AVG(r.score) as avg_score, COUNT(r.rating_id) as review_count
                FROM driver d
                JOIN ride ri ON d.driver_id = ri.driver_id
                JOIN rating r ON ri.ride_id = r.ride_id
                GROUP BY d.driver_id
                ORDER BY avg_score ${order}
                LIMIT ${n}
            `;

            const topDrivers = await prisma.$queryRawUnsafe(query);

            const formatted = topDrivers.map(d => ({
                name: d.name,
                email: d.email,
                avgScore: parseFloat(d.avg_score).toFixed(2),
                reviewCount: Number(d.review_count)
            }));

            res.json(formatted);

        } catch (error) {
            console.error("Error in getTopDrivers:", error);
            res.status(500).json({ error: 'Failed to fetch top drivers' });
        }
    },

    getTableAnalytics: async (req, res) => {
        try {
            const { tableName } = req.params;

            // Whitelist of allowed tables to prevent SQL injection
            const allowedTables = ['driver', 'ride', 'payment', 'rating', 'user'];

            if (!tableName || !allowedTables.includes(tableName)) {
                return res.status(400).json({ error: 'Invalid or unauthorized table name provided.' });
            }

            // Get row count
            const rowCount = await prisma[tableName].count();

            // Attempt to get numeric column aggregates
            // This part is database-specific and relies on common column names.
            // For a more robust solution, one would query information_schema or
            // have a predefined schema mapping.
            const numericAggregates = {};

            // Example: Common numeric columns across tables
            const commonNumericColumns = {
                ride: ['price', 'distance', 'duration', 'start_latitude', 'start_longitude', 'end_latitude', 'end_longitude'],
                payment: ['amount'],
                rating: ['score'],
                // Add other tables and their numeric columns as needed
            };

            const columnsToAggregate = commonNumericColumns[tableName] || [];

            if (columnsToAggregate.length > 0) {
                const selectClauses = columnsToAggregate.map(col =>
                    `SUM(${col}) AS sum_${col}, AVG(${col}) AS avg_${col}`
                ).join(', ');

                const query = `SELECT ${selectClauses} FROM ${tableName}`;
                const aggregatesResult = await prisma.$queryRawUnsafe(query);

                if (aggregatesResult && aggregatesResult.length > 0) {
                    const result = aggregatesResult[0];
                    columnsToAggregate.forEach(col => {
                        numericAggregates[col] = {
                            sum: result[`sum_${col}`] !== null ? parseFloat(result[`sum_${col}`]).toFixed(2) : null,
                            avg: result[`avg_${col}`] !== null ? parseFloat(result[`avg_${col}`]).toFixed(2) : null,
                        };
                    });
                }
            }

            res.json({
                tableName: tableName,
                rowCount: rowCount,
                numericAggregates: numericAggregates,
                note: "Numeric aggregates are provided for common numeric columns if they exist in the table."
            });

        } catch (error) {
            console.error(`Error in getTableAnalytics for table ${req.params.tableName}:`, error);
            res.status(500).json({ error: `Failed to get analytics for table ${req.params.tableName}` });
        }
    },

    executeCustomQuery: async (req, res) => {
        try {
            const { query } = req.body;

            if (!query || typeof query !== 'string') {
                return res.status(400).json({ error: 'Query is required and must be a string' });
            }

            // Basic security checks
            const trimmedQuery = query.trim().toUpperCase();

            // Only allow SELECT queries
            if (!trimmedQuery.startsWith('SELECT')) {
                return res.status(403).json({
                    error: 'Only SELECT queries are allowed for security reasons',
                    hint: 'Try queries like: SELECT * FROM user LIMIT 10'
                });
            }

            // Prevent dangerous operations
            const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
            for (const keyword of dangerousKeywords) {
                if (trimmedQuery.includes(keyword)) {
                    return res.status(403).json({
                        error: `Query contains forbidden keyword: ${keyword}`,
                        hint: 'Only SELECT queries are allowed'
                    });
                }
            }

            // Execute the query
            const results = await prisma.$queryRawUnsafe(query);

            // Format results
            if (!results || results.length === 0) {
                return res.json({
                    columns: [],
                    rows: [],
                    rowCount: 0,
                    message: 'Query executed successfully but returned no results'
                });
            }

            // Extract column names from first row
            const columns = Object.keys(results[0]);

            // Convert BigInt to string for JSON serialization
            const rows = results.map(row => {
                const formattedRow = {};
                for (const key in row) {
                    if (typeof row[key] === 'bigint') {
                        formattedRow[key] = row[key].toString();
                    } else if (row[key] instanceof Date) {
                        formattedRow[key] = row[key].toISOString();
                    } else {
                        formattedRow[key] = row[key];
                    }
                }
                return formattedRow;
            });

            res.json({
                columns,
                rows,
                rowCount: rows.length,
                message: 'Query executed successfully'
            });

        } catch (error) {
            console.error('Error executing custom query:', error);
            res.status(500).json({
                error: 'Failed to execute query',
                details: error.message
            });
        }
    }
};
