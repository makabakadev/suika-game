export type LeaderboardType = 'daily' | 'all-time';

export interface Score {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}