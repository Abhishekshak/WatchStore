import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Paper, Grid, CircularProgress } from '@mui/material';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [watchesCount, setWatchesCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch users
        const usersRes = await axios.get('http://localhost:3001/auth/users');
        setUsersCount(usersRes.data.users.length);

        // Fetch watches
        const watchesRes = await axios.get('http://localhost:3001/api/watches');
        setWatchesCount(watchesRes.data.watches.length);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center" color="primary">
        Admin Dashboard Overview
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Registered Users
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {usersCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Watches in Store
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {watchesCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
