const express = require('express');
const cookieParser = require('cookie-parser');
const corsMiddleware = require('./config/cors');
const { globalLimiter } = require('./middleware/rateLimit.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const financeRoutes = require('./routes/finance.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Trust proxy for secure cookies and accurate IP determination behind proxies/load balancers
app.set('trust proxy', 1);

// Security & Parsing Middlewares
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(globalLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'EduSphere API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Global centralized error handler
app.use(errorHandler);

module.exports = app;
