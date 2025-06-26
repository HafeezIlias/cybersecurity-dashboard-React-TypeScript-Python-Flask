/**
 * Interactive Filters Component
 * ============================
 * 
 * Provides advanced filtering capabilities for cybersecurity data
 * Includes region, risk level, and metric range filters
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
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
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  Clear,
  Public,
  Security,
  Assessment,
  TrendingUp,
} from '@mui/icons-material';
import { Country } from '../services/api';

interface InteractiveFiltersProps {
  countries: Country[];
  onFiltersChange: (filteredCountries: Country[]) => void;
}

interface FilterState {
  selectedRegions: string[];
  selectedRiskCategories: string[];
  ceiRange: [number, number];
  gciRange: [number, number];
  ncsiRange: [number, number];
  ddlRange: [number, number];
  riskScoreRange: [number, number];
  showAdvanced: boolean;
}

const InteractiveFilters: React.FC<InteractiveFiltersProps> = ({ 
  countries, 
  onFiltersChange 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedRegions: [],
    selectedRiskCategories: [],
    ceiRange: [0, 100],
    gciRange: [0, 100],
    ncsiRange: [0, 100],
    ddlRange: [0, 100],
    riskScoreRange: [0, 100],
    showAdvanced: false,
  });

  // Get unique values for dropdowns
  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(countries.map(c => c.Region))).sort();
  }, [countries]);

  const uniqueRiskCategories = useMemo(() => {
    return Array.from(new Set(countries.map(c => c.Risk_Category))).sort();
  }, [countries]);

  // Get min/max values for sliders
  const metricRanges = useMemo(() => {
    if (!countries.length) return null;

    return {
      cei: [0, 100], // CEI is already normalized to 0-1, display as 0-100%
      gci: [Math.min(...countries.map(c => c.GCI || 0)), Math.max(...countries.map(c => c.GCI || 0))],
      ncsi: [Math.min(...countries.map(c => c.NCSI || 0)), Math.max(...countries.map(c => c.NCSI || 0))],
      ddl: [Math.min(...countries.map(c => c.DDL || 0)), Math.max(...countries.map(c => c.DDL || 0))],
      riskScore: [0, 100], // Risk Score is already normalized to 0-1, display as 0-100%
    };
  }, [countries]);

  // Apply filters
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      // Region filter
      if (filters.selectedRegions.length > 0 && !filters.selectedRegions.includes(country.Region)) {
        return false;
      }

      // Risk category filter
      if (filters.selectedRiskCategories.length > 0 && !filters.selectedRiskCategories.includes(country.Risk_Category)) {
        return false;
      }

      // CEI range filter (convert to percentage for comparison)
      const ceiPercent = (country.CEI || 0) * 100;
      if (ceiPercent < filters.ceiRange[0] || ceiPercent > filters.ceiRange[1]) {
        return false;
      }

      // GCI range filter
      const gci = country.GCI || 0;
      if (gci < filters.gciRange[0] || gci > filters.gciRange[1]) {
        return false;
      }

      // NCSI range filter
      const ncsi = country.NCSI || 0;
      if (ncsi < filters.ncsiRange[0] || ncsi > filters.ncsiRange[1]) {
        return false;
      }

      // DDL range filter
      const ddl = country.DDL || 0;
      if (ddl < filters.ddlRange[0] || ddl > filters.ddlRange[1]) {
        return false;
      }

      // Risk Score range filter (convert to percentage for comparison)
      const riskScorePercent = (country.Risk_Score || 0) * 100;
      if (riskScorePercent < filters.riskScoreRange[0] || riskScorePercent > filters.riskScoreRange[1]) {
        return false;
      }

      return true;
    });
  }, [countries, filters]);

  // Notify parent component when filtered data changes
  useEffect(() => {
    onFiltersChange(filteredCountries);
  }, [filteredCountries, onFiltersChange]);

  const handleRegionChange = (event: SelectChangeEvent<string[]>) => {
    setFilters(prev => ({
      ...prev,
      selectedRegions: event.target.value as string[]
    }));
  };

  const handleRiskCategoryChange = (event: SelectChangeEvent<string[]>) => {
    setFilters(prev => ({
      ...prev,
      selectedRiskCategories: event.target.value as string[]
    }));
  };

  const handleSliderChange = (field: keyof FilterState) => (event: Event, newValue: number | number[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: newValue as [number, number]
    }));
  };

  const clearFilters = () => {
    setFilters({
      selectedRegions: [],
      selectedRiskCategories: [],
      ceiRange: [0, 100],
      gciRange: (metricRanges?.gci || [0, 100]) as [number, number],
      ncsiRange: (metricRanges?.ncsi || [0, 100]) as [number, number],
      ddlRange: (metricRanges?.ddl || [0, 100]) as [number, number],
      riskScoreRange: [0, 100],
      showAdvanced: false,
    });
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    
    if (filters.selectedRegions.length > 0) {
      activeFilters.push(`${filters.selectedRegions.length} regions`);
    }
    
    if (filters.selectedRiskCategories.length > 0) {
      activeFilters.push(`${filters.selectedRiskCategories.length} risk levels`);
    }

    return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters applied';
  };

  if (!metricRanges) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <FilterList />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Interactive Filters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredCountries.length} of {countries.length} countries shown
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={clearFilters}
              size="small"
            >
              Clear All
            </Button>
          </Box>

          {/* Filter Summary */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary">
              Active Filters: {getFilterSummary()}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.selectedRegions.map(region => (
                <Chip
                  key={region}
                  label={region}
                  size="small"
                  onDelete={() => {
                    setFilters(prev => ({
                      ...prev,
                      selectedRegions: prev.selectedRegions.filter(r => r !== region)
                    }));
                  }}
                />
              ))}
              {filters.selectedRiskCategories.map(risk => (
                <Chip
                  key={risk}
                  label={risk}
                  size="small"
                  color="secondary"
                  onDelete={() => {
                    setFilters(prev => ({
                      ...prev,
                      selectedRiskCategories: prev.selectedRiskCategories.filter(r => r !== risk)
                    }));
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Basic Filters */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Regions</InputLabel>
                <Select
                  multiple
                  value={filters.selectedRegions}
                  onChange={handleRegionChange}
                  label="Regions"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {uniqueRegions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Risk Categories</InputLabel>
                <Select
                  multiple
                  value={filters.selectedRiskCategories}
                  onChange={handleRiskCategoryChange}
                  label="Risk Categories"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" color="secondary" />
                      ))}
                    </Box>
                  )}
                >
                  {uniqueRiskCategories.map((risk) => (
                    <MenuItem key={risk} value={risk}>
                      {risk}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Advanced Filters Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={filters.showAdvanced}
                onChange={(e) => setFilters(prev => ({ ...prev, showAdvanced: e.target.checked }))}
              />
            }
            label="Show Advanced Metric Filters"
            sx={{ mb: 2 }}
          />

          {/* Advanced Metric Filters */}
          {filters.showAdvanced && (
            <Accordion expanded sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <AccordionSummary>
                <Typography variant="h6">Metric Range Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>
                      Cybersecurity Exposure Index: {filters.ceiRange[0]}% - {filters.ceiRange[1]}%
                    </Typography>
                    <Slider
                      value={filters.ceiRange}
                      onChange={handleSliderChange('ceiRange')}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' }
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>
                      Global Cybersecurity Index: {filters.gciRange[0]} - {filters.gciRange[1]}
                    </Typography>
                    <Slider
                      value={filters.gciRange}
                      onChange={handleSliderChange('gciRange')}
                      valueLabelDisplay="auto"
                      min={metricRanges.gci[0]}
                      max={metricRanges.gci[1]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>
                      National Cyber Security Index: {filters.ncsiRange[0]} - {filters.ncsiRange[1]}
                    </Typography>
                    <Slider
                      value={filters.ncsiRange}
                      onChange={handleSliderChange('ncsiRange')}
                      valueLabelDisplay="auto"
                      min={metricRanges.ncsi[0]}
                      max={metricRanges.ncsi[1]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>
                      Digital Development Level: {filters.ddlRange[0]} - {filters.ddlRange[1]}
                    </Typography>
                    <Slider
                      value={filters.ddlRange}
                      onChange={handleSliderChange('ddlRange')}
                      valueLabelDisplay="auto"
                      min={metricRanges.ddl[0]}
                      max={metricRanges.ddl[1]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      Risk Score: {filters.riskScoreRange[0]}% - {filters.riskScoreRange[1]}%
                    </Typography>
                    <Slider
                      value={filters.riskScoreRange}
                      onChange={handleSliderChange('riskScoreRange')}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 25, label: '25%' },
                        { value: 50, label: '50%' },
                        { value: 75, label: '75%' },
                        { value: 100, label: '100%' }
                      ]}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Results Summary */}
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {filteredCountries.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Countries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="secondary">
                  {Array.from(new Set(filteredCountries.map(c => c.Region))).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Regions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {filteredCountries.filter(c => c.Risk_Category === 'Low Risk').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Low Risk
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {filteredCountries.filter(c => c.Risk_Category === 'High Risk').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  High Risk
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InteractiveFilters; 