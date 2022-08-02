import express from 'express';
import mongoose from 'mongoose';

import mongoDbConnection from './database/database.js';
import config from './config/config.js';
import errorHandlingMiddlware from './middlewares/errorHandling.js';
import userRouter from './routes/userRoutes.js';

var app = express();

// DB configuration and connection create
mongoDbConnection(mongoose, config.uri).connectToMongo();

// setup routes
app.use('/user', userRouter(express));
app.use(errorHandlingMiddlware);

export default app;
