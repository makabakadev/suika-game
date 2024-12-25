import { useState, useEffect } from 'react';
import { getTopScores } from '../utils/scoreUtils';
import type { Score, LeaderboardType } from '../types/leaderboard';

export function useLeaderboard(type: LeaderboardType) {
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scores = await getTopScores(type);
        setTopScores(scores);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, [type]);

  return { topScores, isLoading };
}