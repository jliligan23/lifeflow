-- ============================================================
-- LifeFlow — Blood Donor Registration System
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  blood_type TEXT CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-','unknown')),
  barangay TEXT,
  phone TEXT,
  is_available BOOLEAN DEFAULT true,
  privacy_enabled BOOLEAN DEFAULT false,
  consent_given BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'donor' CHECK (role IN ('donor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DONATION HISTORY TABLE
-- ============================================================
CREATE TABLE public.donation_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  donation_date DATE NOT NULL,
  location TEXT,
  verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOOD REQUESTS TABLE
-- ============================================================
CREATE TABLE public.blood_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blood_type TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal','urgent','critical')),
  hospital TEXT,
  barangay TEXT,
  contact_person TEXT,
  contact_number TEXT,
  posted_by UUID REFERENCES public.profiles(id),
  is_fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACCEPTANCE SURVEY TABLE (Likert Scale for Thesis)
-- ============================================================
CREATE TABLE public.survey_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  respondent_id UUID REFERENCES public.profiles(id),
  q1_ease_of_use INTEGER CHECK (q1_ease_of_use BETWEEN 1 AND 5),
  q2_usefulness INTEGER CHECK (q2_usefulness BETWEEN 1 AND 5),
  q3_satisfaction INTEGER CHECK (q3_satisfaction BETWEEN 1 AND 5),
  q4_recommendation INTEGER CHECK (q4_recommendation BETWEEN 1 AND 5),
  q5_overall INTEGER CHECK (q5_overall BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Public profiles viewable by all (non-private)"
  ON profiles FOR SELECT
  USING (privacy_enabled = false OR auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- DONATION HISTORY Policies
CREATE POLICY "Donors can view own donation history"
  ON donation_history FOR SELECT
  USING (auth.uid() = donor_id);

CREATE POLICY "Donors can insert own donation records"
  ON donation_history FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Admins can manage all donation records"
  ON donation_history FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- BLOOD REQUESTS Policies
CREATE POLICY "Blood requests are publicly viewable"
  ON blood_requests FOR SELECT USING (true);

CREATE POLICY "Admins can manage blood requests"
  ON blood_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SURVEY Policies
CREATE POLICY "Users can submit survey once"
  ON survey_responses FOR INSERT
  WITH CHECK (auth.uid() = respondent_id);

CREATE POLICY "Admins can view all survey responses"
  ON survey_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- AUTO-CREATE PROFILE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, blood_type, consent_given)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'blood_type', 'unknown'),
    COALESCE((NEW.raw_user_meta_data->>'consent_given')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();