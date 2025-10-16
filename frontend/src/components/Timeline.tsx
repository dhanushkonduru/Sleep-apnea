'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  Activity, 
  TrendingUp, 
  Info,
  Play,
  Pause
} from 'lucide-react';
import { ApneaEvent } from '../lib/api';

interface TimelineProps {
  events: ApneaEvent[];
  duration: number;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

export default function Timeline({
  events,
  duration,
  currentTime = 0,
  isPlaying = false,
  onSeek,
  onPlay,
  onPause,
  className = '',
}: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<ApneaEvent | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventSeverity = (confidence: number) => {
    if (confidence >= 0.8) return { level: 'Severe', color: 'danger', bg: 'bg-danger-50', border: 'border-danger-200' };
    if (confidence >= 0.6) return { level: 'Moderate', color: 'warning', bg: 'bg-warning-50', border: 'border-warning-200' };
    if (confidence >= 0.4) return { level: 'Mild', color: 'primary', bg: 'bg-primary-50', border: 'border-primary-200' };
    return { level: 'Low', color: 'success', bg: 'bg-success-50', border: 'border-success-200' };
  };

  const getRiskLevel = (events: ApneaEvent[], duration: number) => {
    if (events.length === 0) return { level: 'Low', color: 'success', score: 0 };
    
    const totalEventDuration = events.reduce((sum, event) => sum + event.duration, 0);
    const eventRatio = totalEventDuration / duration;
    const avgConfidence = events.reduce((sum, event) => sum + event.confidence, 0) / events.length;
    
    const riskScore = (eventRatio * 0.5 + avgConfidence * 0.5);
    
    if (riskScore >= 0.7) return { level: 'High', color: 'danger', score: riskScore };
    if (riskScore >= 0.4) return { level: 'Moderate', color: 'warning', score: riskScore };
    if (riskScore >= 0.2) return { level: 'Low', color: 'primary', score: riskScore };
    return { level: 'Minimal', color: 'success', score: riskScore };
  };

  const riskLevel = getRiskLevel(events, duration);

  const handleEventClick = (event: ApneaEvent) => {
    setSelectedEvent(event);
    setShowDetails(true);
    onSeek?.(event.start);
  };

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = (x / rect.width) * duration;
    onSeek?.(time);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-medical-50 px-6 py-4 border-b border-medical-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-medical-800">Detection Timeline</h3>
            <p className="text-sm text-medical-600">
              {events.length} event{events.length !== 1 ? 's' : ''} detected over {formatTime(duration)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${riskLevel.color}-100 text-${riskLevel.color}-800`}>
              Risk: {riskLevel.level}
            </div>
            
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="flex items-center space-x-1 px-3 py-1 bg-medical-100 text-medical-700 rounded-lg hover:bg-medical-200 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="px-6 py-4 bg-medical-50 border-b border-medical-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-medical-800">{events.length}</div>
            <div className="text-sm text-medical-600">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-medical-800">
              {Math.round(riskLevel.score * 100)}%
            </div>
            <div className="text-sm text-medical-600">Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-medical-800">
              {events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.confidence, 0) / events.length * 100) : 0}%
            </div>
            <div className="text-sm text-medical-600">Avg Confidence</div>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="p-6">
        <div className="relative">
          {/* Timeline Bar */}
          <div 
            className="relative h-8 bg-medical-200 rounded-lg cursor-pointer overflow-hidden"
            onClick={handleTimelineClick}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-success-200 via-warning-200 to-danger-200" />
            
            {/* Playhead */}
            {duration > 0 && (
              <div 
                className="absolute top-0 w-1 h-full bg-white shadow-lg z-10"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            )}
            
            {/* Event Markers */}
            {events.map((event, index) => {
              const severity = getEventSeverity(event.confidence);
              const left = (event.start / duration) * 100;
              const width = ((event.end - event.start) / duration) * 100;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`absolute top-1 h-6 rounded cursor-pointer hover:scale-105 transition-transform ${severity.bg} ${severity.border} border-2`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <AlertTriangle className="w-3 h-3 text-danger-600" />
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Time Labels */}
          <div className="flex justify-between text-xs text-medical-500 mt-2">
            <span>0:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Event List */}
      {events.length > 0 && (
        <div className="px-6 pb-6">
          <h4 className="font-semibold text-medical-800 mb-3">Detected Events</h4>
          <div className="space-y-2">
            {events.map((event, index) => {
              const severity = getEventSeverity(event.confidence);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${severity.bg} ${severity.border}`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${severity.color}-500`} />
                      <div>
                        <div className="font-medium text-medical-800">
                          Apnea Event #{index + 1}
                        </div>
                        <div className="text-sm text-medical-600">
                          {formatTime(event.start)} - {formatTime(event.end)} 
                          ({formatTime(event.duration)})
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-medical-800">
                        {Math.round(event.confidence * 100)}%
                      </div>
                      <div className={`text-xs text-${severity.color}-600`}>
                        {severity.level}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      <AnimatePresence>
        {showDetails && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-medical-800">
                  Event Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-medical-400 hover:text-medical-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-medical-600">Start Time:</span>
                  <span className="font-medium">{formatTime(selectedEvent.start)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medical-600">End Time:</span>
                  <span className="font-medium">{formatTime(selectedEvent.end)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medical-600">Duration:</span>
                  <span className="font-medium">{formatTime(selectedEvent.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medical-600">Confidence:</span>
                  <span className="font-medium">{Math.round(selectedEvent.confidence * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medical-600">Severity:</span>
                  <span className={`font-medium text-${getEventSeverity(selectedEvent.confidence).color}-600`}>
                    {getEventSeverity(selectedEvent.confidence).level}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    onSeek?.(selectedEvent.start);
                    setShowDetails(false);
                  }}
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Go to Event
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-medical-200 text-medical-700 py-2 px-4 rounded-lg hover:bg-medical-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Events State */}
      {events.length === 0 && (
        <div className="px-6 pb-6">
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-medical-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-medical-600 mb-2">
              No Apnea Events Detected
            </h4>
            <p className="text-medical-500">
              Great! No sleep apnea events were detected in this recording.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
