'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Download,
  Info,
  AlertTriangle
} from 'lucide-react';
import { uploadAudio } from '../lib/api';
import { AudioUploadResponse } from '../lib/api';

interface DemoClip {
  id: string;
  name: string;
  description: string;
  duration: number;
  expectedEvents: number;
  expectedRisk: string;
  filename: string;
}

const demoClips: DemoClip[] = [
  {
    id: 'normal',
    name: 'Normal Breathing',
    description: 'Regular breathing pattern without apnea events',
    duration: 30,
    expectedEvents: 0,
    expectedRisk: 'Low',
    filename: '/sample_clips/normal_breathing.wav'
  },
  {
    id: 'apnea',
    name: 'Apnea Sample',
    description: 'Breathing pattern with multiple apnea events',
    duration: 45,
    expectedEvents: 3,
    expectedRisk: 'Moderate',
    filename: '/sample_clips/apnea_sample.wav'
  },
  {
    id: 'severe',
    name: 'Severe Apnea',
    description: 'High-frequency apnea events with severe risk',
    duration: 60,
    expectedEvents: 7,
    expectedRisk: 'High',
    filename: '/sample_clips/severe_apnea.wav'
  }
];

interface DemoPlayerProps {
  onAnalysisComplete?: (result: AudioUploadResponse) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function DemoPlayer({
  onAnalysisComplete,
  onError,
  className = ''
}: DemoPlayerProps) {
  const [selectedClip, setSelectedClip] = useState<DemoClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AudioUploadResponse | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedClip]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  const handleAnalyze = async () => {
    if (!selectedClip) return;

    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);

      // Fetch the audio file
      const response = await fetch(selectedClip.filename);
      const audioBlob = await response.blob();

      // Upload for analysis
      const result = await uploadAudio(audioBlob);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to analyze audio';
      onError?.(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-success-600';
      case 'Moderate': return 'text-warning-600';
      case 'High': return 'text-danger-600';
      default: return 'text-medical-600';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-medical-50 px-6 py-4 border-b border-medical-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-medical-800">Demo Audio Player</h3>
            <p className="text-sm text-medical-600">
              Try our sample audio clips to see the analysis in action
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-lg bg-medical-100 text-medical-600 hover:bg-medical-200 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clip Selection */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {demoClips.map((clip) => (
            <motion.button
              key={clip.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedClip(clip);
                setAnalysisResult(null);
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedClip?.id === clip.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-medical-200 hover:border-medical-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-medical-800">{clip.name}</h4>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  clip.expectedRisk === 'Low' ? 'bg-success-100 text-success-700' :
                  clip.expectedRisk === 'Moderate' ? 'bg-warning-100 text-warning-700' :
                  'bg-danger-100 text-danger-700'
                }`}>
                  {clip.expectedRisk} Risk
                </div>
              </div>
              <p className="text-sm text-medical-600 mb-2">{clip.description}</p>
              <div className="flex items-center justify-between text-xs text-medical-500">
                <span>{formatTime(clip.duration)}</span>
                <span>{clip.expectedEvents} events</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Audio Player */}
        {selectedClip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-medical-50 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-medical-200 text-medical-700 hover:bg-medical-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMute}
                  className="p-2 rounded-lg bg-medical-200 text-medical-700 hover:bg-medical-300 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>

              <div className="flex-1 text-center">
                <span className="text-sm text-medical-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full h-2 bg-medical-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-100"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={selectedClip.filename}
              preload="metadata"
            />
          </motion.div>
        )}

        {/* Analysis Button */}
        {selectedClip && (
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 bg-success-500 text-white px-6 py-3 rounded-lg hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Analyze Audio</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white border border-medical-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-medical-800 mb-3">Analysis Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-medical-800">
                  {Math.round(analysisResult.risk_score * 100)}%
                </div>
                <div className="text-sm text-medical-600">Risk Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-medical-800">
                  {analysisResult.total_events}
                </div>
                <div className="text-sm text-medical-600">Events Detected</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysisResult.risk_level === 'Low' ? 'bg-success-100 text-success-700' :
                analysisResult.risk_level === 'Moderate' ? 'bg-warning-100 text-warning-700' :
                'bg-danger-100 text-danger-700'
              }`}>
                {analysisResult.risk_level} Risk
              </span>
            </div>
          </motion.div>
        )}

        {/* Info Modal */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInfo(false)}
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
                    Demo Information
                  </h3>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="text-medical-400 hover:text-medical-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-medical-600">
                      These are synthetic demo samples for demonstration purposes only.
                    </p>
                  </div>
                  <p className="text-sm text-medical-600">
                    The analysis results shown are simulated and not based on real medical data.
                  </p>
                  <p className="text-sm text-medical-600">
                    For actual medical diagnosis, consult a healthcare professional.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
