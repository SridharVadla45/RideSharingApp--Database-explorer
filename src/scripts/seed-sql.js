import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    const sqlPath = path.join(__dirname, '../../.agent/mysql_insert.sql');
    console.log(`Reading SQL file from: ${sqlPath}`);

    try {
        const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

        // Split by semicolon to get individual statements
        // Filter out empty statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        let successCount = 0;
        let errorCount = 0;

        for (const statement of statements) {
            try {
                // Skip comments
                if (statement.startsWith('--')) continue;

                // Replace uppercase table names with lowercase (and handle underscores)
                // We use regex with case insensitive flag just in case, but specific replacements are safer
                let processedStmt = statement
                    // Table names
                    .replace(/INSERT INTO DRIVER /g, 'INSERT INTO driver ')
                    .replace(/INSERT INTO VEHICLE /g, 'INSERT INTO vehicle ')
                    .replace(/INSERT INTO USER /g, 'INSERT INTO user ')
                    .replace(/INSERT INTO RIDE /g, 'INSERT INTO ride ')
                    .replace(/INSERT INTO DRIVER_VEHICLE /g, 'INSERT INTO driver_vehicle ')
                    .replace(/INSERT INTO BOOKS /g, 'INSERT INTO books ')
                    .replace(/INSERT INTO PAYMENTMETHOD /g, 'INSERT INTO payment_method ')
                    .replace(/INSERT INTO CARD /g, 'INSERT INTO card ')
                    .replace(/INSERT INTO CASH /g, 'INSERT INTO cash ')
                    .replace(/INSERT INTO PAYMENT /g, 'INSERT INTO payment ')
                    .replace(/INSERT INTO RATING /g, 'INSERT INTO rating ')

                    // Column names (be careful with partial matches, use word boundaries if possible, but simple replace might work for these specific names)
                    .replace(/\(DriverID/g, '(driver_id')
                    .replace(/\(VehicleID/g, '(vehicle_id')
                    .replace(/\(UserID/g, '(user_id')
                    .replace(/\(RideID/g, '(ride_id')
                    .replace(/\(PaymentID/g, '(payment_id')
                    .replace(/\(MethodID/g, '(method_id')
                    .replace(/\(RatingID/g, '(rating_id')
                    .replace(/\(CardNo/g, '(card_no')
                    .replace(/\(CashID/g, '(cash_id')

                    // Common columns
                    .replace(/ Name,/g, ' name,')
                    .replace(/ Email,/g, ' email,')
                    .replace(/ PhoneNumber\)/g, ' phone_number)')
                    .replace(/ Type,/g, ' type,')
                    .replace(/ Model,/g, ' model,')
                    .replace(/ LicensePlateNo\)/g, ' license_plate_no)')
                    .replace(/ Description,/g, ' description,')
                    .replace(/ UnitPrice,/g, ' unit_price,')
                    .replace(/ Date,/g, ' date,')
                    .replace(/ Status,/g, ' status,')
                    .replace(/ Pickup,/g, ' pickup,')
                    .replace(/ DropLocation\)/g, ' drop_location)')
                    .replace(/ MethodType,/g, ' method_type,')
                    .replace(/ Expiry,/g, ' expiry,')
                    .replace(/ Score,/g, ' score,')
                    .replace(/ Comments,/g, ' comments,')
                    .replace(/ CreatedAt,/g, ' created_at,')

                    // Fix foreign keys in column lists
                    .replace(/ DriverID,/g, ' driver_id,')
                    .replace(/ VehicleID,/g, ' vehicle_id,')
                    .replace(/ UserID,/g, ' user_id,')
                    .replace(/ RideID,/g, ' ride_id,')
                    .replace(/ MethodID,/g, ' method_id,')
                    .replace(/ MethodID\)/g, ' method_id)')
                    .replace(/ UserID\)/g, ' user_id)')
                    .replace(/ RideID\)/g, ' ride_id)')
                    .replace(/ VehicleID\)/g, ' vehicle_id)');

                // Execute raw SQL
                await prisma.$executeRawUnsafe(processedStmt);
                successCount++;
            } catch (err) {
                // Ignore duplicate entry errors (Code 1062)
                if (err.meta && err.meta.code === '1062') {
                    // console.log('Skipping duplicate entry');
                } else {
                    console.error(`Error executing statement: ${statement.substring(0, 50)}...`);
                    console.error(err.message);
                    errorCount++;
                }
            }
        }

        console.log(`Seeding completed. Success: ${successCount}, Errors: ${errorCount}`);
    } catch (err) {
        console.error('Error reading or executing SQL file:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
