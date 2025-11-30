import { getSchema } from "../repositories/schema.repository";

export const fetchDatabaseSchema = async () => {
    try {
        const schema = await getSchema();
        return schema;
    } catch (error) {
        console.error("Error fetching database schema:", error);
        throw error;
    }
}               

