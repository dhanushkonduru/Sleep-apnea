'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Upload, 
  Mic, 
  MicOff,
  Activity,
  AlertTriangle,
  Heart,
  Brain,
  Shield,
  Zap,
  Clock,
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  BrainCircuit
} from 'lucide-react';
import RealTimeBreathingMonitor from '../components/RealTimeBreathingMonitor';
import EnhancedAnalysisResults from '../components/EnhancedAnalysisResults';
import HealthRecommendations from '../components/HealthRecommendations';
import VisualizationDashboard from '../components/VisualizationDashboard';

// Mock data for demonstration
const mockSegmentResults = [
  {
    segment: 1,
    start_time: 0,
    end_time: 30,
    prediction: "NORMAL",
    confidence: 0.85,
    apnea_score: 0.15,
    respiratory_condition: "Normal Breathing",
    breathing_rate: 16.2,
    max_pause: 1.2,
    reasons: ["✅ Normal breathing patterns detected", "🫁 Regular rate: 16.2 BPM", "🌱 Healthy airflow"],
    medical_suggestions: ["✅ No significant concerns detected", "🌙 Continue healthy sleep habits", "📊 Regular monitoring recommended", "⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider"],
    breathing_type: "NORMAL",
    apnea_pause_count: 0,
    snoring_ratio: 0.12
  },
  {
    segment: 2,
    start_time: 30,
    end_time: 60,
    prediction: "SNORING",
    confidence: 0.78,
    apnea_score: 0.45,
    respiratory_condition: "Snoring/Airway Obstruction",
    breathing_rate: 18.5,
    max_pause: 2.8,
    reasons: ["😴 SNORING detected - ratio: 0.342", "🌬️ Airway obstruction indicated", "📈 Irregular breathing patterns"],
    medical_suggestions: ["⚠️ MODERATE: Snoring indicates airway obstruction", "🏥 Schedule consultation with healthcare provider", "🛏️ Try sleeping on your side", "⚖️ Consider weight management if overweight", "🚫 Avoid alcohol before bedtime", "⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider"],
    breathing_type: "SNORING",
    apnea_pause_count: 0,
    snoring_ratio: 0.342
  },
  {
    segment: 3,
    start_time: 60,
    end_time: 90,
    prediction: "SEVERE",
    confidence: 0.92,
    apnea_score: 0.87,
    respiratory_condition: "Severe Apnea Events",
    breathing_rate: 12.1,
    max_pause: 15.3,
    reasons: ["🚨 APNEA detected - 2 pauses ≥10 seconds", "🚫 Critical breathing interruptions", "⏱️ Longest pause: 15.3s"],
    medical_suggestions: ["🚨 SEVERE: Multiple apnea events detected", "🏥 URGENT: Seek immediate medical attention", "📞 Consider emergency services if severe breathing difficulty", "🛏️ Sleep in semi-upright position", "📱 Keep sleep diary for medical consultation", "⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider"],
    breathing_type: "APNEA",
    apnea_pause_count: 2,
    snoring_ratio: 0.28
  },
  {
    segment: 4,
    start_time: 90,
    end_time: 120,
    prediction: "NORMAL",
    confidence: 0.88,
    apnea_score: 0.22,
    respiratory_condition: "Normal Breathing",
    breathing_rate: 15.8,
    max_pause: 1.5,
    reasons: ["✅ Normal breathing patterns detected", "🫁 Regular rate: 15.8 BPM", "🌱 Healthy airflow"],
    medical_suggestions: ["✅ No significant concerns detected", "🌙 Continue healthy sleep habits", "📊 Regular monitoring recommended", "⚠️ DISCLAIMER: Not a medical diagnosis - consult healthcare provider"],
    breathing_type: "NORMAL",
    apnea_pause_count: 0,
    snoring_ratio: 0.15
  }
];

const mockOverallAnalysis = {
  primary_respiratory_condition: "Mixed Sleep Apnea",
  condition_distribution: {
    "Normal Breathing": 2,
    "Snoring/Airway Obstruction": 1,
    "Severe Apnea Events": 1
  },
  severity_distribution: {
    "NORMAL": 2,
    "MODERATE": 1,
    "SEVERE": 1
  },
  apnea_percentage: 25.0,
  severity: "Moderate",
  total_segments: 4,
  apnea_segments: 1,
  comprehensive_suggestions: [
    "🏥 Schedule consultation with sleep specialist",
    "📊 Consider overnight sleep study (polysomnography)",
    "🛏️ Sleep position therapy (side sleeping)",
    "⚖️ Weight management if overweight",
    "🚫 Avoid alcohol and sedatives before bedtime",
    "💨 Consider CPAP therapy if recommended by doctor",
    "📱 Keep detailed sleep diary for medical consultation"
  ]
};

export default function SleepApneaDemo() {
  const [activeTab, setActiveTab] = useState<'realtime' | 'analysis' | 'visualization'>('realtime');
  const [isDemoMode, setIsDemoMode] = useState(true);

  const tabs = [
    { id: 'realtime', label: 'Real-Time Monitor', icon: Activity },
    { id: 'analysis', label: 'Analysis Results', icon: BarChart3 },
    { id: 'visualization', label: 'Visualizations', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BrainCircuit className="w-8 h-8 mr-3 text-blue-600" />
                Sleep Apnea Detection System
              </h1>
              <p className="text-gray-600 mt-2">
                AI-powered real-time breathing pattern analysis for sleep apnea detection
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isDemoMode ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {isDemoMode ? 'Demo Mode' : 'Live Mode'}
                </span>
              </div>
              
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isDemoMode ? 'Switch to Live' : 'Switch to Demo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'realtime' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RealTimeBreathingMonitor />
          </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <EnhancedAnalysisResults
              segmentResults={mockSegmentResults}
              overallAnalysis={mockOverallAnalysis}
              spectrogramImage="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNwZWN0cm9ncmFtIFZpc3VhbGl6YXRpb248L3RleHQ+PC9zdmc+"
              duration={120}
              totalEvents={3}
              riskScore={0.45}
            />
            
            <HealthRecommendations
              severity={mockOverallAnalysis.severity}
              primaryCondition={mockOverallAnalysis.primary_respiratory_condition}
              apneaPercentage={mockOverallAnalysis.apnea_percentage}
              comprehensiveSuggestions={mockOverallAnalysis.comprehensive_suggestions}
            />
          </motion.div>
        )}

        {activeTab === 'visualization' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VisualizationDashboard
              segmentResults={mockSegmentResults}
              overallAnalysis={mockOverallAnalysis}
              spectrogramImage="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNwZWN0cm9ncmFtIFZpc3VhbGl6YXRpb248L3RleHQ+PC9zdmc+"
              duration={120}
            />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">System Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Real-time breathing pattern analysis</li>
                <li>• Apnea event detection (≥10 seconds)</li>
                <li>• Snoring identification</li>
                <li>• Severity scoring</li>
                <li>• Health recommendations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Specs</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Python FastAPI backend</li>
                <li>• Next.js React frontend</li>
                <li>• Real-time audio processing</li>
                <li>• Machine learning models</li>
                <li>• Supabase integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Medical Disclaimer</h3>
              <p className="text-gray-300 text-sm">
                This system is for educational and monitoring purposes only. 
                It is not a medical device and should not replace professional 
                medical diagnosis or treatment. Always consult with healthcare 
                providers for medical concerns.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sleep Apnea Detection System. Educational project for hackathon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
