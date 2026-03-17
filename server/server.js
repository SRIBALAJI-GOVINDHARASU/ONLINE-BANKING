const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const billRoutes = require('./routes/billRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { logger } = require('./middleware/loggerMiddleware');
const { maintenanceMiddleware } = require('./middleware/maintenanceMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB (Singleton)
connectDB();

// Seed default admin if needed
const { createIfMissing } = require('./config/seed');
createIfMissing().catch((err) => console.error('Seed error', err));

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(logger);
app.use(maintenanceMiddleware);

// API routes
app.use('/api', authRoutes);
app.use('/api', accountRoutes);
app.use('/api', transactionRoutes);
app.use('/api', billRoutes);
app.use('/api', notificationRoutes);
app.use('/api', adminRoutes);

// Error handling last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
