/**
 * Main Dashboard Component - Ultra Modern & Animated
 * ================================================
 * Features: Glassmorphism, Advanced Animations, Floating UI, Particle Effects
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Fade,
  Grow,
  Slide,
  Zoom,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Security,
  Assessment,
  TrendingUp,
  Public,
  Speed,
  Shield,
  Analytics,
  CloudDone,
  Radar,
  Psychology,
  AutoAwesome,
  RocketLaunch,
} from '@mui/icons-material';

import ApiService, { Country } from '../services/api';
import PredictionPanel from './PredictionPanel';
import CorrelationHeatmap from './CorrelationHeatmap';
import RegionalChart from './RegionalChart';
import FeatureImportance from './FeatureImportance';
import CountriesTable from './CountriesTable';
import GeoChart from './GeoChart';

interface DashboardState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  apiStatus: any;
}

const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    countries: [],
    loading: true,
    error: null,
    apiStatus: null,
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Load API status and countries data in parallel
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
      console.error('Error loading dashboard data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load dashboard data. Please ensure the backend is running.',
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
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateY(-60px) rotate(240deg)' },
        },
      }}
    />
  );

  if (state.loading) {
    return (
      <>
        <FloatingParticles />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s infinite',
              },
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' },
              },
            }}
          >
            <Box textAlign="center">
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <CircularProgress 
                  size={80} 
                  thickness={4}
                  sx={{ 
                    color: 'primary.main',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }} 
                />
                <AutoAwesome 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 30,
                    color: 'primary.main',
                    animation: 'spin 3s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                      '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                    },
                  }} 
                />
              </Box>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(45deg, #667eea, #764ba2)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                🚀 Initializing AI Dashboard
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                Loading Advanced Cybersecurity Analytics
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7, maxWidth: 400, mx: 'auto' }}>
                Connecting to neural networks, loading ensemble models, and preparing real-time threat intelligence
              </Typography>
            </Box>
          </Box>
        </Container>
      </>
    );
  }

  if (state.error) {
    return (
      <>
        <FloatingParticles />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                background: 'rgba(244, 67, 54, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: 4,
                color: 'error.main',
                '& .MuiAlert-icon': { color: 'error.main' }
              }}
            >
              <Typography variant="h6">🚨 System Connection Error</Typography>
              {state.error}
            </Alert>
          </Slide>
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="body1" gutterBottom>
              Make sure the Flask backend is running on http://localhost:5000
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Run: python app.py in the project root directory
            </Typography>
          </Box>
        </Container>
      </>
    );
  }

  const modelStatus = getModelStatusSummary();

  return (
    <>
      <FloatingParticles />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Ultra Modern Header with Glassmorphism */}
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
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  animation: 'breathe 4s ease-in-out infinite',
                },
                '@keyframes breathe': {
                  '0%, 100%': { opacity: 0.3 },
                  '50%': { opacity: 0.6 },
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      },
                    }}
                  >
                    <RocketLaunch sx={{ fontSize: 40 }} />
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
                        color: 'transparent',
                        mb: 1,
                      }}
                    >
                      🛡️ CyberShield AI
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                      Advanced Threat Intelligence & Risk Management Platform
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <Zoom in={true} timeout={500}>
                    <Chip
                      icon={<Speed />}
                      label={`System: ${state.apiStatus?.status === 'active' ? '🟢 Online' : '🔴 Offline'}`}
                      sx={{
                        background: state.apiStatus?.status === 'active' 
                          ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: state.apiStatus?.status === 'active' 
                          ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)',
                        color: state.apiStatus?.status === 'active' ? '#4CAF50' : '#f44336',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { 
                          color: state.apiStatus?.status === 'active' ? '#4CAF50' : '#f44336' 
                        }
                      }}
                    />
                  </Zoom>
                  <Zoom in={true} timeout={700}>
                    <Chip
                      icon={<Psychology />}
                      label={`AI Models: ${modelStatus.loaded}/${modelStatus.total} Neural Networks`}
                      sx={{
                        background: 'rgba(33, 150, 243, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(33, 150, 243, 0.3)',
                        color: '#2196F3',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: '#2196F3' }
                      }}
                    />
                  </Zoom>
                  <Zoom in={true} timeout={900}>
                    <Chip
                      icon={<Radar />}
                      label={`🌐 ${state.countries.length} Nations Monitored`}
                      sx={{
                        background: 'rgba(156, 39, 176, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(156, 39, 176, 0.3)',
                        color: '#9C27B0',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: '#9C27B0' }
                      }}
                    />
                  </Zoom>
                  {state.apiStatus?.models_loaded?.ensemble_model && (
                    <Zoom in={true} timeout={1100}>
                      <Chip
                        icon={<CloudDone />}
                        label="🚀 Quantum Ensemble Active"
                        sx={{
                          background: 'rgba(76, 175, 80, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          color: '#4CAF50',
                          fontWeight: 'bold',
                          animation: 'glow 2s ease-in-out infinite',
                          '& .MuiChip-icon': { color: '#4CAF50' },
                          '@keyframes glow': {
                            '0%, 100%': { boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)' },
                            '50%': { boxShadow: '0 0 20px rgba(76, 175, 80, 0.6)' },
                          },
                        }}
                      />
                    </Zoom>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Advanced Grid Layout with Staggered Glassmorphism Cards */}
        <Grid container spacing={4}>
          {/* AI Prediction Center */}
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
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ff9a9e, #fecfef, #fecfef)',
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
                      🎯 Quantum AI Prediction Engine
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Multi-dimensional Risk Analysis • Real-time Threat Assessment • Predictive Intelligence
                    </Typography>
                  </Box>
                </Box>
                <PredictionPanel />
              </Paper>
            </Grow>
          </Grid>

          {/* Security Metrics Correlation */}
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
                    📊 Neural Correlation Matrix
                  </Typography>
                </Box>
                <CorrelationHeatmap />
              </Paper>
            </Grow>
          </Grid>

          {/* AI Feature Importance */}
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
                  <Psychology sx={{ fontSize: 28, mr: 1.5, color: 'warning.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    🧠 AI Feature Intelligence
                  </Typography>
                </Box>
                <FeatureImportance />
              </Paper>
            </Grow>
          </Grid>

          {/* Interactive 3D Globe Visualization */}
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
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    borderRadius: '5px 5px 0 0',
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ width: 50, height: 50, mr: 2, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <Public sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    🌍 Interactive Global Cybersecurity Map
                  </Typography>
                </Box>
                <GeoChart />
              </Paper>
            </Grow>
          </Grid>

          {/* Global Threat Landscape */}
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
                    🌍 Regional Threat Intelligence Analysis
                  </Typography>
                </Box>
                <RegionalChart />
              </Paper>
            </Grow>
          </Grid>

          {/* Countries Security Database */}
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

          {/* Advanced System Status Dashboard */}
          <Grid item xs={12}>
            <Grow in={true} timeout={1800}>
              <Card 
                sx={{ 
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
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={4}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      <Shield sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        🤖 Neural Network Control Center
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Real-time system monitoring and AI model performance metrics
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {[
                      { icon: Assessment, label: 'API Version', value: state.apiStatus?.version || 'v2.0', color: '#2196F3' },
                      { icon: Shield, label: 'Ensemble Model', value: state.apiStatus?.models_loaded?.ensemble_model ? '🟢 Active' : '🔴 Inactive', color: '#4CAF50' },
                      { icon: Public, label: 'Nations Analyzed', value: state.countries.length.toString(), color: '#9C27B0' },
                      { icon: TrendingUp, label: 'Last Sync', value: new Date().toLocaleDateString(), color: '#FF9800' },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Zoom in={true} timeout={2000 + index * 200}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 3,
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(10px)',
                              border: `1px solid ${item.color}30`,
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                background: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-5px)',
                                boxShadow: `0 10px 30px ${item.color}20`,
                              },
                            }}
                          >
                            <item.icon sx={{ fontSize: 40, color: item.color, mb: 2 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {item.label}
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard; 