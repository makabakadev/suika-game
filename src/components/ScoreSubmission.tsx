import React, { useState } from 'react';
import { saveScore } from '../utils/scoreUtils';

interface ScoreSubmissionProps {
  score: number;
  onSubmit: () => void;
}

const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({ score, onSubmit }) => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setError('Please enter a name');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveScore(playerName.trim(), score);
      onSubmit();
    } catch (err) {
      setError('Failed to save score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold text-gray-200 mb-4">Submit Your Score</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm text-gray-300 mb-1">
            Enter your name (max 8 characters):
          </label>
          <input
            id="playerName"
            type="text"
            maxLength={8}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Score'}
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded disabled:opacity-50"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreSubmission;