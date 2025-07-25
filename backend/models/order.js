// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        id: String,
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    amount: { type: Number, required: true },
    pidx: { type: String, required: true }, // Payment ID
    status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
