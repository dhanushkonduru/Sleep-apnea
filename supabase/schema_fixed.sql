-- Sleep Apnea Detection System Database Schema (FIXED)
-- This file contains the complete database schema for the sleep apnea detection system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE notification_type AS ENUM ('high_risk_alert', 'analysis_complete', 'system_update', 'reminder');
CREATE TYPE event_severity AS ENUM ('low', 'mild', 'moderate', 'severe');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role DEFAULT 'patient',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- User profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INTEGER CHECK (age >= 0 AND age <= 150),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    bmi DECIMAL(5,2) CHECK (bmi >= 10 AND bmi <= 100),
    weight_kg DECIMAL(5,2) CHECK (weight_kg >= 20 AND weight_kg <= 300),
    height_cm DECIMAL(5,2) CHECK (height_cm >= 100 AND height_cm <= 250),
    sleep_history TEXT,
    medical_conditions TEXT,
    medications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Recording sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER CHECK (duration_seconds >= 0),
    audio_file_path TEXT,
    audio_file_size BIGINT,
    audio_format VARCHAR(20),
    sample_rate INTEGER,
    device_metadata JSONB,
    recording_quality VARCHAR(20) CHECK (recording_quality IN ('poor', 'fair', 'good', 'excellent')),
    background_noise_level VARCHAR(20) CHECK (background_noise_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    risk_score DECIMAL(5,4) CHECK (risk_score >= 0 AND risk_score <= 1),
    total_events INTEGER DEFAULT 0 CHECK (total_events >= 0),
    events_data JSONB,
    spectrogram_image_path TEXT,
    analysis_metadata JSONB,
    processing_time_ms INTEGER,
    confidence_threshold DECIMAL(5,4) DEFAULT 0.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apnea events table (normalized from reports.events_data)
CREATE TABLE apnea_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    start_time DECIMAL(10,3) NOT NULL CHECK (start_time >= 0),
    end_time DECIMAL(10,3) NOT NULL CHECK (end_time > start_time),
    duration DECIMAL(10,3) GENERATED ALWAYS AS (end_time - start_time) STORED,
    confidence DECIMAL(5,4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    severity event_severity NOT NULL,
    event_type VARCHAR(50) DEFAULT 'apnea',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed'))
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_push BOOLEAN DEFAULT TRUE,
    risk_threshold DECIMAL(5,4) DEFAULT 0.5,
    analysis_reminder_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (analysis_reminder_frequency IN ('daily', 'weekly', 'monthly', 'never')),
    data_retention_days INTEGER DEFAULT 365,
    share_data_for_research BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Audit log table for tracking changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX idx_reports_session_id ON reports(session_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_apnea_events_report_id ON apnea_events(report_id);
CREATE INDEX idx_apnea_events_confidence ON apnea_events(confidence);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at DESC);
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user's overall risk score
CREATE OR REPLACE FUNCTION calculate_user_risk_score(p_user_id UUID)
RETURNS DECIMAL(5,4) AS $$
DECLARE
    avg_risk_score DECIMAL(5,4);
BEGIN
    SELECT AVG(r.risk_score) INTO avg_risk_score
    FROM reports r
    JOIN sessions s ON r.session_id = s.id
    WHERE s.user_id = p_user_id
    AND r.created_at >= NOW() - INTERVAL '30 days';
    
    RETURN COALESCE(avg_risk_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get user's recent activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(p_user_id UUID)
RETURNS TABLE (
    total_sessions BIGINT,
    total_events BIGINT,
    avg_risk_score DECIMAL(5,4),
    last_analysis_date TIMESTAMP WITH TIME ZONE,
    risk_trend VARCHAR(20)
) AS $$
DECLARE
    recent_avg DECIMAL(5,4);
    older_avg DECIMAL(5,4);
BEGIN
    -- Get basic counts
    SELECT 
        COUNT(s.id),
        COALESCE(SUM(r.total_events), 0),
        AVG(r.risk_score),
        MAX(r.created_at)
    INTO 
        total_sessions,
        total_events,
        avg_risk_score,
        last_analysis_date
    FROM sessions s
    LEFT JOIN reports r ON s.id = r.session_id
    WHERE s.user_id = p_user_id;
    
    -- Calculate risk trend
    SELECT AVG(r.risk_score) INTO recent_avg
    FROM reports r
    JOIN sessions s ON r.session_id = s.id
    WHERE s.user_id = p_user_id
    AND r.created_at >= NOW() - INTERVAL '7 days';
    
    SELECT AVG(r.risk_score) INTO older_avg
    FROM reports r
    JOIN sessions s ON r.session_id = s.id
    WHERE s.user_id = p_user_id
    AND r.created_at >= NOW() - INTERVAL '14 days'
    AND r.created_at < NOW() - INTERVAL '7 days';
    
    risk_trend := CASE
        WHEN recent_avg > older_avg + 0.1 THEN 'increasing'
        WHEN recent_avg < older_avg - 0.1 THEN 'decreasing'
        ELSE 'stable'
    END;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE apnea_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profiles" ON profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reports" ON reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM sessions s 
            WHERE s.id = reports.session_id 
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own apnea events" ON apnea_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM reports r
            JOIN sessions s ON r.session_id = s.id
            WHERE r.id = apnea_events.report_id
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, role, email_verified) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@sleepapnea.ai', 
 crypt('admin123', gen_salt('bf')), 'admin', true);

-- Insert sample user preferences
INSERT INTO user_preferences (user_id, notification_email, notification_sms, notification_push)
SELECT id, true, false, true FROM users WHERE role = 'patient';

-- Create views for easier querying
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.email,
    u.role,
    u.created_at,
    p.first_name,
    p.last_name,
    p.age,
    p.gender,
    calculate_user_risk_score(u.id) as overall_risk_score,
    (SELECT COUNT(*) FROM sessions WHERE user_id = u.id) as total_sessions,
    (SELECT COUNT(*) FROM reports r JOIN sessions s ON r.session_id = s.id WHERE s.user_id = u.id) as total_reports
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id;

CREATE VIEW recent_analyses AS
SELECT 
    r.id,
    r.risk_score,
    r.total_events,
    r.created_at,
    s.user_id,
    s.duration_seconds,
    s.recording_quality
FROM reports r
JOIN sessions s ON r.session_id = s.id
WHERE r.created_at >= NOW() - INTERVAL '7 days'
ORDER BY r.created_at DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', false);

-- Storage policies
CREATE POLICY "Users can upload their own audio files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own audio files" ON storage.objects
    FOR SELECT USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio files" ON storage.objects
    FOR DELETE USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts for the sleep apnea detection system';
COMMENT ON TABLE profiles IS 'Extended user profile information including medical data';
COMMENT ON TABLE sessions IS 'Audio recording sessions with metadata';
COMMENT ON TABLE reports IS 'Analysis reports generated from audio sessions';
COMMENT ON TABLE apnea_events IS 'Individual apnea events detected within reports';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE user_preferences IS 'User settings and preferences';
COMMENT ON TABLE audit_log IS 'Audit trail for data changes';

COMMENT ON FUNCTION calculate_user_risk_score(UUID) IS 'Calculates overall risk score for a user based on recent reports';
COMMENT ON FUNCTION get_user_activity_summary(UUID) IS 'Returns comprehensive activity summary for a user';
