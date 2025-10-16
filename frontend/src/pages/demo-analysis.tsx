'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Heart, 
  TrendingUp, 
  Clock, 
  Shield,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Info,
  Upload,
  Play,
  Download,
  Share2
} from 'lucide-react';
import EnhancedAnalysisResults from '../components/EnhancedAnalysisResults';
import HealthRecommendations from '../components/HealthRecommendations';
import VisualizationDashboard from '../components/VisualizationDashboard';

// Mock data that matches the enhanced backend response
const mockAnalysisData = {
  segment_results: [
    {
      segment: 1,
      start_time: 0,
      end_time: 5,
      prediction: 'SEVERE',
      confidence: 0.95,
      apnea_score: 0.89,
      respiratory_condition: 'Severe Respiratory Distress',
      breathing_rate: 8.5,
      max_pause: 4.2,
      reasons: ['🚨 SEVERE respiratory distress detected', '🚫 Critical breathing interruption'],
      medical_suggestions: [
        '🚨 SEVERE respiratory concerns detected',
        '🏥 URGENT: Seek immediate medical attention',
        '📞 Consider emergency services if severe breathing difficulty',
        '⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider'
      ]
    },
    {
      segment: 2,
      start_time: 5,
      end_time: 10,
      prediction: 'MODERATE',
      confidence: 0.87,
      apnea_score: 0.67,
      respiratory_condition: 'Moderate Respiratory Issues',
      breathing_rate: 12.3,
      max_pause: 2.8,
      reasons: ['⚠️ MODERATE respiratory concerns', '📈 Irregular breathing patterns'],
      medical_suggestions: [
        '⚠️ MODERATE respiratory concerns detected',
        '🏥 Schedule consultation with healthcare provider',
        '📊 Monitor symptoms closely',
        '⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider'
      ]
    },
    {
      segment: 3,
      start_time: 10,
      end_time: 15,
      prediction: 'MILD',
      confidence: 0.78,
      apnea_score: 0.45,
      respiratory_condition: 'Mild Respiratory Concern',
      breathing_rate: 15.7,
      max_pause: 1.5,
      reasons: ['📉 MILD irregularities detected', '🌱 Minor breathing variations'],
      medical_suggestions: [
        '📉 MILD irregularities detected',
        '🏥 Consider consultation if symptoms persist',
        '🌱 Practice good sleep hygiene',
        '⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider'
      ]
    },
    {
      segment: 4,
      start_time: 15,
      end_time: 20,
      prediction: 'NORMAL',
      confidence: 0.92,
      apnea_score: 0.15,
      respiratory_condition: 'Normal',
      breathing_rate: 18.2,
      max_pause: 0.8,
      reasons: ['✅ Normal breathing patterns detected'],
      medical_suggestions: [
        '✅ No significant concerns detected',
        '⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider'
      ]
    }
  ],
  overall_analysis: {
    primary_respiratory_condition: 'Severe Respiratory Distress',
    condition_distribution: {
      'Severe Respiratory Distress': 1,
      'Moderate Respiratory Issues': 1,
      'Mild Respiratory Concern': 1,
      'Normal': 1
    },
    severity_distribution: {
      'SEVERE': 1,
      'MODERATE': 1,
      'MILD': 1,
      'NORMAL': 1
    },
    apnea_percentage: 75.0,
    severity: 'Severe',
    total_segments: 4,
    apnea_segments: 3,
    comprehensive_suggestions: [
      '🚨 SEVERE respiratory concerns detected',
      '🏥 URGENT: Seek immediate medical attention',
      '📞 Consider emergency services if severe breathing difficulty',
      '⚠️ MODERATE respiratory concerns detected',
      '🏥 Schedule consultation with healthcare provider',
      '📊 Monitor symptoms closely',
      '📉 MILD irregularities detected',
      '🏥 Consider consultation if symptoms persist',
      '🌱 Practice good sleep hygiene',
      '✅ No significant concerns detected',
      '⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider'
    ]
  },
  spectrogram_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
  duration: 20,
  total_events: 3,
  risk_score: 0.75
};

export default function DemoAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'visualization'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🩺 Sleep Apnea Detector</h1>
            <p className="text-xl opacity-90">
              Advanced AI-powered analysis of breathing patterns during sleep
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Demo Analysis</h3>
              <p className="text-yellow-700">
                This is a demonstration of the enhanced sleep apnea analysis interface. 
                The data shown is simulated for demonstration purposes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Analysis Overview', icon: Activity },
                { id: 'health', label: 'Health Recommendations', icon: Heart },
                { id: 'visualization', label: 'Data Visualization', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EnhancedAnalysisResults
                  segmentResults={mockAnalysisData.segment_results}
                  overallAnalysis={mockAnalysisData.overall_analysis}
                  spectrogramImage={mockAnalysisData.spectrogram_image}
                  duration={mockAnalysisData.duration}
                  totalEvents={mockAnalysisData.total_events}
                  riskScore={mockAnalysisData.risk_score}
                />
              </motion.div>
            )}

            {/* Health Recommendations Tab */}
            {activeTab === 'health' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <HealthRecommendations
                  severity={mockAnalysisData.overall_analysis.severity}
                  primaryCondition={mockAnalysisData.overall_analysis.primary_respiratory_condition}
                  apneaPercentage={mockAnalysisData.overall_analysis.apnea_percentage}
                  comprehensiveSuggestions={mockAnalysisData.overall_analysis.comprehensive_suggestions}
                />
              </motion.div>
            )}

            {/* Visualization Tab */}
            {activeTab === 'visualization' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <VisualizationDashboard
                  segmentResults={mockAnalysisData.segment_results}
                  overallAnalysis={mockAnalysisData.overall_analysis}
                  spectrogramImage={mockAnalysisData.spectrogram_image}
                  duration={mockAnalysisData.duration}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-5 h-5" />
            <span>Upload Your Audio</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Play className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share Results</span>
          </button>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical-Grade Analysis</h3>
            <p className="text-gray-600">
              Advanced AI algorithms analyze breathing patterns with medical-grade accuracy
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Recommendations</h3>
            <p className="text-gray-600">
              Personalized health suggestions based on your analysis results
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Visualizations</h3>
            <p className="text-gray-600">
              Comprehensive charts and graphs to understand your sleep patterns
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
