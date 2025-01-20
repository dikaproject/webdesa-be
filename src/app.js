const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;