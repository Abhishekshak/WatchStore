import React, { useState } from 'react';
import {
  Badge,
  Button,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const [openDialog, setOpenDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoutConfirm = () => {
    logout();
    setOpenDialog(false);
    setShowSnackbar(true);
  };

  const displayName = user
    ? (user.name || user.email || '').charAt(0).toUpperCase() +
      (user.name || user.email || '').slice(1)
    : '';

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'black', color: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WatchOutlinedIcon
                sx={{
                  mr: 1,
                  color: 'white',
                  animation: 'spin 3s linear infinite',
                  '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ color: 'white', textDecoration: 'none', fontWeight: 700 }}
              >
                A WATCH
              </Typography>
            </Box>

            {/* Right Side Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Button
                color="inherit"
                component={Link}
                to="/collections"
                startIcon={<StorefrontOutlinedIcon />}
                sx={{ fontSize: '0.875rem', textTransform: 'none', color: 'white' }}
              >
                Collections
              </Button>

              <IconButton component={Link} to="/cart" sx={{ color: 'white' }}>
                <Badge badgeContent={cartCount} color="primary">
                  <AddShoppingCartIcon sx={{ fontSize: '1.5rem' }} />
                </Badge>
              </IconButton>

              {!user ? (
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  startIcon={<PersonOutlineOutlinedIcon />}
                  sx={{ fontSize: '0.875rem', textTransform: 'none', color: 'white' }}
                >
                  Login / Register
                </Button>
              ) : (
                <>
                  <Typography variant="body1" sx={{ color: 'white', mr: 2, fontWeight: 'medium' }}>
                    Welcome, {displayName}
                  </Typography>

                  {/* My Orders Button */}
                  <Button
                    color="inherit"
                    component={Link}
                    to="/my-orders"
                    sx={{ fontSize: '0.875rem', textTransform: 'none', color: 'white' }}
                  >
                    My Orders
                  </Button>

                  <Button
                    color="inherit"
                    onClick={() => setOpenDialog(true)}
                    sx={{ fontSize: '0.875rem', color: 'white' }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="error">Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Logout */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Logged out successfully
        </Alert>
      </Snackbar>
    </>
  );
}

export default Navbar;
