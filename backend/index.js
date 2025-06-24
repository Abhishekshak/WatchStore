require('dotenv').config();  

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploads folder statically so images can be accessed by URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/WatchStore')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const watchRoutes = require('./routes/watches');
const cartRoutes = require('./routes/cart');

// Use routes
app.use('/auth', authRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/cart', cartRoutes);

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
