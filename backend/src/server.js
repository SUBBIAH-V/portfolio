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

// Serve static frontend build from backend/public
const publicDir = path.resolve(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  console.log(`[Static]: Serving frontend from ${publicDir}`);
  app.use(express.static(publicDir));
}

// Explicit Root Route Handler
app.get('/', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    try {
      const html = fs.readFileSync(indexPath, 'utf8');
      return res.type('html').send(html);
    } catch (e) {
      console.error('[Index Read Error]:', e);
    }
  }
  res.send(`<!DOCTYPE html><html><head><title>SUBBIAH VADIVELAN Portfolio API</title></head><body style="font-family:sans-serif;padding:40px;background:#0f172a;color:#f8fafc"><h2>🚀 SUBBIAH VADIVELAN Portfolio API</h2><p>Server is live!</p><p>👉 <a href="/api/public/portfolio" style="color:#38bdf8">View Public Portfolio API Data</a></p></body></html>`);
});

// Single-Page Application Catch-all Handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'API Endpoint Not Found' });
  }
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    try {
      const html = fs.readFileSync(indexPath, 'utf8');
      return res.type('html').send(html);
    } catch (e) {
      console.error('[SPA Read Error]:', e);
    }
  }
  res.status(200).send(`<!DOCTYPE html><html><head><title>SUBBIAH VADIVELAN Portfolio API</title></head><body style="font-family:sans-serif;padding:40px;background:#0f172a;color:#f8fafc"><h2>🚀 SUBBIAH VADIVELAN Portfolio API</h2><p>Server is live!</p><p>👉 <a href="/api/public/portfolio" style="color:#38bdf8">View Public Portfolio API Data</a></p></body></html>`);
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
