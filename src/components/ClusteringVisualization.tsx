/**
 * Clustering Visualization Component
 * =================================
 * 
 * Displays clustering analysis of countries based on cybersecurity characteristics
 * Shows different risk groups and regional patterns
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Avatar,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Radar,
  ExpandMore,
  Security,
  Group,
  Assessment,
  Public,
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import ApiService, { Country } from '../services/api';

interface ClusteringVisualizationProps {
  countries?: Country[];
}

interface ClusterData {
  name: string;
  countries: Country[];
  avgCEI: number;
  avgGCI: number;
  avgNCSI: number;
  avgDDL: number;
  avgRisk: number;
  color: string;
}

interface RiskDistribution {
  name: string;
  value: number;
  color: string;
}

interface RegionalCluster {
  region: string;
  countries: Country[];
  riskDistribution: { [key: string]: number };
}

const ClusteringVisualization: React.FC<ClusteringVisualizationProps> = ({ countries: propCountries }) => {
  const [countries, setCountries] = useState<Country[]>(propCountries || []);
  const [loading, setLoading] = useState(!propCountries);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propCountries) {
      loadCountries();
    }
  }, [propCountries]);

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
      setError('Failed to load countries data');
    } finally {
      setLoading(false);
    }
  };

  // Risk-based clustering
  const riskClusters = useMemo((): ClusterData[] => {
    if (!countries.length) return [];

    const clusters = countries.reduce((acc, country) => {
      const riskCategory = country.Risk_Category;
      if (!acc[riskCategory]) {
        acc[riskCategory] = [];
      }
      acc[riskCategory].push(country);
      return acc;
    }, {} as Record<string, Country[]>);

    const colors = {
      'High Risk': '#e74c3c',
      'Medium Risk': '#f39c12',
      'Low Risk': '#27ae60'
    };

    return Object.entries(clusters).map(([riskLevel, countriesInCluster]) => {
      const avgCEI = countriesInCluster.reduce((sum, c) => sum + (c.CEI || 0), 0) / countriesInCluster.length;
      const avgGCI = countriesInCluster.reduce((sum, c) => sum + (c.GCI || 0), 0) / countriesInCluster.length;
      const avgNCSI = countriesInCluster.reduce((sum, c) => sum + (c.NCSI || 0), 0) / countriesInCluster.length;
      const avgDDL = countriesInCluster.reduce((sum, c) => sum + (c.DDL || 0), 0) / countriesInCluster.length;
      const avgRisk = countriesInCluster.reduce((sum, c) => sum + (c.Risk_Score || 0), 0) / countriesInCluster.length;

      return {
        name: riskLevel,
        countries: countriesInCluster,
        avgCEI: Number((avgCEI * 100).toFixed(1)),
        avgGCI: Number(avgGCI.toFixed(1)),
        avgNCSI: Number(avgNCSI.toFixed(1)),
        avgDDL: Number(avgDDL.toFixed(1)),
        avgRisk: Number((avgRisk * 100).toFixed(1)),
        color: colors[riskLevel as keyof typeof colors] || '#95a5a6',
      };
    }).sort((a, b) => b.avgRisk - a.avgRisk);
  }, [countries]);

  // Regional clustering
  const regionalClusters = useMemo((): RegionalCluster[] => {
    if (!countries.length) return [];

    const regions = countries.reduce((acc, country) => {
      if (!acc[country.Region]) {
        acc[country.Region] = [];
      }
      acc[country.Region].push(country);
      return acc;
    }, {} as Record<string, Country[]>);

    return Object.entries(regions).map(([region, countriesInRegion]) => {
      const riskDistribution = countriesInRegion.reduce((acc, country) => {
        acc[country.Risk_Category] = (acc[country.Risk_Category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        region,
        countries: countriesInRegion,
        riskDistribution,
      };
    });
  }, [countries]);

  // Risk distribution for pie chart
  const riskDistribution = useMemo((): RiskDistribution[] => {
    const colors = {
      'High Risk': '#e74c3c',
      'Medium Risk': '#f39c12',
      'Low Risk': '#27ae60'
    };

    return riskClusters.map(cluster => ({
      name: cluster.name,
      value: cluster.countries.length,
      color: cluster.color,
    }));
  }, [riskClusters]);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High Risk':
        return <TrendingDown sx={{ color: '#e74c3c' }} />;
      case 'Medium Risk':
        return <Remove sx={{ color: '#f39c12' }} />;
      case 'Low Risk':
        return <TrendingUp sx={{ color: '#27ae60' }} />;
      default:
        return <Assessment />;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6">{data.name}</Typography>
          <Typography variant="body2">
            Countries: {data.value} ({((data.value / countries.length) * 100).toFixed(1)}%)
          </Typography>
        </Paper>
      );
    }
    return null;
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
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
            🎯 Loading Cluster Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Grouping countries by cybersecurity patterns...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Clustering Analysis Error</Typography>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: 'auto', minHeight: '600px' }}>
      {/* Header */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                textAlign: 'center', 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 1, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}>
                  <Radar sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Clustering Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Risk & Regional Patterns
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {riskClusters.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk Clusters
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      {regionalClusters.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Regions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {countries.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Countries
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Risk Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <Security sx={{ mr: 1 }} />
              Risk Distribution
            </Typography>
            <Box sx={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Metrics Comparison */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <Assessment sx={{ mr: 1 }} />
              Average Metrics by Risk Level
            </Typography>
            <Box sx={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskClusters} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgGCI" fill="#8884d8" name="GCI" />
                  <Bar dataKey="avgNCSI" fill="#82ca9d" name="NCSI" />
                  <Bar dataKey="avgDDL" fill="#ffc658" name="DDL" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Clusters Details */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <Group sx={{ mr: 1 }} />
              Risk-Based Clusters
            </Typography>
            
            {riskClusters.map((cluster, index) => (
              <Accordion key={index} sx={{ 
                mb: 1, 
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:before': { display: 'none' },
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {getRiskIcon(cluster.name)}
                    <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                      {cluster.name}
                    </Typography>
                    <Chip 
                      label={`${cluster.countries.length} countries`}
                      sx={{ 
                        bgcolor: cluster.color, 
                        color: 'white',
                        mr: 2
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                      Avg Risk Score: {cluster.avgRisk}%
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>Average Metrics:</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary={`CEI: ${cluster.avgCEI}%`}
                            secondary="Cybersecurity Exposure Index"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={`GCI: ${cluster.avgGCI}`}
                            secondary="Global Cybersecurity Index"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={`NCSI: ${cluster.avgNCSI}`}
                            secondary="National Cyber Security Index"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={`DDL: ${cluster.avgDDL}`}
                            secondary="Digital Development Level"
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: cluster.color, fontWeight: 'bold' }}>
                        Countries in this cluster ({cluster.countries.length}):
                      </Typography>
                      <Box sx={{ 
                        maxHeight: 200, 
                        overflow: 'auto',
                        p: 1,
                        border: `1px solid ${cluster.color}30`,
                        borderRadius: 1,
                        background: `${cluster.color}05`
                      }}>
                        {cluster.countries.map((country, countryIndex) => (
                          <Chip
                            key={countryIndex}
                            label={country.Country}
                            size="small"
                            sx={{ 
                              m: 0.5,
                              bgcolor: `${cluster.color}20`,
                              color: cluster.color,
                              border: `1px solid ${cluster.color}40`,
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: cluster.color,
                                color: 'white'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>


      </Grid>
    </Box>
  );
};

export default ClusteringVisualization; 