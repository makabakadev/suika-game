import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard.ts';
import { Trophy, Calendar, Clock } from 'lucide-react';
import type { LeaderboardType } from '../types/leaderboard.ts';

const Leaderboard: React.FC = () => {
  const [type, setType] = useState<LeaderboardType>('daily');
  const { topScores, isLoading } = useLeaderboard(type);
  
  return (
    <div className="h-72 flex flex-col bg-gray-700 rounded-lg overflow-hidden border-2 border-red-600">
      <div className="flex items-center justify-center gap-2 p-4 bg-green-700 border-b border-red-600">
        <Trophy className="w-5 h-5 text-yellow-300" />
        <h2 className="text-xl font-bold text-white">Top Players</h2>
      </div>
      
      <div className="flex border-b border-red-600">
        <button
          onClick={() => setType('daily')}
          className={`flex-1 p-2 flex items-center justify-center gap-2 ${
            type === 'daily' ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Daily
        </button>
        <button
          onClick={() => setType('all-time')}
          className={`flex-1 p-2 flex items-center justify-center gap-2 ${
            type === 'all-time' ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          All Time
        </button>
      </div>

      <div className="overflow-y-auto max-h-[300px] p-4 bg-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <p className="text-gray-300">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topScores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-2 bg-gray-700 rounded border border-green-700 hover:border-green-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-400 w-6 font-bold">{index + 1}.</span>
                  <span className="text-gray-200 font-medium">{score.player_name}</span>
                </div>
                <span className="text-green-400 font-bold">{score.score}</span>
              </div>
            ))}
            {topScores.length === 0 && (
              <p className="text-center text-gray-400">No scores yet!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;