import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will take the user to the previous page
  };

  return (
    <IconButton onClick={handleGoBack} color="primary">
      <ArrowBackIcon />
    </IconButton>
  );
};

export default GoBack;
