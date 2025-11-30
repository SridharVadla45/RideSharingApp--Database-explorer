import { fetchDatabaseSchema } from "../services/schema.service";
export const getDatabaseSchema = async (req, res) => {
    try {
        const schema = await fetchDatabaseSchema();
        res.render("database_schema", { 
            title: "Database Schema",
            schema 
        });
    }   catch (error) {
        console.error("Error getting database schema:", error);
        res.status(500).send("Internal Server Error");
    }
}