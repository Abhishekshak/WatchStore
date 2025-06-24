import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axios from 'axios';
import { REGISTRATION_SCHEMA } from '../services/Validation';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: REGISTRATION_SCHEMA,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const { confirmPassword, ...cleanedValues } = values;
        const res = await axios.post('http://localhost:3001/register', cleanedValues);

        // Show success snackbar
        setSnackbarOpen(true);

        // Wait a moment before redirecting to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        if (error.response?.data?.message?.includes('already registered')) {
          setFieldError('email', error.response.data.message);
        } else {
          alert(error.response?.data?.message || 'Something went wrong');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right,#222222, #444444)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: '#2a5298', width: 32, height: 32 }}>
              <PersonAddAltIcon fontSize="small" />
            </Avatar>
            <Typography component="h1" variant="h6" fontWeight="medium" mt={1}>
              Create Account
            </Typography>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
            <TextField
              select
              fullWidth
              size="small"
              margin="dense"
              label="Gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="small"
              disabled={formik.isSubmitting}
              sx={{
                mt: 2,
                bgcolor: '#2a5298',
                textTransform: 'none',
                '&:hover': { bgcolor: '#1e3c72' },
              }}
            >
              {formik.isSubmitting ? 'Registering...' : 'Register'}
            </Button>

<Box mt={2} textAlign="center">
  <Typography variant="body2" gutterBottom>
    Already have an account?
  </Typography>
  <Button
    variant="contained"
    size="small"
    onClick={() => navigate('/login')}
    sx={{
      mt: 1,
      bgcolor: '#2a5298',
      textTransform: 'none',
      px: 3, // Optional: controls button width
      '&:hover': { bgcolor: '#1e3c72' },
    }}
  >
    Go to Login
  </Button>
</Box>

          </Box>
        </Paper>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          Registered successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;