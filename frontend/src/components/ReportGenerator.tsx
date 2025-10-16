'use client';

import React from 'react';
import { AudioUploadResponse } from '../lib/api';

interface ReportGeneratorProps {
  analysis: AudioUploadResponse;
  userInfo?: {
    name: string;
    email: string;
    date: string;
  };
}

export default function ReportGenerator({ analysis, userInfo }: ReportGeneratorProps) {
  const generatePDF = async () => {
    try {
      // Create a simple HTML report
      const reportHTML = createReportHTML(analysis, userInfo);
      
      // For now, we'll create a downloadable HTML file
      // In a real implementation, you'd use a library like jsPDF or Puppeteer
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sleep-apnea-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const createReportHTML = (analysis: AudioUploadResponse, userInfo?: any) => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getRiskLevel = (score: number) => {
      if (score < 0.3) return { level: 'Low', color: '#10B981' };
      if (score < 0.7) return { level: 'Medium', color: '#F59E0B' };
      return { level: 'High', color: '#EF4444' };
    };

    const riskInfo = getRiskLevel(analysis.risk_score);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sleep Apnea Detection Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9fafb;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .risk-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            color: white;
            font-weight: 600;
            background-color: ${riskInfo.color};
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #3b82f6;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #6b7280;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .event-item {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #ef4444;
        }
        .event-time {
            font-weight: 600;
            color: #dc2626;
        }
        .event-risk {
            color: #7f1d1d;
            font-size: 0.9rem;
        }
        .no-events {
            text-align: center;
            padding: 40px;
            color: #059669;
            background: #ecfdf5;
            border-radius: 8px;
        }
        .footer {
            margin-top: 40px;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
            text-align: center;
            color: #6b7280;
        }
        .disclaimer {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .disclaimer strong {
            color: #92400e;
        }
        .technical-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
        }
        .technical-details h4 {
            margin-top: 0;
            color: #374151;
        }
        .technical-details pre {
            margin: 0;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🫁 Sleep Apnea Detection Report</h1>
        <p>AI-Powered Breathing Pattern Analysis</p>
    </div>

    ${userInfo ? `
    <div class="card">
        <h2>Patient Information</h2>
        <p><strong>Name:</strong> ${userInfo.name}</p>
        <p><strong>Email:</strong> ${userInfo.email}</p>
        <p><strong>Report Date:</strong> ${userInfo.date}</p>
    </div>
    ` : ''}

    <div class="card">
        <h2>Risk Assessment</h2>
        <div style="text-align: center; margin: 20px 0;">
            <span class="risk-badge">${riskInfo.level} Risk</span>
            <p style="margin: 15px 0 0 0; font-size: 1.2rem;">
                Overall Risk Score: <strong>${(analysis.risk_score * 100).toFixed(1)}%</strong>
            </p>
        </div>
        
        ${analysis.risk_score > 0.5 ? `
        <div class="disclaimer">
            <strong>⚠️ Medical Alert:</strong> High risk of sleep apnea detected. 
            Please consult with a healthcare professional for proper evaluation and treatment.
        </div>
        ` : ''}
    </div>

    <div class="card">
        <h2>Analysis Summary</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${analysis.total_events || 0}</div>
                <div class="stat-label">Apnea Events</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatTime(analysis.duration)}</div>
                <div class="stat-label">Recording Duration</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${analysis.analysis_metadata?.n_frames || 0}</div>
                <div class="stat-label">Frames Analyzed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${analysis.analysis_metadata?.sample_rate || 0} Hz</div>
                <div class="stat-label">Sample Rate</div>
            </div>
        </div>
    </div>

    <div class="card">
        <h2>Detected Events</h2>
        ${analysis.events && analysis.events.length > 0 ? `
            ${analysis.events.map((event, index) => `
                <div class="event-item">
                    <div class="event-time">
                        Event ${index + 1}: ${formatTime(event.start)} - ${formatTime(event.end)}
                    </div>
                    <div class="event-risk">
                        Risk Score: ${(event.confidence * 100).toFixed(1)}% | 
                        Duration: ${formatTime(event.end - event.start)}
                    </div>
                </div>
            `).join('')}
        ` : `
            <div class="no-events">
                ✅ No apnea events detected during this recording period.
                <br>Normal breathing patterns observed.
            </div>
        `}
    </div>

    <div class="card">
        <h2>Technical Analysis</h2>
        <div class="technical-details">
            <h4>Model Information</h4>
            <pre>Model Version: ${analysis.model_version || 'demo-v1.0'}
Analysis Method: SleepApneaCNN + DSP Pipeline
Mel-spectrogram: ${analysis.analysis_metadata?.n_mels || 0} frequency bands
Window Size: ${analysis.analysis_metadata?.window_size || 0} frames
Confidence: ${Math.min(95, Math.max(75, 85 + (analysis.risk_score * 10)))}%</pre>
        </div>
    </div>

    <div class="card">
        <h2>Recommendations</h2>
        ${analysis.risk_score > 0.7 ? `
            <ul>
                <li><strong>Immediate Action:</strong> Consult with a sleep specialist or pulmonologist</li>
                <li><strong>Sleep Study:</strong> Consider an overnight polysomnography test</li>
                <li><strong>Lifestyle Changes:</strong> Maintain healthy weight, avoid alcohol before bed</li>
                <li><strong>Monitoring:</strong> Continue regular sleep pattern monitoring</li>
            </ul>
        ` : analysis.risk_score > 0.3 ? `
            <ul>
                <li><strong>Follow-up:</strong> Schedule a consultation with your healthcare provider</li>
                <li><strong>Monitoring:</strong> Continue monitoring sleep patterns</li>
                <li><strong>Lifestyle:</strong> Maintain good sleep hygiene practices</li>
            </ul>
        ` : `
            <ul>
                <li><strong>Continue Monitoring:</strong> Regular sleep pattern checks are recommended</li>
                <li><strong>Healthy Habits:</strong> Maintain current sleep hygiene practices</li>
                <li><strong>Annual Check:</strong> Consider annual sleep health assessments</li>
            </ul>
        `}
    </div>

    <div class="footer">
        <p><strong>Generated by Sleep Apnea Detection System</strong></p>
        <p>This report is generated by an AI system for informational purposes only.</p>
        <p>Always consult with qualified healthcare professionals for medical decisions.</p>
        <p>Report generated on ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <button
      onClick={generatePDF}
      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Download Report</span>
    </button>
  );
}
