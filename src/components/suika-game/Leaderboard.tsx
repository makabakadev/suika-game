import React, { useState } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard.ts';
import { Trophy, Calendar, Clock } from 'lucide-react';
import type { LeaderboardType } from '../../types/leaderboard.ts';

const Leaderboard: React.FC = () => {
  const [type, setType] = useState<LeaderboardType>('daily');
  const { topScores, isLoading } = useLeaderboard(type);

  return (
    <div className="h-72 flex flex-col bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
      <div className="flex items-center justify-center gap-2 p-4 bg-gray-200 border-b border-gray-300">
        <Trophy className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-bold text-gray-800">Top Players</h2>
      </div>

      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setType('daily')}
          className={`flex-1 p-2 flex items-center justify-center gap-2 transition-colors ${
            type === 'daily' ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Daily
        </button>
        <button
          onClick={() => setType('all-time')}
          className={`flex-1 p-2 flex items-center justify-center gap-2 transition-colors ${
            type === 'all-time' ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Clock className="w-4 h-4" />
          All Time
        </button>
      </div>

      <div className="overflow-y-auto max-h-[300px] p-4 bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topScores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-2 bg-gray-200 rounded border border-gray-300 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 w-6 font-bold">{index + 1}.</span>
                  <span className="text-gray-700 font-medium">{score.player_name}</span>
                </div>
                <span className="text-gray-900 font-bold">{score.score}</span>
              </div>
            ))}
            {topScores.length === 0 && (
              <p className="text-center text-gray-600">No scores yet!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
