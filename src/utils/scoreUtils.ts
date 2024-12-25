import { createClient } from '@supabase/supabase-js';
import { LeaderboardType } from '../types/leaderboard';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Score {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

export async function saveScore(playerName: string, score: number): Promise<void> {
  const { error } = await supabase
    .from('scores')
    .insert([{ player_name: playerName, score }]);

  if (error) throw error;
}

export async function getTopScores(type: LeaderboardType): Promise<Score[]> {
  let query = supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (type === 'daily') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query = query.gte('created_at', today.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}