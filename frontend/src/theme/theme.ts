import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7F32',
      light: '#ff9b59',
      dark: '#cc6628',
    },
    secondary: {
      main: '#000000',
      light: '#2c2c2c',
      dark: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
          },
        },
      },
    },
  },
}); 