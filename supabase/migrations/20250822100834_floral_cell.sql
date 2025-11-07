/*
  # Complete Uncoded Partner Portal Database Schema

  1. New Tables
    - `partners` - Main partner information
    - `locations` - Partner locations (multiple per partner)
    - `users` - Users created by partners for each location
    - `milestones` - Journey tracking for each partner
    - `bos_tasks` - Tasks for BOS users
    - `pricing_tasks` - Tasks for pricing team
    - `spoc_mappings` - SPOC ID to email mappings
    - `brand_channel_mappings` - Numeric value to brand channel mappings

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Sample Data
    - Insert initial mappings and sample data
*/

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL,
  firm_name text NOT NULL,
  email text UNIQUE NOT NULL,
  mobile text NOT NULL,
  country text NOT NULL,
  brand text NOT NULL,
  business text NOT NULL CHECK (business IN ('Sales', 'Exchange')),
  uncoded_spoc_id text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  pin_code text NOT NULL,
  landmark text,
  state text NOT NULL,
  tax_id text NOT NULL,
  tax_id_type text NOT NULL,
  gstin text,
  brand_location_code text NOT NULL,
  payment_modes text[] DEFAULT '{}',
  payment_mode_details jsonb DEFAULT '{}',
  invoicing_frequency text NOT NULL CHECK (invoicing_frequency IN ('daily', 'weekly', 'monthly')),
  invoicing_type text NOT NULL CHECK (invoicing_type IN ('consolidated', 'statewise', 'storewise')),
  banking_details jsonb,
  brand_channel text,
  plan_id text,
  feature_rights text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'registration' CHECK (status IN ('registration', 'bos-processing', 'pricing-setup', 'user-creation', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  pin_code text NOT NULL,
  landmark text,
  state text NOT NULL,
  tax_id text NOT NULL,
  brand_location_code text NOT NULL,
  is_head_office boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  username text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'rejected')),
  started_at timestamptz,
  completed_at timestamptz,
  duration integer, -- in minutes
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create bos_tasks table
CREATE TABLE IF NOT EXISTS bos_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  plan_id text,
  feature_rights text[] DEFAULT '{}',
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create pricing_tasks table
CREATE TABLE IF NOT EXISTS pricing_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  margin_configured boolean DEFAULT false,
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create spoc_mappings table
CREATE TABLE IF NOT EXISTS spoc_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spoc_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create brand_channel_mappings table
CREATE TABLE IF NOT EXISTS brand_channel_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numeric_value integer UNIQUE NOT NULL,
  brand_channel text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bos_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE spoc_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_channel_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these based on your auth requirements)
CREATE POLICY "Allow all operations on partners" ON partners FOR ALL USING (true);
CREATE POLICY "Allow all operations on locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on milestones" ON milestones FOR ALL USING (true);
CREATE POLICY "Allow all operations on bos_tasks" ON bos_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on pricing_tasks" ON pricing_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on spoc_mappings" ON spoc_mappings FOR ALL USING (true);
CREATE POLICY "Allow all operations on brand_channel_mappings" ON brand_channel_mappings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_locations_partner_id ON locations(partner_id);
CREATE INDEX IF NOT EXISTS idx_users_partner_id ON users(partner_id);
CREATE INDEX IF NOT EXISTS idx_users_location_id ON users(location_id);
CREATE INDEX IF NOT EXISTS idx_milestones_partner_id ON milestones(partner_id);
CREATE INDEX IF NOT EXISTS idx_bos_tasks_partner_id ON bos_tasks(partner_id);
CREATE INDEX IF NOT EXISTS idx_bos_tasks_status ON bos_tasks(status);
CREATE INDEX IF NOT EXISTS idx_pricing_tasks_partner_id ON pricing_tasks(partner_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tasks_status ON pricing_tasks(status);
CREATE INDEX IF NOT EXISTS idx_spoc_mappings_spoc_id ON spoc_mappings(spoc_id);
CREATE INDEX IF NOT EXISTS idx_brand_channel_mappings_numeric_value ON brand_channel_mappings(numeric_value);

-- Insert sample SPOC mappings
INSERT INTO spoc_mappings (spoc_id, name, email) VALUES
  ('SPOC001', 'Alice Cooper', 'alice@uncoded.com'),
  ('SPOC002', 'Bob Wilson', 'bob@uncoded.com'),
  ('SPOC003', 'Carol Davis', 'carol@uncoded.com')
ON CONFLICT (spoc_id) DO NOTHING;

-- Insert sample brand channel mappings
INSERT INTO brand_channel_mappings (numeric_value, brand_channel) VALUES
  (1, 'Premium Retail'),
  (2, 'Mass Market'),
  (3, 'Online Channel'),
  (4, 'Exchange Program')
ON CONFLICT (numeric_value) DO NOTHING;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for partners table
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();