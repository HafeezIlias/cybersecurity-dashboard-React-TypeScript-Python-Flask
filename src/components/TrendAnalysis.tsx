/**
 * Trend Analysis Component
 * =======================
 * 
 * Displays trend analysis and time series patterns in cybersecurity data
 * Shows metric evolution and comparative trends
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  Avatar,
  Fade,
  SelectChangeEvent,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  TrendingDown,
  Analytics,
  ShowChart,
  Assessment,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import ApiService, { Country } from '../services/api';

interface TrendAnalysisProps {
  countries?: Country[];
}

type TrendView = 'overview' | 'regions' | 'risk-categories';
type MetricType = 'CEI' | 'GCI' | 'NCSI' | 'DDL' | 'Risk_Score';

interface TrendDataPoint {
  name: string;
  CEI: number;
  GCI: number;
  NCSI: number;
  DDL: number;
  Risk_Score: number;
  count: number;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ countries: propCountries }) => {
  const [countries, setCountries] = useState<Country[]>(propCountries || []);
  const [loading, setLoading] = useState(!propCountries);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<TrendView>('overview');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('Risk_Score');

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

  // Generate trend data based on view
  const trendData = useMemo((): TrendDataPoint[] => {
    if (!countries.length) return [];

    switch (view) {
      case 'overview':
        // Global overview - average metrics
        const globalAverages = {
          name: 'Global Average',
          CEI: (countries.reduce((sum, c) => sum + (c.CEI || 0), 0) / countries.length) * 100,
          GCI: countries.reduce((sum, c) => sum + (c.GCI || 0), 0) / countries.length,
          NCSI: countries.reduce((sum, c) => sum + (c.NCSI || 0), 0) / countries.length,
          DDL: countries.reduce((sum, c) => sum + (c.DDL || 0), 0) / countries.length,
          Risk_Score: (countries.reduce((sum, c) => sum + (c.Risk_Score || 0), 0) / countries.length) * 100,
          count: countries.length,
        };
        return [globalAverages];

      case 'regions':
        // Group by regions
        const regionGroups = countries.reduce((acc, country) => {
          if (!acc[country.Region]) {
            acc[country.Region] = [];
          }
          acc[country.Region].push(country);
          return acc;
        }, {} as Record<string, Country[]>);

        return Object.entries(regionGroups).map(([region, regionCountries]) => ({
          name: region,
          CEI: (regionCountries.reduce((sum, c) => sum + (c.CEI || 0), 0) / regionCountries.length) * 100,
          GCI: regionCountries.reduce((sum, c) => sum + (c.GCI || 0), 0) / regionCountries.length,
          NCSI: regionCountries.reduce((sum, c) => sum + (c.NCSI || 0), 0) / regionCountries.length,
          DDL: regionCountries.reduce((sum, c) => sum + (c.DDL || 0), 0) / regionCountries.length,
          Risk_Score: (regionCountries.reduce((sum, c) => sum + (c.Risk_Score || 0), 0) / regionCountries.length) * 100,
          count: regionCountries.length,
        })).sort((a, b) => b.Risk_Score - a.Risk_Score);

      case 'risk-categories':
        // Group by risk categories
        const riskGroups = countries.reduce((acc, country) => {
          if (!acc[country.Risk_Category]) {
            acc[country.Risk_Category] = [];
          }
          acc[country.Risk_Category].push(country);
          return acc;
        }, {} as Record<string, Country[]>);

        return Object.entries(riskGroups).map(([risk, riskCountries]) => ({
          name: risk,
          CEI: (riskCountries.reduce((sum, c) => sum + (c.CEI || 0), 0) / riskCountries.length) * 100,
          GCI: riskCountries.reduce((sum, c) => sum + (c.GCI || 0), 0) / riskCountries.length,
          NCSI: riskCountries.reduce((sum, c) => sum + (c.NCSI || 0), 0) / riskCountries.length,
          DDL: riskCountries.reduce((sum, c) => sum + (c.DDL || 0), 0) / riskCountries.length,
          Risk_Score: (riskCountries.reduce((sum, c) => sum + (c.Risk_Score || 0), 0) / riskCountries.length) * 100,
          count: riskCountries.length,
        })).sort((a, b) => b.Risk_Score - a.Risk_Score);

      default:
        return [];
    }
  }, [countries, view]);

  const getMetricColor = (metric: MetricType): string => {
    const colors = {
      'CEI': '#e74c3c',
      'GCI': '#3498db',
      'NCSI': '#2ecc71',
      'DDL': '#f39c12',
      'Risk_Score': '#9b59b6',
    };
    return colors[metric];
  };

  const getMetricLabel = (metric: MetricType): string => {
    const labels = {
      'CEI': 'Cybersecurity Exposure Index (%)',
      'GCI': 'Global Cybersecurity Index',
      'NCSI': 'National Cyber Security Index',
      'DDL': 'Digital Development Level',
      'Risk_Score': 'Risk Score (%)',
    };
    return labels[metric];
  };

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: TrendView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleMetricChange = (event: SelectChangeEvent) => {
    setSelectedMetric(event.target.value as MetricType);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toFixed(1)}
              {entry.dataKey === 'CEI' || entry.dataKey === 'Risk_Score' ? '%' : ''}
            </Typography>
          ))}
          {payload[0]?.payload?.count && (
            <Typography variant="caption" color="text.secondary">
              Countries: {payload[0].payload.count}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  const getGlobalAverage = (metric: MetricType): number => {
    if (!countries.length) return 0;
    
    const sum = countries.reduce((acc, country) => {
      const value = country[metric] || 0;
      return acc + (metric === 'CEI' || metric === 'Risk_Score' ? value * 100 : value);
    }, 0);
    
    return sum / countries.length;
  };

  const getTrendDirection = (currentValue: number, globalAverage: number): 'up' | 'down' | 'stable' => {
    const diff = Math.abs(currentValue - globalAverage);
    if (diff < 1) return 'stable';
    return currentValue > globalAverage ? 'up' : 'down';
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
            📈 Loading Trend Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Analyzing cybersecurity trends and patterns...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Trend Analysis Error</Typography>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '700px' }}>
      {/* Header with controls */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'success.main' }}>
                  <Timeline sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Trend Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pattern Recognition
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
                fullWidth
              >
                <ToggleButton value="overview">Overview</ToggleButton>
                <ToggleButton value="regions">Regions</ToggleButton>
                <ToggleButton value="risk-categories">Risk Levels</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Primary Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  label="Primary Metric"
                  onChange={handleMetricChange}
                >
                  <MenuItem value="CEI">Cybersecurity Exposure Index</MenuItem>
                  <MenuItem value="GCI">Global Cybersecurity Index</MenuItem>
                  <MenuItem value="NCSI">National Cyber Security Index</MenuItem>
                  <MenuItem value="DDL">Digital Development Level</MenuItem>
                  <MenuItem value="Risk_Score">Risk Score</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Global Average Reference */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          Global Average for {getMetricLabel(selectedMetric)}: {getGlobalAverage(selectedMetric).toFixed(1)}
          {selectedMetric === 'CEI' || selectedMetric === 'Risk_Score' ? '%' : ''}
        </Typography>
      </Paper>

      {/* Main Chart */}
      <Paper sx={{ p: 3, height: '500px', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <ShowChart sx={{ mr: 1 }} />
          {view === 'overview' ? 'Global Overview' : 
           view === 'regions' ? 'Regional Trends' : 'Risk Category Trends'}
        </Typography>

        <ResponsiveContainer width="100%" height="85%">
          {view === 'overview' ? (
            // Single metric overview
            <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={getGlobalAverage(selectedMetric)} 
                stroke="#ff7300" 
                strokeDasharray="3 3"
                label="Global Average"
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor(selectedMetric)}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          ) : (
            // Multi-series comparison
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine 
                y={getGlobalAverage(selectedMetric)} 
                stroke="#ff7300" 
                strokeDasharray="3 3"
                label="Global Average"
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor(selectedMetric)}
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </Paper>

      {/* Trend Insights */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {trendData.map((item, index) => {
          const trend = getTrendDirection(item[selectedMetric], getGlobalAverage(selectedMetric));
          return (
            <Chip
              key={index}
              icon={
                trend === 'up' ? <TrendingUp /> :
                trend === 'down' ? <TrendingDown /> :
                <Assessment />
              }
              label={`${item.name}: ${item[selectedMetric].toFixed(1)}${
                selectedMetric === 'CEI' || selectedMetric === 'Risk_Score' ? '%' : ''
              }`}
              color={
                trend === 'up' ? 'success' :
                trend === 'down' ? 'error' :
                'default'
              }
              variant={trend === 'stable' ? 'outlined' : 'filled'}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default TrendAnalysis; 