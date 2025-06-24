/**
 * Prediction Panel Component
 * =========================
 * 
 * This component provides an interface for making predictions using the
 * unified ensemble model, with interactive input controls and result display.
 */

import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Slider,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Info,
  Psychology,
  TrendingUp,
  ExpandMore,
  Security,
} from '@mui/icons-material';

import ApiService, { PredictionRequest, PredictionResponse } from '../services/api';

interface MetricInfo {
  name: string;
  description: string;
  range: [number, number];
  color: string;
  isReverse: boolean; // true if lower values are better
}

const METRICS_INFO: Record<string, MetricInfo> = {
  CEI: {
    name: 'Cybersecurity Exposure Index',
    description: 'Measures exposure to cyber threats (lower is better)',
    range: [0, 1],
    color: '#ff6b6b',
    isReverse: true,
  },
  GCI: {
    name: 'Global Cybersecurity Index',
    description: 'Overall cybersecurity capabilities (higher is better)',
    range: [0, 100],
    color: '#4ecdc4',
    isReverse: false,
  },
  NCSI: {
    name: 'National Cyber Security Index',
    description: 'National cybersecurity readiness (higher is better)',
    range: [0, 100],
    color: '#45b7d1',
    isReverse: false,
  },
  DDL: {
    name: 'Digital Development Level',
    description: 'Digital infrastructure development (higher is better)',
    range: [0, 100],
    color: '#f9ca24',
    isReverse: false,
  },
};

const PredictionPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<PredictionRequest>({
    CEI: 0.5,
    GCI: 50,
    NCSI: 50,
    DDL: 50,
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMetricChange = (metric: keyof PredictionRequest) => (
    event: Event,
    newValue: number | number[]
  ) => {
    setMetrics(prev => ({
      ...prev,
      [metric]: newValue as number,
    }));
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ApiService.predictRisk(metrics);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to make prediction. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (metric: string, value: number): string => {
    const info = METRICS_INFO[metric];
    if (info.isReverse) {
      return value < 0.3 ? 'Low Risk' : value < 0.6 ? 'Medium Risk' : 'High Risk';
    } else {
      return value > 70 ? 'Low Risk' : value > 40 ? 'Medium Risk' : 'High Risk';
    }
  };

  const getRiskColor = (riskCategory: string): string => {
    switch (riskCategory) {
      case 'Low Risk': return '#4caf50';
      case 'Medium Risk': return '#ff9800';
      case 'High Risk': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatConfidence = (confidence: number): string => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  return (
    <Grid container spacing={3}>
      {/* Input Controls */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            📊 Input Metrics
          </Typography>
          
          {Object.entries(METRICS_INFO).map(([key, info]) => (
            <Box key={key} sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  {info.name}
                </Typography>
                <Tooltip title={info.description}>
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Slider
                value={metrics[key as keyof PredictionRequest]}
                onChange={handleMetricChange(key as keyof PredictionRequest)}
                min={info.range[0]}
                max={info.range[1]}
                step={key === 'CEI' ? 0.01 : 1}
                marks={[
                  { value: info.range[0], label: info.range[0].toString() },
                  { value: info.range[1], label: info.range[1].toString() },
                ]}
                valueLabelDisplay="on"
                sx={{ color: info.color }}
              />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  Current: {metrics[key as keyof PredictionRequest]}
                </Typography>
                <Chip
                  label={getRiskLevel(key, metrics[key as keyof PredictionRequest])}
                  size="small"
                  sx={{
                    bgcolor: getRiskColor(getRiskLevel(key, metrics[key as keyof PredictionRequest])),
                    color: 'white',
                  }}
                />
              </Box>
            </Box>
          ))}
          
          <Button
            variant="contained"
            fullWidth
            onClick={handlePredict}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? 'Predicting...' : '🚀 Predict with Ensemble Model'}
          </Button>
        </Paper>
      </Grid>

      {/* Results Display */}
      <Grid item xs={12} md={6}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {prediction && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Prediction Results
            </Typography>

            {/* Primary Prediction */}
            <Card sx={{ mb: 2, bgcolor: getRiskColor(prediction.primary_prediction.risk_category), color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {prediction.primary_prediction.risk_category}
                    </Typography>
                    <Typography variant="body1">
                      Confidence: {formatConfidence(prediction.primary_prediction.confidence)}
                    </Typography>
                    <Typography variant="body2">
                      Risk Score: {(prediction.primary_prediction.risk_score * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Security sx={{ fontSize: 60, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>

            {/* Model Information */}
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<TrendingUp />}
                label={`${prediction.model_info.ensemble_components} Algorithms Combined`}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`${prediction.model_info.voting_strategy} Voting`}
                color="secondary"
              />
            </Box>

            {/* Detailed Results Accordion */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">📈 Detailed Analysis</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Individual Model Votes:
                    </Typography>
                    {Object.entries(prediction.model_info.individual_votes).map(([model, vote]) => (
                      <Chip
                        key={model}
                        label={`${model}: ${vote}`}
                        size="small"
                        sx={{ m: 0.5 }}
                        color={vote === prediction.primary_prediction.risk_category ? 'success' : 'default'}
                      />
                    ))}
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Cluster:</Typography>
                    <Typography variant="body1">{prediction.additional_insights.cluster}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Predicted GCI:</Typography>
                    <Typography variant="body1">
                      {prediction.additional_insights.predicted_gci.toFixed(1)}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Timestamp */}
            <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
              Prediction made: {new Date(prediction.primary_prediction.timestamp).toLocaleString()}
            </Typography>
          </Paper>
        )}

        {!prediction && !loading && (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Psychology sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Ready for Prediction
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Adjust the metrics and click predict to see results from the unified ensemble model
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default PredictionPanel; 