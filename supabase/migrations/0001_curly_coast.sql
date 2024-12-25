/*
  # Create scores table for leaderboard

  1. New Tables
    - `scores`
      - `id` (uuid, primary key)
      - `player_name` (text, max 8 chars)
      - `score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `scores` table
    - Add policies for:
      - Anyone can read scores
      - Anyone can insert their own score
*/

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL CHECK (char_length(player_name) <= 8),
  score integer NOT NULL CHECK (score >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores
CREATE POLICY "Anyone can read scores"
  ON scores
  FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to insert their own score
CREATE POLICY "Anyone can insert their own score"
  ON scores
  FOR INSERT
  TO anon
  WITH CHECK (true);