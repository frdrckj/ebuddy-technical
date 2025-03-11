import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from '../routes/userRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Not found handler
app.use((_, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, _: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default app;
