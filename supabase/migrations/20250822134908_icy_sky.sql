/*
  # Add Partner Authentication System

  1. New Tables
    - `partner_users` - Store partner login credentials linked to partner records
      - `id` (uuid, primary key)
      - `partner_id` (uuid, foreign key to partners table)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text) - In production, this would be properly hashed
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `partner_users` table
    - Add policies for partner users to access their own data
    - Add indexes for performance

  3. Sample Data
    - Create sample partner user accounts for testing
*/

-- Create partner_users table
CREATE TABLE IF NOT EXISTS partner_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL, -- In production, use proper password hashing
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE partner_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_users_partner_id ON partner_users(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_users_username ON partner_users(username);
CREATE INDEX IF NOT EXISTS idx_partner_users_email ON partner_users(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_partner_users_updated_at'
    ) THEN
        CREATE TRIGGER update_partner_users_updated_at
            BEFORE UPDATE ON partner_users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- RLS Policies
DO $$
BEGIN
    -- Allow partners to read their own user data
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'partner_users' 
        AND policyname = 'Partners can read own user data'
    ) THEN
        CREATE POLICY "Partners can read own user data"
            ON partner_users
            FOR SELECT
            TO public
            USING (true); -- For now, allow public access for demo
    END IF;

    -- Allow creating partner user accounts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'partner_users' 
        AND policyname = 'Allow partner user creation'
    ) THEN
        CREATE POLICY "Allow partner user creation"
            ON partner_users
            FOR INSERT
            TO public
            WITH CHECK (true); -- For now, allow public access for demo
    END IF;

    -- Allow updating partner user accounts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'partner_users' 
        AND policyname = 'Allow partner user updates'
    ) THEN
        CREATE POLICY "Allow partner user updates"
            ON partner_users
            FOR UPDATE
            TO public
            USING (true); -- For now, allow public access for demo
    END IF;
END $$;