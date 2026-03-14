import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/tasks', taskRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

// Top-level await with error handling
try {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('❌ Failed to connect to MongoDB:', error.message);
  process.exit(1);
}

// Error handling middleware
app.use(errorHandler);
