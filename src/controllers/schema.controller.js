import { databaseRepository } from "../repositories/utility.respository.js";

export const getSchemaController = async (req, res) => {
    try {
        const schema = await databaseRepository.fetchDatabaseSchema();
        res.json(schema);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch database schema' });
    }
};  