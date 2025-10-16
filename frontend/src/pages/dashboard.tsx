'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Settings,
  User,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Brain,
  Zap,
  Shield,
  Heart
} from 'lucide-react';
import Recorder from '../components/Recorder';
import Spectrogram from '../components/Spectrogram';
import Timeline from '../components/Timeline';
import EnhancedAnalysisResults from '../components/EnhancedAnalysisResults';
import HealthRecommendations from '../components/HealthRecommendations';
import VisualizationDashboard from '../components/VisualizationDashboard';
import RealtimeDetection from '../components/RealtimeDetection';
import ReportGenerator from '../components/ReportGenerator';
import RiskGauge from '../components/RiskGauge';
import EnhancedSpectrogram from '../components/EnhancedSpectrogram';
import ApneaEventTable from '../components/ApneaEventTable';
import SleepScore from '../components/SleepScore';
import AuthModal from '../components/AuthModal';
import { AudioUploadResponse, UserReport } from '../lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudioUploadResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'record' | 'realtime' | 'history' | 'profile'>('record');
  const [detectionMode, setDetectionMode] = useState<'batch' | 'realtime'>('batch');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock data for demo
  useEffect(() => {
    // Simulate user data
    setUser({
      id: 'user-123',
      email: 'demo@example.com',
      name: 'John Doe',
      role: 'patient'
    });

    // Simulate reports data
    setReports([
      {
        id: 'report-1',
        risk_score: 0.45,
        total_events: 3,
        created_at: '2024-01-15T10:30:00Z',
        events: []
      },
      {
        id: 'report-2',
        risk_score: 0.23,
        total_events: 1,
        created_at: '2024-01-14T09:15:00Z',
        events: []
      },
      {
        id: 'report-3',
        risk_score: 0.67,
        total_events: 5,
        created_at: '2024-01-13T11:45:00Z',
        events: []
      }
    ]);
  }, []);

  const handleAnalysisComplete = (result: AudioUploadResponse) => {
    setCurrentAnalysis(result);
    setCurrentTime(0);
    // Add to reports
    const newReport: UserReport = {
      id: result.job_id,
      risk_score: result.risk_score,
      total_events: result.total_events,
      created_at: new Date().toISOString(),
      events: result.events
    };
    setReports(prev => [newReport, ...prev]);
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

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 0.7) return { level: 'High', color: 'danger' };
    if (riskScore >= 0.4) return { level: 'Moderate', color: 'warning' };
    if (riskScore >= 0.2) return { level: 'Low', color: 'primary' };
    return { level: 'Minimal', color: 'success' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAverageRiskScore = () => {
    if (reports.length === 0) return 0;
    return reports.reduce((sum, report) => sum + report.risk_score, 0) / reports.length;
  };

  const getTotalEvents = () => {
    return reports.reduce((sum, report) => sum + report.total_events, 0);
  };

  const averageRisk = getAverageRiskScore();
  const totalEvents = getTotalEvents();
  const riskLevel = getRiskLevel(averageRisk);

  return (
    <div className="min-h-screen bg-medical-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-medical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-medical-800">SleepApnea Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-medical-600">
                Welcome, {user?.name || 'User'}
              </div>
              <button className="p-2 rounded-lg bg-medical-100 text-medical-600 hover:bg-medical-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medical-600">Total Sessions</p>
                <p className="text-2xl font-bold text-medical-800">{reports.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medical-600">Average Risk</p>
                <p className="text-2xl font-bold text-medical-800">
                  {Math.round(averageRisk * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medical-600">Total Events</p>
                <p className="text-2xl font-bold text-medical-800">{totalEvents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-danger-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medical-600">Risk Level</p>
                <p className={`text-2xl font-bold text-${riskLevel.color}-600`}>
                  {riskLevel.level}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-success-600" />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-medical-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'record', label: 'Record Audio', icon: Activity },
                { id: 'realtime', label: 'Real-time', icon: Zap },
                { id: 'history', label: 'History', icon: Clock },
                { id: 'profile', label: 'Profile', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-medical-500 hover:text-medical-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Record Tab */}
            {activeTab === 'record' && (
              <div className="space-y-8">
                {/* Detection Mode Selector */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Mode</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setDetectionMode('batch')}
                      className={`px-6 py-3 rounded-lg transition-colors ${
                        detectionMode === 'batch'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FileText className="w-5 h-5 inline mr-2" />
                      Batch Analysis
                    </button>
                    <button
                      onClick={() => setDetectionMode('realtime')}
                      className={`px-6 py-3 rounded-lg transition-colors ${
                        detectionMode === 'realtime'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Zap className="w-5 h-5 inline mr-2" />
                      Real-time Monitoring
                    </button>
                  </div>
                </div>

                {detectionMode === 'batch' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Recorder
                      onAnalysisComplete={handleAnalysisComplete}
                      onError={handleError}
                      userId={user?.id}
                    />

                    {currentAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        {/* Risk Gauge */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            Apnea Risk Assessment
                          </h3>
                          <div className="flex justify-center">
                            <RiskGauge riskScore={currentAnalysis.risk_score} size={200} />
                          </div>
                        </div>

                        {/* Enhanced Spectrogram */}
                        <EnhancedSpectrogram
                          events={currentAnalysis.events}
                          duration={currentAnalysis.duration}
                          isPlaying={isPlaying}
                          currentTime={currentTime}
                          onPlay={handlePlay}
                          onPause={handlePause}
                          onSeek={handleSeek}
                          onReset={handleReset}
                          onEventClick={setSelectedEvent}
                        />

                        {/* Sleep Score */}
                        <SleepScore
                          events={currentAnalysis.events || []}
                          duration={currentAnalysis.duration}
                          riskScore={currentAnalysis.risk_score}
                        />

                        {/* Apnea Event Table */}
                        <ApneaEventTable
                          events={currentAnalysis.events || []}
                          duration={currentAnalysis.duration}
                          onEventClick={setSelectedEvent}
                          onPlayEvent={(event) => {
                            handleSeek(event.start);
                            handlePlay();
                          }}
                        />

                        {/* Enhanced Analysis Results with Health Recommendations */}
                        {currentAnalysis.segment_results && currentAnalysis.overall_analysis ? (
                          <div className="space-y-8">
                            <EnhancedAnalysisResults
                              segmentResults={currentAnalysis.segment_results}
                              overallAnalysis={currentAnalysis.overall_analysis}
                              spectrogramImage={currentAnalysis.spectrogram_image}
                              duration={currentAnalysis.duration}
                              totalEvents={currentAnalysis.total_events}
                              riskScore={currentAnalysis.risk_score}
                            />
                            
                            <HealthRecommendations
                              severity={currentAnalysis.overall_analysis.severity}
                              primaryCondition={currentAnalysis.overall_analysis.primary_respiratory_condition}
                              apneaPercentage={currentAnalysis.overall_analysis.apnea_percentage}
                              comprehensiveSuggestions={currentAnalysis.overall_analysis.comprehensive_suggestions}
                            />
                            
                            <VisualizationDashboard
                              segmentResults={currentAnalysis.segment_results}
                              overallAnalysis={currentAnalysis.overall_analysis}
                              spectrogramImage={currentAnalysis.spectrogram_image}
                              duration={currentAnalysis.duration}
                            />
                          </div>
                        ) : (
                          <EnhancedAnalysisResults 
                            analysis={currentAnalysis}
                            onDownloadReport={() => {
                              // Handle report download
                              console.log('Download report');
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <RealtimeDetection 
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                )}
              </div>
            )}

            {/* Real-time Tab */}
            {activeTab === 'realtime' && (
              <RealtimeDetection 
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-medical-800">
                    Analysis History
                  </h3>
                  <button className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {reports.map((report, index) => {
                    const reportRiskLevel = getRiskLevel(report.risk_score);
                    return (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full bg-${reportRiskLevel.color}-500`} />
                            <div>
                              <h4 className="font-semibold text-medical-800">
                                Session {index + 1}
                              </h4>
                              <p className="text-sm text-medical-600">
                                {formatDate(report.created_at)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-lg font-bold text-medical-800">
                                {Math.round(report.risk_score * 100)}%
                              </div>
                              <div className="text-xs text-medical-600">Risk</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-medical-800">
                                {report.total_events}
                              </div>
                              <div className="text-xs text-medical-600">Events</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${reportRiskLevel.color}-100 text-${reportRiskLevel.color}-800`}>
                              {reportRiskLevel.level}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-medical-800 mb-6">
                  User Profile
                </h3>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-medical-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-medical-700 mb-2">
                          Gender
                        </label>
                        <select className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <option>Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Sleep History Notes
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any relevant sleep history or medical conditions..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button className="px-6 py-2 border border-medical-300 text-medical-700 rounded-lg hover:bg-medical-50 transition-colors">
                        Cancel
                      </button>
                      <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
