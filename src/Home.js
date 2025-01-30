// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Link } from '@mui/material';
import Layout from './Layout';

const Home = () => {
  const navigate = useNavigate();

  const navigateToSimulate = () => {
    navigate('/simulate');
  };

  const navigateToEvaluate = () => {
    navigate('/evaluate');
  };

  const navigateToTest = () => {
    navigate('/testbackend');
  };

  return (
    <Layout>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: `url('/resources/alina-grubnyak-unsplash.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            textAlign: 'center',
            padding: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Virtual Visual Cortex
          </Typography>
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="body1">
              Simulate cortex responses with your stimuli datasets, <br /> or Evaluate your model performance on real experiments.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={navigateToSimulate}
              sx={{
                backgroundColor: '#E0E0E0',
                color: '#333',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D5D5D5',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  backgroundColor: '#C0C0C0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(2px)',
                },
              }}
            >
              Simulate
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={navigateToTest}
              sx={{
                backgroundColor: '#E0E0E0',
                color: '#333',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D5D5D5',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  backgroundColor: '#C0C0C0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(2px)',
                },
              }}
            >
              TEST
            </Button>
          </Box>
        </Container>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: '10px',
            color: 'white',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '0.75rem',
          }}
        >
          © 2025 <Link href="https://www.murtylab.com/" target="_blank" rel="noopener noreferrer" sx={{ color: 'white' }}>Murty Lab, Gatech</Link>. All Rights Reserved.
        </Typography>
      </Box>
    </Layout>
  );
};

export default Home;
