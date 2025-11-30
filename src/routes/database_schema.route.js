import express from "express";

const databaseSchemaRouter = express.Router();

databaseSchemaRouter.get("/database_schema", (req, res) => {
  res.render("database_schema", { title: "Database Schema" });
});

export default databaseSchemaRouter;