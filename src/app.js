const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const desaRoutes = require('./routes/desa');
const userRoutes = require('./routes/user');
const umkmRoutes = require('./routes/umkm');
const wisataRoutes = require('./routes/wisata');
const programRoutes = require('./routes/pembangunan')
const laporanRoutes = require('./routes/laporan');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Static files middleware - perbaiki path
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/desa', desaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/umkm', umkmRoutes);
app.use('/api/wisata', wisataRoutes);
app.use('/api/program', programRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`Static files served from: ${path.join(__dirname, '..', 'uploads')}`);
});

module.exports = app;