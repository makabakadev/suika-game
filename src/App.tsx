import { useState } from 'react';
import GameCanvas from './components/GameCanvas';
// import PreviewCanvas from './components/PreviewCanvas';
import Leaderboard from './components/Leaderboard';
import ScoreSubmission from './components/ScoreSubmission';
import { getRandomInitialEntity } from './utils/gameUtils';
import { Entity } from './types/game';
import { useGameSize } from './hooks/useGameSize';

function App() {
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
    setScore(prev => prev + points);
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
    <div className="min-h-screen bg-gray-900 p-4 bg-[url('/assets/background.webp')] bg-cover bg-center bg-fixed">
      <div className="flex flex-col items-center">
        <div className="bg-gray-800/90 flex items-center space-x-2 mb-4 py-2 px-4">
          <h1 className="text-3xl font-bold text-green-500 drop-shadow-lg">
            SUIka game
            <a
              href="https://x.com/suisnails"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline ml-2"
            >
              by Sui Snails
            </a>
          </h1>
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'} justify-center items-start max-w-full overflow-hidden`}>
          <div className="bg-gray-800/90 p-4 rounded-lg border-2 border-green-600">
            <GameCanvas 
              onGameOver={handleGameOver} 
              onScoreUpdate={handleScoreUpdate}
              onNextEntityChange={setNextEntity}
            />
          </div>
          
          <div className={`bg-gray-800/90 p-4 rounded-lg ${isMobile ? 'mt-4 w-full' : ''}`}>
            <div className="flex flex-col gap-4">
              {/* Score and Preview Section */}
              <div className="bg-gray-700 p-4 rounded-lg border-2 border-red-600">
                <p className="text-gray-300 text-2xl font-bold mb-4">Score: <span className="text-green-400">{score}</span></p>
                {/* <div>
                  <p className="text-gray-300 text-sm mb-2">Next:</p>
                  <PreviewCanvas entity={nextEntity} />
                  <p className="text-gray-400 text-lg text-center">{nextEntity.name}</p>
                </div> */}
              </div>
              
              {/* Leaderboard Section */}
              <Leaderboard />
            </div>
          </div>
        </div>

        {showScoreSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <ScoreSubmission score={score} onSubmit={handleScoreSubmitted} />
          </div>
        )}

        {gameOver && !showScoreSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg text-center border-2 border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Game Over!</h2>
              <p className="text-xl text-green-400 mb-4">Final Score: {score}</p>
              <button
                onClick={handleRestart}
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;