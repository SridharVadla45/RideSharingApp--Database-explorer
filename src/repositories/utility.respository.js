// repositories/utility.repository.js
import prisma from "../config/prisma.js";

export const databaseRepository = {

  fetchDatabaseSchema: async () => {
    try {
      const tables = [];
      const tablesResult = await prisma.$queryRaw`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = DATABASE()
      `;
      
      const columns = await prisma.$queryRaw`
        SELECT 
          TABLE_NAME, 
          COLUMN_NAME, 
          DATA_TYPE, 
          IS_NULLABLE
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME, ORDINAL_POSITION
      `;

      for (const table of tablesResult) {
        const tableName = table.TABLE_NAME;
        const tableColumns = columns
          .filter(col => col.TABLE_NAME === tableName)
          .map(col => col.COLUMN_NAME);
        
        tables.push({
          name: tableName,
          columns: tableColumns
        });
      }
      
      return { tables };
    } catch (error) {
      console.error("Error fetching database schema:", error);
      throw error;
    }
  },

  fetchTableData: async (tableName) => {
    try {
      console.log('Looking for table:', tableName);
      
      // Since your Prisma models are lowercase, use the table name as-is
      // or convert to lowercase to be safe
      const modelName = tableName.toLowerCase();
      
      console.log('Using model name:', modelName);
      
      if (!prisma[modelName]) {
        // List available models for debugging
        const availableModels = Object.keys(prisma).filter(key => 
          !key.startsWith('_') && 
          !key.startsWith('$') && 
          typeof prisma[key]?.findMany === 'function'
        );
        throw new Error(`Table '${tableName}' not found. Available models: ${availableModels.join(', ')}`);
      }

      const rows = await prisma[modelName].findMany({
        orderBy: { [getPrimaryKeyField(modelName)]: 'asc' }
      });

      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

      return {
        columns,
        rows
      };
    } catch (error) {
      console.error("Error fetching table data:", error);
      throw error;
    }
  },

  addTableRecord: async (tableName, data) => {
    try {
      const modelName = tableName.toLowerCase();
      
      if (!prisma[modelName]) {
        throw new Error(`Table '${tableName}' not found`);
      }

      const newRecord = await prisma[modelName].create({
        data: data
      });

      return {
        success: true,
        id: newRecord[getPrimaryKeyField(modelName)],
        record: newRecord
      };
    } catch (error) {
      console.error("Error adding table record:", error);
      throw error;
    }
  },

  updateTableRecord: async (tableName, id, data) => {
    try {
      const modelName = tableName.toLowerCase();
      
      if (!prisma[modelName]) {
        throw new Error(`Table '${tableName}' not found`);
      }

      const primaryKey = getPrimaryKeyField(modelName);
      const whereCondition = { [primaryKey]: parseInt(id) };

      const updatedRecord = await prisma[modelName].update({
        where: whereCondition,
        data: data
      });

      return {
        success: true,
        record: updatedRecord
      };
    } catch (error) {
      console.error("Error updating table record:", error);
      throw error;
    }
  },

  deleteTableRecord: async (tableName, id) => {
    try {
      const modelName = tableName.toLowerCase();
      
      if (!prisma[modelName]) {
        throw new Error(`Table '${tableName}' not found`);
      }

      const primaryKey = getPrimaryKeyField(modelName);
      const whereCondition = { [primaryKey]: parseInt(id) };

      await prisma[modelName].delete({
        where: whereCondition
      });

      return {
        success: true,
        message: `Record deleted successfully`
      };
    } catch (error) {
      console.error("Error deleting table record:", error);
      throw error;
    }
  },

  getRecordById: async (tableName, id) => {
    try {
      const modelName = tableName.toLowerCase();
      
      if (!prisma[modelName]) {
        throw new Error(`Table '${tableName}' not found`);
      }

      const primaryKey = getPrimaryKeyField(modelName);
      const whereCondition = { [primaryKey]: parseInt(id) };

      const record = await prisma[modelName].findUnique({
        where: whereCondition
      });

      if (!record) {
        throw new Error(`Record not found`);
      }

      return {
        record,
        columns: Object.keys(record)
      };
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      throw error;
    }
  },

  // Special handling for composite key tables (books, driver_vehicle)
  fetchTableDataWithCompositeKey: async (tableName) => {
    try {
      const modelName = tableName.toLowerCase();
      
      if (!prisma[modelName]) {
        throw new Error(`Table '${tableName}' not found`);
      }

      const rows = await prisma[modelName].findMany();

      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

      return {
        columns,
        rows
      };
    } catch (error) {
      console.error("Error fetching composite key table data:", error);
      throw error;
    }
  }
};

// Helper function to get primary key field name for each model
function getPrimaryKeyField(modelName) {
  const primaryKeyMap = {
    'user': 'user_id',
    'driver': 'driver_id',
    'vehicle': 'vehicle_id',
    'ride': 'ride_id',
    'payment_method': 'method_id',
    'card': 'card_no', // card uses card_no as primary key
    'cash': 'cash_id',
    'payment': 'payment_id',
    'rating': 'rating_id',
    'driver_vehicle': 'driver_id', // composite key, but we need one for ordering
    'books': 'user_id' // composite key, but we need one for ordering
  };
  
  return primaryKeyMap[modelName] || 'id';
}

// Debug function to check available models
export const debugPrismaModels = () => {
  const models = Object.keys(prisma).filter(key => 
    !key.startsWith('_') && 
    !key.startsWith('$') && 
    typeof prisma[key]?.findMany === 'function'
  );
  console.log('Available Prisma models:', models);
  return models;
};