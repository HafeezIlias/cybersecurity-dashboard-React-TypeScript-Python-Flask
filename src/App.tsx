/**
 * Main App Component with Routing
 * ==============================
 * 
 * Root component for the Cybersecurity Dashboard application with multi-page navigation
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import PredictionsPage from './pages/PredictionsPage';
import VisualizationsPage from './pages/VisualizationsPage';

// Create a custom theme for the cybersecurity dashboard
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Professional blue
      dark: '#115293',
      light: '#42a5f5',
    },
    secondary: {
      main: '#dc004e', // Security red for alerts
      dark: '#9a0036',
      light: '#e5336d',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50', // Green for low risk
    },
    warning: {
      main: '#ff9800', // Orange for medium risk
    },
    error: {
      main: '#f44336', // Red for high risk
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/visualizations" element={<VisualizationsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
