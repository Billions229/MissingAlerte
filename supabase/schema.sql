-- Missing Alert Database Schema
-- This file contains the SQL schema for the Missing Alert application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM ('family', 'volunteer');
CREATE TYPE missing_person_status AS ENUM ('active', 'found', 'closed');
CREATE TYPE alert_status AS ENUM ('active', 'resolved', 'false_alarm');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    user_type user_type NOT NULL DEFAULT 'family',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missing persons table
CREATE TABLE IF NOT EXISTS missing_persons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    description TEXT,
    last_seen_location TEXT,
    last_seen_date TIMESTAMP WITH TIME ZONE,
    photo_url TEXT,
    additional_photos TEXT[], -- Array of photo URLs
    physical_description TEXT,
    clothing_description TEXT,
    medical_conditions TEXT,
    contact_info TEXT,
    status missing_person_status DEFAULT 'active',
    priority_level INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=urgent
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table (for broadcasting missing person alerts)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    missing_person_id UUID REFERENCES missing_persons(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    location_radius INTEGER DEFAULT 10, -- Radius in kilometers
    target_location POINT, -- Geographic point for targeting
    status alert_status DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sightings table (for reporting sightings of missing persons)
CREATE TABLE IF NOT EXISTS sightings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    missing_person_id UUID REFERENCES missing_persons(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    location_coordinates POINT,
    description TEXT,
    photo_url TEXT,
    sighting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table (for managing volunteer assignments)
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    missing_person_id UUID REFERENCES missing_persons(id) ON DELETE CASCADE NOT NULL,
    assigned_area TEXT,
    assigned_coordinates POINT,
    status TEXT DEFAULT 'assigned', -- assigned, active, completed, unavailable
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, missing_person_id)
);

-- Search activities table (for tracking search efforts)
CREATE TABLE IF NOT EXISTS search_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    missing_person_id UUID REFERENCES missing_persons(id) ON DELETE CASCADE NOT NULL,
    volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- search, distribution, coordination, etc.
    location TEXT,
    location_coordinates POINT,
    description TEXT,
    duration_minutes INTEGER,
    result TEXT, -- found, no_result, clue_found, etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- alert, sighting, update, system
    related_id UUID, -- Can reference missing_person, sighting, etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_missing_persons_status ON missing_persons(status);
CREATE INDEX IF NOT EXISTS idx_missing_persons_reporter ON missing_persons(reporter_id);
CREATE INDEX IF NOT EXISTS idx_missing_persons_created_at ON missing_persons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_missing_person ON alerts(missing_person_id);
CREATE INDEX IF NOT EXISTS idx_sightings_missing_person ON sightings(missing_person_id);
CREATE INDEX IF NOT EXISTS idx_sightings_created_at ON sightings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteers_profile ON volunteers(profile_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_missing_person ON volunteers(missing_person_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missing_persons_updated_at BEFORE UPDATE ON missing_persons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sightings_updated_at BEFORE UPDATE ON sightings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missing_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Missing persons policies
CREATE POLICY "Anyone can view active missing persons" ON missing_persons FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create missing person reports" ON missing_persons FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reporters can update their own reports" ON missing_persons FOR UPDATE USING (auth.uid() = reporter_id);

-- Sightings policies
CREATE POLICY "Anyone can view sightings" ON sightings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sightings" ON sightings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own sightings" ON sightings FOR UPDATE USING (auth.uid() = reporter_id);

-- Volunteers policies
CREATE POLICY "Volunteers can view their assignments" ON volunteers FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can volunteer for cases" ON volunteers FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Volunteers can update their status" ON volunteers FOR UPDATE USING (auth.uid() = profile_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Functions for common operations

-- Function to create a new missing person alert
CREATE OR REPLACE FUNCTION create_missing_person_alert(
    p_missing_person_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_location_radius INTEGER DEFAULT 10
)
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
BEGIN
    INSERT INTO alerts (missing_person_id, created_by, title, message, location_radius)
    VALUES (p_missing_person_id, auth.uid(), p_title, p_message, p_location_radius)
    RETURNING id INTO alert_id;
    
    RETURN alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify volunteers in area
CREATE OR REPLACE FUNCTION notify_volunteers_in_area(
    p_missing_person_id UUID,
    p_notification_title TEXT,
    p_notification_message TEXT
)
RETURNS INTEGER AS $$
DECLARE
    notification_count INTEGER := 0;
    volunteer_record RECORD;
BEGIN
    -- Insert notifications for all volunteers with user_type = 'volunteer'
    INSERT INTO notifications (user_id, title, message, type, related_id)
    SELECT 
        p.id,
        p_notification_title,
        p_notification_message,
        'alert',
        p_missing_person_id
    FROM profiles p
    WHERE p.user_type = 'volunteer' AND p.is_verified = true;
    
    GET DIAGNOSTICS notification_count = ROW_COUNT;
    
    RETURN notification_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
