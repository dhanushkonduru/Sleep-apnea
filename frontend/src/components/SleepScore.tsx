'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  Brain,
  Shield
} from 'lucide-react';
import { ApneaEvent } from '../lib/api';

interface SleepScoreProps {
  events: ApneaEvent[];
  duration: number;
  riskScore: number;
  className?: string;
}

export default function SleepScore({ events, duration, riskScore, className = '' }: SleepScoreProps) {
  // Calculate sleep score based on multiple factors
  const calculateSleepScore = () => {
    let score = 100; // Start with perfect score
    
    // Factor 1: Number of events (penalty for more events)
    const eventCount = events.length;
    const eventPenalty = Math.min(eventCount * 5, 40); // Max 40 points penalty
    score -= eventPenalty;
    
    // Factor 2: Time spent in apnea (penalty for longer apnea time)
    const totalApneaTime = events.reduce((sum, event) => sum + (event.end - event.start), 0);
    const apneaPercentage = (totalApneaTime / duration) * 100;
    const apneaPenalty = Math.min(apneaPercentage * 0.5, 30); // Max 30 points penalty
    score -= apneaPenalty;
    
    // Factor 3: Average confidence score (penalty for higher confidence)
    const avgConfidence = events.length > 0 
      ? events.reduce((sum, event) => sum + event.confidence, 0) / events.length 
      : 0;
    const confidencePenalty = avgConfidence * 20; // Up to 20 points penalty
    score -= confidencePenalty;
    
    // Factor 4: Event frequency (penalty for frequent events)
    const eventFrequency = eventCount / (duration / 60); // events per minute
    const frequencyPenalty = Math.min(eventFrequency * 10, 20); // Max 20 points penalty
    score -= frequencyPenalty;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const sleepScore = calculateSleepScore();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: '#10B981', bgColor: '#D1FAE5', label: 'Excellent' };
    if (score >= 60) return { color: '#F59E0B', bgColor: '#FEF3C7', label: 'Good' };
    if (score >= 40) return { color: '#F97316', bgColor: '#FED7AA', label: 'Fair' };
    return { color: '#EF4444', bgColor: '#FEE2E2', label: 'Poor' };
  };

  const scoreInfo = getScoreColor(sleepScore);

  const getHealthSuggestion = (score: number) => {
    if (score >= 80) {
      return {
        icon: CheckCircle,
        message: "Excellent sleep quality! Continue your current routine.",
        color: "text-green-600"
      };
    } else if (score >= 60) {
      return {
        icon: TrendingUp,
        message: "Good sleep quality. Consider monitoring for improvements.",
        color: "text-yellow-600"
      };
    } else if (score >= 40) {
      return {
        icon: AlertTriangle,
        message: "Fair sleep quality. Consider lifestyle changes and monitoring.",
        color: "text-orange-600"
      };
    } else {
      return {
        icon: AlertTriangle,
        message: "Poor sleep quality. Please consult a healthcare professional.",
        color: "text-red-600"
      };
    }
  };

  const healthSuggestion = getHealthSuggestion(sleepScore);

  // Calculate score breakdown
  const scoreBreakdown = [
    {
      factor: 'Event Count',
      value: events.length,
      impact: events.length === 0 ? 'Positive' : 'Negative',
      weight: Math.min(events.length * 5, 40),
      icon: Activity
    },
    {
      factor: 'Apnea Duration',
      value: `${((events.reduce((sum, event) => sum + (event.end - event.start), 0) / duration) * 100).toFixed(1)}%`,
      impact: events.length === 0 ? 'Positive' : 'Negative',
      weight: Math.min((events.reduce((sum, event) => sum + (event.end - event.start), 0) / duration) * 50, 30),
      icon: Clock
    },
    {
      factor: 'Confidence Level',
      value: `${(riskScore * 100).toFixed(1)}%`,
      impact: riskScore < 0.3 ? 'Positive' : 'Negative',
      weight: riskScore * 20,
      icon: AlertTriangle
    },
    {
      factor: 'Event Frequency',
      value: `${(events.length / (duration / 60)).toFixed(1)}/min`,
      impact: events.length === 0 ? 'Positive' : 'Negative',
      weight: Math.min((events.length / (duration / 60)) * 10, 20),
      icon: TrendingUp
    }
  ];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-600" />
          Sleep Quality Score
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${scoreInfo.bgColor} ${scoreInfo.color}`}>
          {scoreInfo.label}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: scoreInfo.bgColor }}>
              <span className="text-3xl font-bold" style={{ color: scoreInfo.color }}>
                {sleepScore}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-medium text-gray-600">/ 100</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <div className={`flex items-center justify-center space-x-2 ${healthSuggestion.color}`}>
            <healthSuggestion.icon className="w-5 h-5" />
            <span className="font-medium">{healthSuggestion.message}</span>
          </div>
        </motion.div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
        {scoreBreakdown.map((item, index) => (
          <motion.div
            key={item.factor}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                item.impact === 'Positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{item.factor}</div>
                <div className="text-sm text-gray-600">{item.value}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                item.impact === 'Positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.impact === 'Positive' ? '+' : '-'}{item.weight.toFixed(0)} pts
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg"
      >
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          Recommendations
        </h4>
        <div className="text-sm text-gray-700 space-y-1">
          {sleepScore < 60 && (
            <>
              <div>• Consult with a sleep specialist for comprehensive evaluation</div>
              <div>• Consider lifestyle changes: weight management, avoid alcohol before bed</div>
              <div>• Monitor sleep patterns regularly</div>
            </>
          )}
          {sleepScore >= 60 && sleepScore < 80 && (
            <>
              <div>• Continue monitoring your sleep patterns</div>
              <div>• Maintain good sleep hygiene practices</div>
              <div>• Consider annual sleep health assessments</div>
            </>
          )}
          {sleepScore >= 80 && (
            <>
              <div>• Excellent sleep quality! Keep up the good work</div>
              <div>• Continue your current sleep routine</div>
              <div>• Regular monitoring is still recommended</div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
