import { useState, useEffect } from 'react';

const GAME_ASPECT_RATIO = 640 / 960; // width / height
const MIN_HEIGHT = 600; // Minimum game height for desktop

export function useGameSize() {
  const [dimensions, setDimensions] = useState({ width: 640, height: 960 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function updateSize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // On mobile, calculate width first based on screen width
        const maxWidth = window.innerWidth - 32; // Account for padding
        const gameWidth = maxWidth;
        const gameHeight = Math.floor(gameWidth / GAME_ASPECT_RATIO);
        setDimensions({ width: gameWidth, height: gameHeight });
      } else {
        // Desktop layout
        const windowHeight = window.innerHeight - 150;
        const maxHeight = Math.max(MIN_HEIGHT, windowHeight);
        const gameHeight = maxHeight;
        const gameWidth = Math.floor(gameHeight * GAME_ASPECT_RATIO);
        setDimensions({ width: gameWidth, height: gameHeight });
      }
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { ...dimensions, isMobile };
}