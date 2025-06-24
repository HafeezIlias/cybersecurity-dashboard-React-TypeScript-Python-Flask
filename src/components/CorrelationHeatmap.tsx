/**
 * Correlation Heatmap Component
 * ============================
 * 
 * Displays correlation matrix between cybersecurity metrics
 * using data from the Flask API.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ApiService from '../services/api';

interface CorrelationData {
  correlation_matrix: Record<string, Record<string, number>>;
  metrics: string[];
  description: Record<string, string>;
}

const CorrelationHeatmap: React.FC = () => {
  const [data, setData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCorrelationData();
  }, []);

  const loadCorrelationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.getCorrelationData();
      setData(result);
    } catch (error) {
      console.error('Error loading correlation data:', error);
      setError('Failed to load correlation data');
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (value: number): string => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(76, 175, 80, ${intensity})`; // Green for positive
    } else {
      return `rgba(244, 67, 54, ${intensity})`; // Red for negative
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error">
        {error || 'No data available'}
      </Alert>
    );
  }

  const { correlation_matrix, metrics, description } = data;

  return (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 400, p: 2 }}>
          {/* Header */}
          <Box display="flex" mb={1}>
            <Box sx={{ width: 100 }} /> {/* Empty corner */}
            {metrics.map(metric => (
              <Box
                key={metric}
                sx={{
                  width: 80,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                }}
              >
                {metric}
              </Box>
            ))}
          </Box>

          {/* Correlation Matrix */}
          {metrics.map(rowMetric => (
            <Box key={rowMetric} display="flex" mb={1}>
              {/* Row Label */}
              <Box
                sx={{
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  pr: 1,
                }}
              >
                {rowMetric}
              </Box>

              {/* Correlation Values */}
              {metrics.map(colMetric => {
                const value = correlation_matrix[rowMetric]?.[colMetric] || 0;
                return (
                  <Box
                    key={colMetric}
                    sx={{
                      width: 80,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: getCorrelationColor(value),
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: 1,
                      mx: 0.5,
                      color: Math.abs(value) > 0.5 ? 'white' : 'black',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                    title={`${rowMetric} vs ${colMetric}: ${value.toFixed(3)}`}
                  >
                    {value.toFixed(2)}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          📊 Correlation Strength:
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(76, 175, 80, 0.8)', borderRadius: 1 }} />
            <Typography variant="caption">Positive (+1.0)</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(244, 67, 54, 0.8)', borderRadius: 1 }} />
            <Typography variant="caption">Negative (-1.0)</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(158, 158, 158, 0.3)', borderRadius: 1 }} />
            <Typography variant="caption">No correlation (0.0)</Typography>
          </Box>
        </Box>
      </Box>

      {/* Metrics Description */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          📝 Metrics Description:
        </Typography>
        {Object.entries(description).map(([metric, desc]) => (
          <Typography key={metric} variant="caption" display="block" sx={{ mb: 0.5 }}>
            <strong>{metric}:</strong> {desc}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default CorrelationHeatmap; 