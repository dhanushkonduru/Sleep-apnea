-- Seed data for Sleep Apnea Detection System (FIXED)
-- This file contains sample data for development and testing

-- Insert sample users
INSERT INTO users (id, email, password_hash, role, email_verified, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'patient1@example.com', crypt('password123', gen_salt('bf')), 'patient', true, true),
('22222222-2222-2222-2222-222222222222', 'patient2@example.com', crypt('password123', gen_salt('bf')), 'patient', true, true),
('33333333-3333-3333-3333-333333333333', 'doctor1@example.com', crypt('password123', gen_salt('bf')), 'doctor', true, true),
('44444444-4444-4444-4444-444444444444', 'admin@example.com', crypt('password123', gen_salt('bf')), 'admin', true, true);

-- Insert sample profiles
INSERT INTO profiles (user_id, first_name, last_name, age, gender, bmi, weight_kg, height_cm, sleep_history, medical_conditions) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Doe', 45, 'male', 28.5, 85.0, 175.0, 'Usually sleeps 6-7 hours per night, occasional snoring', 'Mild hypertension'),
('22222222-2222-2222-2222-222222222222', 'Jane', 'Smith', 38, 'female', 24.2, 65.0, 165.0, 'Sleeps 7-8 hours, good sleep quality', 'None'),
('33333333-3333-3333-3333-333333333333', 'Dr. Michael', 'Johnson', 52, 'male', 26.1, 80.0, 180.0, 'Medical professional', 'None'),
('44444444-4444-4444-4444-444444444444', 'Admin', 'User', 30, 'other', 22.0, 70.0, 180.0, 'System administrator', 'None');

-- Insert sample sessions
INSERT INTO sessions (id, user_id, start_time, end_time, duration_seconds, audio_format, sample_rate, device_metadata, recording_quality, background_noise_level) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
 '2024-01-15 22:30:00+00', '2024-01-15 23:15:00+00', 2700, 'wav', 16000, 
 '{"browser": "Chrome", "os": "Windows", "microphone": "Built-in"}', 'good', 'low'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 
 '2024-01-16 23:00:00+00', '2024-01-17 06:30:00+00', 27000, 'wav', 16000,
 '{"browser": "Chrome", "os": "Windows", "microphone": "Built-in"}', 'excellent', 'low'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
 '2024-01-14 21:45:00+00', '2024-01-14 22:30:00+00', 2700, 'wav', 16000,
 '{"browser": "Safari", "os": "macOS", "microphone": "External"}', 'good', 'medium'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 
 '2024-01-13 22:00:00+00', '2024-01-14 05:45:00+00', 27900, 'wav', 16000,
 '{"browser": "Safari", "os": "macOS", "microphone": "External"}', 'excellent', 'low');

-- Insert sample reports
INSERT INTO reports (id, session_id, model_version, risk_score, total_events, events_data, analysis_metadata, processing_time_ms, confidence_threshold) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
 'demo-v1.0', 0.45, 3, 
 '[{"id": "event-1", "start": 12.5, "end": 18.2, "confidence": 0.87, "duration": 5.7, "type": "apnea", "severity": "severe"}, {"id": "event-2", "start": 28.1, "end": 32.8, "confidence": 0.73, "duration": 4.7, "type": "apnea", "severity": "moderate"}, {"id": "event-3", "start": 38.5, "end": 42.1, "confidence": 0.65, "duration": 3.6, "type": "apnea", "severity": "moderate"}]',
 '{"sample_rate": 16000, "n_mels": 128, "n_frames": 270, "window_size": 8}', 2500, 0.5),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
 'demo-v1.0', 0.68, 7, 
 '[{"id": "event-1", "start": 45.2, "end": 52.1, "confidence": 0.92, "duration": 6.9, "type": "apnea", "severity": "severe"}, {"id": "event-2", "start": 128.5, "end": 135.3, "confidence": 0.78, "duration": 6.8, "type": "apnea", "severity": "moderate"}, {"id": "event-3", "start": 245.7, "end": 252.1, "confidence": 0.85, "duration": 6.4, "type": "apnea", "severity": "severe"}, {"id": "event-4", "start": 380.2, "end": 387.8, "confidence": 0.71, "duration": 7.6, "type": "apnea", "severity": "moderate"}, {"id": "event-5", "start": 520.1, "end": 528.3, "confidence": 0.89, "duration": 8.2, "type": "apnea", "severity": "severe"}, {"id": "event-6", "start": 680.5, "end": 688.1, "confidence": 0.76, "duration": 7.6, "type": "apnea", "severity": "moderate"}, {"id": "event-7", "start": 820.3, "end": 828.9, "confidence": 0.83, "duration": 8.6, "type": "apnea", "severity": "severe"}]',
 '{"sample_rate": 16000, "n_mels": 128, "n_frames": 2700, "window_size": 8}', 5200, 0.5),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 
 'demo-v1.0', 0.12, 1, 
 '[{"id": "event-1", "start": 15.3, "end": 18.7, "confidence": 0.45, "duration": 3.4, "type": "apnea", "severity": "mild"}]',
 '{"sample_rate": 16000, "n_mels": 128, "n_frames": 270, "window_size": 8}', 1800, 0.5),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 
 'demo-v1.0', 0.23, 2, 
 '[{"id": "event-1", "start": 125.4, "end": 132.1, "confidence": 0.58, "duration": 6.7, "type": "apnea", "severity": "moderate"}, {"id": "event-2", "start": 340.8, "end": 347.2, "confidence": 0.62, "duration": 6.4, "type": "apnea", "severity": "moderate"}]',
 '{"sample_rate": 16000, "n_mels": 128, "n_frames": 2790, "window_size": 8}', 3200, 0.5);

