'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Activity, 
  AlertTriangle, 
  Heart,
  Zap,
  Clock,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface BreathingEvent {
  timestamp: number;
  type: 'NORMAL' | 'SNORING' | 'APNEA';
  confidence: number;
  duration: number;
  breathing_rate: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
}

interface RealTimeBreathingMonitorProps {
  onAnalysisComplete?: (events: BreathingEvent[]) => void;
}

export default function RealTimeBreathingMonitor({ onAnalysisComplete }: RealTimeBreathingMonitorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [events, setEvents] = useState<BreathingEvent[]>([]);
  const [currentBreathingType, setCurrentBreathingType] = useState<'NORMAL' | 'SNORING' | 'APNEA'>('NORMAL');
  const [confidence, setConfidence] = useState(0);
  const [breathingRate, setBreathingRate] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [severityScore, setSeverityScore] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const getBreathingTypeColor = (type: string) => {
    switch (type) {
      case 'APNEA': return 'from-red-500 to-red-700';
      case 'SNORING': return 'from-yellow-500 to-yellow-700';
      default: return 'from-green-500 to-green-700';
    }
  };

  const getBreathingTypeEmoji = (type: string) => {
    switch (type) {
      case 'APNEA': return '🚨';
      case 'SNORING': return '😴';
      default: return '✅';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Moderate': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Set up audio context for real-time analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);
      
      // Start real-time analysis
      startRealTimeAnalysis();
      
      // Set up media recorder for full audio capture
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Update session duration
      intervalRef.current = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsRecording(false);
    setIsAnalyzing(false);
  };

  const startRealTimeAnalysis = () => {
    const analyzeAudio = () => {
      if (!analyserRef.current || !isRecording) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate audio features
      const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength);
      const spectralCentroid = calculateSpectralCentroid(dataArray);
      const zeroCrossings = calculateZeroCrossings(dataArray);
      
      // Simulate breathing analysis (in real implementation, this would call your backend)
      const breathingAnalysis = analyzeBreathingPattern(rms, spectralCentroid, zeroCrossings);
      
      setCurrentBreathingType(breathingAnalysis.type);
      setConfidence(breathingAnalysis.confidence);
      setBreathingRate(breathingAnalysis.breathingRate);
      setSeverityScore(breathingAnalysis.severityScore);
      
      // Add event if significant change detected
      if (breathingAnalysis.type !== 'NORMAL' && breathingAnalysis.confidence > 0.7) {
        const newEvent: BreathingEvent = {
          timestamp: Date.now(),
          type: breathingAnalysis.type,
          confidence: breathingAnalysis.confidence,
          duration: 1.0, // 1 second analysis window
          breathing_rate: breathingAnalysis.breathingRate,
          severity: breathingAnalysis.severity
        };
        
        setEvents(prev => [...prev, newEvent]);
      }
      
      animationRef.current = requestAnimationFrame(analyzeAudio);
    };
    
    analyzeAudio();
  };

  const calculateSpectralCentroid = (dataArray: Uint8Array): number => {
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      weightedSum += i * dataArray[i];
      magnitudeSum += dataArray[i];
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  };

  const calculateZeroCrossings = (dataArray: Uint8Array): number => {
    let crossings = 0;
    for (let i = 1; i < dataArray.length; i++) {
      if ((dataArray[i] >= 128) !== (dataArray[i-1] >= 128)) {
        crossings++;
      }
    }
    return crossings / dataArray.length;
  };

  const analyzeBreathingPattern = (rms: number, spectralCentroid: number, zeroCrossings: number) => {
    // Simulate breathing pattern analysis
    // In real implementation, this would use your ML model
    
    let type: 'NORMAL' | 'SNORING' | 'APNEA' = 'NORMAL';
    let confidence = 0.8;
    let breathingRate = 15 + Math.random() * 5; // 15-20 BPM
    let severityScore = 0;
    let severity: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    
    // Apnea detection (very low RMS, low spectral centroid)
    if (rms < 10 && spectralCentroid < 50) {
      type = 'APNEA';
      confidence = 0.9;
      severityScore = 0.8;
      severity = 'Critical';
    }
    // Snoring detection (high RMS, high spectral centroid, high zero crossings)
    else if (rms > 50 && spectralCentroid > 100 && zeroCrossings > 0.3) {
      type = 'SNORING';
      confidence = 0.85;
      severityScore = 0.6;
      severity = 'Moderate';
    }
    // Normal breathing
    else {
      type = 'NORMAL';
      confidence = 0.8;
      severityScore = 0.2;
      severity = 'Low';
    }
    
    return { type, confidence, breathingRate, severityScore, severity };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventStats = () => {
    const apneaEvents = events.filter(e => e.type === 'APNEA').length;
    const snoringEvents = events.filter(e => e.type === 'SNORING').length;
    const normalEvents = events.filter(e => e.type === 'NORMAL').length;
    
    return { apneaEvents, snoringEvents, normalEvents };
  };

  const stats = getEventStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🩺 Real-Time Breathing Monitor</h2>
        <p className="text-gray-600">Live analysis of breathing patterns during sleep</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Mic className="w-5 h-5" />
              <span>Start Monitoring</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <MicOff className="w-5 h-5" />
              <span>Stop Monitoring</span>
            </button>
          )}
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{formatTime(sessionDuration)}</div>
            <div className="text-sm text-gray-600">Session Duration</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{breathingRate.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Breathing Rate (BPM)</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{(confidence * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Confidence</div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <motion.div
        key={currentBreathingType}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-r ${getBreathingTypeColor(currentBreathingType)} rounded-xl p-6 text-white shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{getBreathingTypeEmoji(currentBreathingType)}</div>
            <div>
              <h3 className="text-2xl font-bold">Current Status: {currentBreathingType}</h3>
              <p className="text-lg opacity-90">
                {currentBreathingType === 'APNEA' && 'Critical breathing interruptions detected'}
                {currentBreathingType === 'SNORING' && 'Snoring/airway obstruction detected'}
                {currentBreathingType === 'NORMAL' && 'Normal breathing patterns detected'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{(confidence * 100).toFixed(0)}%</div>
            <div className="text-sm opacity-75">Confidence</div>
          </div>
        </div>
      </motion.div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Apnea Events</h3>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.apneaEvents}</div>
          <div className="text-sm text-gray-600">Critical breathing pauses</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Snoring Events</h3>
            <Zap className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.snoringEvents}</div>
          <div className="text-sm text-gray-600">Airway obstruction</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Normal Periods</h3>
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.normalEvents}</div>
          <div className="text-sm text-gray-600">Healthy breathing</div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
          Event Timeline
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {events.slice(-10).reverse().map((event, index) => (
              <motion.div
                key={`${event.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg border-l-4 ${
                  event.type === 'APNEA' ? 'bg-red-50 border-red-400' :
                  event.type === 'SNORING' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getBreathingTypeEmoji(event.type)}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{event.type}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(event.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {events.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events detected yet. Start monitoring to see real-time analysis.</p>
            </div>
          )}
        </div>
      </div>

      {/* Severity Score */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Severity Assessment</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">Current Severity Score</span>
            <span className={`text-2xl font-bold ${getSeverityColor(
              severityScore > 0.7 ? 'Critical' :
              severityScore > 0.5 ? 'High' :
              severityScore > 0.3 ? 'Moderate' : 'Low'
            )}`}>
              {(severityScore * 100).toFixed(0)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                severityScore > 0.7 ? 'bg-red-500' :
                severityScore > 0.5 ? 'bg-orange-500' :
                severityScore > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${severityScore * 100}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            {severityScore > 0.7 && '🚨 Critical: Multiple apnea events detected - seek immediate medical attention'}
            {severityScore > 0.5 && severityScore <= 0.7 && '⚠️ High: Significant breathing irregularities - consult healthcare provider'}
            {severityScore > 0.3 && severityScore <= 0.5 && '📈 Moderate: Some breathing concerns - monitor closely'}
            {severityScore <= 0.3 && '✅ Low: Normal breathing patterns detected'}
          </div>
        </div>
      </div>
    </div>
  );
}
