import { useState } from 'react';
import GameCanvas from './components/GameCanvas';
// import PreviewCanvas from './components/PreviewCanvas';
import Leaderboard from './components/Leaderboard';
import ScoreSubmission from './components/ScoreSubmission';
import { getRandomInitialEntity } from './utils/gameUtils';
import { Entity } from './types/game';
import { useGameSize } from './hooks/useGameSize';

function App() {
  // const [score, setScore] = useState(0);
  // const [gameOver, setGameOver] = useState(false);
  // const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  // const [nextEntity, setNextEntity] = useState<Entity>(getRandomInitialEntity());
  // const { isMobile } = useGameSize();
  
  // const handleGameOver = () => {
  //   setGameOver(true);
  //   setShowScoreSubmission(true);
  // };
  
  // const handleScoreUpdate = (points: number) => {
  //   setScore(prev => prev + points);
  // };
  
  // const handleRestart = () => {
  //   setGameOver(false);
  //   setScore(0);
  //   setShowScoreSubmission(false);
  //   window.location.reload();
  // };
  
  // const handleScoreSubmitted = () => {
  //   setShowScoreSubmission(false);
  // };

  return (
    <div className="bg-yellow-200 text-yellow-900 text-center py-2 mb-4 rounded-lg border-b-2 border-yellow-500">
      <p className="text-sm sm:text-base font-bold">
        This publication is currently being peer-reviewed. Results and theories are subject to change.
      </p>
    </div>
    // <div className="min-h-screen bg-gray-100 p-4 bg-cover bg-center bg-fixed">
    //   <div className="flex flex-col items-center">
    //     <header className="text-center mb-12">
    //       <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
    //         On the Theoretical Foundations of BORK: A Comprehensive Analysis
    //       </h1>
    //       <div className="font-serif italic mb-6">
    //         Dr. Bork von Borkenstein III, PhD
    //         <br />
    //         Department of Advanced Bork Studies
    //         <br />
    //         The BORK Institute
    //       </div>
    //       <div className="text-sm text-gray-500">
    //         Originally published in the Journal of Bork Sciences
    //         <br />
    //         Volume BORK, Issue BORK, 2024
    //       </div>
    //     </header>
        
    //     <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'} justify-center items-start max-w-full overflow-hidden`}>
    //       <div className="bg-gray-300/90 p-4 rounded-lg border-2 border-green-600">
    //         <GameCanvas 
    //           onGameOver={handleGameOver} 
    //           onScoreUpdate={handleScoreUpdate}
    //           onNextEntityChange={setNextEntity}
    //         />
    //       </div>
          
    //       <div className={`bg-gray-400/90 p-4 rounded-lg ${isMobile ? 'mt-4 w-full' : ''}`}>
    //         <div className="flex flex-col gap-4">
    //           {/* Score and Preview Section */}
    //           <div className="bg-gray-100 p-4 rounded-lg border-2 border-red-600">
    //             <p className="text-gray-300 text-2xl font-bold mb-4">Score: <span className="text-green-400">{score}</span></p>
    //             {/* <div>
    //               <p className="text-gray-300 text-sm mb-2">Next:</p>
    //               <PreviewCanvas entity={nextEntity} />
    //               <p className="text-gray-400 text-lg text-center">{nextEntity.name}</p>
    //             </div> */}
    //           </div>
              
    //           {/* Leaderboard Section */}
    //           <Leaderboard />
    //         </div>
    //       </div>
    //     </div>

    //     {showScoreSubmission && (
    //       <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
    //         <ScoreSubmission score={score} onSubmit={handleScoreSubmitted} />
    //       </div>
    //     )}

    //     {gameOver && !showScoreSubmission && (
    //       <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
    //         <div className="bg-gray-800 p-8 rounded-lg text-center border-2 border-red-600">
    //           <h2 className="text-2xl font-bold text-red-500 mb-4">Game Over!</h2>
    //           <p className="text-xl text-green-400 mb-4">Final Score: {score}</p>
    //           <button
    //             onClick={handleRestart}
    //             className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
    //           >
    //             Play Again
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}

export default App;