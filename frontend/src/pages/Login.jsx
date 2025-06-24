import React from 'react';
import { useFormik } from 'formik';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LOGIN_SCHEMA } from '../services/Validation';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LOGIN_SCHEMA,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await login(values); // Call login from context

        if (!response || !response.user || !response.token) {
          throw new Error('Invalid login response. Please try again.');
        }

        const { token, user } = response;

        // Save the token to localStorage
        localStorage.setItem('authToken', token);

        // --- CART MERGE LOGIC START ---
        const localCartStr = localStorage.getItem('cart');
        if (localCartStr) {
          try {
            const localCart = JSON.parse(localCartStr);

            if (Array.isArray(localCart) && localCart.length > 0) {
              // Send local cart to backend to merge with user cart
              await fetch('http://localhost:3001/api/cart/merge', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cart: localCart }),
              });

              // Clear local cart after successful merge
              localStorage.removeItem('cart');
            }
          } catch (mergeError) {
            console.error('Failed to merge cart after login:', mergeError);
            // You can optionally show a message or silently fail
          }
        }
        // --- CART MERGE LOGIC END ---

        // Navigate based on role
        if (user.role === 'admin') {
          navigate('../admin/Dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Login error:', error);
        setFieldError('password', error.message || 'Login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #222222, #444444)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar sx={{ bgcolor: '#2a5298', width: 48, height: 48 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="medium" mt={2}>
              Sign In
            </Typography>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#2a5298',
                textTransform: 'none',
                '&:hover': { bgcolor: '#1e3c72' },
              }}
            >
              {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="body1" mb={1}>
              Don't have an account?
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                textTransform: 'none',
                bgcolor: '#2a5298',
                '&:hover': { bgcolor: '#1e3c72' },
                maxWidth: '150px',
                margin: '0 auto',
              }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
