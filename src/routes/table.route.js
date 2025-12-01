import express from 'express';
import { TablesController } from '../controllers/table.controller.js';
export const tableRouter = express.Router();
tableRouter.get('/tables/:tableName', (req,res,next)=>{
    console.log(`Received request for table: ${req.params.tableName}`);
    next();
},TablesController.getTabledata);

tableRouter.post('/tables/:tableName', (req,res,next)=>{
    console.log(`Received POST request for table: ${req.params.tableName} with body:`, req.body);
    next();
},TablesController.addTabledata);
