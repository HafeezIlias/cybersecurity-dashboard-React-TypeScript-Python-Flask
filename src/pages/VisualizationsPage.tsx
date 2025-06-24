/**
 * Visualizations Page - Data Analytics & Insights
 * ==============================================
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Fade,
  Grow,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Analytics,
  Assessment,
  Public,
  BarChart,
  ShowChart,
  PieChart,
  Timeline,
} from '@mui/icons-material';

import ApiService, { Country } from '../services/api';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import RegionalChart from '../components/RegionalChart';
import FeatureImportance from '../components/FeatureImportance';
import CountriesTable from '../components/CountriesTable';
import GeoChart from '../components/GeoChart';

interface VisualizationsPageState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  apiStatus: any;
}

const VisualizationsPage: React.FC = () => {
  const [state, setState] = useState<VisualizationsPageState>({
    countries: [],
    loading: true,
    error: null,
    apiStatus: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [apiStatus, countries] = await Promise.all([
        ApiService.getApiStatus(),
        ApiService.getCountries(),
      ]);

      setState(prev => ({
        ...prev,
        apiStatus,
        countries,
        loading: false,
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load data. Please ensure the backend is running.',
        loading: false,
      }));
    }
  };

  // Floating particles background
  const FloatingParticles = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 30s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-25px) rotate(120deg)' },
          '66%': { transform: 'translateY(-50px) rotate(240deg)' },
        },
      }}
    />
  );

  if (state.loading) {
    return (
      <>
        <FloatingParticles />
        <Box sx={{ ml: '280px', p: 4 }}>
          <Container maxWidth="xl">
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="70vh"
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box textAlign="center">
                <Analytics sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  📊 Loading Analytics Engine
                </Typography>
                <LinearProgress sx={{ width: 300, mb: 2 }} />
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  Preparing data visualizations and insights...
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  if (state.error) {
    return (
      <>
        <FloatingParticles />
        <Box sx={{ ml: '280px', p: 4 }}>
          <Container maxWidth="xl">
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6">Visualization System Error</Typography>
              {state.error}
            </Alert>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <FloatingParticles />
      <Box sx={{ ml: '280px', p: 4 }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Fade in={true} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: 6,
                  p: 4,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                      animation: 'rotate 4s linear infinite',
                      '@keyframes rotate': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  >
                    <Analytics sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: '#667eea', // Fallback color for better visibility
                        mb: 1,
                      }}
                    >
                      📊 Data Visualizations
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      Advanced Analytics & Insights Dashboard
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <Chip
                    icon={<BarChart />}
                    label="Interactive Charts"
                    sx={{
                      background: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                      '& .MuiChip-icon': { color: '#4CAF50' }
                    }}
                  />
                  <Chip
                    icon={<ShowChart />}
                    label="Real-time Data"
                    sx={{
                      background: 'rgba(33, 150, 243, 0.2)',
                      color: '#2196F3',
                      '& .MuiChip-icon': { color: '#2196F3' }
                    }}
                  />
                  <Chip
                    icon={<PieChart />}
                    label="Statistical Analysis"
                    sx={{
                      background: 'rgba(156, 39, 176, 0.2)',
                      color: '#9C27B0',
                      '& .MuiChip-icon': { color: '#9C27B0' }
                    }}
                  />
                  <Chip
                    icon={<Timeline />}
                    label="Trend Analysis"
                    sx={{
                      background: 'rgba(255, 152, 0, 0.2)',
                      color: '#FF9800',
                      '& .MuiChip-icon': { color: '#FF9800' }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Visualizations Grid */}
          <Grid container spacing={4}>
            {/* Interactive 3D Globe Visualization */}
            <Grid item xs={12}>
              <Grow in={true} timeout={800}>
                <Paper 
                  sx={{ 
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 5,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      borderRadius: '5px 5px 0 0',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Public sx={{ fontSize: 28, mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      🌍 Interactive Global Cybersecurity Map
                    </Typography>
                  </Box>
                  <GeoChart />
                </Paper>
              </Grow>
            </Grid>

            {/* Correlation Heatmap */}
            <Grid item xs={12} md={6}>
              <Grow in={true} timeout={1000}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: '520px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 5,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #a8edea, #fed6e3)',
                      borderRadius: '5px 5px 0 0',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Analytics sx={{ fontSize: 28, mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      📈 Neural Correlation Matrix
                    </Typography>
                  </Box>
                  <CorrelationHeatmap />
                </Paper>
              </Grow>
            </Grid>

            {/* Feature Importance */}
            <Grid item xs={12} md={6}>
              <Grow in={true} timeout={1200}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: '520px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 5,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #ffecd2, #fcb69f)',
                      borderRadius: '5px 5px 0 0',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Assessment sx={{ fontSize: 28, mr: 1.5, color: 'warning.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      🧠 AI Feature Intelligence
                    </Typography>
                  </Box>
                  <FeatureImportance />
                </Paper>
              </Grow>
            </Grid>

            {/* Regional Analysis Chart */}
            <Grid item xs={12}>
              <Grow in={true} timeout={1400}>
                <Paper 
                  sx={{ 
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 5,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #d299c2, #fef9d7)',
                      borderRadius: '5px 5px 0 0',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ width: 50, height: 50, mr: 2, background: 'linear-gradient(135deg, #d299c2, #fef9d7)' }}>
                      <Public sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      🌍 Global Threat Intelligence Network
                    </Typography>
                  </Box>
                  <RegionalChart />
                </Paper>
              </Grow>
            </Grid>

            {/* Countries Data Table */}
            <Grid item xs={12}>
              <Grow in={true} timeout={1600}>
                <Paper 
                  sx={{ 
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 5,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #89f7fe, #66a6ff)',
                      borderRadius: '5px 5px 0 0',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ width: 50, height: 50, mr: 2, background: 'linear-gradient(135deg, #89f7fe, #66a6ff)' }}>
                      <Assessment sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      📋 Comprehensive Security Database
                    </Typography>
                  </Box>
                  <CountriesTable countries={state.countries} />
                </Paper>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default VisualizationsPage; 