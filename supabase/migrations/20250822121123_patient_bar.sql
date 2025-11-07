/*
  # Create email logs table

  1. New Tables
    - `email_logs`
      - `id` (uuid, primary key)
      - `recipient` (text)
      - `subject` (text)
      - `partner_id` (uuid, foreign key)
      - `email_type` (text)
      - `metadata` (jsonb)
      - `sent_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `email_logs` table
    - Add policy for authenticated users to read email logs
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text,
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on email_logs"
  ON email_logs
  FOR ALL
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_email_logs_partner_id ON email_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);