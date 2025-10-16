'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';
import { ApneaEvent } from '../lib/api';

interface ApneaEventTableProps {
  events: ApneaEvent[];
  duration: number;
  onEventClick?: (event: ApneaEvent) => void;
  onPlayEvent?: (event: ApneaEvent) => void;
  className?: string;
}

export default function ApneaEventTable({ 
  events, 
  duration, 
  onEventClick, 
  onPlayEvent,
  className = '' 
}: ApneaEventTableProps) {
  const [sortBy, setSortBy] = useState<'time' | 'duration' | 'confidence'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (riskScore: number) => {
    if (riskScore < 0.3) return 'text-green-600 bg-green-100';
    if (riskScore < 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityLabel = (riskScore: number) => {
    if (riskScore < 0.3) return 'Low';
    if (riskScore < 0.7) return 'Moderate';
    return 'High';
  };

  const sortedEvents = [...events].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'time':
        aValue = a.start;
        bValue = b.start;
        break;
      case 'duration':
        aValue = a.end - a.start;
        bValue = b.end - b.start;
        break;
      case 'confidence':
        aValue = a.confidence;
        bValue = b.confidence;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Event #', 'Start Time', 'End Time', 'Duration (s)', 'Risk Score (%)', 'Severity'];
    const csvContent = [
      headers.join(','),
      ...sortedEvents.map((event, index) => [
        index + 1,
        event.start.toFixed(1),
        event.end.toFixed(1),
        (event.end - event.start).toFixed(1),
        (event.confidence * 100).toFixed(1),
        getSeverityLabel(event.confidence)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apnea-events-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (events.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Apnea Events Detected</h3>
          <p className="text-gray-600">Great news! No breathing interruptions were found in this recording.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Apnea Event Summary
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{events.length}</div>
          <div className="text-sm text-blue-700">Total Events</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-900">
            {formatTime(events.reduce((sum, event) => sum + (event.end - event.start), 0))}
          </div>
          <div className="text-sm text-yellow-700">Total Duration</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-900">
            {Math.round((events.reduce((sum, event) => sum + (event.end - event.start), 0) / duration) * 100)}%
          </div>
          <div className="text-sm text-red-700">Time in Apnea</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-900">
            {Math.round(events.reduce((sum, event) => sum + event.confidence, 0) / events.length * 100)}%
          </div>
          <div className="text-sm text-purple-700">Avg Confidence</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Event #</th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('time')}
              >
                <div className="flex items-center space-x-1">
                  <span>Timestamp</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center space-x-1">
                  <span>Duration</span>
                  <Clock className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex items-center space-x-1">
                  <span>Risk Score</span>
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Severity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event, index) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-700">{index + 1}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </div>
                    <div className="text-gray-500">
                      {((event.end - event.start) / 60).toFixed(1)} min
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(event.end - event.start)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {(event.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${event.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.confidence)}`}>
                    {getSeverityLabel(event.confidence)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEventClick?.(event)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="View Event"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPlayEvent?.(event)}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Play Event"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
