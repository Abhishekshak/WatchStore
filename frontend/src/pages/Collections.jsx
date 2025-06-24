import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Button, Box, Divider
} from '@mui/material';
import {
  ArrowBack, Discount, Transgender, Male, Female
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

function Collections() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleGoBack = () => {
    navigate('/');
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/watches')
      .then(response => {
        if (Array.isArray(response.data.watches)) {
          setProducts(response.data.watches);
        } else {
          console.error("Expected 'watches' array in response:", response.data);
          setProducts([]);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const unisexWatches = products.filter(p => p.gender === 'Unisex');
  const menWatches = products.filter(p => p.gender === 'Men');
  const womenWatches = products.filter(p => p.gender === 'Women');

  const formatProduct = (product) => ({
    id: product._id,
    name: product.name,
    price: product.discountedPrice || product.price,
    image: `http://localhost:3001/${product.images?.[0]}`,
  });

  return (
    <>
      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        background: 'linear-gradient(135deg,rgb(65, 82, 108) 0%,rgb(1, 75, 194) 100%)',
        color: 'white', p: { xs: 4, md: 8 }, textAlign: 'center'
      }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Timeless Elegance, Modern Precision
        </Typography>
        <Typography variant="h6">
          Discover our curated collection of premium watches
        </Typography>
      </Box>

      {/* Main Section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleGoBack} sx={{ mb: 3 }}>
          Back to Home
        </Button>

        {/* Unisex Watches */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Transgender color="secondary" sx={{ mr: 1 }} /> Unisex Watches
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={4} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            {unisexWatches.map((product) => (
              <Grid item key={product._id} xs={4} sm={4} md={4} lg={3}>
                <ProductCard product={formatProduct(product)} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Men’s Watches */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Male color="primary" sx={{ mr: 1 }} /> Men’s Watches
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={4} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            {menWatches.map((product) => (
              <Grid item key={product._id} xs={4} sm={4} md={4} lg={3}>
                <ProductCard product={formatProduct(product)} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Women’s Watches */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Female color="error" sx={{ mr: 1 }} /> Women’s Watches
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={4} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            {womenWatches.map((product) => (
              <Grid item key={product._id} xs={4} sm={4} md={4} lg={3}>
                <ProductCard product={formatProduct(product)} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* All Products */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>Our Complete Collection</Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={4} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            {products.map((product) => (
              <Grid item key={product._id} xs={4} sm={4} md={4} lg={3}>
                <ProductCard product={formatProduct(product)} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Special Offer */}
        <Box sx={{
          background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
          color: 'white',
          p: 3,
          borderRadius: 2,
          textAlign: 'center',
          mb: 6
        }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Discount sx={{ mr: 1, fontSize: '2rem' }} /> Limited Time Offer!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Get 15% off on all watches during Fridays!
          </Typography>
          <Button variant="contained" color="inherit" sx={{ color: '#ff416c', fontWeight: 'bold' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Shop Now
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Collections;
