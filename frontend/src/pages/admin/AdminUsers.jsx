import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/auth/users')
      .then(res => {
        // Sort users by newest first (descending) using _id timestamp
        const sortedUsers = res.data.users.sort((a, b) => {
          return b._id.localeCompare(a._id); // _id string comparison works for timestamps
        });

        setUsers(sortedUsers);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={6}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box textAlign="center" mt={6}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  if (users.length === 0) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="text.secondary">
          No users found.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box mb={3} display="flex" justifyContent="flex-start" alignItems="center">
        <Typography variant="h4" fontWeight="bold" color="primary">
          Users List
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 2, px: 3 }}><strong>#</strong></TableCell>
              <TableCell sx={{ py: 2, px: 3 }}><strong>Name</strong></TableCell>
              <TableCell sx={{ py: 2, px: 3 }}><strong>Email</strong></TableCell>
              <TableCell sx={{ py: 2, px: 3 }}><strong>Phone</strong></TableCell>
              <TableCell sx={{ py: 2, px: 3 }}><strong>Role</strong></TableCell>
              <TableCell sx={{ py: 2, px: 3 }}><strong>Gender</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id} hover>
                <TableCell sx={{ py: 2, px: 3 }}>{index + 1}</TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>{user.name}</TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>{user.email}</TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>{user.phone || '-'}</TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>{user.role || '-'}</TableCell>
                <TableCell sx={{ py: 2, px: 3, textTransform: 'capitalize' }}>{user.gender || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminUsers;
