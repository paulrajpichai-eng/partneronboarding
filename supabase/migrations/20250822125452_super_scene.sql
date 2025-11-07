/*
  # Safe Email System Setup
  
  This migration safely creates all necessary tables and policies for the email system.
  It checks for existing objects before creating them to avoid duplicate errors.
  
  1. Tables
    - email_logs: Track all email communications
    - spoc_mappings: SPOC ID to name/email mappings  
    - brand_channel_mappings: Numeric value to brand channel mappings
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public access (adjust as needed)
  
  3. Sample Data
    - Sample SPOC mappings for testing
    - Sample brand channel mappings
*/

-- Function to safely create policies
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
  policy_name text,
  table_name text,
  policy_definition text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = policy_name
  ) THEN
    EXECUTE policy_definition;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create email_logs table if not exists
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

-- Create spoc_mappings table if not exists
CREATE TABLE IF NOT EXISTS spoc_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spoc_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create brand_channel_mappings table if not exists
CREATE TABLE IF NOT EXISTS brand_channel_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numeric_value integer UNIQUE NOT NULL,
  brand_channel text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE spoc_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_channel_mappings ENABLE ROW LEVEL SECURITY;

-- Create indexes if not exists
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

-- Create policies safely using the function
SELECT create_policy_if_not_exists(
  'Allow all operations on email_logs',
  'email_logs',
  'CREATE POLICY "Allow all operations on email_logs" ON email_logs FOR ALL TO public USING (true) WITH CHECK (true)'
);

SELECT create_policy_if_not_exists(
  'Allow all operations on spoc_mappings',
  'spoc_mappings', 
  'CREATE POLICY "Allow all operations on spoc_mappings" ON spoc_mappings FOR ALL TO public USING (true) WITH CHECK (true)'
);

SELECT create_policy_if_not_exists(
  'Allow all operations on brand_channel_mappings',
  'brand_channel_mappings',
  'CREATE POLICY "Allow all operations on brand_channel_mappings" ON brand_channel_mappings FOR ALL TO public USING (true) WITH CHECK (true)'
);

-- Insert sample SPOC mappings if not exists
INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC001', 'John Smith', 'john.smith@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC001');

INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC002', 'Sarah Johnson', 'sarah.johnson@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC002');

INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC003', 'Mike Wilson', 'mike.wilson@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC003');

INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC004', 'Lisa Chen', 'lisa.chen@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC004');

INSERT INTO spoc_mappings (spoc_id, name, email)
SELECT 'SPOC005', 'David Brown', 'david.brown@uncoded.com'
WHERE NOT EXISTS (SELECT 1 FROM spoc_mappings WHERE spoc_id = 'SPOC005');

-- Insert sample brand channel mappings if not exists
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

INSERT INTO brand_channel_mappings (numeric_value, brand_channel)
SELECT 5, 'Enterprise Direct'
WHERE NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 5);

INSERT INTO brand_channel_mappings (numeric_value, brand_channel)
SELECT 6, 'Partner Channel'
WHERE NOT EXISTS (SELECT 1 FROM brand_channel_mappings WHERE numeric_value = 6);

-- Clean up the helper function
DROP FUNCTION IF EXISTS create_policy_if_not_exists(text, text, text);

-- Add foreign key constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'email_logs_partner_id_fkey'
  ) THEN
    ALTER TABLE email_logs 
    ADD CONSTRAINT email_logs_partner_id_fkey 
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE;
  END IF;
END $$;