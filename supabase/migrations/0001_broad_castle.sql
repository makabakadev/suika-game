/*
  # Create scores table with RLS policies

  1. New Tables
    - `scores`
      - `id` (uuid, primary key)
      - `player_name` (text, max 8 chars)
      - `score` (integer, non-negative)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `scores` table
    - Add policies for:
      - Public read access
      - Public score submission
*/

-- Create scores table if it doesn't exist
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL CHECK (char_length(player_name) <= 8),
  score integer NOT NULL CHECK (score >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can read scores" ON scores;
  DROP POLICY IF EXISTS "Anyone can insert their own score" ON scores;
  
  -- Create new policies
  CREATE POLICY "Anyone can read scores"
    ON scores
    FOR SELECT
    TO anon
    USING (true);

  CREATE POLICY "Anyone can insert their own score"
    ON scores
    FOR INSERT
    TO anon
    WITH CHECK (true);
END $$;