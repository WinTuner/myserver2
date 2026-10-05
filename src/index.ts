import 'dotenv/config';
import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import mongoose from 'mongoose';
import UserRoutes from './UserRoutes';
import cors from 'cors';
import path from 'node:path';

export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', UserRoutes);

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== 'test') {
  console.error('MONGODB_URI missing. Set it in .env or environment.');
}

// Connect to MongoDB
if (!uri) {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT} (no DB: MONGODB_URI missing)`);
    });
  }
} else {
  mongoose
    .connect(uri, {})
    .then(() => {
      console.log('Connected to MongoDB');
      if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
          console.log(`Server is running on port http://localhost:${PORT}`);
        });
      }
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

export default app;
