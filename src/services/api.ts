/**
 * API Service for Cybersecurity Dashboard
 * =====================================
 * 
 * This service handles all communication with the Flask backend API,
 * including the unified ensemble model predictions and data retrieval.
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface Country {
  Country: string;
  Region: string;
  CEI: number;
  GCI: number;
  NCSI: number;
  DDL: number;
  Risk_Category: string;
  Risk_Score: number;
}

export interface PredictionRequest {
  CEI: number;
  GCI: number;
  NCSI: number;
  DDL: number;
}

export interface PredictionResponse {
  primary_prediction: {
    risk_category: string;
    confidence: number;
    risk_score: number;
    model_type: string;
    timestamp: string;
  };
  additional_insights: {
    cluster: number;
    individual_rf_prediction: string;
    individual_rf_probabilities: Record<string, number>;
    predicted_gci: number;
    actual_gci: number;
  };
  model_info: {
    ensemble_components: number;
    voting_strategy: string;
    unified_deployment: boolean;
    individual_votes: Record<string, string>;
  };
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  percentage: number;
  description: string;
}

export interface SimilarCountry {
  country: string;
  region: string;
  similarity: number;
  distance: number;
  risk_category: string;
  risk_score: number;
  metrics: {
    CEI: number;
    GCI: number;
    NCSI: number;
    DDL: number;
  };
}

export interface Recommendation {
  metric: string;
  current_value: number;
  priority: string;
  recommendation: string;
  impact: string;
  target_value: number;
  improvement_percentage: number;
}

// API Service Class
export class ApiService {
  /**
   * Get API status and available endpoints
   */
  static async getApiStatus() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching API status:', error);
      throw error;
    }
  }

  /**
   * Get all countries data with optional filtering
   */
  static async getCountries(region?: string, riskCategory?: string): Promise<Country[]> {
    try {
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      if (riskCategory) params.append('risk_category', riskCategory);
      
      const response = await apiClient.get(`/api/countries?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching countries data:', error);
      throw error;
    }
  }

  /**
   * Get correlation matrix for heatmap visualization
   */
  static async getCorrelationData() {
    try {
      const response = await apiClient.get('/api/correlation');
      return response.data;
    } catch (error) {
      console.error('Error fetching correlation data:', error);
      throw error;
    }
  }

  /**
   * Get regional analysis and statistics
   */
  static async getRegionalAnalysis() {
    try {
      const response = await apiClient.get('/api/regional-analysis');
      return response.data;
    } catch (error) {
      console.error('Error fetching regional analysis:', error);
      throw error;
    }
  }

  /**
   * Predict risk using the unified ensemble model
   */
  static async predictRisk(data: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await apiClient.post('/api/predict', data);
      return response.data;
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  }

  /**
   * Get feature importance data
   */
  static async getFeatureImportance(): Promise<FeatureImportance[]> {
    try {
      const response = await apiClient.get('/api/feature-importance');
      return response.data.feature_importance;
    } catch (error) {
      console.error('Error fetching feature importance:', error);
      throw error;
    }
  }

  /**
   * Find countries with similar cybersecurity profiles
   */
  static async getSimilarCountries(data: PredictionRequest): Promise<SimilarCountry[]> {
    try {
      const response = await apiClient.post('/api/similar-countries', data);
      return response.data.similar_countries;
    } catch (error) {
      console.error('Error fetching similar countries:', error);
      throw error;
    }
  }

  /**
   * Get improvement recommendations
   */
  static async getRecommendations(data: PredictionRequest): Promise<Recommendation[]> {
    try {
      const response = await apiClient.post('/api/recommendations', data);
      return response.data.recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get model information and performance metrics
   */
  static async getModelInfo() {
    try {
      const response = await apiClient.get('/api/model-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      throw error;
    }
  }
}

// Export default instance
export default ApiService; 