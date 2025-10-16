'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { ApneaEvent } from '../lib/api';

interface EnhancedSpectrogramProps {
  spectrogramImage?: string;
  events?: ApneaEvent[];
  duration?: number;
  isPlaying?: boolean;
  currentTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onReset?: () => void;
  onEventClick?: (event: ApneaEvent) => void;
  className?: string;
}

export default function EnhancedSpectrogram({
  spectrogramImage,
  events = [],
  duration = 0,
  isPlaying = false,
  currentTime = 0,
  onPlay,
  onPause,
  onSeek,
  onReset,
  onEventClick,
  className = '',
}: EnhancedSpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOverlays, setShowOverlays] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState<ApneaEvent | null>(null);

  // Generate mock spectrogram data if no image provided
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Create spectrogram pattern
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Create mel-scale like pattern
        const melY = height - y;
        const timeX = x / width;
        
        // Frequency pattern (higher frequencies at top)
        const frequency = Math.sin(melY * 0.1 + timeX * 10) * 0.5 + 0.5;
        const intensity = Math.sin(timeX * 20) * 0.3 + 0.7;
        
        // Color mapping (blue to red for intensity)
        const r = Math.floor(frequency * 255);
        const g = Math.floor(intensity * 100);
        const b = Math.floor((1 - frequency) * 255);
        
        data[index] = r;     // Red
        data[index + 1] = g; // Green
        data[index + 2] = b; // Blue
        data[index + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw event overlays
    if (showOverlays && events.length > 0) {
      events.forEach((event, index) => {
        const startX = (event.start / duration) * width;
        const endX = (event.end / duration) * width;
        const eventWidth = endX - startX;
        
        // Draw red overlay for apnea events
        ctx.fillStyle = `rgba(239, 68, 68, ${event.confidence * 0.7})`;
        ctx.fillRect(startX, 0, eventWidth, height);
        
        // Draw border
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, 0, eventWidth, height);
        
        // Add event number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`${index + 1}`, startX + 5, 20);
      });
    }

    // Draw current time indicator
    if (duration > 0) {
      const currentX = (currentTime / duration) * width;
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();
    }
  }, [events, duration, currentTime, showOverlays]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onSeek || duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = (x / canvas.width) * duration;
    
    onSeek(time);
  };

  const handleEventClick = (event: ApneaEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
    if (onSeek) {
      onSeek(event.start);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-600" />
          Enhanced Spectrogram
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`p-2 rounded-lg transition-colors ${
              showOverlays 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {showOverlays ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Spectrogram Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-48 border border-gray-200 rounded-lg cursor-pointer"
          onClick={handleCanvasClick}
        />
        
        {/* Frequency labels */}
        <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-gray-500 py-2">
          <span>8kHz</span>
          <span>4kHz</span>
          <span>2kHz</span>
          <span>1kHz</span>
          <span>500Hz</span>
        </div>
        
        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pb-2">
          <span>0:00</span>
          <span>{formatTime(duration / 4)}</span>
          <span>{formatTime(duration / 2)}</span>
          <span>{formatTime(duration * 3 / 4)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Event Markers */}
      {events.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Apnea Events</h4>
          <div className="flex flex-wrap gap-2">
            {events.map((event, index) => (
              <motion.button
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleEventClick(event)}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  hoveredEvent?.id === event.id
                    ? 'bg-red-200 text-red-800'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Event {index + 1}: {formatTime(event.start)}-{formatTime(event.end)}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onReset}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Normal Breathing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Apnea Events</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span>Current Time</span>
        </div>
      </div>
    </div>
  );
}
