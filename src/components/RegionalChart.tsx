/**
 * Regional Chart Component - Advanced Analytics
 * ===========================================
 * 
 * Displays comprehensive regional cybersecurity statistics with interactive charts
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  Public,
  Security,
  Assessment,
} from '@mui/icons-material';
import ApiService from '../services/api';

interface RegionalStats {
  Region: string;
  CEI_mean: number;
  CEI_std: number;
  CEI_count: number;
  GCI_mean: number;
  GCI_std: number;
  GCI_count: number;
  NCSI_mean: number;
  NCSI_std: number;
  NCSI_count: number;
  DDL_mean: number;
  DDL_std: number;
  DDL_count: number;
  Risk_Score_mean: number;
  Risk_Score_std: number;
  Risk_Score_count: number;
}

interface RegionalData {
  regional_statistics: RegionalStats[];
  risk_distribution: { [region: string]: { [risk: string]: number } };
  total_regions: number;
}

const RegionalChart: React.FC = () => {
  const [data, setData] = useState<RegionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRegionalData();
  }, []);

  const loadRegionalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.getRegionalAnalysis();
      setData(result);
    } catch (error) {
      console.error('Error loading regional data:', error);
      setError('Failed to load regional data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRegionColor = (region: string): string => {
    const colors = {
      'Africa': '#FF6B6B',
      'Asia': '#4ECDC4',
      'Europe': '#45B7D1',
      'North America': '#96CEB4',
      'South America': '#FFEAA7',
      'Oceania': '#DDA0DD',
      'Middle East': '#F39C12',
      'default': '#95A5A6'
    };
    return colors[region as keyof typeof colors] || colors.default;
  };

  const getRiskColor = (risk: string): string => {
    const colors = {
      'High Risk': '#e74c3c',
      'Medium Risk': '#f39c12',
      'Low Risk': '#27ae60'
    };
    return colors[risk as keyof typeof colors] || '#95a5a6';
  };

  const formatValue = (value: number): string => {
    return value?.toFixed(2) || '0.00';
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: 'primary.main',
              mb: 2,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }} 
          />
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
            🌍 Loading Global Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Analyzing regional cybersecurity patterns...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          background: 'rgba(244, 67, 54, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>Regional Analysis Error</Typography>
        {error}
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <Box sx={{ height: '450px', overflow: 'auto' }}>
      {/* Header Stats */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Public sx={{ fontSize: 32, color: '#4ECDC4', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {data.total_regions}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Global Regions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Assessment sx={{ fontSize: 32, color: '#45B7D1', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {data.regional_statistics.reduce((sum, region) => sum + region.CEI_count, 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Countries
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Security sx={{ fontSize: 32, color: '#96CEB4', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {formatValue(data.regional_statistics.reduce((sum, region) => sum + region.Risk_Score_mean, 0) / data.regional_statistics.length)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Global Avg Risk
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Regional Statistics Cards */}
      <Grid container spacing={3}>
        {data.regional_statistics.map((region, index) => (
          <Grid item xs={12} md={6} lg={4} key={region.Region}>
            <Grow in={true} timeout={1000 + index * 200}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${getRegionColor(region.Region)}30`,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: `0 20px 40px ${getRegionColor(region.Region)}20`,
                    border: `2px solid ${getRegionColor(region.Region)}60`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${getRegionColor(region.Region)}, ${getRegionColor(region.Region)}80)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Region Header */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        background: `linear-gradient(135deg, ${getRegionColor(region.Region)}, ${getRegionColor(region.Region)}80)`,
                      }}
                    >
                      <Public sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {region.Region}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {region.CEI_count} Countries
                      </Typography>
                    </Box>
                  </Box>

                  {/* Risk Score */}
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Overall Risk Score
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: getRegionColor(region.Region) }}>
                        {formatValue(region.Risk_Score_mean)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(region.Risk_Score_mean / 100) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${getRegionColor(region.Region)}, ${getRegionColor(region.Region)}80)`,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  {/* Security Metrics */}
                  <Grid container spacing={1}>
                    {[
                      { label: 'CEI', value: region.CEI_mean, icon: '🔒' },
                      { label: 'GCI', value: region.GCI_mean, icon: '🛡️' },
                      { label: 'NCSI', value: region.NCSI_mean, icon: '🌐' },
                      { label: 'DDL', value: region.DDL_mean, icon: '⚡' },
                    ].map((metric) => (
                      <Grid item xs={6} key={metric.label}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            textAlign: 'center',
                            transition: 'background 0.3s ease',
                            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            {metric.icon} {metric.label}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {formatValue(metric.value)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Risk Distribution */}
                  {data.risk_distribution[region.Region] && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Risk Distribution
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {Object.entries(data.risk_distribution[region.Region]).map(([riskLevel, count]) => (
                          <Chip
                            key={riskLevel}
                            label={`${riskLevel}: ${count}`}
                            size="small"
                            sx={{
                              background: `${getRiskColor(riskLevel)}20`,
                              color: getRiskColor(riskLevel),
                              border: `1px solid ${getRiskColor(riskLevel)}40`,
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Summary Footer */}
      <Fade in={true} timeout={1500}>
        <Box sx={{ mt: 3, p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            🌍 Regional analysis showing cybersecurity metrics across {data.total_regions} global regions • 
            📊 Data includes CEI, GCI, NCSI, and DDL indicators • 
            🎯 Risk scores calculated using ensemble AI models
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default RegionalChart; 