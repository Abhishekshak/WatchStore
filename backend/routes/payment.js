const express = require('express');
const axios = require('axios');
const router = express.Router();
const Order = require('../models/Order');

// Use your Khalti live secret key here or from .env
const KHALTI_SECRET_KEY = '19f444941b5341f3834abf60cecf6f32';

// Set correct URLs for your frontend
const RETURN_URL = 'http://localhost:5173/payment-success';
const WEBSITE_URL = 'http://localhost:5173';

// 👉 Initiate payment
router.post('/initiate', async (req, res) => {
  const { amount, orderId, orderName } = req.body;

  try {
    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/initiate/',
      {
        return_url: RETURN_URL,
        website_url: WEBSITE_URL,
        amount,
        purchase_order_id: orderId,
        purchase_order_name: orderName,
        customer_info: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '9800000000',
        },
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ paymentUrl: response.data.payment_url });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// ✅ Verify Khalti payment and save order
router.post('/verify', async (req, res) => {
  try {
    const { pidx, userId, items, amount } = req.body;

    // Verify payment with Khalti
    const khaltiRes = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
        },
      }
    );

    const { status } = khaltiRes.data;

    if (status === 'Completed') {
      const newOrder = new Order({
        userId,
        items: items || [],   // Here items include image for each product
        amount,
        pidx,
        status: 'paid',
      });

      await newOrder.save();

      return res.json({ success: true, message: 'Payment verified and order saved.' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not completed.' });
    }
  } catch (err) {
    console.error('Khalti verification error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to verify Khalti payment.' });
  }
});

module.exports = router;
