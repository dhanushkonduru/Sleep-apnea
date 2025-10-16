'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain,
  Heart
} from 'lucide-react';

interface RealtimeDetectionProps {
  onAnalysisComplete?: (results: any) => void;
}

export default function RealtimeDetection({ onAnalysisComplete }: RealtimeDetectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 2048;
        source.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initAudio();
  }, []);

  // Real-time waveform visualization
  useEffect(() => {
    if (isRecording && analyserRef.current) {
      const updateWaveform = () => {
        const bufferLength = analyserRef.current!.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current!.getByteFrequencyData(dataArray);
        
        // Convert to waveform data
        const waveform = Array.from(dataArray).slice(0, 100);
        setWaveformData(waveform);
        
        // Simulate real-time analysis
        const avgAmplitude = waveform.reduce((a, b) => a + b, 0) / waveform.length;
        const simulatedConfidence = Math.min(95, 70 + (avgAmplitude / 10));
        setConfidence(simulatedConfidence);
        
        // Simulate risk detection
        if (avgAmplitude < 20) {
          setRiskLevel('high');
          // Add apnea event
          const newEvent = {
            id: Date.now(),
            start_time: currentTime,
            end_time: currentTime + 2,
            risk_score: 0.8,
            confidence: simulatedConfidence
          };
          setLiveEvents(prev => [...prev, newEvent]);
        } else if (avgAmplitude < 50) {
          setRiskLevel('medium');
        } else {
          setRiskLevel('low');
        }
        
        animationRef.current = requestAnimationFrame(updateWaveform);
      };
      
      updateWaveform();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, currentTime]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      startTimeRef.current = Date.now();
      interval = setInterval(() => {
        setCurrentTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setCurrentTime(0);
    setWaveformData([]);
    setLiveEvents([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onAnalysisComplete) {
        onAnalysisComplete({
          duration: currentTime,
          events: liveEvents,
          risk_score: liveEvents.length > 0 ? 0.7 : 0.2,
          total_events: liveEvents.length
        });
      }
    }, 2000);
  };

  const reset = () => {
    setIsRecording(false);
    setIsAnalyzing(false);
    setCurrentTime(0);
    setWaveformData([]);
    setLiveEvents([]);
    setConfidence(0);
    setRiskLevel('low');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const RiskIcon = getRiskIcon(riskLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-time Detection</h2>
        <p className="text-gray-600">Monitor breathing patterns in real-time</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
          >
            <Square className="w-5 h-5" />
            <span>Stop Recording</span>
          </button>
        )}
        
        <button
          onClick={reset}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-gray-900">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-600">Recording Time</div>
      </div>

      {/* Live Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{confidence}%</div>
          <div className="text-sm text-blue-700">Confidence</div>
        </div>
        
        <div className={`text-center p-4 rounded-lg ${getRiskColor(riskLevel)}`}>
          <RiskIcon className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold capitalize">{riskLevel}</div>
          <div className="text-sm">Risk Level</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{liveEvents.length}</div>
          <div className="text-sm text-purple-700">Events Detected</div>
        </div>
      </div>

      {/* Live Waveform */}
      {isRecording && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Live Waveform
          </h3>
          
          <div className="h-32 bg-gray-50 rounded-lg p-4 flex items-end space-x-1">
            {waveformData.map((value, index) => (
              <motion.div
                key={index}
                className="bg-blue-500 rounded-sm"
                style={{ width: '4px' }}
                animate={{ height: `${(value / 255) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Live Events
          </h3>
          
          <div className="space-y-2">
            {liveEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-800">Apnea Detected</span>
                  </div>
                  <div className="text-sm text-red-600">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analysis Status */}
      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-blue-50 rounded-xl"
        >
          <div className="flex items-center justify-center space-x-3">
            <Brain className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-lg font-semibold text-blue-800">
              Analyzing breathing patterns...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
