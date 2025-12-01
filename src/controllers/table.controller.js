import { databaseRepository } from "../repositories/utility.respository.js";
export const TablesController = {
    getTabledata  : async (req, res) => {       
        const tableName = req.params.tableName;
        try {
            let result = null;
            // Assuming databaseTableRepository is already imported
                        if (tableName === 'books' || tableName === 'driver_vehicle') {
            result = await databaseRepository.fetchTableDataWithCompositeKey(tableName);
            } else {
            result = await databaseRepository.fetchTableData(tableName);
            }
            res.json(result);
        } catch (error) {
            console.error("Error in getTabledata controller:", error);  
            res.status(500).json({ error: 'Failed to fetch table data' });
        }
    }   ,
    addTabledata : async (req, res) => {
        const tableName = req.params.tableName;
        const rowData = req.body;
        try {
            const newRecord = await databaseRepository.addTableRecord(tableName, rowData);
            res.status(201).json(newRecord);
        } catch (error) {
            console.error("Error in addTabledata controller:", error);
            res.status(500).json({ error: 'Failed to add table data' });
        }
    }             

} ;