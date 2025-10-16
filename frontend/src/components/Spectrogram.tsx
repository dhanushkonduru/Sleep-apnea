'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { ApneaEvent } from '../lib/api';

interface SpectrogramProps {
  spectrogramImage?: string;
  events?: ApneaEvent[];
  duration?: number;
  isPlaying?: boolean;
  currentTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onReset?: () => void;
  className?: string;
}

export default function Spectrogram({
  spectrogramImage,
  events = [],
  duration = 0,
  isPlaying = false,
  currentTime = 0,
  onPlay,
  onPause,
  onSeek,
  onReset,
  className = '',
}: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation for real-time spectrogram generation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        const newProgress = prev + 0.01;
        return newProgress >= 1 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Draw animated spectrogram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Create animated spectrogram pattern
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Create mel-scale like pattern
        const melY = height - y;
        const timeX = x / width;
        
        // Animated frequency pattern
        const frequency = Math.sin(melY * 0.1 + timeX * 10 + animationProgress * Math.PI * 2) * 0.5 + 0.5;
        const intensity = Math.sin(timeX * 20 + animationProgress * Math.PI * 4) * 0.3 + 0.7;
        
        // Color mapping (blue to red for intensity)
        const r = Math.floor(frequency * 255);
        const g = Math.floor(intensity * 100);
        const b = Math.floor((1 - frequency) * 255);
        
        data[index] = r;     // Red
        data[index + 1] = g; // Green
        data[index + 2] = b;   // Blue
        data[index + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw events overlay
    if (showEvents && events.length > 0) {
      events.forEach((event) => {
        const startX = (event.start / duration) * width;
        const endX = (event.end / duration) * width;
        const eventHeight = height * 0.1;
        const eventY = height - eventHeight;

        // Event rectangle
        ctx.fillStyle = `rgba(239, 68, 68, ${event.confidence})`;
        ctx.fillRect(startX, eventY, endX - startX, eventHeight);

        // Event border
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, eventY, endX - startX, eventHeight);

        // Event label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Apnea (${Math.round(event.confidence * 100)}%)`,
          startX + (endX - startX) / 2,
          eventY + eventHeight / 2 + 4
        );
      });
    }

    // Draw playhead
    if (duration > 0) {
      const playheadX = (currentTime / duration) * width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
    }

  }, [spectrogramImage, events, duration, currentTime, showEvents, animationProgress]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = (x / canvas.width) * duration;
    
    onSeek(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-medical-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-medical-800 px-6 py-4 border-b border-medical-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Audio Spectrogram</h3>
            <p className="text-sm text-medical-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEvents(!showEvents)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showEvents 
                  ? 'bg-danger-500 text-white' 
                  : 'bg-medical-600 text-medical-300 hover:bg-medical-500'
              }`}
            >
              Events {showEvents ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-medical-600 text-medical-300 hover:bg-medical-500 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Spectrogram Display */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-64 cursor-pointer"
          onClick={handleCanvasClick}
        />
        
        {/* Loading Animation */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-medical-900/50"
            >
              <div className="bg-medical-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                  <span className="text-white font-medium">Generating Spectrogram...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="bg-medical-800 px-6 py-4 border-t border-medical-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center space-x-2 bg-medical-600 text-medical-300 px-4 py-2 rounded-lg hover:bg-medical-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Event Summary */}
          {events.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-medical-300">
                {events.length} apnea event{events.length !== 1 ? 's' : ''} detected
              </div>
              <div className="text-xs text-medical-400">
                Avg confidence: {Math.round(events.reduce((sum, e) => sum + e.confidence, 0) / events.length * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {duration > 0 && (
          <div className="mt-4">
            <div className="relative h-2 bg-medical-700 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Event markers */}
              {events.map((event, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full bg-danger-500 opacity-70"
                  style={{
                    left: `${(event.start / duration) * 100}%`,
                    width: `${((event.end - event.start) / duration) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-medical-800 px-6 py-3 border-t border-medical-700">
        <div className="flex items-center justify-between text-xs text-medical-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary-500 rounded"></div>
              <span>Normal Activity</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-danger-500 rounded"></div>
              <span>Apnea Events</span>
            </div>
          </div>
          
          <div className="text-medical-500">
            Frequency (Hz) ↑ | Time →
          </div>
        </div>
      </div>
    </div>
  );
}
