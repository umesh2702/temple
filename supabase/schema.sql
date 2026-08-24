-- ============================================================
-- Temple Journey — Supabase PostgreSQL Database Schema
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  home_state TEXT DEFAULT 'Andhra Pradesh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create TEMPLES Table
CREATE TABLE IF NOT EXISTS public.temples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  alternate_names TEXT[],
  city TEXT,
  district TEXT,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  description TEXT,
  image_url TEXT,
  category TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create TEMPLE_VISITS Table
CREATE TABLE IF NOT EXISTS public.temple_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  companions TEXT,
  memory TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create VISIT_PHOTOS Table
CREATE TABLE IF NOT EXISTS public.visit_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES public.temple_visits(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles; Users can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Temples: Everyone can view temples; Authenticated users can insert custom temples
CREATE POLICY "Temples are viewable by everyone" ON public.temples
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create custom temples" ON public.temples
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Temple Visits: User can only access/modify their OWN visits
CREATE POLICY "Users can select own temple visits" ON public.temple_visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own temple visits" ON public.temple_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own temple visits" ON public.temple_visits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own temple visits" ON public.temple_visits
  FOR DELETE USING (auth.uid() = user_id);

-- Visit Photos: Accessible only through owned visits
CREATE POLICY "Users can view own visit photos" ON public.visit_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.temple_visits
      WHERE temple_visits.id = visit_photos.visit_id AND temple_visits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own visit photos" ON public.visit_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.temple_visits
      WHERE temple_visits.id = visit_photos.visit_id AND temple_visits.user_id = auth.uid()
    )
  );

