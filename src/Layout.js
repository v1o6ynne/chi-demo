// src/Layout.js
import React from 'react';
import LongMenu from './Menu';
import { Box, Typography } from '@mui/material';

const Layout = ({ children, title }) => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Add LongMenu to the top-right corner */}
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
        }}
      >
        <LongMenu />
      </Box>

      {/* Add title to the top-left corner if provided */}
      {title && (
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 1000,
          }}
        >
          <Typography variant="h5" component="div" sx={{ color: 'white' }}>
            {title}
          </Typography>
        </Box>
      )}

      {/* Render the page content */}
      {children}
    </Box>
  );
};

export default Layout;

