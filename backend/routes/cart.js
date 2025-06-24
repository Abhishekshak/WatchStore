const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const authenticate = require('../middleware/authenticate'); // Your auth middleware

// Get current user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const userCart = await Cart.findOne({ userId }).populate('items.productId');

    if (!userCart) {
      return res.json({ items: [] }); // Return empty array if cart not found
    }

    res.json(userCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

// Merge localStorage cart with user cart after login
router.post('/merge', authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const localCart = req.body.cart; // [{ id: productId, quantity: number }, ...]

    if (!Array.isArray(localCart)) {
      return res.status(400).json({ message: 'Invalid cart format' });
    }

    // Get or create user cart
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
    }

    // Merge logic
    localCart.forEach(localItem => {
      const existingItem = userCart.items.find(item => item.productId.toString() === localItem.id);
      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        userCart.items.push({ productId: localItem.id, quantity: localItem.quantity });
      }
    });

    await userCart.save();
    res.json({ message: 'Cart merged successfully', cart: userCart });
  } catch (error) {
    console.error('Cart merge error:', error);
    res.status(500).json({ message: 'Failed to merge cart' });
  }
});

module.exports = router;
