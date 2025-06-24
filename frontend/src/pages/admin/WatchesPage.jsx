import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CircularProgress,
  Container,
  Chip,
  Stack,
} from '@mui/material';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x180?text=No+Image';

function WatchesPage() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWatches = () => {
    setLoading(true);
    axios
      .get('http://localhost:3001/api/watches')
      .then((res) => {
        setWatches(res.data.watches);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch watches');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWatches();
  }, []);

  const handleAddWatch = () => navigate('/admin/add-watch');
  const handleEdit = (id) => navigate(`/admin/watches/edit/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/watches/${id}`);
      alert('Watch deleted successfully');
      fetchWatches();
    } catch {
      alert('Failed to delete watch');
    }
  };

  // Gender badge chip
  const getGenderBadge = (gender) => {
    switch (gender) {
      case 'Men':
        return <Chip label="Men" color="primary" size="small" />;
      case 'Women':
        return <Chip label="Women" color="secondary" size="small" />;
      case 'Unisex':
      default:
        return <Chip label="Unisex" color="default" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Watches
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddWatch} sx={{ px: 3, py: 1 }}>
          Add New Watch
        </Button>
      </Box>

      {watches.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography variant="h6" color="text.secondary">
            No watches found. Start by adding your first watch.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Total watches: {watches.length}
          </Typography>

          <Grid container spacing={3} alignItems="stretch">
            {watches.map((watch) => {
              const imageUrl = watch.images?.[0]
                ? `http://localhost:3001/${watch.images[0].replace(/\\/g, '/')}`
                : PLACEHOLDER_IMAGE;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={watch._id} display="flex">
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      width: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={imageUrl}
                      alt={watch.name}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        noWrap
                        title={watch.name}
                        sx={{ fontSize: '1.1rem', mb: 1 }}
                      >
                        {watch.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Brand: <strong>{watch.brand || 'N/A'}</strong>
                      </Typography>

                      <Box my={1}>
                        {watch.discountedPrice ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              Rs.{watch.price?.toLocaleString()}
                            </Typography>
                            <Typography variant="body1" color="error" fontWeight="bold">
                              Rs.{watch.discountedPrice?.toLocaleString()}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="body1" fontWeight="bold">
                            Rs.{watch.price?.toLocaleString() || 'N/A'}
                          </Typography>
                        )}
                      </Box>

                      <Box mt="auto">
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {getGenderBadge(watch.gender)}
                          {/* New badge for displayInHome */}
                          {watch.displayInHome && (
                            <Chip label="Featured" color="success" size="small" />
                          )}
                        </Stack>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(watch._id)}
                        sx={{ flex: 1, mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(watch._id)}
                        sx={{ flex: 1 }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default WatchesPage;
