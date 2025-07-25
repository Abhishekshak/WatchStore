const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/WatchStore')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Routes
const authRoutes = require('./routes/auth');
const watchRoutes = require('./routes/watches');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order'); // ✅ double-check this path

app.use('/auth', authRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes); // ✅ this makes /api/orders/user/:id available

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
