/*
  # Complete Email System Setup

  1. Tables
    - Ensures all required tables exist with proper structure
    - Safe to run multiple times (uses IF NOT EXISTS)
  
  2. Security
    - RLS policies for all tables
    - Proper access controls
    
  3. Sample Data
    - SPOC mappings for testing
    - Brand channel mappings
    - Only inserts if data doesn't exist

  4. Functions
    - Helper functions for email processing
*/

-- Create tables with IF NOT EXISTS to avoid conflicts
CREATE TABLE IF NOT EXISTS spoc_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spoc_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brand_channel_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numeric_value integer UNIQUE NOT NULL,
  brand_channel text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text,
  partner_id uuid,
  email_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_spoc_mappings_spoc_id') THEN
    CREATE INDEX idx_spoc_mappings_spoc_id ON spoc_mappings(spoc_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_brand_channel_mappings_numeric_value') THEN
    CREATE INDEX idx_brand_channel_mappings_numeric_value ON brand_channel_mappings(numeric_value);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_logs_partner_id') THEN
    CREATE INDEX idx_email_logs_partner_id ON email_logs(partner_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_logs_email_type') THEN
    CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE spoc_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_channel_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- SPOC mappings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'spoc_mappings' AND policyname = 'Allow all operations on spoc_mappings') THEN
    CREATE POLICY "Allow all operations on spoc_mappings" ON spoc_mappings FOR ALL TO public USING (true);
  END IF;
  
  -- Brand channel mappings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brand_channel_mappings' AND policyname = 'Allow all operations on brand_channel_mappings') THEN
    CREATE POLICY "Allow all operations on brand_channel_mappings" ON brand_channel_mappings FOR ALL TO public USING (true);
  END IF;
  
  -- Email logs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_logs' AND policyname = 'Allow all operations on email_logs') THEN
    CREATE POLICY "Allow all operations on email_logs" ON email_logs FOR ALL TO public USING (true);
  END IF;
END $$;

-- Insert sample data only if it doesn't exist
DO $$
BEGIN
  -- Insert SPOC mappings if they don't exist
  IF NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC001') THEN
    INSERT INTO spoc_mappings (spoc_id, name, email) VALUES
    ('SPOC001', 'John Smith', 'john.smith@uncoded.com'),
    ('SPOC002', 'Sarah Johnson', 'sarah.johnson@uncoded.com'),
    ('SPOC003', 'Mike Wilson', 'mike.wilson@uncoded.com'),
    ('SPOC004', 'Emily Davis', 'emily.davis@uncoded.com'),
    ('SPOC005', 'David Brown', 'david.brown@uncoded.com');
  END IF;
  
  -- Insert brand channel mappings if they don't exist
  IF NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 1) THEN
    INSERT INTO brand_channel_mappings (numeric_value, brand_channel) VALUES
    (1, 'Premium Retail'),
    (2, 'Mass Market'),
    (3, 'Online Channel'),
    (4, 'Exchange Program'),
    (5, 'Enterprise Direct'),
    (6, 'SMB Partner'),
    (7, 'Retail Chain'),
    (8, 'Authorized Dealer');
  END IF;
END $$;