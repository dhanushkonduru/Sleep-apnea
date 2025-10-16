import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AudioUploadResponse {
  status: string;
  job_id: string;
  duration: number;
  events: ApneaEvent[];
  risk_score: number;
  risk_level: string;
  total_events: number;
  spectrogram_image: string;
  model_version: string;
  analysis_metadata: {
    sample_rate: number;
    n_mels: number;
    n_frames: number;
    window_size: number;
  };
}

export interface ApneaEvent {
  id: string;
  start: number;
  end: number;
  confidence: number;
  duration: number;
  type: string;
  severity: string;
}

export interface UserReport {
  id: string;
  risk_score: number;
  total_events: number;
  created_at: string;
  events: ApneaEvent[];
}

export interface UserSession {
  id: string;
  duration: number;
  created_at: string;
  device_meta: {
    browser?: string;
    os?: string;
  };
}

export interface UserProfile {
  age?: number;
  gender?: string;
  bmi?: number;
  sleep_history?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout: 30000, // 30 second timeout
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with error status
        throw new Error(
          error.response.data?.detail || 
          error.response.data?.error || 
          `HTTP ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error: Unable to connect to server');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  async uploadAudio(
    file: Blob,
    userId?: string,
    sessionId?: string
  ): Promise<AudioUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, 'recording.wav');
    
    if (userId) {
      formData.append('user_id', userId);
    }
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    return this.request<AudioUploadResponse>(
      'POST',
      '/api/v1/audio/upload',
      formData,
      { 'Content-Type': 'multipart/form-data' }
    );
  }

  async getUserReports(userId: string, limit: number = 10): Promise<{
    status: string;
    user_id: string;
    reports: UserReport[];
    total: number;
  }> {
    return this.request('GET', `/api/v1/reports/${userId}?limit=${limit}`);
  }

  async getUserSessions(userId: string, limit: number = 20): Promise<{
    status: string;
    user_id: string;
    sessions: UserSession[];
    total: number;
  }> {
    return this.request('GET', `/api/v1/sessions/${userId}?limit=${limit}`);
  }

  async updateUserProfile(userId: string, profile: UserProfile): Promise<{
    status: string;
    message: string;
  }> {
    return this.request('PUT', `/api/v1/profile/${userId}`, profile);
  }

  async sendNotification(
    userId: string,
    reportId: string,
    messageType: string,
    message: string
  ): Promise<{
    status: string;
    notification_id: string;
    message: string;
  }> {
    return this.request('POST', '/api/v1/notify', {
      user_id: userId,
      report_id: reportId,
      message_type: messageType,
      message: message,
    });
  }

  async healthCheck(): Promise<{
    message: string;
    version: string;
    status: string;
  }> {
    return this.request('GET', '/');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual functions for convenience
export const uploadAudio = (file: Blob, userId?: string, sessionId?: string) =>
  apiClient.uploadAudio(file, userId, sessionId);

export const getUserReports = (userId: string, limit?: number) =>
  apiClient.getUserReports(userId, limit);

export const getUserSessions = (userId: string, limit?: number) =>
  apiClient.getUserSessions(userId, limit);

export const updateUserProfile = (userId: string, profile: UserProfile) =>
  apiClient.updateUserProfile(userId, profile);

export const sendNotification = (
  userId: string,
  reportId: string,
  messageType: string,
  message: string
) => apiClient.sendNotification(userId, reportId, messageType, message);

export const healthCheck = () => apiClient.healthCheck();
