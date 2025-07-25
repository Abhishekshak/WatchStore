import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const handleIncrease = (id) => {
    const item = cartItems.find((item) => item._id === id);
    updateQuantity(id, item.quantity + 1);
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.discountedPrice ?? item.price;
    return total + price * item.quantity;
  }, 0);

  const handleKhaltiPayment = async () => {
    const res = await fetch('http://localhost:3001/api/payment/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalPrice * 100,
        orderId: 'ORDER_' + Date.now(),
        orderName: 'Ecommerce Cart Payment',
      }),
    });

    const data = await res.json();
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
    } else {
      alert('Failed to initiate payment');
    }
  };

  // After redirect from Khalti, verify and save order
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pidx = params.get('pidx');

    if (pidx && user) {
      const verifyAndSaveOrder = async () => {
        try {
          setLoading(true);

          const res = await fetch('http://localhost:3001/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pidx,
              userId: user.id,
              items: cartItems.map((item) => ({
                id: item._id,
                name: item.name,
                quantity: item.quantity,
                price: (item.discountedPrice ?? item.price) * 100,
                image: item.image,
              })),
              amount: totalPrice * 100,
            }),
          });

          const result = await res.json();

          if (res.ok && result.success) {
            clearCart();
            navigate('/my-orders');
          } else {
            alert('Failed to verify payment or save order: ' + (result.message || result.error));
          }
        } catch (err) {
          console.error('Error verifying payment or saving order:', err);
          alert('Something went wrong during payment verification');
        } finally {
          setLoading(false);
        }
      };

      verifyAndSaveOrder();
    }
  }, [location.search, user, cartItems, clearCart, navigate, totalPrice]);

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/collections')}>
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      <Stack spacing={3}>
        {cartItems.map((item) => (
          <Paper key={item._id} elevation={2} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', maxHeight: 120, objectFit: 'contain' }}
                />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.brand}
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                  Rs. {item.discountedPrice ?? item.price}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleDecrease(item._id)}
                    disabled={item.quantity === 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => handleIncrease(item._id)}>
                    <Add />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemove(item._id)}
                    sx={{ ml: 2 }}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h5" fontWeight="bold">
          Rs. {totalPrice.toFixed(2)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" color="error" onClick={clearCart} disabled={loading}>
          Clear Cart
        </Button>
        <Button variant="contained" color="primary" onClick={handleKhaltiPayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay with Khalti'}
        </Button>
      </Stack>
    </Container>
  );
};

export default Cart;
