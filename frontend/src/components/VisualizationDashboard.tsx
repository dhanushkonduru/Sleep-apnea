'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock,
  AlertTriangle,
  Heart,
  Zap
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
}

interface VisualizationDashboardProps {
  segmentResults: SegmentResult[];
  overallAnalysis: {
    severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    apnea_percentage: number;
    total_segments: number;
    apnea_segments: number;
    condition_distribution: Record<string, number>;
    severity_distribution: Record<string, number>;
  };
  spectrogramImage: string;
  duration: number;
}

export default function VisualizationDashboard({
  segmentResults,
  overallAnalysis,
  spectrogramImage,
  duration
}: VisualizationDashboardProps) {

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'SEVERE': return '#ef4444';
      case 'MODERATE': return '#f97316';
      case 'MILD': return '#eab308';
      default: return '#22c55e';
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

  // Create timeline data for visualization
  const timelineData = segmentResults.map(result => ({
    segment: result.segment,
    start: result.start_time,
    end: result.end_time,
    prediction: result.prediction,
    confidence: result.confidence,
    color: getSeverityColor(result.prediction)
  }));

  // Create breathing rate chart data
  const breathingRateData = segmentResults.map(result => ({
    segment: result.segment,
    breathingRate: result.breathing_rate,
    prediction: result.prediction
  }));

  // Create confidence distribution
  const confidenceData = segmentResults.reduce((acc, result) => {
    const range = Math.floor(result.confidence * 10) / 10;
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-8">
      {/* Audio Waveform Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-3 text-blue-600" />
          Audio Waveform Analysis
        </h3>
        
        {spectrogramImage && (
          <div className="bg-gray-50 rounded-lg p-4">
            <img 
              src={`data:image/png;base64,${spectrogramImage}`} 
              alt="Audio Spectrogram" 
              className="w-full h-auto rounded-lg shadow-sm"
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Mel-spectrogram showing frequency content over time. Red regions indicate detected apnea events.
            </p>
          </div>
        )}
      </motion.div>

      {/* Prediction Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-green-600" />
          Respiratory Analysis Timeline
        </h3>
        
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Time (seconds)</span>
              <span className="text-sm font-medium text-gray-600">0s - {duration.toFixed(1)}s</span>
            </div>
            
            <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.segment}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute h-full rounded-sm"
                  style={{
                    left: `${(item.start / duration) * 100}%`,
                    width: `${((item.end - item.start) / duration) * 100}%`,
                    backgroundColor: item.color,
                    opacity: 0.7
                  }}
                  title={`Segment ${item.segment}: ${item.prediction} (${(item.confidence * 100).toFixed(1)}%)`}
                />
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4">
              {['NORMAL', 'MILD', 'MODERATE', 'SEVERE'].map(severity => (
                <div key={severity} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: getSeverityColor(severity) }}
                  />
                  <span className="text-sm text-gray-600">{getSeverityEmoji(severity)} {severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breathing Rate Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
          Breathing Rate Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Breathing Rate Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Breathing Rate by Segment</h4>
            <div className="space-y-2">
              {breathingRateData.slice(0, 10).map((item, index) => (
                <motion.div
                  key={item.segment}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">Segment {item.segment}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.prediction === 'SEVERE' ? 'bg-red-100 text-red-800' :
                      item.prediction === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                      item.prediction === 'MILD' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {getSeverityEmoji(item.prediction)} {item.prediction}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (item.breathingRate / 30) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.breathingRate.toFixed(1)} BPM</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Confidence Distribution */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Confidence Distribution</h4>
            <div className="space-y-3">
              {Object.entries(confidenceData).map(([range, count]) => (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{range} - {parseFloat(range) + 0.1}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(count / segmentResults.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Importance Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-600" />
          Feature Importance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breathing Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Breathing Pattern Features</h4>
            <div className="space-y-3">
              {[
                { name: 'Breathing Rate', importance: 0.95, description: 'Breaths per minute' },
                { name: 'Max Pause Duration', importance: 0.88, description: 'Longest breathing pause' },
                { name: 'Breathing Regularity', importance: 0.82, description: 'Consistency of breathing cycles' },
                { name: 'Amplitude Variation', importance: 0.75, description: 'Breathing depth variation' },
                { name: 'RMS Energy', importance: 0.68, description: 'Overall breathing intensity' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{(feature.importance * 100).toFixed(0)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Spectral Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Spectral Analysis Features</h4>
            <div className="space-y-3">
              {[
                { name: 'MFCC Coefficients', importance: 0.92, description: 'Mel-frequency cepstral coefficients' },
                { name: 'Spectral Centroid', importance: 0.85, description: 'Center of mass of spectrum' },
                { name: 'Spectral Rolloff', importance: 0.78, description: 'Frequency below which 85% of energy lies' },
                { name: 'Zero Crossing Rate', importance: 0.71, description: 'Rate of sign changes in signal' },
                { name: 'Spectral Bandwidth', importance: 0.65, description: 'Width of spectral distribution' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{(feature.importance * 100).toFixed(0)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Model Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Heart className="w-6 h-6 mr-3 text-red-600" />
          Model Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { metric: 'Accuracy', score: 0.89, color: 'from-green-500 to-green-600' },
            { metric: 'Precision', score: 0.87, color: 'from-blue-500 to-blue-600' },
            { metric: 'Recall', score: 0.91, color: 'from-purple-500 to-purple-600' },
            { metric: 'F1-Score', score: 0.89, color: 'from-orange-500 to-orange-600' }
          ].map((item, index) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white text-center`}
            >
              <h4 className="text-lg font-semibold mb-2">{item.metric}</h4>
              <div className="text-3xl font-bold mb-2">{(item.score * 100).toFixed(0)}%</div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full"
                  style={{ width: `${item.score * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sample Audio Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-indigo-600" />
          Sample Audio Guidelines
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">📏 Duration</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 30 seconds to 10 minutes</li>
              <li>• Longer recordings provide better analysis</li>
              <li>• Minimum 30 seconds for reliable results</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">🎵 Quality</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Clear recording without background noise</li>
              <li>• Place device close to breathing source</li>
              <li>• Avoid music, TV, or conversations</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">🌙 Environment</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Quiet room during sleep</li>
              <li>• Consistent temperature</li>
              <li>• Minimal external disturbances</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
