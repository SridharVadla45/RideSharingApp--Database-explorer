import express from 'express';
import { getSchemaController } from '../controllers/schema.controller.js';
export const schemaRouter = express.Router();

schemaRouter.get('/schema', getSchemaController);
