/**
 * Comparison Chart Component
 * =========================
 * 
 * Displays comparison bar charts for cybersecurity metrics
 * across regions, risk levels, or top/bottom countries.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Chip,
  Grid,
  Autocomplete,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import {
  BarChart,
  Public,
  Assessment,
  TrendingUp,
  TrendingDown,
  Compare,
  Clear,
  Add,
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ApiService, { Country } from '../services/api';

interface ComparisonChartProps {
  countries?: Country[];
}

type ComparisonMode = 'regions' | 'topCountries' | 'bottomCountries' | 'riskLevels' | 'customCountries';

const ComparisonChart: React.FC<ComparisonChartProps> = ({ countries: propCountries }) => {
  const [countries, setCountries] = useState<Country[]>(propCountries || []);
  const [loading, setLoading] = useState(!propCountries);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ComparisonMode>('regions');
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

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

  // Generate comparison data based on selected mode
  const comparisonData = useMemo(() => {
    if (!countries.length) return [];

    switch (mode) {
      case 'customCountries':
        // Custom country comparison - Fixed logic with normalized CEI
        if (selectedCountries.length === 0) return [];
        
        const customData = selectedCountries.map(country => {
          const data = {
            name: country.Country.length > 15 ? country.Country.substring(0, 15) + '...' : country.Country,
            fullName: country.Country,
            CEI: Number(country.CEI) * 100 || 0, // Convert CEI from 0-1 to 0-100 scale
            GCI: Number(country.GCI) || 0,
            NCSI: Number(country.NCSI) || 0,
            DDL: Number(country.DDL) || 0,
            'Risk Score': Number(country.Risk_Score) * 100 || 0, // Convert Risk_Score from 0-1 to 0-100 scale
            region: country.Region,
            riskCategory: country.Risk_Category,
            // Keep original values for tooltip
            originalCEI: Number(country.CEI) || 0,
            originalRiskScore: Number(country.Risk_Score) || 0,
          };
          return data;
        });
        return customData;

      case 'regions':
        // Group by regions and calculate averages
        const regionGroups = countries.reduce((acc, country) => {
          if (!acc[country.Region]) {
            acc[country.Region] = [];
          }
          acc[country.Region].push(country);
          return acc;
        }, {} as Record<string, Country[]>);

        return Object.entries(regionGroups).map(([region, regionCountries]) => {
          const avgCEI = regionCountries.reduce((sum, c) => sum + (c.CEI || 0), 0) / regionCountries.length;
          const avgGCI = regionCountries.reduce((sum, c) => sum + (c.GCI || 0), 0) / regionCountries.length;
          const avgNCSI = regionCountries.reduce((sum, c) => sum + (c.NCSI || 0), 0) / regionCountries.length;
          const avgDDL = regionCountries.reduce((sum, c) => sum + (c.DDL || 0), 0) / regionCountries.length;
          const avgRisk = regionCountries.reduce((sum, c) => sum + (c.Risk_Score || 0), 0) / regionCountries.length;

          return {
            name: region,
            CEI: Number((avgCEI * 100).toFixed(1)), // Convert CEI to 0-100 scale
            GCI: Number(avgGCI.toFixed(1)),
            NCSI: Number(avgNCSI.toFixed(1)),
            DDL: Number(avgDDL.toFixed(1)),
            'Risk Score': Number((avgRisk * 100).toFixed(1)), // Convert Risk_Score to 0-100 scale
            count: regionCountries.length,
            originalCEI: Number(avgCEI.toFixed(3)),
            originalRiskScore: Number(avgRisk.toFixed(3)),
          };
        }).sort((a, b) => b['Risk Score'] - a['Risk Score']);

      case 'topCountries':
        // Top 10 countries by Risk Score
        return countries
          .sort((a, b) => (b.Risk_Score || 0) - (a.Risk_Score || 0))
          .slice(0, 10)
          .map(country => ({
            name: country.Country.length > 15 ? country.Country.substring(0, 15) + '...' : country.Country,
            fullName: country.Country,
            CEI: (country.CEI || 0) * 100, // Convert CEI to 0-100 scale
            GCI: country.GCI || 0,
            NCSI: country.NCSI || 0,
            DDL: country.DDL || 0,
            'Risk Score': (country.Risk_Score || 0) * 100, // Convert Risk_Score to 0-100 scale
            region: country.Region,
            originalCEI: country.CEI || 0,
            originalRiskScore: country.Risk_Score || 0,
          }));

      case 'bottomCountries':
        // Bottom 10 countries by Risk Score
        return countries
          .sort((a, b) => (a.Risk_Score || 0) - (b.Risk_Score || 0))
          .slice(0, 10)
          .map(country => ({
            name: country.Country.length > 15 ? country.Country.substring(0, 15) + '...' : country.Country,
            fullName: country.Country,
            CEI: (country.CEI || 0) * 100, // Convert CEI to 0-100 scale
            GCI: country.GCI || 0,
            NCSI: country.NCSI || 0,
            DDL: country.DDL || 0,
            'Risk Score': (country.Risk_Score || 0) * 100, // Convert Risk_Score to 0-100 scale
            region: country.Region,
            originalCEI: country.CEI || 0,
            originalRiskScore: country.Risk_Score || 0,
          }));

      case 'riskLevels':
        // Group by risk categories
        const riskGroups = countries.reduce((acc, country) => {
          if (!acc[country.Risk_Category]) {
            acc[country.Risk_Category] = [];
          }
          acc[country.Risk_Category].push(country);
          return acc;
        }, {} as Record<string, Country[]>);

        return Object.entries(riskGroups).map(([riskLevel, riskCountries]) => {
          const avgCEI = riskCountries.reduce((sum, c) => sum + (c.CEI || 0), 0) / riskCountries.length;
          const avgGCI = riskCountries.reduce((sum, c) => sum + (c.GCI || 0), 0) / riskCountries.length;
          const avgNCSI = riskCountries.reduce((sum, c) => sum + (c.NCSI || 0), 0) / riskCountries.length;
          const avgDDL = riskCountries.reduce((sum, c) => sum + (c.DDL || 0), 0) / riskCountries.length;
          const avgRisk = riskCountries.reduce((sum, c) => sum + (c.Risk_Score || 0), 0) / riskCountries.length;

          return {
            name: riskLevel,
            CEI: Number((avgCEI * 100).toFixed(1)), // Convert CEI to 0-100 scale
            GCI: Number(avgGCI.toFixed(1)),
            NCSI: Number(avgNCSI.toFixed(1)),
            DDL: Number(avgDDL.toFixed(1)),
            'Risk Score': Number((avgRisk * 100).toFixed(1)), // Convert Risk_Score to 0-100 scale
            count: riskCountries.length,
            originalCEI: Number(avgCEI.toFixed(3)),
            originalRiskScore: Number(avgRisk.toFixed(3)),
          };
        });

      default:
        return [];
    }
  }, [countries, mode, selectedCountries]);

  const getModeTitle = () => {
    switch (mode) {
      case 'regions':
        return 'Regional Comparison';
      case 'topCountries':
        return 'Top 10 Highest Risk Countries';
      case 'bottomCountries':
        return 'Top 10 Lowest Risk Countries';
      case 'riskLevels':
        return 'Risk Level Comparison';
      case 'customCountries':
        return 'Custom Country Comparison';
      default:
        return 'Comparison';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'regions':
        return 'Average cybersecurity metrics by geographic regions';
      case 'topCountries':
        return 'Countries with the highest cybersecurity risk scores';
      case 'bottomCountries':
        return 'Countries with the lowest cybersecurity risk scores';
      case 'riskLevels':
        return 'Average metrics grouped by risk categories';
      case 'customCountries':
        return 'Compare selected countries side by side';
      default:
        return '';
    }
  };

  // Add country to comparison
  const addCountryToComparison = (country: Country) => {
    if (!selectedCountries.find(c => c.Country === country.Country) && selectedCountries.length < 8) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  // Remove country from comparison
  const removeCountryFromComparison = (countryName: string) => {
    setSelectedCountries(selectedCountries.filter(c => c.Country !== countryName));
  };

  // Clear all selected countries
  const clearAllCountries = () => {
    setSelectedCountries([]);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card sx={{ minWidth: 200, background: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {data.fullName || label}
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                CEI: {data.originalCEI ? data.originalCEI.toFixed(3) : (data.CEI / 100).toFixed(3)}/1.0
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                GCI: {data.GCI?.toFixed(1) || 0}/100
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                NCSI: {data.NCSI?.toFixed(1) || 0}/100
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                DDL: {data.DDL?.toFixed(1) || 0}/100
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Risk Score: {data.originalRiskScore ? (data.originalRiskScore * 100).toFixed(1) : (data['Risk Score']?.toFixed(1) || 0)}/100
              </Typography>
              {data.region && (
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Region: {data.region}
                </Typography>
              )}
              {data.count && (
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Countries: {data.count}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Box textAlign="center">
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading comparison data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ background: 'rgba(244, 67, 54, 0.1)' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Controls */}
      <Box sx={{ mb: 1.5, flexShrink: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
              {getModeTitle()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              {getModeDescription()}
            </Typography>
          </Box>
          <Chip 
            label={`${comparisonData.length} items`} 
            size="small"
            sx={{ 
              background: 'rgba(33, 150, 243, 0.8)',
              color: '#ffffff',
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                background: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.8rem',
                px: 1.5,
                py: 0.5,
                fontWeight: 500,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#ffffff',
                  fontWeight: 600,
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'rgba(0, 0, 0, 0.9)',
                },
              },
            }}
          >
            <ToggleButton value="regions">
              <Public sx={{ mr: 0.5, fontSize: 16 }} />
              Regions
            </ToggleButton>
            <ToggleButton value="topCountries">
              <TrendingUp sx={{ mr: 0.5, fontSize: 16 }} />
              Top Risk
            </ToggleButton>
            <ToggleButton value="bottomCountries">
              <TrendingDown sx={{ mr: 0.5, fontSize: 16 }} />
              Low Risk
            </ToggleButton>
            <ToggleButton value="riskLevels">
              <Assessment sx={{ mr: 0.5, fontSize: 16 }} />
              Risk Levels
            </ToggleButton>
            <ToggleButton value="customCountries">
              <Compare sx={{ mr: 0.5, fontSize: 16 }} />
              Custom
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Custom Country Selection */}
        {mode === 'customCountries' && (
          <Box sx={{ mb: 2 }}>
            {/* Single Row: Search, Clear All, and Selected Countries */}
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.Country}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search countries to compare..."
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#000000',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.7)',
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: 'rgba(0, 0, 0, 0.5)',
                        opacity: 1,
                      },
                    }}
                  />
                )}
                onChange={(e, value) => value && addCountryToComparison(value)}
                value={null}
                disabled={selectedCountries.length >= 8}
              />
              
              <Button
                variant="outlined"
                size="small"
                onClick={clearAllCountries}
                disabled={selectedCountries.length === 0}
                startIcon={<Clear />}
                sx={{
                  color: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(0, 0, 0, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#f44336',
                    color: '#f44336',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Clear All
              </Button>

              {/* Selected Countries on same row */}
              {selectedCountries.length > 0 && (
                <>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.8)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Selected ({selectedCountries.length}/8):
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedCountries.map((country) => (
                      <Chip
                        key={country.Country}
                        label={country.Country}
                        size="small"
                        onDelete={() => removeCountryFromComparison(country.Country)}
                        sx={{
                          background: 'rgba(102, 126, 234, 0.8)',
                          color: '#ffffff',
                          fontWeight: 600,
                          '& .MuiChip-deleteIcon': {
                            color: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { color: '#f44336' },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {selectedCountries.length === 0 && (
              <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontStyle: 'italic', mt: 1 }}>
                Select countries from the dropdown above to compare their cybersecurity metrics
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Chart */}
      <Box sx={{ flex: 1, minHeight: 450, height: 500, overflow: 'hidden', mt: 1 }}>
        {mode === 'customCountries' && selectedCountries.length === 0 ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%"
            sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '2px dashed rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box textAlign="center">
              <Compare sx={{ fontSize: 64, color: 'rgba(0, 0, 0, 0.4)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'rgba(0, 0, 0, 0.8)', mb: 1, fontWeight: 600 }}>
                No Countries Selected
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                Choose countries from the dropdown above to start comparing
              </Typography>
            </Box>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={comparisonData}
              margin={{ 
                top: 20 , 
                right: 30, 
                left: 20, 
                bottom: mode === 'customCountries' ? 90 : 70 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#000000', fontSize: 12, fontWeight: 600 }}
                angle={-45}
                textAnchor="end"
                height={mode === 'customCountries' ? 90 : 70}
                interval={0}
                axisLine={{ stroke: 'rgba(0,0,0,0.4)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.4)' }}
              />
              <YAxis 
                tick={{ fill: '#000000', fontSize: 12, fontWeight: 600 }} 
                axisLine={{ stroke: 'rgba(0,0,0,0.4)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.4)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#000000', fontWeight: 600 }}
                iconType="rect"
              />
              <Bar dataKey="CEI" fill="#4ECDC4" name="CEI (Exposure)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="GCI" fill="#667eea" name="GCI (Commitment)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="NCSI" fill="#ffeaa7" name="NCSI (Preparedness)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="DDL" fill="#a8edea" name="DDL (Digital Dev)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Risk Score" fill="#e74c3c" name="Risk Score" radius={[2, 2, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </Box>

      {/* Legend Info */}
      <Box sx={{ 
        mt: 1, 
        p: 1.5, 
        background: 'rgba(255, 255, 255, 0.08)', 
        borderRadius: 2, 
        flexShrink: 0,
        minHeight: 45
      }}>
        <Grid container spacing={1} sx={{ height: '100%' }}>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1} sx={{ height: '100%' }}>
              <Box sx={{ width: 10, height: 10, background: '#4ECDC4', borderRadius: 1, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2, color: '#000000', fontWeight: 600 }}>
                CEI: Exposure
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1} sx={{ height: '100%' }}>
              <Box sx={{ width: 10, height: 10, background: '#667eea', borderRadius: 1, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2, color: '#000000', fontWeight: 600 }}>
                GCI: Commitment
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1} sx={{ height: '100%' }}>
              <Box sx={{ width: 10, height: 10, background: '#ffeaa7', borderRadius: 1, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2, color: '#000000', fontWeight: 600 }}>
                NCSI: Security
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center" gap={1} sx={{ height: '100%' }}>
              <Box sx={{ width: 10, height: 10, background: '#a8edea', borderRadius: 1, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2, color: '#000000', fontWeight: 600 }}>
                DDL: Digital Dev
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ComparisonChart; 