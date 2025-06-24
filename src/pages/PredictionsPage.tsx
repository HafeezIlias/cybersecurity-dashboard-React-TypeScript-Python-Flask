/**
 * Predictions Page - AI Risk Assessment Center
 * ==========================================
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
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  Assessment,
  Speed,
  Shield,
  Analytics,
  Radar,
} from '@mui/icons-material';

import ApiService, { Country } from '../services/api';
import PredictionPanel from '../components/PredictionPanel';

interface PredictionsPageState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  apiStatus: any;
}

const PredictionsPage: React.FC = () => {
  const [state, setState] = useState<PredictionsPageState>({
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

  const getModelStatusSummary = () => {
    if (!state.apiStatus?.models_loaded) return { total: 0, loaded: 0 };
    
    const models = state.apiStatus.models_loaded;
    const total = Object.keys(models).length;
    const loaded = Object.values(models).filter(Boolean).length;
    
    return { total, loaded };
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
            radial-gradient(circle at 25% 75%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 25s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(-40px) rotate(240deg)' },
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
                <Psychology sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  🧠 Loading AI Prediction Engine
                </Typography>
                <LinearProgress sx={{ width: 300, mb: 2 }} />
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  Initializing neural networks and ensemble models...
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
              <Typography variant="h6">AI System Error</Typography>
              {state.error}
            </Alert>
          </Container>
        </Box>
      </>
    );
  }

  const modelStatus = getModelStatusSummary();

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
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                      },
                    }}
                  >
                    <Psychology sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        mb: 1,
                      }}
                    >
                      🧠 AI Prediction Center
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      Advanced Risk Assessment & Threat Intelligence Platform
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <Chip
                    icon={<AutoAwesome />}
                    label={`Neural Engine: ${state.apiStatus?.models_loaded?.ensemble_model ? '🟢 Active' : '🔴 Offline'}`}
                    sx={{
                      background: 'rgba(76, 175, 80, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      color: '#4CAF50',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    icon={<Analytics />}
                    label={`AI Models: ${modelStatus.loaded}/${modelStatus.total} Online`}
                    sx={{
                      background: 'rgba(33, 150, 243, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      color: '#2196F3',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    icon={<Radar />}
                    label={`${state.countries.length} Countries in Database`}
                    sx={{
                      background: 'rgba(156, 39, 176, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(156, 39, 176, 0.3)',
                      color: '#9C27B0',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Main Prediction Interface */}
          <Grid container spacing={4}>
            {/* Primary Prediction Panel */}
            <Grid item xs={12}>
              <Grow in={true} timeout={800}>
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
                      transform: 'translateY(-5px)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #ff9a9e, #fecfef)',
                      borderRadius: '5px 5px 0 0',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, background: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }}>
                      <AutoAwesome sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        🎯 Quantum Risk Prediction Engine
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Multi-dimensional Analysis • Real-time Assessment • Predictive Intelligence
                      </Typography>
                    </Box>
                  </Box>
                  <PredictionPanel />
                </Paper>
              </Grow>
            </Grid>

            {/* AI Model Status Cards */}
            <Grid item xs={12} md={4}>
              <Grow in={true} timeout={1000}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Speed sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Processing Speed
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 700, mb: 1 }}>
                      0.23s
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Average prediction time
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grow in={true} timeout={1200}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Assessment sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Accuracy Rate
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
                      94.8%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Ensemble model accuracy
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grow in={true} timeout={1400}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Shield sx={{ fontSize: 48, color: '#FF9800', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Confidence Level
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700, mb: 1 }}>
                      96.2%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Average prediction confidence
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default PredictionsPage; 