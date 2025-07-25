import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Grid,
  Box,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:3001/api/orders/user/${user.id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5">Please log in to view your orders.</Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading your orders...</Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5">You have no orders yet.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      <Stack spacing={3}>
        {orders.map((order) => (
          <Paper key={order._id} sx={{ p: 2 }}>
            <Typography variant="h6">Order ID: {order._id}</Typography>
            <Typography variant="body2">
              Date: {new Date(order.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              Total: Rs. {(order.amount / 100).toFixed(2)}
            </Typography>

            {/* <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              Items:
            </Typography> */}

            <Stack spacing={1} sx={{ mt: 1 }}>
              {order.items.map((item, i) => (
                <Grid
                  key={i}
                  container
                  alignItems="center"
                  spacing={2}
                  sx={{ borderBottom: '1px solid #eee', pb: 1 }}
                >
                  <Grid item xs={2}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', maxHeight: 80, objectFit: 'contain' }}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity} × Rs. {(item.price / 100).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Stack>

            <Divider sx={{ mt: 2 }} />
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default MyOrders;
