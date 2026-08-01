import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { seedDBIfEmpty, setDbConnected } from './utils/dataStore.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static directory for file uploads & downloads
const uploadDir = path.join(process.cwd(), 'uploads');
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
const frontendDist = path.join(process.cwd(), '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Initialize DB and Start Server
const startServer = async () => {
  const dbStatus = await connectDB();
  setDbConnected(dbStatus);
  if (dbStatus) {
    await seedDBIfEmpty();
  }

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Portfolio CMS Server running on http://localhost:${PORT}`);
    console.log(`📌 Public API: http://localhost:${PORT}/api/public/portfolio`);
    console.log(`=================================================`);
  });
};

startServer();
