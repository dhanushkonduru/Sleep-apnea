'use client';

import React from 'react';
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
  Info
} from 'lucide-react';

interface SegmentResult {
  segment: number;
  start_time: number;
  end_time: number;
  prediction: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
  confidence: number;
  apnea_score: number;
  respiratory_condition: string;
  breathing_rate: number;
  max_pause: number;
  reasons: string[];
  medical_suggestions: string[];
}

interface OverallAnalysis {
  primary_respiratory_condition: string;
  condition_distribution: Record<string, number>;
  severity_distribution: Record<string, number>;
  apnea_percentage: number;
  severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
  total_segments: number;
  apnea_segments: number;
  comprehensive_suggestions: string[];
}

interface EnhancedAnalysisResultsProps {
  segmentResults: SegmentResult[];
  overallAnalysis: OverallAnalysis;
  spectrogramImage: string;
  duration: number;
  totalEvents: number;
  riskScore: number;
}

export default function EnhancedAnalysisResults({
  segmentResults,
  overallAnalysis,
  spectrogramImage,
  duration,
  totalEvents,
  riskScore
}: EnhancedAnalysisResultsProps) {
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'SEVERE': return 'from-red-500 to-red-700';
      case 'MODERATE': return 'from-orange-500 to-orange-700';
      case 'MILD': return 'from-yellow-500 to-yellow-700';
      default: return 'from-green-500 to-green-700';
    }
  };

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case 'SEVERE': return '🔴';
      case 'MODERATE': return '🟠';
      case 'MILD': return '🟡';
      default: return '🟢';
    }
  };

  const getConditionEmoji = (condition: string) => {
    if (condition.includes('Wheezing') || condition.includes('Asthma')) return '🫁';
    if (condition.includes('Apnea')) return '😴';
    if (condition.includes('Distress')) return '🚨';
    return '🙂';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          🩺 Sleep Apnea Analysis Results
        </h2>
        <p className="text-gray-600 text-lg">
          Advanced AI-powered analysis of your breathing patterns
        </p>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <span className="text-2xl font-bold">{overallAnalysis.total_segments}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Segments</h3>
          <p className="text-purple-100 text-sm">Audio segments analyzed</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-2xl font-bold">{overallAnalysis.apnea_segments}</span>
          </div>
          <h3 className="text-lg font-semibold">Apnea Events</h3>
          <p className="text-red-100 text-sm">Detected breathing interruptions</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-2xl font-bold">{overallAnalysis.apnea_percentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-lg font-semibold">Apnea Percentage</h3>
          <p className="text-orange-100 text-sm">Percentage of affected segments</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8" />
            <span className="text-2xl font-bold">{getConditionEmoji(overallAnalysis.primary_respiratory_condition)}</span>
          </div>
          <h3 className="text-lg font-semibold">Primary Condition</h3>
          <p className="text-blue-100 text-sm truncate">{overallAnalysis.primary_respiratory_condition}</p>
        </div>
      </motion.div>

      {/* Severity Assessment Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl p-6 text-white shadow-lg ${
          overallAnalysis.severity === 'Severe' 
            ? 'bg-gradient-to-r from-red-500 to-pink-600' 
            : overallAnalysis.severity === 'Moderate'
            ? 'bg-gradient-to-r from-orange-500 to-red-500'
            : overallAnalysis.severity === 'Mild'
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
            : 'bg-gradient-to-r from-green-500 to-blue-500'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{getSeverityEmoji(overallAnalysis.severity)}</div>
          <div>
            <h3 className="text-2xl font-bold">Assessment: {overallAnalysis.severity}</h3>
            <p className="text-lg opacity-90">
              {overallAnalysis.severity === 'Severe' && 
                "Based on the analysis, your breathing patterns indicate a severe risk of sleep apnea. It is highly recommended to consult a medical professional for further evaluation and treatment."}
              {overallAnalysis.severity === 'Moderate' && 
                "Your breathing patterns show moderate signs of sleep apnea. Consider scheduling a consultation with a healthcare provider for proper evaluation."}
              {overallAnalysis.severity === 'Mild' && 
                "Mild irregularities detected in your breathing patterns. Monitor your symptoms and consider discussing with a healthcare provider if concerns persist."}
              {overallAnalysis.severity === 'Normal' && 
                "Your breathing patterns appear normal with minimal apnea events detected. Continue monitoring your sleep health."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Medical Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Stethoscope className="w-6 h-6 mr-3 text-blue-600" />
          Medical Recommendations
        </h3>
        
        <div className="space-y-4">
          {overallAnalysis.comprehensive_suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                suggestion.includes('URGENT') || suggestion.includes('CRITICAL')
                  ? 'bg-red-50 border-red-400 text-red-800'
                  : suggestion.includes('DISCLAIMER')
                  ? 'bg-gray-50 border-gray-400 text-gray-700'
                  : 'bg-blue-50 border-blue-400 text-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                {suggestion.includes('URGENT') || suggestion.includes('CRITICAL') ? (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                ) : suggestion.includes('DISCLAIMER') ? (
                  <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{suggestion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Condition Distribution Chart */}
      {Object.keys(overallAnalysis.condition_distribution).length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🫁 Respiratory Condition Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Condition Distribution</h4>
              <div className="space-y-3">
                {Object.entries(overallAnalysis.condition_distribution).map(([condition, count]) => (
                  <div key={condition} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{condition}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(count / overallAnalysis.total_segments) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Severity Distribution</h4>
              <div className="space-y-3">
                {Object.entries(overallAnalysis.severity_distribution).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{severity}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getSeverityColor(severity)}`}
                          style={{ width: `${(count / overallAnalysis.total_segments) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Segment Analysis Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Detailed Segment Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Segment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Time Range</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Prediction</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Condition</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Breathing Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Max Pause</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Reasons</th>
              </tr>
            </thead>
            <tbody>
              {segmentResults.slice(0, 10).map((result, index) => (
                <motion.tr
                  key={result.segment}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    result.prediction === 'SEVERE' ? 'bg-red-50' :
                    result.prediction === 'MODERATE' ? 'bg-orange-50' :
                    result.prediction === 'MILD' ? 'bg-yellow-50' : 'bg-green-50'
                  }`}
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{result.segment}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {result.start_time.toFixed(1)}s - {result.end_time.toFixed(1)}s
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.prediction === 'SEVERE' ? 'bg-red-100 text-red-800' :
                      result.prediction === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                      result.prediction === 'MILD' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {getSeverityEmoji(result.prediction)} {result.prediction}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{(result.confidence * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs">{result.respiratory_condition}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{result.breathing_rate.toFixed(1)} BPM</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{result.max_pause.toFixed(1)}s</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="max-w-xs">
                      {result.reasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="truncate" title={reason}>
                          {reason}
                        </div>
                      ))}
                      {result.reasons.length > 2 && (
                        <div className="text-gray-400">+{result.reasons.length - 2} more</div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {segmentResults.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing first 10 segments of {segmentResults.length} total segments
            </p>
          </div>
        )}
      </motion.div>

      {/* Expandable Detailed Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">🔍 Detailed Segment Insights</h3>
        
        <div className="space-y-4">
          {segmentResults.slice(0, 5).map((result, index) => (
            <motion.div
              key={result.segment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Segment {result.segment} - {result.prediction} ({result.respiratory_condition})
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.prediction === 'SEVERE' ? 'bg-red-100 text-red-800' :
                  result.prediction === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                  result.prediction === 'MILD' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {getSeverityEmoji(result.prediction)} {result.prediction}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Analysis Results</h5>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Confidence:</span> {(result.confidence * 100).toFixed(1)}%</div>
                    <div><span className="font-medium">Apnea Score:</span> {result.apnea_score.toFixed(3)}</div>
                    <div><span className="font-medium">Breathing Rate:</span> {result.breathing_rate.toFixed(1)} BPM</div>
                    <div><span className="font-medium">Max Pause:</span> {result.max_pause.toFixed(1)}s</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Detection Reasons</h5>
                  <div className="space-y-1">
                    {result.reasons.map((reason, idx) => (
                      <div key={idx} className="text-sm text-gray-600">• {reason}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              {result.medical_suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-2">Medical Suggestions</h5>
                  <div className="space-y-1">
                    {result.medical_suggestions.slice(0, 3).map((suggestion, idx) => (
                      <div key={idx} className="text-sm text-blue-600">• {suggestion}</div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}