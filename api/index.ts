import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from '../server/routes.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Mount complete API router for Vercel serverless deployment
app.use(apiRouter);

export default app;
