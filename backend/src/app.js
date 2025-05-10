import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Config CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

// common middleware
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Import Router
import userRoute from './routes/user.routes.js';

// Config router
app.use('/api/v1/user', userRoute);

// Import Error Middleware
import errorHandler from './middlewares/error.middleware.js';

// Error Handling Middleware
app.use(errorHandler);

export { app };
