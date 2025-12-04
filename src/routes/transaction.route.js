import express from 'express';
import { TransactionController } from '../controllers/transaction.controller.js';

export const transactionRouter = express.Router();

transactionRouter.post('/transactions/register-driver-vehicle', TransactionController.registerDriverWithVehicle);
