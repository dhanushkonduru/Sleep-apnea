'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, User, Mail, Calendar } from 'lucide-react';
import { getCurrentUser, signInWithGoogle, signOut } from '../lib/supabase';

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setTesting(true);
    addTestResult('Starting Google OAuth flow...', 'info');
    
    try {
      await signInWithGoogle();
      addTestResult('Google OAuth redirect initiated', 'success');
    } catch (error: any) {
      addTestResult(`Google OAuth failed: ${error.message}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSignOut = async () => {
    setTesting(true);
    addTestResult('Signing out...', 'info');
    
    try {
      await signOut();
      setUser(null);
      addTestResult('Successfully signed out', 'success');
    } catch (error: any) {
      addTestResult(`Sign out failed: ${error.message}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  const addTestResult = (message: string, type: 'success' | 'error' | 'info') => {
    const result = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Google OAuth Integration Test
            </h1>
            <p className="text-gray-600">
              Test the Google sign-in/sign-up functionality
            </p>
          </div>

          {/* User Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-medium text-green-800">Authenticated</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">
                      <strong>ID:</strong> {user.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">
                      <strong>Email:</strong> {user.email}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">
                      <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  {user.app_metadata?.provider && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700">
                        <strong>Provider:</strong> {user.app_metadata.provider}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <XCircle className="w-6 h-6 text-yellow-600" />
                  <span className="text-lg font-medium text-yellow-800">Not Authenticated</span>
                </div>
                <p className="text-yellow-700">
                  You are not currently signed in. Use the buttons below to test authentication.
                </p>
              </motion.div>
            )}
          </div>

          {/* Test Controls */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Controls</h2>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={testing}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {testing ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span>Test Google Sign-In</span>
                </button>
              ) : (
                <button
                  onClick={handleSignOut}
                  disabled={testing}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {testing ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span>Sign Out</span>
                </button>
              )}
              
              <button
                onClick={checkAuthStatus}
                disabled={testing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Loader className="w-5 h-5" />
                <span>Refresh Status</span>
              </button>
              
              <button
                onClick={clearResults}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            {testResults.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No test results yet. Click a test button above to start testing.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      result.type === 'success'
                        ? 'bg-green-50 border-green-400 text-green-800'
                        : result.type === 'error'
                        ? 'bg-red-50 border-red-400 text-red-800'
                        : 'bg-blue-50 border-blue-400 text-blue-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{result.message}</span>
                      <span className="text-xs opacity-75">{result.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Testing Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Make sure your Supabase project has Google OAuth configured</li>
              <li>Ensure your Google OAuth credentials are set up correctly</li>
              <li>Click "Test Google Sign-In" to initiate the OAuth flow</li>
              <li>Complete the Google authentication in the popup/redirect</li>
              <li>Check that you're redirected back and authenticated</li>
              <li>Use "Sign Out" to test the logout functionality</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
