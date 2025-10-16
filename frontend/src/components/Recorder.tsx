'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause, Upload, AlertCircle } from 'lucide-react';
import { uploadAudio } from '../lib/api';
import { AudioUploadResponse } from '../lib/api';

interface RecorderProps {
  onAnalysisComplete?: (result: AudioUploadResponse) => void;
  onError?: (error: string) => void;
  userId?: string;
  sessionId?: string;
  maxDuration?: number; // in seconds
  className?: string;
}

export default function Recorder({
  onAnalysisComplete,
  onError,
  userId,
  sessionId,
  maxDuration = 300, // 5 minutes default
  className = '',
}: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'paused' | 'processing' | 'completed'>('idle');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
      setError('Microphone access denied. Please allow microphone access to record audio.');
    }
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (!hasPermission) {
        await checkMicrophonePermission();
        if (!hasPermission) return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordingStatus('recording');

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

    } catch (err: any) {
      setError(`Failed to start recording: ${err.message}`);
      onError?.(err.message);
    }
  }, [hasPermission, maxDuration, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingStatus('completed');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      setRecordingStatus('paused');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setRecordingStatus('recording');
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    }
  }, [isRecording, isPaused, maxDuration, stopRecording]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setError(null);
    setRecordingStatus('idle');
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  const uploadRecording = useCallback(async () => {
    if (!audioBlob) return;

    try {
      setIsProcessing(true);
      setError(null);
      setRecordingStatus('processing');

      const result = await uploadAudio(audioBlob, userId, sessionId);
      onAnalysisComplete?.(result);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze audio';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [audioBlob, userId, sessionId, onAnalysisComplete, onError]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskColor = (time: number) => {
    if (time < 10) return 'text-success-500';
    if (time < 30) return 'text-warning-500';
    return 'text-danger-500';
  };

  if (hasPermission === false) {
    return (
      <div className={`bg-danger-50 border border-danger-200 rounded-lg p-6 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-danger-800 mb-2">
          Microphone Access Required
        </h3>
        <p className="text-danger-600 mb-4">
          Please allow microphone access to record audio for analysis.
        </p>
        <button
          onClick={checkMicrophonePermission}
          className="bg-danger-500 text-white px-4 py-2 rounded-lg hover:bg-danger-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-medical-800 mb-2">
          Record Audio for Analysis
        </h2>
        <p className="text-medical-600">
          Record your breathing or sleep sounds for apnea detection
        </p>
        
        {/* Status Indicator */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            recordingStatus === 'recording' ? 'bg-danger-500 animate-pulse' :
            recordingStatus === 'paused' ? 'bg-warning-500' :
            recordingStatus === 'processing' ? 'bg-primary-500 animate-spin' :
            recordingStatus === 'completed' ? 'bg-success-500' :
            'bg-medical-300'
          }`}></div>
          <span className="text-sm text-medical-600">
            {recordingStatus === 'recording' ? 'Recording...' :
             recordingStatus === 'paused' ? 'Paused' :
             recordingStatus === 'processing' ? 'Processing...' :
             recordingStatus === 'completed' ? 'Ready for analysis' :
             'Ready to record'}
          </span>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-4xl font-mono font-bold ${getRiskColor(recordingTime)}`}>
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-medical-500 mt-1">
            {recordingTime < 10 && 'Minimum 10 seconds recommended'}
            {recordingTime >= 10 && recordingTime < 30 && 'Good duration for analysis'}
            {recordingTime >= 30 && 'Excellent - ready for analysis'}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              disabled={!hasPermission}
              className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <>
              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="flex items-center space-x-2 bg-warning-500 text-white px-6 py-3 rounded-lg hover:bg-warning-600 transition-colors"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 bg-danger-500 text-white px-6 py-3 rounded-lg hover:bg-danger-600 transition-colors"
              >
                <Square className="w-5 h-5" />
                <span>Stop</span>
              </button>
            </>
          )}

          {audioBlob && !isRecording && (
            <>
              <button
                onClick={uploadRecording}
                disabled={isProcessing}
                className="flex items-center space-x-2 bg-success-500 text-white px-6 py-3 rounded-lg hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>{isProcessing ? 'Analyzing...' : 'Analyze Audio'}</span>
              </button>

              <button
                onClick={resetRecording}
                className="flex items-center space-x-2 bg-medical-500 text-white px-6 py-3 rounded-lg hover:bg-medical-600 transition-colors"
              >
                <span>Record Again</span>
              </button>
            </>
          )}
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="w-full max-w-md">
            <audio
              src={audioUrl}
              controls
              className="w-full"
              preload="metadata"
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-danger-500" />
              <span className="text-danger-700 font-medium">Error</span>
            </div>
            <p className="text-danger-600 mt-1">{error}</p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              <span className="text-primary-700 font-medium">
                Analyzing audio for apnea events...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Recording Tips */}
      <div className="mt-6 bg-medical-50 rounded-lg p-4">
        <h4 className="font-semibold text-medical-800 mb-2">Recording Tips:</h4>
        <ul className="text-sm text-medical-600 space-y-1">
          <li>• Record in a quiet environment</li>
          <li>• Place microphone close to breathing source</li>
          <li>• Record for at least 10 seconds for best results</li>
          <li>• Avoid background noise and music</li>
        </ul>
      </div>
    </div>
  );
}
