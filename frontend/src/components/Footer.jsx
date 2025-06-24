import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#000', color: '#ccc', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Products */}
          <Grid xs={12} sm={3}>
            <Typography variant="h6" sx={{ color: '#87cefa' }}>Products</Typography>
            <Typography variant="body2">Products</Typography>
            <Typography variant="body2">Women</Typography>
            <Typography variant="body2">New Products</Typography>
            <Typography variant="body2">Catalog</Typography>
          </Grid>

          {/* Brand */}
          <Grid xs={12} sm={3}>
            <Typography variant="h6" sx={{ color: '#87cefa' }}>Brand</Typography>
            <Typography variant="body2">Brand History of G-Shock</Typography>
            <Typography variant="body2">Technology</Typography>
            <Typography variant="body2">Rolex</Typography>
            <Typography variant="body2">Naviforce</Typography>
          </Grid>

          {/* Links */}
          <Grid xs={12} sm={3}>
            <Typography variant="h6" sx={{ color: '#87cefa' }}>Links</Typography>
            <Typography variant="body2">Store</Typography>
          </Grid>

          {/* Contact Us */}
          <Grid xs={12} sm={3}>
            <Typography variant="h6" sx={{ color: '#87cefa' }}>Contact Us</Typography>
            <Typography variant="body2">support@awatchstore.com</Typography>
            <Typography variant="body2">9812345678</Typography>
            <Typography variant="body2">Chhauni, Kathmandu, Nepal</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center', fontSize: '0.8rem' }}>
          <Typography variant="body2" sx={{ color: '#888' }}>
            © 2025 A Watch Store. Designed for Every Second.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
