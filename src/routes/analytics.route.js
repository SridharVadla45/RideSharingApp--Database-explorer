import express from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';

export const analyticsRouter = express.Router();

analyticsRouter.get('/analytics/forecast', AnalyticsController.getBudgetForecast);
analyticsRouter.get('/analytics/top-drivers', AnalyticsController.getTopDrivers);
analyticsRouter.get('/analytics/table/:tableName', AnalyticsController.getTableAnalytics);
analyticsRouter.post('/analytics/custom-query', AnalyticsController.executeCustomQuery);
