/**
 * Scatter Plot Component - Relationship Analysis
 * =============================================
 * 
 * Interactive scatter plots to explore relationships between cybersecurity metrics
 * Supports different combinations of CEI, GCI, NCSI, DDL, and Risk Score
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
} from '@mui/material';
import {
  ScatterPlot as ScatterPlotIcon,
  TrendingUp,
  Analytics,
  Public,
  Assessment,
} from '@mui/icons-material';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import ApiService, { Country } from '../services/api';

interface ScatterPlotProps {
  countries?: Country[];
}

type MetricType = 'CEI' | 'GCI' | 'NCSI' | 'DDL' | 'Risk_Score';

interface ScatterDataPoint {
  country: string;
  region: string;
  riskCategory: string;
  x: number;
  y: number;
  size: number;
  originalX: number;
  originalY: number;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ countries: propCountries }) => {
  const [countries, setCountries] = useState<Country[]>(propCountries || []);
  const [loading, setLoading] = useState(!propCountries);
  const [error, setError] = useState<string | null>(null);
  const [xMetric, setXMetric] = useState<MetricType>('GCI');
  const [yMetric, setYMetric] = useState<MetricType>('Risk_Score');

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

  // Generate scatter plot data
  const scatterData = useMemo(() => {
    if (!countries.length) return [];

    return countries.map((country) => {
      // Get normalized values for display (0-100 scale for CEI and Risk_Score)
      const getDisplayValue = (metric: MetricType, country: Country): number => {
        switch (metric) {
          case 'CEI':
            return (country.CEI || 0) * 100;
          case 'GCI':
            return country.GCI || 0;
          case 'NCSI':
            return country.NCSI || 0;
          case 'DDL':
            return country.DDL || 0;
          case 'Risk_Score':
            return (country.Risk_Score || 0) * 100;
          default:
            return 0;
        }
      };

      // Get original values for tooltip
      const getOriginalValue = (metric: MetricType, country: Country): number => {
        switch (metric) {
          case 'CEI':
            return country.CEI || 0;
          case 'GCI':
            return country.GCI || 0;
          case 'NCSI':
            return country.NCSI || 0;
          case 'DDL':
            return country.DDL || 0;
          case 'Risk_Score':
            return country.Risk_Score || 0;
          default:
            return 0;
        }
      };

      const dataPoint: ScatterDataPoint = {
        country: country.Country,
        region: country.Region,
        riskCategory: country.Risk_Category,
        x: getDisplayValue(xMetric, country),
        y: getDisplayValue(yMetric, country),
        size: 40, // Fixed size for now, could be based on another metric
        originalX: getOriginalValue(xMetric, country),
        originalY: getOriginalValue(yMetric, country),
      };

      return dataPoint;
    }).filter(point => point.x > 0 && point.y > 0); // Filter out invalid data points
  }, [countries, xMetric, yMetric]);

  // Group data by region for different colors
  const dataByRegion = useMemo(() => {
    const regionGroups = scatterData.reduce((acc, point) => {
      if (!acc[point.region]) {
        acc[point.region] = [];
      }
      acc[point.region].push(point);
      return acc;
    }, {} as Record<string, ScatterDataPoint[]>);

    return regionGroups;
  }, [scatterData]);

  const getRegionColor = (region: string): string => {
    const colors = {
      'Africa': '#FF6B6B',
      'Asia-Pasific': '#4ECDC4',
      'Europe': '#45B7D1',
      'North America': '#96CEB4',
      'South America': '#FFEAA7',
      'Oceania': '#DDA0DD',
      'Middle East': '#F39C12',
    };
    return colors[region as keyof typeof colors] || '#95A5A6';
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

  const handleXMetricChange = (event: SelectChangeEvent) => {
    setXMetric(event.target.value as MetricType);
  };

  const handleYMetricChange = (event: SelectChangeEvent) => {
    setYMetric(event.target.value as MetricType);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper
          sx={{
            p: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
            {data.country}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Region: <strong>{data.region}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Risk Category: <strong>{data.riskCategory}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {getMetricLabel(xMetric)}: <strong>
                {xMetric === 'CEI' || xMetric === 'Risk_Score' 
                  ? `${data.originalX.toFixed(3)} (${data.x.toFixed(1)}%)`
                  : data.x.toFixed(1)
                }
              </strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {getMetricLabel(yMetric)}: <strong>
                {yMetric === 'CEI' || yMetric === 'Risk_Score' 
                  ? `${data.originalY.toFixed(3)} (${data.y.toFixed(1)}%)`
                  : data.y.toFixed(1)
                }
              </strong>
            </Typography>
          </Box>
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
            📊 Loading Scatter Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Analyzing relationships between metrics...
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
        <Typography variant="h6" sx={{ mb: 1 }}>Scatter Plot Analysis Error</Typography>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '600px' }}>
      {/* Header with controls */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Card 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    mx: 'auto',
                    mb: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <ScatterPlotIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Scatter Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Relationship Explorer
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>X-Axis Metric</InputLabel>
                <Select
                  value={xMetric}
                  label="X-Axis Metric"
                  onChange={handleXMetricChange}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <MenuItem value="CEI">Cybersecurity Exposure Index</MenuItem>
                  <MenuItem value="GCI">Global Cybersecurity Index</MenuItem>
                  <MenuItem value="NCSI">National Cyber Security Index</MenuItem>
                  <MenuItem value="DDL">Digital Development Level</MenuItem>
                  <MenuItem value="Risk_Score">Risk Score</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Y-Axis Metric</InputLabel>
                <Select
                  value={yMetric}
                  label="Y-Axis Metric"
                  onChange={handleYMetricChange}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
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

      {/* Region legend */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.keys(dataByRegion).map((region) => (
          <Chip
            key={region}
            label={`${region} (${dataByRegion[region].length})`}
            sx={{
              background: getRegionColor(region),
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-label': {
                fontSize: '0.75rem',
              },
            }}
          />
        ))}
      </Box>

      {/* Scatter plot */}
      <Paper
        sx={{
          p: 2,
          height: '450px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0, 0, 0, 0.1)" 
            />
            <XAxis 
              type="number" 
              dataKey="x"
              name={getMetricLabel(xMetric)}
              tick={{ fill: '#000', fontSize: 12 }}
              label={{ 
                value: getMetricLabel(xMetric), 
                position: 'insideBottom', 
                offset: -10,
                style: { textAnchor: 'middle', fill: '#000', fontWeight: 'bold' }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="y"
              name={getMetricLabel(yMetric)}
              tick={{ fill: '#000', fontSize: 12 }}
              label={{ 
                value: getMetricLabel(yMetric), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#000', fontWeight: 'bold' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Render scatter plots for each region */}
            {Object.entries(dataByRegion).map(([region, data]) => (
              <Scatter
                key={region}
                name={region}
                data={data}
                fill={getRegionColor(region)}
                fillOpacity={0.7}
                stroke={getRegionColor(region)}
                strokeWidth={2}
              />
            ))}
          </RechartsScatterChart>
        </ResponsiveContainer>
      </Paper>

      {/* Statistics */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          icon={<Public />}
          label={`Total Countries: ${scatterData.length}`}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(10px)',
          }}
        />
        <Chip
          icon={<Assessment />}
          label={`Regions: ${Object.keys(dataByRegion).length}`}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(10px)',
          }}
        />
        <Chip
          icon={<TrendingUp />}
          label={`Comparing: ${getMetricLabel(xMetric).split(' ')[0]} vs ${getMetricLabel(yMetric).split(' ')[0]}`}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(10px)',
          }}
        />
      </Box>
    </Box>
  );
};

export default ScatterPlot; 