import React from 'react';
import { Card, CardContent, Typography, Box, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the watch details page when clicked
    navigate(`/watch/${product.id}`);
  };

  return (
    <Card
      sx={{
        width: 250,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
        borderRadius: 2,
      }}
    >
      <CardActionArea onClick={handleClick}>
        <Box
          sx={{
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'cover',
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Rs.{product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;