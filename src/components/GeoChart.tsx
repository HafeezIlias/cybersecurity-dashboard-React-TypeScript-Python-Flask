/**
 * Interactive 3D Choropleth Map Component
 * =======================================
 * 
 * Features:
 * - 3D rotating globe with filled country polygons (like Chart.js Geo)
 * - Regional/continental filtering
 * - Interactive country selection with details
 * - Color-coded risk levels (choropleth map)
 * - Smooth animations and modern UI
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  LinearProgress,
  Alert,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  Public,
  ViewInAr,
  FilterList,
  Security,
  Assessment,
  Refresh,
  Language,
  Map,
  Satellite,
  Search,
  ZoomIn,
  Clear,
} from '@mui/icons-material';
import ApiService, { Country } from '../services/api';

interface CountryPolygon {
  type: string;
  properties: {
    name: string;
    iso_a3: string;
    iso_a2: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

interface EnhancedCountryPolygon extends CountryPolygon {
  countryData?: Country;
  fillColor: string;
  strokeColor: string;
  altitude: number;
}

const GeoChart: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<Country | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'flat'>('3d');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [worldData, setWorldData] = useState<CountryPolygon[]>([]);
  const globeRef = useRef<any>(null);

  // Country coordinates for zoom functionality
  const countryCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'United States': { lat: 39.8283, lng: -98.5795 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'France': { lat: 46.6034, lng: 1.8883 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'Russia': { lat: 61.5240, lng: 105.3188 },
    'South Korea': { lat: 35.9078, lng: 127.7669 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Sweden': { lat: 60.1282, lng: 18.6435 },
    'Norway': { lat: 60.4720, lng: 8.4689 },
    'Denmark': { lat: 56.2639, lng: 9.5018 },
    'Finland': { lat: 61.9241, lng: 25.7482 },
    'Switzerland': { lat: 46.8182, lng: 8.2275 },
    'Austria': { lat: 47.5162, lng: 14.5501 },
    'Belgium': { lat: 50.5039, lng: 4.4699 },
    'Ireland': { lat: 53.4129, lng: -8.2439 },
    'Portugal': { lat: 39.3999, lng: -8.2245 },
    'Greece': { lat: 39.0742, lng: 21.8243 },
    'Poland': { lat: 51.9194, lng: 19.1451 },
    'Czech Republic': { lat: 49.8175, lng: 15.4730 },
    'Hungary': { lat: 47.1625, lng: 19.5033 },
    'Slovakia': { lat: 48.6690, lng: 19.6990 },
    'Slovenia': { lat: 46.1512, lng: 14.9955 },
    'Croatia': { lat: 45.1000, lng: 15.2000 },
    'Romania': { lat: 45.9432, lng: 24.9668 },
    'Bulgaria': { lat: 42.7339, lng: 25.4858 },
    'Serbia': { lat: 44.0165, lng: 21.0059 },
    'Ukraine': { lat: 48.3794, lng: 31.1656 },
    'Turkey': { lat: 38.9637, lng: 35.2433 },
    'Israel': { lat: 31.0461, lng: 34.8516 },
    'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
    'UAE': { lat: 23.4241, lng: 53.8478 },
    'Qatar': { lat: 25.3548, lng: 51.1839 },
    'Kuwait': { lat: 29.3117, lng: 47.4818 },
    'Jordan': { lat: 30.5852, lng: 36.2384 },
    'Lebanon': { lat: 33.8547, lng: 35.8623 },
    'Egypt': { lat: 26.0975, lng: 30.0444 },
    'South Africa': { lat: -30.5595, lng: 22.9375 },
    'Nigeria': { lat: 9.0820, lng: 8.6753 },
    'Kenya': { lat: -0.0236, lng: 37.9062 },
    'Morocco': { lat: 31.7917, lng: -7.0926 },
    'Tunisia': { lat: 33.8869, lng: 9.5375 },
    'Algeria': { lat: 28.0339, lng: 1.6596 },
    'Ghana': { lat: 7.9465, lng: -1.0232 },
    'Ethiopia': { lat: 9.1450, lng: 40.4897 },
    'Tanzania': { lat: -6.3690, lng: 34.8888 },
    'Uganda': { lat: 1.3733, lng: 32.2903 },
    'Rwanda': { lat: -1.9403, lng: 29.8739 },
    'Botswana': { lat: -22.3285, lng: 24.6849 },
    'Mauritius': { lat: -20.3484, lng: 57.5522 },
    'Mexico': { lat: 23.6345, lng: -102.5528 },
    'Argentina': { lat: -38.4161, lng: -63.6167 },
    'Chile': { lat: -35.6751, lng: -71.5430 },
    'Colombia': { lat: 4.5709, lng: -74.2973 },
    'Peru': { lat: -9.1900, lng: -75.0152 },
    'Ecuador': { lat: -1.8312, lng: -78.1834 },
    'Uruguay': { lat: -32.5228, lng: -55.7658 },
    'Paraguay': { lat: -23.4425, lng: -58.4438 },
    'Venezuela': { lat: 6.4238, lng: -66.5897 },
    'Costa Rica': { lat: 9.7489, lng: -83.7534 },
    'Panama': { lat: 8.5380, lng: -80.7821 },
    'Dominican Republic': { lat: 18.7357, lng: -70.1627 },
    'Jamaica': { lat: 18.1096, lng: -77.2975 },
    'Trinidad and Tobago': { lat: 10.6918, lng: -61.2225 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Malaysia': { lat: 4.2105, lng: 101.9758 },
    'Thailand': { lat: 15.8700, lng: 100.9925 },
    'Indonesia': { lat: -0.7893, lng: 113.9213 },
    'Philippines': { lat: 12.8797, lng: 121.7740 },
    'Vietnam': { lat: 14.0583, lng: 108.2772 },
    'Myanmar': { lat: 21.9162, lng: 95.9560 },
    'Cambodia': { lat: 12.5657, lng: 104.9910 },
    'Laos': { lat: 19.8563, lng: 102.4955 },
    'Bangladesh': { lat: 23.6850, lng: 90.3563 },
    'Pakistan': { lat: 30.3753, lng: 69.3451 },
    'Afghanistan': { lat: 33.9391, lng: 67.7100 },
    'Iran': { lat: 32.4279, lng: 53.6880 },
    'Iraq': { lat: 33.2232, lng: 43.6793 },
    'Syria': { lat: 34.8021, lng: 38.9968 },
    'Yemen': { lat: 15.5527, lng: 48.5164 },
    'Oman': { lat: 21.4735, lng: 55.9754 },
    'Bahrain': { lat: 25.9304, lng: 50.6378 },
    'Sri Lanka': { lat: 7.8731, lng: 80.7718 },
    'Nepal': { lat: 28.3949, lng: 84.1240 },
    'Bhutan': { lat: 27.5142, lng: 90.4336 },
    'Mongolia': { lat: 46.8625, lng: 103.8467 },
    'North Korea': { lat: 40.3399, lng: 127.5101 },
    'Kazakhstan': { lat: 48.0196, lng: 66.9237 },
    'Uzbekistan': { lat: 41.3775, lng: 64.5853 },
    'Kyrgyzstan': { lat: 41.2044, lng: 74.7661 },
    'Tajikistan': { lat: 38.8610, lng: 71.2761 },
    'Turkmenistan': { lat: 38.9697, lng: 59.5563 },
    'Azerbaijan': { lat: 40.1431, lng: 47.5769 },
    'Armenia': { lat: 40.0691, lng: 45.0382 },
    'Georgia': { lat: 42.3154, lng: 43.3569 },
    'Moldova': { lat: 47.4116, lng: 28.3699 },
    'Belarus': { lat: 53.7098, lng: 27.9534 },
    'Lithuania': { lat: 55.1694, lng: 23.8813 },
    'Latvia': { lat: 56.8796, lng: 24.6032 },
    'Estonia': { lat: 58.5953, lng: 25.0136 },
    'Iceland': { lat: 64.9631, lng: -19.0208 },
    'Luxembourg': { lat: 49.8153, lng: 6.1296 },
    'Malta': { lat: 35.9375, lng: 14.3754 },
    'Cyprus': { lat: 35.1264, lng: 33.4299 },
    'New Zealand': { lat: -40.9006, lng: 174.8860 },
    'Papua New Guinea': { lat: -6.3150, lng: 143.9555 },
    'Fiji': { lat: -16.5780, lng: 179.4144 },
    'Solomon Islands': { lat: -9.6457, lng: 160.1562 },
    'Vanuatu': { lat: -15.3767, lng: 166.9592 },
    'Samoa': { lat: -13.7590, lng: -172.1046 },
    'Tonga': { lat: -21.1789, lng: -175.1982 },
    'Palau': { lat: 7.5150, lng: 134.5825 },
    'Micronesia': { lat: 7.4256, lng: 150.5508 },
    'Marshall Islands': { lat: 7.1315, lng: 171.1845 },
  };

  // Load world GeoJSON data and countries data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load world GeoJSON data and countries data in parallel
        const [worldResponse, countriesData] = await Promise.all([
          fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'),
          ApiService.getCountries()
        ]);

        if (!worldResponse.ok) {
          throw new Error('Failed to load world map data');
        }

        const worldGeoJson = await worldResponse.json();
        setWorldData(worldGeoJson.features || []);
        setCountries(countriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load map data. Please ensure you have an internet connection.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique regions for filtering
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(countries.map(country => country.Region)));
    return ['All', ...uniqueRegions];
  }, [countries]);

  // Get unique risk categories for filtering
  const riskCategories = useMemo(() => {
    const uniqueRisks = Array.from(new Set(countries.map(country => country.Risk_Category)));
    return ['All', ...uniqueRisks];
  }, [countries]);

  // Color mapping for regions and risk levels
  const getRegionColor = (region: string): string => {
    const colors = {
      'Africa': '#FF6B6B',
      'Asia': '#4ECDC4',
      'Europe': '#45B7D1',
      'North America': '#96CEB4',
      'South America': '#FFEAA7',
      'Oceania': '#DDA0DD',
      'Middle East': '#F39C12',
    };
    return colors[region as keyof typeof colors] || '#95A5A6';
  };

  const getRiskColor = (riskCategory: string): string => {
    const colors = {
      'High Risk': '#e74c3c',
      'Medium Risk': '#f39c12',
      'Low Risk': '#27ae60'
    };
    return colors[riskCategory as keyof typeof colors] || '#95a5a6';
  };

  // Country name mapping for better matching
  const getCountryMatch = (geoCountryName: string): Country | undefined => {
    // Direct name match
    let match = countries.find(c => 
      c.Country.toLowerCase() === geoCountryName.toLowerCase()
    );
    
    if (match) return match;

    // Common name variations mapping
    const nameMapping: { [key: string]: string } = {
      'United States of America': 'United States',
      'Russian Federation': 'Russia',
      'Korea, Republic of': 'South Korea',
      'Korea, Democratic People\'s Republic of': 'North Korea',
      'Iran, Islamic Republic of': 'Iran',
      'Syrian Arab Republic': 'Syria',
      'Venezuela, Bolivarian Republic of': 'Venezuela',
      'Bolivia, Plurinational State of': 'Bolivia',
      'Tanzania, United Republic of': 'Tanzania',
      'Congo, Democratic Republic of the': 'Democratic Republic of Congo',
      'Congo, Republic of the': 'Republic of Congo',
      'Macedonia, the former Yugoslav Republic of': 'North Macedonia',
      'Moldova, Republic of': 'Moldova',
      'Palestinian Territory, Occupied': 'Palestine',
      'Lao People\'s Democratic Republic': 'Laos',
      'Viet Nam': 'Vietnam',
      'Myanmar': 'Myanmar',
      'Brunei Darussalam': 'Brunei',
    };

    const mappedName = nameMapping[geoCountryName];
    if (mappedName) {
      match = countries.find(c => 
        c.Country.toLowerCase() === mappedName.toLowerCase()
      );
    }

    if (match) return match;

    // Partial name matching
    match = countries.find(c => 
      c.Country.toLowerCase().includes(geoCountryName.toLowerCase()) ||
      geoCountryName.toLowerCase().includes(c.Country.toLowerCase())
    );

    return match;
  };

  // Enhanced polygon data with country information
  const enhancedPolygons = useMemo(() => {
    if (!worldData.length || !countries.length) return [];

    let filteredCountries = countries;

    // Apply region filter
    if (selectedRegion !== 'All') {
      filteredCountries = filteredCountries.filter(country => country.Region === selectedRegion);
    }

    // Apply risk category filter
    if (selectedRisk !== 'All') {
      filteredCountries = filteredCountries.filter(country => country.Risk_Category === selectedRisk);
    }

    // Apply country filter
    if (selectedCountryFilter) {
      filteredCountries = filteredCountries.filter(country => country.Country === selectedCountryFilter.Country);
    }

    return worldData.map((polygon): EnhancedCountryPolygon => {
      const countryData = getCountryMatch(polygon.properties.name);
      
      // Check if this country should be shown based on filters
      const shouldShow = !countryData || filteredCountries.includes(countryData);
      
      let fillColor = '#2c3e50'; // Default dark color for countries without data
      let strokeColor = '#1a1a1a'; // Dark borders for clear separation
      let altitude = 0.015; // Higher minimum altitude to be clearly above globe surface

      if (countryData && shouldShow) {
        fillColor = getRiskColor(countryData.Risk_Category);
        strokeColor = '#1a1a1a'; // Dark borders for all countries with data
        altitude = Math.max(countryData.Risk_Score * 0.005, 0.02); // Much higher altitude, minimum 0.02
      } else if (!shouldShow) {
        // Hide filtered out countries by making them nearly transparent
        fillColor = 'rgba(44, 62, 80, 0.1)';
        strokeColor = 'rgba(26, 26, 26, 0.3)'; // Semi-transparent dark borders
        altitude = 0.01; // Still clearly above surface
      }

      return {
        ...polygon,
        countryData,
        fillColor,
        strokeColor,
        altitude,
      };
    });
  }, [worldData, countries, selectedRegion, selectedRisk]);

  // Handle country selection
  const handleCountryClick = (polygon: any) => {
    if (polygon.countryData) {
      setSelectedCountry(polygon.countryData);
    }
  };

  const resetView = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ 
        lat: 0, 
        lng: 0, 
        altitude: 2.5 
      }, 1000);
    }
  };

  const zoomToCountry = (country: Country) => {
    if (globeRef.current && countryCoordinates[country.Country]) {
      const coords = countryCoordinates[country.Country];
      globeRef.current.pointOfView({
        lat: coords.lat,
        lng: coords.lng,
        altitude: 1.5 // Closer zoom for country view
      }, 1500);
      setSelectedCountry(country);
    }
  };

  // Initialize globe position when component mounts
  useEffect(() => {
    if (globeRef.current && !loading) {
      // Center the globe and set initial view
      setTimeout(() => {
        globeRef.current.pointOfView({ 
          lat: 20, 
          lng: 0, 
          altitude: 2.5 
        }, 0);
      }, 100);
    }
  }, [loading]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="500px"
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box textAlign="center">
          <Public 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main', 
              mb: 2,
              animation: 'spin 3s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }} 
          />
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
            🌍 Loading Global Cybersecurity Map
          </Typography>
          <LinearProgress sx={{ width: 300, mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Loading world map data and country cybersecurity metrics...
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
        <Typography variant="h6" sx={{ mb: 1 }}>Global Map Error</Typography>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Controls Panel */}
      <Fade in={true} timeout={800}>
        <Card 
          sx={{ 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Country Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  size="small"
                  options={countries}
                  getOptionLabel={(option) => option.Country}
                  value={selectedCountryFilter}
                  onChange={(event, newValue) => {
                    setSelectedCountryFilter(newValue);
                    if (newValue) {
                      zoomToCountry(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Country"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={option.Risk_Category} 
                        size="small" 
                        sx={{ 
                          background: `${getRiskColor(option.Risk_Category)}20`,
                          color: getRiskColor(option.Risk_Category),
                          fontSize: '0.7rem'
                        }} 
                      />
                      {option.Country}
                    </Box>
                  )}
                />
              </Grid>

              {/* Region Filter */}
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={selectedRegion}
                    label="Region"
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    {regions.map(region => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Risk Filter */}
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={selectedRisk}
                    label="Risk Level"
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    {riskCategories.map(risk => (
                      <MenuItem key={risk} value={risk}>
                        {risk}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* View Mode Toggle */}
              <Grid item xs={6} sm={4} md={2}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      color: 'text.secondary',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ToggleButton value="3d">
                    <ViewInAr sx={{ mr: 1 }} />
                    3D
                  </ToggleButton>
                  <ToggleButton value="flat">
                    <Map sx={{ mr: 1 }} />
                    Flat
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* Action Buttons and Country Count */}
              <Grid item xs={6} sm={8} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary', mr: 2 }}>
                    {enhancedPolygons.filter(p => p.countryData).length} countries
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Reset View">
                      <IconButton 
                        onClick={resetView}
                        sx={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
                        }}
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    {selectedCountryFilter && (
                      <>
                        <Tooltip title={`Zoom to ${selectedCountryFilter.Country}`}>
                          <IconButton 
                            onClick={() => zoomToCountry(selectedCountryFilter)}
                            sx={{ 
                              background: 'rgba(33, 150, 243, 0.2)',
                              color: '#2196F3',
                              '&:hover': { background: 'rgba(33, 150, 243, 0.3)' },
                            }}
                          >
                            <ZoomIn />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear Country Filter">
                          <IconButton 
                            onClick={() => {
                              setSelectedCountryFilter(null);
                              resetView();
                            }}
                            sx={{ 
                              background: 'rgba(244, 67, 54, 0.2)',
                              color: '#f44336',
                              '&:hover': { background: 'rgba(244, 67, 54, 0.3)' },
                            }}
                          >
                            <Clear />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Globe Container */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Grow in={true} timeout={1000}>
            <Card 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ 
                height: '500px', 
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <Globe
                  ref={globeRef}
                  width={undefined}
                  height={500}
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                  
                  // Polygon layer for filled countries (like Chart.js Geo)
                  polygonsData={enhancedPolygons}
                  polygonGeoJsonGeometry="geometry"
                  polygonCapColor={(d: any) => d.fillColor}
                  polygonSideColor={(d: any) => d.strokeColor}
                  polygonStrokeColor={(d: any) => d.strokeColor}
                  polygonAltitude={(d: any) => d.altitude}
                  polygonCapCurvatureResolution={4}
                  polygonLabel={(d: any) => {
                    const country = d.countryData;
                    if (!country) return `<div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white;">${d.properties.name}<br/>No cybersecurity data available</div>`;
                    
                    return `
                      <div style="background: rgba(0,0,0,0.9); padding: 12px; border-radius: 8px; color: white; font-family: Arial; max-width: 250px;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: ${d.fillColor};">${country.Country}</div>
                        <div style="margin-bottom: 4px;">🌍 Region: ${country.Region}</div>
                        <div style="margin-bottom: 4px;">⚠️ Risk: ${country.Risk_Category}</div>
                        <div style="margin-bottom: 4px;">📊 Risk Score: ${country.Risk_Score?.toFixed(2)}</div>
                        <div style="margin-bottom: 4px;">🔒 CEI: ${country.CEI?.toFixed(2)}</div>
                        <div style="margin-bottom: 4px;">🛡️ GCI: ${country.GCI?.toFixed(2)}</div>
                        <div style="margin-bottom: 4px;">🌐 NCSI: ${country.NCSI?.toFixed(2)}</div>
                        <div>⚡ DDL: ${country.DDL?.toFixed(2)}</div>
                      </div>
                    `;
                  }}
                  onPolygonClick={handleCountryClick}
                  enablePointerInteraction={true}
                  showAtmosphere={true}
                  atmosphereColor="rgba(102, 126, 234, 0.3)"
                  atmosphereAltitude={0.25}
                />
              </Box>
            </Card>
          </Grow>
        </Grid>

        {/* Country Details Panel */}
        <Grid item xs={12} lg={4}>
          <Grow in={true} timeout={1200}>
            <Card 
              sx={{ 
                height: '500px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                overflow: 'auto',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {selectedCountry ? (
                  <Box>
                    {/* Selected Country Details */}
                    <Box display="flex" alignItems="center" mb={3}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          mr: 2,
                          background: `linear-gradient(135deg, ${getRegionColor(selectedCountry.Region)}, ${getRegionColor(selectedCountry.Region)}80)`,
                        }}
                      >
                        <Public />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {selectedCountry.Country}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {selectedCountry.Region}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip 
                      label={selectedCountry.Risk_Category}
                      sx={{
                        mb: 3,
                        background: `${getRiskColor(selectedCountry.Risk_Category)}20`,
                        color: getRiskColor(selectedCountry.Risk_Category),
                        border: `1px solid ${getRiskColor(selectedCountry.Risk_Category)}60`,
                        fontWeight: 'bold',
                      }}
                    />

                    {/* Metrics */}
                    <Grid container spacing={2}>
                      {[
                        { label: 'Risk Score', value: selectedCountry.Risk_Score, icon: '🎯', max: 100 },
                        { label: 'CEI', value: selectedCountry.CEI, icon: '🔒', max: 100 },
                        { label: 'GCI', value: selectedCountry.GCI, icon: '🛡️', max: 100 },
                        { label: 'NCSI', value: selectedCountry.NCSI, icon: '🌐', max: 100 },
                        { label: 'DDL', value: selectedCountry.DDL, icon: '⚡', max: 10 },
                      ].map((metric) => (
                        <Grid item xs={12} key={metric.label}>
                          <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {metric.icon} {metric.label}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {metric.value?.toFixed(2) || 'N/A'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                / {metric.max}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(metric.value / metric.max) * 100}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(90deg, ${getRegionColor(selectedCountry.Region)}, ${getRegionColor(selectedCountry.Region)}80)`,
                                  borderRadius: 3,
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box textAlign="center" sx={{ mt: 8 }}>
                    <Satellite sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      Select a Country
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Click on any country on the globe to view detailed cybersecurity metrics and analysis.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Legend */}
      <Fade in={true} timeout={1500}>
        <Box sx={{ mt: 3, p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            🗺️ Choropleth Legend: Countries filled by risk level • Height = Risk Score • 
            Use mouse to rotate, zoom, and explore • Click countries for details
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label="🔴 High Risk" size="small" sx={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c' }} />
            <Chip label="🟡 Medium Risk" size="small" sx={{ background: 'rgba(243, 156, 18, 0.2)', color: '#f39c12' }} />
            <Chip label="🟢 Low Risk" size="small" sx={{ background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60' }} />
            <Chip label="⚫ No Data" size="small" sx={{ background: 'rgba(44, 62, 80, 0.2)', color: '#2c3e50' }} />
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default GeoChart; 