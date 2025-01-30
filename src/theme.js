// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Default font for the app
    h1: {
      fontFamily: 'Roboto, Arial, sans-serif', // Font for the h1 heading
    },
    h2: {
      fontFamily: 'Roboto, Arial, sans-serif', // Font for the h2 heading
    },
    button: {
      fontFamily: 'Roboto, Arial, sans-serif', 
    },
  },
});

export default theme;
