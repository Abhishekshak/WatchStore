import React, { useContext } from 'react';
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import { CartContext } from '../context/CartContext';
import CloseIcon from '@mui/icons-material/Close';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart } = useContext(CartContext);

  return (
    <Drawer anchor="right" open={isCartOpen} onClose={toggleCart}>
      <Box sx={{ width: 300, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={toggleCart}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {cartItems.length === 0 ? (
          <Typography variant="body2" mt={2}>Cart is empty</Typography>
        ) : (
          cartItems.map((item, index) => (
            <Box key={index} my={2}>
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">Rs. {item.discountedPrice}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
