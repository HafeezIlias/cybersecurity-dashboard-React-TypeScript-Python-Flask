/**
 * Dashboard Page - System Overview & Status
 * ========================================
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
  Dashboard,
  Assessment,
  Public,
  Speed,
  Shield,
  Analytics,
  CloudDone,
  Security,
  RocketLaunch,
} from '@mui/icons-material';

import ApiService, { Country } from '../services/api';

interface DashboardPageState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  apiStatus: any;
}

const DashboardPage: React.FC = () => {
  const [state, setState] = useState<DashboardPageState>({
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
                <Dashboard sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  🚀 Loading CyberShield AI
                </Typography>
                <LinearProgress sx={{ width: 300, mb: 2 }} />
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  Initializing security systems and AI models...
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
              <Typography variant="h6">System Connection Error</Typography>
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
          {/* Introduction Section */}
          <Fade in={true} timeout={800}>
            <Card 
              sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(30px)',
                borderRadius: 6,
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
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '6px 6px 0 0',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
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
                    <Shield sx={{ fontSize: 40 }} />
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
                      🛡️ CyberShield AI Dashboard
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 2 }}>
                      Advanced Global Cybersecurity Risk Management Platform
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                      Welcome to the comprehensive cybersecurity analytics platform that monitors and analyzes 
                      cyber threats across 192 countries worldwide. Our AI-powered system provides real-time 
                      risk assessments, predictive analytics, and actionable intelligence to help organizations 
                      and governments strengthen their cybersecurity posture.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>

          {/* Cybersecurity Metrics Explanation */}
          <Fade in={true} timeout={1000}>
            <Card 
              sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(30px)',
                borderRadius: 6,
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
                  height: '4px',
                  background: 'linear-gradient(90deg, #ff9a9e, #fecfef)',
                  borderRadius: '6px 6px 0 0',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2, background: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }}>
                    <Analytics sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                      📊 Understanding Cybersecurity Metrics
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Key indicators that measure national cybersecurity readiness and resilience
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* CEI Explanation */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(78, 205, 196, 0.3)',
                        boxShadow: '0 8px 32px rgba(78, 205, 196, 0.1)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #4ECDC4, #44A08D)',
                          borderRadius: '4px 4px 0 0',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 40px rgba(78, 205, 196, 0.2)',
                          border: '2px solid rgba(78, 205, 196, 0.5)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ width: 40, height: 40, mr: 2, background: 'linear-gradient(135deg, #4ECDC4, #44A08D)' }}>
                          <Security sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4ECDC4' }}>
                          🔒 CEI - Cybersecurity Exposure Index
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>What it measures:</strong> A country's vulnerability to cyber threats based on digital infrastructure exposure, 
                        attack surface, and historical incident data.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>Key factors:</strong> Internet penetration, critical infrastructure digitization, 
                        known vulnerabilities, and cyber attack frequency.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        <strong>Scale:</strong> 0-100 (Higher score = Greater exposure to cyber risks)
                      </Typography>
                    </Box>
                  </Grid>

                  {/* GCI Explanation */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #667eea, #764ba2)',
                          borderRadius: '4px 4px 0 0',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 40px rgba(102, 126, 234, 0.2)',
                          border: '2px solid rgba(102, 126, 234, 0.5)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ width: 40, height: 40, mr: 2, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                          <Shield sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          🛡️ GCI - Global Cybersecurity Index
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>What it measures:</strong> A country's commitment to cybersecurity across legal, 
                        technical, organizational, capacity building, and cooperation dimensions.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>Key factors:</strong> Cybersecurity legislation, technical institutions, 
                        organizational structures, capacity development, and international cooperation.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        <strong>Scale:</strong> 0-100 (Higher score = Better cybersecurity commitment)
                      </Typography>
                    </Box>
                  </Grid>

                  {/* NCSI Explanation */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(255, 234, 167, 0.4)',
                        boxShadow: '0 8px 32px rgba(250, 177, 160, 0.1)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #ffeaa7, #fab1a0)',
                          borderRadius: '4px 4px 0 0',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 40px rgba(250, 177, 160, 0.2)',
                          border: '2px solid rgba(255, 234, 167, 0.6)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ width: 40, height: 40, mr: 2, background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)' }}>
                          <Public sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fab1a0' }}>
                          🌐 NCSI - National Cyber Security Index
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>What it measures:</strong> A country's preparedness to prevent cyber threats 
                        and manage cyber incidents, focusing on digital welfare and cyber resilience.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>Key factors:</strong> Incident response capabilities, cyber crisis management, 
                        digital welfare policies, and cyber resilience frameworks.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        <strong>Scale:</strong> 0-100 (Higher score = Better cyber preparedness)
                      </Typography>
                    </Box>
                  </Grid>

                  {/* DDL Explanation */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(168, 237, 234, 0.4)',
                        boxShadow: '0 8px 32px rgba(168, 237, 234, 0.1)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #a8edea, #fed6e3)',
                          borderRadius: '4px 4px 0 0',
                        },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 15px 40px rgba(168, 237, 234, 0.2)',
                          border: '2px solid rgba(168, 237, 234, 0.6)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ width: 40, height: 40, mr: 2, background: 'linear-gradient(135deg, #a8edea, #fed6e3)' }}>
                          <Speed sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#74b9ff' }}>
                          ⚡ DDL - Digital Development Level
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>What it measures:</strong> A country's overall digital infrastructure maturity, 
                        technological advancement, and digital economy development.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        <strong>Key factors:</strong> Digital infrastructure quality, internet connectivity, 
                        e-government services, digital skills, and technology adoption rates.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        <strong>Scale:</strong> 0-10 (Higher score = More advanced digital development)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Risk Score Explanation */}
                <Box 
                  sx={{ 
                    mt: 4, 
                    p: 4, 
                    borderRadius: 4, 
                    background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.08), rgba(243, 156, 18, 0.08), rgba(39, 174, 96, 0.08))',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #e74c3c, #f39c12, #27ae60)',
                      borderRadius: '4px 4px 0 0',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                    🎯 AI-Computed Risk Score
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                    Our ensemble machine learning model combines all four metrics to calculate a comprehensive 
                    <strong> Cybersecurity Risk Score (0-100)</strong> that represents each country's overall cyber threat level.
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                    <Chip 
                      label="🔴 High Risk (70-100)" 
                      sx={{ 
                        background: 'rgba(231, 76, 60, 0.2)', 
                        color: '#e74c3c',
                        border: '1px solid rgba(231, 76, 60, 0.3)',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                    <Chip 
                      label="🟡 Medium Risk (40-69)" 
                      sx={{ 
                        background: 'rgba(243, 156, 18, 0.2)', 
                        color: '#f39c12',
                        border: '1px solid rgba(243, 156, 18, 0.3)',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                    <Chip 
                      label="🟢 Low Risk (0-39)" 
                      sx={{ 
                        background: 'rgba(39, 174, 96, 0.2)', 
                        color: '#27ae60',
                        border: '1px solid rgba(39, 174, 96, 0.3)',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>

          {/* Statistics Grid */}
          <Grid container spacing={4}>
            {[
              { icon: Assessment, label: 'API Version', value: state.apiStatus?.version || 'v2.0', color: '#2196F3' },
              { icon: Shield, label: 'Security Status', value: 'Protected', color: '#4CAF50' },
              { icon: Public, label: 'Global Coverage', value: `${state.countries.length} Nations`, color: '#9C27B0' },
              { icon: CloudDone, label: 'AI Models', value: `${modelStatus.loaded} Active`, color: '#FF9800' },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in={true} timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <item.icon sx={{ fontSize: 40, color: item.color, mb: 2 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                        {item.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {/* System Health */}
          <Grow in={true} timeout={1800}>
            <Box sx={{ mt: 4 }}>
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: 5,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Analytics sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    🎯 System Health Monitor
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        API Connection Status
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={state.apiStatus?.status === 'active' ? 100 : 0} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        AI Models Loaded ({modelStatus.loaded}/{modelStatus.total})
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(modelStatus.loaded / Math.max(modelStatus.total, 1)) * 100} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    🚀 Last Updated: {new Date().toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    ⚡ Real-time monitoring active • 🛡️ All systems operational
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grow>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage; 