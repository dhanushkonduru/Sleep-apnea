'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileAudio, 
  X, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Download
} from 'lucide-react';
import { uploadAudio } from '../lib/api';
import { AudioUploadResponse } from '../lib/api';

interface AudioUploaderProps {
  onAnalysisComplete?: (result: AudioUploadResponse) => void;
  onError?: (error: string) => void;
  userId?: string;
  sessionId?: string;
  className?: string;
}

export default function AudioUploader({
  onAnalysisComplete,
  onError,
  userId,
  sessionId,
  className = '',
}: AudioUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/webm'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid audio file (WAV, MP3, M4A, or WebM)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }

    setError(null);
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert file to blob for upload
      const audioBlob = new Blob([file], { type: file.type });
      
      // Upload and analyze
      const result = await uploadAudio(audioBlob, userId, sessionId);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(100);
      
      setTimeout(() => {
        onAnalysisComplete?.(result);
        setIsUploading(false);
      }, 500);

    } catch (err: any) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      const errorMessage = err.message || 'Failed to analyze audio file';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsUploading(false);
    }
  }, [userId, sessionId, onAnalysisComplete, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-medical-800 mb-2">
          Upload Audio File
        </h2>
        <p className="text-medical-600">
          Upload an audio file for sleep apnea analysis
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-medical-300 hover:border-medical-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!uploadedFile && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-medical-800 mb-2">
                Drop your audio file here
              </h3>
              <p className="text-medical-600 mb-4">
                or click to browse files
              </p>
              <div className="text-sm text-medical-500">
                Supported formats: WAV, MP3, M4A, WebM (max 50MB)
              </div>
            </div>
          </motion.div>
        )}

        {uploadedFile && !isUploading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
              <FileAudio className="w-8 h-8 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-medical-800 mb-2">
                File Ready for Analysis
              </h3>
              <div className="bg-medical-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileAudio className="w-5 h-5 text-medical-600" />
                    <div>
                      <div className="font-medium text-medical-800">{uploadedFile.name}</div>
                      <div className="text-sm text-medical-600">
                        {formatFileSize(uploadedFile.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 text-medical-400 hover:text-medical-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleFileSelect(uploadedFile)}
                className="bg-success-500 text-white px-6 py-3 rounded-lg hover:bg-success-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                <span>Analyze Audio</span>
              </button>
            </div>
          </motion.div>
        )}

        {isUploading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-medical-800 mb-2">
                Analyzing Audio...
              </h3>
              <p className="text-medical-600 mb-4">
                Processing your audio file for sleep apnea detection
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-medical-200 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-primary-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-sm text-medical-600">
                {uploadProgress}% complete
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-danger-50 border border-danger-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-danger-500" />
            <span className="text-danger-700 font-medium">Upload Error</span>
          </div>
          <p className="text-danger-600 mt-1">{error}</p>
        </motion.div>
      )}

      {/* Upload Tips */}
      <div className="mt-6 bg-medical-50 rounded-lg p-4">
        <h4 className="font-semibold text-medical-800 mb-2">Upload Tips:</h4>
        <ul className="text-sm text-medical-600 space-y-1">
          <li>• Use high-quality audio recordings for best results</li>
          <li>• Record in a quiet environment with minimal background noise</li>
          <li>• Audio should contain breathing sounds or sleep recordings</li>
          <li>• Recommended duration: 10 seconds to 5 minutes</li>
        </ul>
      </div>
    </div>
  );
}
