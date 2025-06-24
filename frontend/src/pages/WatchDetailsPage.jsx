// WatchDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Card, CardMedia, Chip, Container, Divider,
  Grid, Paper, Stack, Tab, Tabs, Typography, useTheme
} from '@mui/material';
import {
  ShoppingCart, LocalShipping, Autorenew, Shield, ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const WatchDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [watchData, setWatchData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = 'http://localhost:3001/';

  useEffect(() => {
    fetch(`${baseURL}api/watches`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch watches');
        return res.json();
      })
      .then(data => {
        const foundWatch = data.watches.find(w => w._id === id);
        if (!foundWatch) {
          setError('Watch not found');
          setLoading(false);
          return;
        }
        setWatchData(foundWatch);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const normalizedImages = watchData?.images.map(img =>
    baseURL + img.replace(/\\/g, '/')
  );

const { addToCart } = useCart();

const handleAddToCart = () => {
  const cartItem = {
    _id: watchData._id,
    name: watchData.name,
    brand: watchData.brand,
    price: watchData.price,
    discountedPrice: watchData.discountedPrice,
    image: normalizedImages[0],
    quantity: 1,
  };

  addToCart(cartItem);  // This updates React state + localStorage internally

  setOpenSnackbar(true);
};


  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleTabChange = (_, newVal) => setTabValue(newVal);
  const handleGoBack = () => navigate(-1);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading watch details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button onClick={handleGoBack} sx={{ mt: 2 }}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={handleGoBack} sx={{ mb: 3 }}>
        Go Back
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardMedia
              component="img"
              image={normalizedImages[selectedImage]}
              alt={watchData.name}
              sx={{
                height: 500,
                objectFit: 'contain',
                backgroundColor: '#f5f5f5'
              }}
            />
          </Card>

          <Stack direction="row" spacing={1} mt={2} justifyContent="center">
            {normalizedImages.map((img, i) => (
              <Paper
                key={i}
                elevation={selectedImage === i ? 4 : 1}
                sx={{
                  width: 80,
                  height: 80,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedImage === i ? `2px solid ${theme.palette.primary.main}` : 'none',
                }}
                onClick={() => setSelectedImage(i)}
              >
                <img src={img} alt={`Thumbnail ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {watchData.brand}
            </Typography>

            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {watchData.name}
            </Typography>

            <Box mb={3}>
              {watchData.discountedPrice ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    Rs.{watchData.discountedPrice}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    Rs.{watchData.price}
                  </Typography>
                  <Chip label={`Save Rs.${(watchData.price - watchData.discountedPrice).toFixed(2)}`} color="error" size="small" />
                </Stack>
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  Rs.{watchData.price}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} mb={4}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                sx={{ py: 1.5, px: 4, minWidth: 180 }}
              >
                Add to Cart
              </Button>

              <Notification
                open={openSnackbar}
                message="Item added to cart!"
                onClose={handleCloseSnackbar}
              />
            </Stack>

            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocalShipping color="primary" />
                  <Typography variant="body2">Free shipping on orders over Rs.3000</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Autorenew color="primary" />
                  <Typography variant="body2">30-day free returns</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Shield color="primary" />
                  <Typography variant="body2">5 year warranty included</Typography>
                </Box>
              </Stack>
            </Paper>

            <Box sx={{ width: '100%' }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
                <Tab label="Description" />
                <Tab label="Features" />
                <Tab label="Specifications" />
              </Tabs>

              {tabValue === 0 && (
                <Box sx={{ width: '100%', maxWidth: 385 }}>
                  <Typography variant="body1" color="text.secondary">{watchData.description}</Typography>
                </Box>
              )}
              {tabValue === 1 && (
                <Stack spacing={1}>
                  {watchData.features.map((f, i) => (
                    <Typography key={i} variant="body1" color="text.secondary">• {f}</Typography>
                  ))}
                </Stack>
              )}
              {tabValue === 2 && (
                <Stack divider={<Divider flexItem />} spacing={1}>
                  {Object.entries(watchData.specifications).map(([key, val], i) => (
                    <Grid container key={i} spacing={2} py={1}>
                      <Grid item xs={5}>
                        <Typography fontWeight="medium">{key}</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography color="text.secondary">{val}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WatchDetailsPage;
