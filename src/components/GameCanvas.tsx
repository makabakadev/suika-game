import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { ENTITIES } from '../constants/entities';
import { getRandomInitialEntity } from '../utils/gameUtils';
import { usePreloadedCircularTextures } from '../hooks/usePreloadedCircularTextures';
import { createCircularImage } from '../hooks/createCircularImage';
import { useGameSize } from '../hooks/useGameSize';
import { createConfetti } from '../hooks/createConfetti';
import { checkGameOver } from '../utils/gameLogic';
import { drawGameOverLine } from '../utils/renderUtils';
import { getScaleFactor, scaleRadius } from '../utils/scaleUtils';
import { DROP_COOLDOWN, GAME_OVER_CHECK_DELAY } from '../utils/gameConstants';

interface GameCanvasProps {
  onGameOver: () => void;
  onScoreUpdate: (score: number) => void;
  onNextEntityChange: (entity: typeof ENTITIES[0]) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver, onScoreUpdate, onNextEntityChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const currentEntityRef = useRef<Matter.Body | null>(null);
  const nextEntityRef = useRef(getRandomInitialEntity());
  const gameOverRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const { width, height } = useGameSize();
  const scaleFactor = getScaleFactor(width);
  const circleTextures = usePreloadedCircularTextures();

  const TRACKING_ZONE_Y = 50; // Fixed y-coordinate for tracking
  const lastDropTimeRef = useRef(0); // Tracks the last drop time
  