-- Insert sample apnea events (normalized from reports)
INSERT INTO apnea_events (report_id, start_time, end_time, confidence, severity, event_type) VALUES
-- Events from first report
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 12.5, 18.2, 0.87, 'severe', 'apnea'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 28.1, 32.8, 0.73, 'moderate', 'apnea'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 38.5, 42.1, 0.65, 'moderate', 'apnea'),
-- Events from second report
('ffffffff-ffff-ffff-ffff-ffffffffffff', 45.2, 52.1, 0.92, 'severe', 'apnea'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 128.5, 135.3, 0.78, 'moderate', 'apnea'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 245.7, 252.1, 0.85, 'severe', 'apnea'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 380.2, 387.8, 0.71, 'moderate', 'apnea'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 520.1, 528.3, 0.89, 'severe', 'apnea'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 680.5, 688.1, 0.76, 'moderate', 'apnea'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 820.3, 828.9, 0.83, 'severe', 'apnea'),
-- Events from third report
('gggggggg-gggg-gggg-gggg-gggggggggggg', 15.3, 18.7, 0.45, 'mild', 'apnea'),
-- Events from fourth report
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 125.4, 132.1, 0.58, 'moderate', 'apnea'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhh', 340.8, 347.2, 0.62, 'moderate', 'apnea');

-- Insert sample notifications
INSERT INTO notifications (user_id, report_id, type, title, message, is_read, sent_at, delivery_method, delivery_status) VALUES
('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 
 'analysis_complete', 'Analysis Complete', 'Your sleep analysis is ready. 3 apnea events detected with moderate risk.', 
 false, '2024-01-15 23:20:00+00', 'in_app', 'delivered'),
('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 
 'high_risk_alert', 'High Risk Alert', 'High apnea risk detected: 7 events with severe risk level. Please consult a healthcare professional.', 
 false, '2024-01-17 06:35:00+00', 'email', 'delivered'),
('22222222-2222-2222-2222-222222222222', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 
 'analysis_complete', 'Analysis Complete', 'Your sleep analysis is ready. 1 mild apnea event detected with low risk.', 
 true, '2024-01-14 22:35:00+00', 'in_app', 'delivered'),
('22222222-2222-2222-2222-222222222222', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 
 'analysis_complete', 'Analysis Complete', 'Your sleep analysis is ready. 2 moderate apnea events detected with low risk.', 
 false, '2024-01-14 05:50:00+00', 'in_app', 'delivered');

-- Insert sample user preferences
INSERT INTO user_preferences (user_id, notification_email, notification_sms, notification_push, risk_threshold, analysis_reminder_frequency, data_retention_days, share_data_for_research) VALUES
('11111111-1111-1111-1111-111111111111', true, false, true, 0.5, 'weekly', 365, false),
('22222222-2222-2222-2222-222222222222', true, true, true, 0.3, 'monthly', 180, true),
('33333333-3333-3333-3333-333333333333', true, false, false, 0.6, 'never', 730, false),
('44444444-4444-4444-4444-444444444444', true, false, true, 0.4, 'daily', 365, false);

-- Insert sample audit log entries
INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id) VALUES
('users', '11111111-1111-1111-1111-111111111111', 'INSERT', NULL, '{"email": "patient1@example.com", "role": "patient"}', '11111111-1111-1111-1111-111111111111'),
('profiles', '11111111-1111-1111-1111-111111111111', 'INSERT', NULL, '{"first_name": "John", "last_name": "Doe", "age": 45}', '11111111-1111-1111-1111-111111111111'),
('sessions', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INSERT', NULL, '{"user_id": "11111111-1111-1111-1111-111111111111", "duration_seconds": 2700}', '11111111-1111-1111-1111-111111111111'),
('reports', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'INSERT', NULL, '{"risk_score": 0.45, "total_events": 3}', '11111111-1111-1111-1111-111111111111');

-- Update sequences to avoid conflicts
SELECT setval('users_id_seq', 1000);
SELECT setval('profiles_id_seq', 1000);
SELECT setval('sessions_id_seq', 1000);
SELECT setval('reports_id_seq', 1000);
SELECT setval('apnea_events_id_seq', 1000);
SELECT setval('notifications_id_seq', 1000);
SELECT setval('user_preferences_id_seq', 1000);
SELECT setval('audit_log_id_seq', 1000);
