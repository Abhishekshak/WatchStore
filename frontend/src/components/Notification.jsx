// Notification.js
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Notification will disappear after 3 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Customize position
    >
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