-- Notifications: User can only access their own notifications
CREATE POLICY "Users can select own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED SACRED TEMPLES DATASET (30+ Indian Temples)
-- ============================================================
INSERT INTO public.temples (id, name, alternate_names, city, district, state, country, latitude, longitude, description, image_url, category) VALUES
('b1a1a1a1-0000-4000-a000-000000000001', 'Tirumala Venkateswara Temple', ARRAY['Tirupati Balaji', 'Seven Hills Temple'], 'Tirupati', 'Tirupati', 'Andhra Pradesh', 'India', 13.6833, 79.3473, 'One of the most visited and revered Hindu shrines in the world, dedicated to Lord Venkateswara.', 'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=1200&auto=format&fit=crop', 'Divya Desam'),
('b1a1a1a1-0000-4000-a000-000000000002', 'Arunachaleswarar Temple', ARRAY['Annamalaiyar Temple', 'Tiruvannamalai Temple'], 'Tiruvannamalai', 'Tiruvannamalai', 'Tamil Nadu', 'India', 12.2319, 79.0677, 'A magnificent shrine dedicated to Lord Shiva as Agni (fire), situated at the base of Annamalai Hill.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop', 'Shiva Temple'),
('b1a1a1a1-0000-4000-a000-000000000003', 'Meenakshi Amman Temple', ARRAY['Meenakshi Sundareswarar Temple', 'Madurai Meenakshi'], 'Madurai', 'Madurai', 'Tamil Nadu', 'India', 9.9195, 78.1193, 'Historic Dravidian architecture marvel featuring towering colorful gopurams dedicated to Goddess Meenakshi.', 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?q=80&w=1200&auto=format&fit=crop', 'Devi Temple'),
('b1a1a1a1-0000-4000-a000-000000000004', 'Brihadeeswarar Temple', ARRAY['Thanjavur Periya Kovil', 'Big Temple'], 'Thanjavur', 'Thanjavur', 'Tamil Nadu', 'India', 10.7828, 79.1318, 'UNESCO World Heritage Site built by Emperor Raja Raja Chola I in 1010 AD.', 'https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=1200&auto=format&fit=crop', 'Heritage'),
('b1a1a1a1-0000-4000-a000-000000000005', 'Somnath Temple', ARRAY['Deo Patan'], 'Veraval', 'Gir Somnath', 'Gujarat', 'India', 20.8880, 70.4012, 'The first among the 12 holy Jyotirlingas of Lord Shiva, situated right on the shores of the Arabian Sea.', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1200&auto=format&fit=crop', 'Jyotirlingam'),
('b1a1a1a1-0000-4000-a000-000000000006', 'Kedarnath Temple', ARRAY['Kedarnath Dham'], 'Kedarnath', 'Rudraprayag', 'Uttarakhand', 'India', 30.7352, 79.0669, 'High altitude Himalayan shrine located at 3,583 meters above sea level near the Mandakini river.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop', 'Jyotirlingam'),
('b1a1a1a1-0000-4000-a000-000000000007', 'Kashi Vishwanath Temple', ARRAY['Golden Temple of Varanasi'], 'Varanasi', 'Varanasi', 'Uttar Pradesh', 'India', 25.3109, 83.0107, 'One of the most sacred Shiva temples located on the western bank of the holy river Ganga in Varanasi.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop', 'Jyotirlingam'),
('b1a1a1a1-0000-4000-a000-000000000008', 'Sabarimala Sree Dharma Sastha Temple', ARRAY['Sabarimala Ayyappa Temple'], 'Pathanamthitta', 'Pathanamthitta', 'Kerala', 'India', 9.4344, 77.0811, 'Nestled deep inside the Western Ghats mountain ranges, dedicated to Lord Ayyappan.', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop', 'Other'),
('b1a1a1a1-0000-4000-a000-000000000009', 'Jagannath Temple Puri', ARRAY['Puri Jagannath Dham'], 'Puri', 'Puri', 'Odisha', 'India', 19.8049, 85.8179, 'Famous Char Dham pilgrimage destination famous for the grand annual Ratha Yatra.', 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop', 'Vishnu Temple'),
('b1a1a1a1-0000-4000-a000-000000000010', 'Vaishno Devi Temple', ARRAY['Mata Vaishno Devi Shrine'], 'Katra', 'Reasi', 'Jammu & Kashmir', 'India', 33.0308, 74.9490, 'Revered mountain cave shrine dedicated to Mata Vaishno Devi located in Trikuta Mountains.', 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=1200&auto=format&fit=crop', 'Shakti Peetha'),
('b1a1a1a1-0000-4000-a000-000000000011', 'Srisailam Mallikarjuna Temple', ARRAY['Bhramaramba Mallikarjuna Swamy'], 'Srisailam', 'Nandyal', 'Andhra Pradesh', 'India', 16.0745, 78.8687, 'Unique sacred shrine that functions both as a Jyotirlinga for Shiva and a Shakti Peetha for Goddess Bhramaramba.', 'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=1200&auto=format&fit=crop', 'Jyotirlingam'),
('b1a1a1a1-0000-4000-a000-000000000012', 'Kanaka Durga Temple', ARRAY['Vijayawada Durga Temple'], 'Vijayawada', 'NTR', 'Andhra Pradesh', 'India', 16.5186, 80.6074, 'Perched on Indrakeeladri hill on the banks of Krishna River, dedicated to Goddess Kanaka Durga.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop', 'Devi Temple'),
('b1a1a1a1-0000-4000-a000-000000000013', 'Virupaksha Temple', ARRAY['Hampi Virupaksha'], 'Hampi', 'Vijayanagara', 'Karnataka', 'India', 15.3350, 76.4600, 'Part of the UNESCO World Heritage Group of Monuments at Hampi.', 'https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=1200&auto=format&fit=crop', 'Heritage'),
('b1a1a1a1-0000-4000-a000-000000000014', 'Yadadri Lakshmi Narasimha Swamy Temple', ARRAY['Yadagirigutta Temple'], 'Yadagirigutta', 'Yadadri Bhuvanagiri', 'Telangana', 'India', 17.5898, 78.9483, 'Majestic cave shrine reconstructed into a magnificent monolithic granite temple.', 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?q=80&w=1200&auto=format&fit=crop', 'Vishnu Temple'),
('b1a1a1a1-0000-4000-a000-000000000015', 'Badrinath Temple', ARRAY['Badrinarayan Temple'], 'Badrinath', 'Chamoli', 'Uttarakhand', 'India', 30.7433, 79.4938, 'Sacred shrine dedicated to Vishnu located along the Alaknanda River in the Himalayan hill town of Badrinath.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop', 'Divya Desam')
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Setup for Visit Photos
INSERT INTO storage.buckets (id, name, public) VALUES ('visit-photos', 'visit-photos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Visit Photos" ON storage.objects FOR SELECT USING (bucket_id = 'visit-photos');
CREATE POLICY "Authenticated Users upload Visit Photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'visit-photos' AND auth.role() = 'authenticated');
