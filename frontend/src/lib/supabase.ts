import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Some features may not work.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor';
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  age?: number;
  gender?: string;
  bmi?: number;
  sleep_history?: string;
}

export interface Session {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  audio_path?: string;
  duration: number;
  device_meta: Record<string, any>;
}

export interface Report {
  id: string;
  session_id: string;
  risk_score: number;
  events: any[];
  model_version: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  report_id: string;
  type: string;
  message: string;
  sent_at: string;
}

// Auth functions
export const signUp = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  
  if (error) throw error;
  return data;
};

export const signUpWithGoogle = async () => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database functions
export const createUser = async (userData: Partial<User>) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUser = async (userId: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const createProfile = async (profileData: Partial<Profile>) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, profileData: Partial<Profile>) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const createSession = async (sessionData: Partial<Session>) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserSessions = async (userId: string, limit: number = 20) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const createReport = async (reportData: Partial<Report>) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('reports')
    .insert(reportData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserReports = async (userId: string, limit: number = 10) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      sessions!inner(user_id)
    `)
    .eq('sessions.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const createNotification = async (notificationData: Partial<Notification>) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserNotifications = async (userId: string, limit: number = 20) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};
