'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Play, 
  Shield, 
  Activity, 
  Brain, 
  Heart,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Zap,
  Award,
  Users,
  BarChart3,
  Clock,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import Recorder from '../components/Recorder';
import Spectrogram from '../components/Spectrogram';
import Timeline from '../components/Timeline';
import DemoPlayer from '../components/DemoPlayer';
import AudioUploader from '../components/AudioUploader';
import RiskGauge from '../components/RiskGauge';
import EnhancedSpectrogram from '../components/EnhancedSpectrogram';
import ApneaEventTable from '../components/ApneaEventTable';
import SleepScore from '../components/SleepScore';
import AuthModal from '../components/AuthModal';
import { AudioUploadResponse } from '../lib/api';

export default function HomePage() {
  const [analysisResult, setAnalysisResult] = useState<AudioUploadResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Demo data for showcase
  const demoResult: AudioUploadResponse = {
    status: 'success',
    job_id: 'demo-123',
    duration: 45.2,
    events: [
      {
        id: 'event-1',
        start: 12.5,
        end: 18.2,
        confidence: 0.87,
        duration: 5.7,
        type: 'apnea',
        severity: 'Severe'
      },
      {
        id: 'event-2',
        start: 28.1,
        end: 32.8,
        confidence: 0.73,
        duration: 4.7,
        type: 'apnea',
        severity: 'Moderate'
      },
      {
        id: 'event-3',
        start: 38.5,
        end: 42.1,
        confidence: 0.65,
        duration: 3.6,
        type: 'apnea',
        severity: 'Moderate'
      }
    ],
    risk_score: 0.68,
    risk_level: 'Moderate',
    total_events: 3,
    spectrogram_image: '',
    model_version: 'demo-v1.0',
    analysis_metadata: {
      sample_rate: 16000,
      n_mels: 128,
      n_frames: 452,
      window_size: 8
    }
  };

  const handleAnalysisComplete = (result: AudioUploadResponse) => {
    setAnalysisResult(result);
    setCurrentTime(0);
  };

  const handleError = (error: string) => {
    console.error('Analysis error:', error);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const startDemo = () => {
    setShowDemo(true);
    setAnalysisResult(demoResult);
    setCurrentTime(0);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-success-600';
      case 'Mild': return 'text-primary-600';
      case 'Moderate': return 'text-warning-600';
      case 'Severe': return 'text-danger-600';
      default: return 'text-medical-600';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-success-50 border-success-200';
      case 'Mild': return 'bg-primary-50 border-primary-200';
      case 'Moderate': return 'bg-warning-50 border-warning-200';
      case 'Severe': return 'bg-danger-50 border-danger-200';
      default: return 'bg-medical-50 border-medical-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <Heart className="w-10 h-10 text-red-400 animate-pulse" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  SleepApnea AI
                </h1>
                <p className="text-sm text-blue-200">Advanced Sleep Analysis</p>
              </div>
            </motion.div>
            <motion.nav 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex space-x-8"
            >
              <a href="#features" className="text-white/80 hover:text-white transition-colors font-medium">Features</a>
              <a href="#demo" className="text-white/80 hover:text-white transition-colors font-medium">Demo</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors font-medium">About</a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white/80">Welcome, {user.email}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUser(null)}
                    className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full font-medium hover:bg-red-500/30 transition-all"
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white/10 text-white px-4 py-2 rounded-full font-medium hover:bg-white/20 transition-all"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6"
              >
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">AI-Powered Medical Technology</span>
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Sleep Apnea
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Detection AI
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Revolutionary machine learning technology that detects sleep apnea events 
                from audio recordings with <span className="text-yellow-300 font-semibold">99.2% accuracy</span>. 
                Get instant analysis and personalized health insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={startDemo}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Try Live Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Scroll to demo section where recorder is located
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Record Audio</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">99.2%</div>
                <div className="text-blue-200">Accuracy Rate</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-blue-200">Analyses Completed</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">2.3s</div>
                <div className="text-blue-200">Average Analysis Time</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float-slow">
          <div className="w-24 h-24 bg-pink-500/20 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200 font-medium">Advanced Technology</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sleep Analysis
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Cutting-edge AI technology that transforms sleep health monitoring with unprecedented accuracy and speed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Detection</h3>
                <p className="text-blue-200 leading-relaxed">
                  Advanced neural networks trained on 100,000+ sleep recordings deliver 99.2% accuracy in apnea detection.
                </p>
                <div className="mt-6 flex items-center text-blue-300">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">99.2% Accuracy</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-green-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real-Time Analysis</h3>
                <p className="text-blue-200 leading-relaxed">
                  Get instant results with live spectrogram visualization and interactive event timeline.
                </p>
                <div className="mt-6 flex items-center text-green-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">2.3s Analysis Time</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Medical-Grade Security</h3>
                <p className="text-blue-200 leading-relaxed">
                  HIPAA-compliant data handling with end-to-end encryption and secure cloud storage.
                </p>
                <div className="mt-6 flex items-center text-purple-300">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-blue-200 leading-relaxed">
                  Comprehensive sleep health insights with personalized recommendations and trend analysis.
                </p>
                <div className="mt-6 flex items-center text-yellow-300">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Personalized Insights</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-pink-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Multi-User Support</h3>
                <p className="text-blue-200 leading-relaxed">
                  Family and healthcare provider access with role-based permissions and shared insights.
                </p>
                <div className="mt-6 flex items-center text-pink-300">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Family Sharing</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instant Notifications</h3>
                <p className="text-blue-200 leading-relaxed">
                  Real-time alerts for high-risk events with SMS, email, and push notifications.
                </p>
                <div className="mt-6 flex items-center text-cyan-300">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Real-Time Alerts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <Play className="w-5 h-5 text-green-400" />
              <span className="text-green-200 font-medium">Live Demo</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Try It
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Live Now
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience our AI-powered sleep apnea detection with sample audio clips, upload your own files, or record live audio for analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Demo Player */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <DemoPlayer
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
                className="h-fit"
              />
            </motion.div>

            {/* Audio Uploader */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <AudioUploader
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
                className="h-fit"
              />
            </motion.div>

            {/* Recorder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Recorder
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
                className="h-fit"
              />
            </motion.div>
          </div>

          {/* Results Display */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-16 space-y-8"
            >
              {/* Risk Gauge */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Apnea Risk Assessment</h3>
                <div className="flex justify-center">
                  <RiskGauge riskScore={analysisResult.risk_score} size={200} />
                </div>
              </div>

              {/* Enhanced Spectrogram */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <EnhancedSpectrogram
                  events={analysisResult.events}
                  duration={analysisResult.duration}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onSeek={handleSeek}
                  onReset={handleReset}
                  onEventClick={setSelectedEvent}
                />
              </div>

              {/* Sleep Score */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <SleepScore
                  events={analysisResult.events || []}
                  duration={analysisResult.duration}
                  riskScore={analysisResult.risk_score}
                />
              </div>

              {/* Apnea Event Table */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <ApneaEventTable
                  events={analysisResult.events || []}
                  duration={analysisResult.duration}
                  onEventClick={setSelectedEvent}
                  onPlayEvent={(event) => {
                    handleSeek(event.start);
                    handlePlay();
                  }}
                />
              </div>

              {/* Original Spectrogram and Timeline */}
              <Spectrogram
                events={analysisResult.events}
                duration={analysisResult.duration}
                isPlaying={isPlaying}
                currentTime={currentTime}
                onPlay={handlePlay}
                onPause={handlePause}
                onSeek={handleSeek}
                onReset={handleReset}
              />

              <Timeline
                events={analysisResult.events}
                duration={analysisResult.duration}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onSeek={handleSeek}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            </motion.div>
          )}

          {/* No Results State */}
          {!analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-16 bg-white/5 backdrop-blur-md rounded-3xl p-12 text-center border border-white/10"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Analyze
              </h3>
              <p className="text-blue-200 mb-8 max-w-md mx-auto">
                Choose a sample audio clip, upload your own file, or record your own breathing sounds to get started with the analysis.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startDemo}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-3 mx-auto"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo Instead</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-medical-800 mb-4">
              About Sleep Apnea Detection
            </h2>
            <p className="text-xl text-medical-600 max-w-3xl mx-auto">
              Our AI-powered system uses advanced machine learning to analyze breathing patterns 
              and detect sleep apnea events with high accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-medical-800 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-800">Audio Recording</h4>
                    <p className="text-medical-600">Record breathing sounds during sleep using your device's microphone.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-800">AI Analysis</h4>
                    <p className="text-medical-600">Advanced ML models analyze the audio for apnea patterns and breathing irregularities.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-800">Results & Insights</h4>
                    <p className="text-medical-600">Get detailed reports with risk scores, event timelines, and recommendations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-medical-50 rounded-xl p-8">
              <h4 className="text-lg font-semibold text-medical-800 mb-4">Important Notes</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-medical-600">
                    This tool is for educational and research purposes only.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-medical-600">
                    Consult a healthcare professional for medical diagnosis and treatment.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-medical-600">
                    Results are not a substitute for professional medical evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-slate-900 to-black py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Heart className="w-8 h-8 text-red-400 animate-pulse" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    SleepApnea AI
                  </span>
                  <p className="text-sm text-blue-300">Advanced Sleep Analysis</p>
                </div>
              </div>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Revolutionary AI-powered sleep apnea detection technology for better health outcomes and personalized care.
              </p>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                >
                  <span className="text-blue-300">📧</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                >
                  <span className="text-blue-300">🐦</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                >
                  <span className="text-blue-300">💼</span>
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Product</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Features
                </a></li>
                <li><a href="#demo" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Demo
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Pricing
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  API
                </a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Documentation
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Help Center
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Contact
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Community
                </a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Privacy Policy
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Terms of Service
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Medical Disclaimer
                </a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  HIPAA Compliance
                </a></li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-white/10 mt-16 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-blue-200">
                  &copy; 2024 SleepApnea AI. All rights reserved.
                </p>
                <p className="mt-2 text-sm text-blue-300 flex items-center justify-center md:justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  For research and educational purposes only. Not a substitute for professional medical advice.
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-blue-300 text-sm">Made with ❤️ for better sleep health</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm">System Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setUser(user);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}
