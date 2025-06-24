/**
 * Feature Importance Component
 * ===========================
 * 
 * Displays feature importance from the classification model
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, LinearProgress } from '@mui/material';
import ApiService, { FeatureImportance as FeatureImportanceType } from '../services/api';

const FeatureImportance: React.FC = () => {
  const [data, setData] = useState<FeatureImportanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeatureImportance();
  }, []);

  const loadFeatureImportance = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.getFeatureImportance();
      setData(result);
    } catch (error) {
      console.error('Error loading feature importance:', error);
      setError('Failed to load feature importance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 2 }}>
      {data.map((item, index) => (
        <Box key={item.feature} sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {item.feature}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {item.percentage.toFixed(1)}%
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={item.percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: `hsl(${120 - (index * 30)}, 70%, 50%)`,
              },
            }}
          />
          
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {item.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default FeatureImportance; 