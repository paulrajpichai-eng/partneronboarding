/*
  # Email System Setup

  1. New Tables
    - `email_logs` - Track all sent emails
    - `spoc_mappings` - SPOC ID to name/email mapping  
    - `brand_channel_mappings` - Numeric value to brand channel mapping

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a demo system)

  3. Sample Data
    - Sample SPOC mappings for testing
    - Sample brand channel mappings for testing
*/

-- Create email_logs table if it doesn't exist
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

-- Create spoc_mappings table if it doesn't exist
CREATE TABLE IF NOT EXISTS spoc_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spoc_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create brand_channel_mappings table if it doesn't exist
CREATE TABLE IF NOT EXISTS brand_channel_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numeric_value integer UNIQUE NOT NULL,
  brand_channel text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_logs_partner_id') THEN
    CREATE INDEX idx_email_logs_partner_id ON email_logs(partner_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_logs_email_type') THEN
    CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_email_logs_sent_at') THEN
    CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_spoc_mappings_spoc_id') THEN
    CREATE INDEX idx_spoc_mappings_spoc_id ON spoc_mappings(spoc_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_brand_channel_mappings_numeric_value') THEN
    CREATE INDEX idx_brand_channel_mappings_numeric_value ON brand_channel_mappings(numeric_value);
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE spoc_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_channel_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Email logs policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'email_logs' AND policyname = 'Allow all operations on email_logs'
  ) THEN
    CREATE POLICY "Allow all operations on email_logs"
      ON email_logs
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;

  -- SPOC mappings policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'spoc_mappings' AND policyname = 'Allow all operations on spoc_mappings'
  ) THEN
    CREATE POLICY "Allow all operations on spoc_mappings"
      ON spoc_mappings
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Brand channel mappings policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'brand_channel_mappings' AND policyname = 'Allow all operations on brand_channel_mappings'
  ) THEN
    CREATE POLICY "Allow all operations on brand_channel_mappings"
      ON brand_channel_mappings
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Insert sample SPOC mappings (only if they don't exist)
INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC001', 'John Smith', 'john.smith@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC001');

INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC002', 'Sarah Johnson', 'sarah.johnson@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC002');

INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC003', 'Mike Wilson', 'mike.wilson@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC003');

-- Insert sample brand channel mappings (only if they don't exist)
INSERT INTO brand_channel_mappings (numeric_value, brand_channel)
SELECT 1, 'Premium Retail'
WHERE NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 1);

INSERT INTO brand_channel_mappings (numeric_value, brand_channel)
SELECT 2, 'Mass Market'
WHERE NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 2);

INSERT INTO brand_channel_mappings (numeric_value, brand_channel)
SELECT 3, 'Online Channel'
WHERE NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 3);

INSERT INTO brand_channel_mappings (numeric_value, brand_channel)
SELECT 4, 'Exchange Program'
WHERE NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 4);