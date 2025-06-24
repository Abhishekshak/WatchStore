import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch watches flagged displayInHome from backend (which returns max 4 random)
    axios.get('http://localhost:3001/api/watches?displayInHome=true')
      .then(res => {
        setProducts(res.data.watches);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(135deg, rgb(65, 82, 108) 0%, rgb(1, 75, 194) 100%)',
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Discover Our Exclusive Collection
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Find the perfect watch that fits your style. Browse through our collection of luxury, classic, and sporty designs.
        </Typography>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 6 }}>
        {loading ? (
          <Typography>Loading watches...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : products.length === 0 ? (
          <Typography>No featured watches available.</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {products.map((product) => (
              <Grid
                item
                key={product._id}
                xs={12} sm={6} md={4} lg={3}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <ProductCard product={{
                  id: product._id,
                  name: product.name,
                  price: product.discountedPrice || product.price,
                  image: `http://localhost:3001/${product.images?.[0]}`
                }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* View More Button */}
        <Box sx={{ textAlign: 'center', pt: 6 }}>
          <Button
            component={Link}
            to="/Collections"
            variant="contained"
            color="primary"
            sx={{ fontSize: '1rem', textTransform: 'none' }}
            onClick={() => window.scrollTo(0, 0)}
          >
            View More
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Home;
