import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CircularProgress, Container, Typography } from '@mui/material';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (processed) return;

    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const pidx = params.get('pidx');
      const status = params.get('status');
      const amountStr = params.get('amount');

      if (!user || !pidx || status !== 'Completed' || !amountStr) {
        alert('Invalid or incomplete payment');
        navigate('/');
        return;
      }

      setProcessed(true);

      try {
        const res = await fetch('http://localhost:3001/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pidx,
            userId: user._id || user.id,
            amount: Number(amountStr),
            items: cartItems.map((item) => ({
              id: item._id,
              name: item.name,
              quantity: item.quantity,
              price: (item.discountedPrice ?? item.price) * 100,
            })),
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          clearCart();
          navigate('/my-orders');
        } else {
          alert('Payment verification failed: ' + (data.message || 'Unknown error'));
          navigate('/');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        alert('Something went wrong');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, user, cartItems, clearCart, navigate, processed]);

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      {loading ? (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying your payment...
          </Typography>
        </>
      ) : (
        <Typography variant="h6">Redirecting...</Typography>
      )}
    </Container>
  );
};

export default PaymentSuccess;
