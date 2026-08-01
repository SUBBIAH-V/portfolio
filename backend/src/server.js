import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db.js';
import { seedDBIfEmpty, setDbConnected } from './utils/dataStore.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static directory for file uploads & downloads
const uploadDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio Backend CMS API is running smooth!' });
});

// Serve static frontend build if present
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDist)) {
  console.log(`[Static]: Serving frontend from ${frontendDist}`);
  app.use(express.static(frontendDist));
} else {
  console.warn(`[Static Warning]: ${frontendDist} not found.`);
}

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`<h2>Portfolio Backend API Running!</h2><p>Frontend static build build pending.</p><p><a href="/api/public/portfolio">View Portfolio JSON API</a></p>`);
  }
});

// Initialize DB and Start Server
const startServer = async () => {
  try {
    const dbStatus = await connectDB();
    setDbConnected(dbStatus);
    if (dbStatus) {
      await seedDBIfEmpty();
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=================================================`);
      console.log(`🚀 Portfolio Server running on port ${PORT}`);
      console.log(`📌 Public API: /api/public/portfolio`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('[Server Start Error]:', err);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Portfolio Fallback Server running on port ${PORT}`);
    });
  }
};

startServer();