  const dropSoundRef = useRef(new Audio('/assets/sounds/drop.mp3')); // Replace with your drop sound file path
  
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#1a1a1a',
        pixelRatio: window.devicePixelRatio
      },
    });

    // Create a separate canvas for the game over line
    const lineCanvas = document.createElement('canvas');
    lineCanvas.width = width;
    lineCanvas.height = height;
    lineCanvas.style.position = 'absolute';
    lineCanvas.style.top = '0';
    lineCanvas.style.left = '0';
    lineCanvas.style.pointerEvents = 'none';
    lineCanvas.style.zIndex = '1';
    canvasRef.current.parentElement?.appendChild(lineCanvas);
    
    const lineCtx = lineCanvas.getContext('2d');
    if (lineCtx) {
      drawGameOverLine(lineCtx, width);
    }

    const walls = [
      Matter.Bodies.rectangle(width/2, height + 10, width, 20, { isStatic: true }), // bottom
      Matter.Bodies.rectangle(-10, height/2, 20, height, { isStatic: true }), // left
      Matter.Bodies.rectangle(width + 10, height/2, 20, height, { isStatic: true }), // right
    ];
    
    Matter.World.add(engine.world, walls);
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    
    engineRef.current = engine;
    
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA as Matter.Body & { level?: number };
        const bodyB = pair.bodyB as Matter.Body & { level?: number };

        if (bodyA.level && bodyB.level && bodyA.level === bodyB.level) {
          const nextLevel = bodyA.level + 1;
          const nextEntity = ENTITIES.find(e => e.level === nextLevel);

          // Create a new Audio instance for each collision
          const collisionSound = new Audio('/assets/sounds/collision.mp3'); // Replace with your collision sound file path
          collisionSound.play();
          
          if (nextEntity) {
            const newPos = {
              x: (bodyA.position.x + bodyB.position.x) / 2,
              y: (bodyA.position.y + bodyB.position.y) / 2,
            };
            
            Matter.World.remove(engine.world, [bodyA, bodyB]);
            
            const scaledRadius = scaleRadius(nextEntity.radius, scaleFactor);
            console.log('circleTextures:', circleTextures);
            console.log('nextEntity.level:', nextEntity.level);
            console.log('Texture for level:', circleTextures[nextEntity.level]);
            const texture = circleTextures[nextEntity.level]; // e.g.  '/assets/... (base64 data URL)'
            console.log('texture:', texture);
            
            const newBody = Matter.Bodies.circle(newPos.x, newPos.y, scaledRadius, {
              render: {
                fillStyle: nextEntity.color, // optional fallback
                sprite: {
                  texture,
                  xScale: (scaledRadius * 2) / 64,
                  yScale: (scaledRadius * 2) / 64,
                },
              },
              level: nextEntity.level,
            });
            
            Matter.World.add(engine.world, newBody);
            onScoreUpdate(nextEntity.scoreValue);
             
             // Trigger confetti effect
            createConfetti(engine.world, newPos.x, newPos.y);
          }
        }
      });
    });

    return () => {
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      lineCanvas.remove();
    };
  }, [width, height, scaleFactor]);

  const handleMouseDown = async (e: React.MouseEvent) => {
    const now = Date.now();
    if (gameOverRef.current || currentEntityRef.current || now - lastDropTimeRef.current < DROP_COOLDOWN) {
      return; // Exit if within cooldown or other conditions
    }
    
    lastDropTimeRef.current = now; // Update the last drop time

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const entity = nextEntityRef.current;
    const scaledRadius = scaleRadius(entity.radius, scaleFactor);
    const circledTexture = await createCircularImage(entity.path, 64);
    
    // Create the entity at the tracking zone's Y position
    const newEntity = Matter.Bodies.circle(x, TRACKING_ZONE_Y, scaledRadius, {
      render: {
        sprite: {
          texture: circledTexture,
          xScale: (scaledRadius * 2) / 64,
          yScale: (scaledRadius * 2) / 64,
        },
      },
      level: entity.level,
      isStatic: true, // Keep it static while dragging
    });

    Matter.World.add(engineRef.current!.world, newEntity);
    currentEntityRef.current = newEntity;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentEntityRef.current) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Only update the x position; keep y fixed to TRACKING_ZONE_Y
    Matter.Body.setPosition(currentEntityRef.current, { x, y: TRACKING_ZONE_Y });
  };

  const handleMouseUp = () => {
    if (!currentEntityRef.current) return;
    
    // Play drop sound
    dropSoundRef.current.play();

    // Make the entity dynamic to "drop" it
    Matter.Body.setStatic(currentEntityRef.current, false);
    currentEntityRef.current = null;
    setIsDragging(false);

    // Set the next entity
    const nextEntity = getRandomInitialEntity();
    nextEntityRef.current = nextEntity;
    onNextEntityChange(nextEntity);

    setTimeout(() => {
      if (gameOverRef.current) return;
      const bodies = Matter.Composite.allBodies(engineRef.current!.world);
      if (checkGameOver(bodies)) {
        gameOverRef.current = true;
        onGameOver();
      }
    }, GAME_OVER_CHECK_DELAY);
  
    setTimeout(() => {
      currentEntityRef.current = null;
    }, DROP_COOLDOWN);
  };

  // const handleClick = async (e: React.MouseEvent) => {
  //   if (!engineRef.current || !canvasRef.current || currentEntityRef.current || gameOverRef.current) return;
  
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
    
  //   // 1) Create the circle-cropped sprite
  //   const entity = nextEntityRef.current;
  //   const circledTexture = await createCircularImage(entity.path, 64);
    
  //   // 2) Create the Matter body
  //   const scaledRadius = scaleRadius(entity.radius, scaleFactor);
  //   const newEntity = Matter.Bodies.circle(x, 50, scaledRadius, {
  //     render: {
  //       // The fillStyle is optional if you're using a sprite
  //       fillStyle: entity.color,
  //       sprite: {
  //         texture: circledTexture,
  //         xScale: scaledRadius * 2 / 64,  // The diameter vs. original image dimension
  //         yScale: scaledRadius * 2 / 64,
  //       }
  //     },
  //     level: entity.level,
  //     restitution: 0.3,
  //     friction: 0.1,
  //   });
    

  //   Matter.World.add(engineRef.current.world, newEntity);
  //   currentEntityRef.current = newEntity;

  //   const nextEntity = getRandomInitialEntity();
  //   nextEntityRef.current = nextEntity;
  //   onNextEntityChange(nextEntity);

  //   setTimeout(() => {
  //     if (gameOverRef.current) return;
  //     const bodies = Matter.Composite.allBodies(engineRef.current!.world);
  //     if (checkGameOver(bodies)) {
  //       gameOverRef.current = true;
  //       onGameOver();
  //     }
  //   }, GAME_OVER_CHECK_DELAY);
  
  //   setTimeout(() => {
  //     currentEntityRef.current = null;
  //   }, DROP_COOLDOWN);
  // };

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border-2 border-gray-800 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default GameCanvas;