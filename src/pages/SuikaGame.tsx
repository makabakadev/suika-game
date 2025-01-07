import { useState } from 'react';
import GameCanvas from '../components/suika-game/GameCanvas';
// import PreviewCanvas from '../components/PreviewCanvas';
import Leaderboard from '../components/suika-game/Leaderboard';
import ScoreSubmission from '../components/suika-game/ScoreSubmission';
import { getRandomInitialEntity } from '../utils/gameUtils';
import { Entity } from '../types/game';
import { useGameSize } from '../hooks/useGameSize';

export function SuikaGame() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [nextEntity, setNextEntity] = useState<Entity>(getRandomInitialEntity());
  const { isMobile } = useGameSize();

  const handleGameOver = () => {
    setGameOver(true);
    setShowScoreSubmission(true);
  };

  const handleScoreUpdate = (points: number) => {
    setScore((prev) => prev + points);
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setShowScoreSubmission(false);
    window.location.reload();
  };

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold mb-4 text-gray-800">
          Gravitational BORK: Unraveling Poultry-Based Theories of Gravity
        </h1>
        <div className="font-serif italic text-base text-gray-600 mb-2">
          Dr. Bork von Borkenstein III, PhD
        </div>
        <div className="text-sm text-gray-500">
          Originally published in Nature BORK, Volume BORK, Issue BORK, 2024
        </div>
      </header>

      <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'} justify-center items-start max-w-full overflow-hidden`}>
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg border-2 border-gray-300">
          <GameCanvas 
            onGameOver={handleGameOver} 
            onScoreUpdate={handleScoreUpdate}
            onNextEntityChange={setNextEntity}
          />
        </div>

        <div className={`bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-300 ${isMobile ? 'mt-4 w-full' : ''}`}> 
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg border-2 border-gray-300">
              <p className="font-serif text-xl text-gray-700 mb-4">
                Score: <span className="text-gray-900 font-bold">{score}</span>
              </p>
            </div>
            <Leaderboard />
          </div>
        </div>
      </div>

      {showScoreSubmission && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-50">
          <ScoreSubmission score={score} onSubmit={handleScoreSubmitted} />
        </div>
      )}

      {gameOver && !showScoreSubmission && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-8 rounded-lg text-center border-2 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
            <p className="text-xl text-gray-700 mb-4">Final Score: {score}</p>
            <button
              onClick={handleRestart}
              className="bg-gray-300 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
