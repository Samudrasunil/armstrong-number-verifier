import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e91e63',
    },
    background: {
      default: '#0c0b10', 
      paper: 'rgba(40, 38, 56, 0.7)', 
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif', 
    h3: {
      fontWeight: 700, 
    },
    h5: {
      fontWeight: 500, 
    },
  },
});

export default theme;