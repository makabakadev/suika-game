import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { ENTITIES } from '../../constants/suikaEntities.ts';
import { getRandomInitialEntity } from '../../utils/gameUtils.ts';
import { usePreloadedCircularTextures } from '../../hooks/usePreloadedCircularTextures.ts';
import { useGameSize } from '../../hooks/useGameSize.ts';
import { createConfetti } from '../../hooks/createConfetti.ts';
import { checkGameOver } from '../../utils/gameLogic.ts';
import { drawGameOverLine } from '../../utils/renderUtils.ts';
import { getScaleFactor, scaleRadius } from '../../utils/scaleUtils.ts';
import { DROP_COOLDOWN, GAME_OVER_CHECK_DELAY } from '../../utils/gameConstants.ts';

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
  const { textures: circleTextures, isLoaded } = usePreloadedCircularTextures(scaleFactor);
  
  const TRACKING_ZONE_Y = 50; // Fixed y-coordinate for tracking
  const lastDropTimeRef = useRef(0); // Tracks the last drop time
  
  const dropSoundRef = useRef(new Audio('/assets/sounds/drop.mp3')); // Replace with your drop sound file path
  
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    
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
          const nextEntity = ENTITIES.find((e) => e.level === nextLevel);
    
          // Play collision sound
          const collisionSound = new Audio('/assets/sounds/collision.mp3'); // Replace with your collision sound file path
          collisionSound.play();
    
          if (nextEntity) {
            const newPos = {
              x: (bodyA.position.x + bodyB.position.x) / 2,
              y: (bodyA.position.y + bodyB.position.y) / 2,
            };
    
            // Remove the merged entities from the world
            Matter.World.remove(engine.world, [bodyA, bodyB]);
    
            const scaledRadius = scaleRadius(nextEntity.radius, scaleFactor);
    
            // Retrieve the preloaded texture
            const textureData = circleTextures[nextEntity.level];
            if (!textureData) return;
    
            const { data: texture } = textureData;
    
            // Create a new Matter.js body for the merged entity
            const newBody = Matter.Bodies.circle(newPos.x, newPos.y, scaledRadius, {
              render: {
                sprite: {
                  texture, // Use the preloaded and scaled texture
                  xScale: 1, // Texture is already correctly scaled
                  yScale: 1,
                },
              },
              level: nextEntity.level,
            });
    
            // Add the new entity to the Matter.js world
            Matter.World.add(engine.world, newBody);
    
            // Update the score
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
  }, [isLoaded, width, height, scaleFactor]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    const now = Date.now();
    if (gameOverRef.current || currentEntityRef.current || now - lastDropTimeRef.current < DROP_COOLDOWN) {
      return;
    }
  
    lastDropTimeRef.current = now;
  
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
  
    const entity = nextEntityRef.current;
    const scaledRadius = scaleRadius(entity.radius, scaleFactor);
    const textureData = circleTextures[entity.level];
  
    if (!textureData) {
      console.error('Texture data not found for entity level:', entity.level);
      return;
    }
  
    const { data: texture } = textureData;
  
    // Create the Matter.js body
    const newEntity = Matter.Bodies.circle(x, TRACKING_ZONE_Y, scaledRadius, {
      render: {
        sprite: {
          texture, // Use the preloaded and scaled PNG texture
          xScale: 1,
          yScale: 1,
        },
      },
      level: entity.level,
      isStatic: true,
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

  const handleTouchStart = async (e: React.TouchEvent) => { 
    const now = Date.now();
    if (
      gameOverRef.current ||
      currentEntityRef.current ||
      now - lastDropTimeRef.current < DROP_COOLDOWN
    ) {
      return; // Exit if within cooldown or other conditions
    }
  
    lastDropTimeRef.current = now; // Update the last drop time
  
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0]; // Get the first touch
    const x = touch.clientX - rect.left;
  
    const entity = nextEntityRef.current;
    const scaledRadius = scaleRadius(entity.radius, scaleFactor);
    const textureData = circleTextures[entity.level];
  
    if (!textureData) {
      console.error('Texture data not found for entity level:', entity.level);
      return;
    }
  
    const { data: texture } = textureData;
  
    // Create the Matter.js body
    const newEntity = Matter.Bodies.circle(x, TRACKING_ZONE_Y, scaledRadius, {
      render: {
        sprite: {
          texture, // Use the preloaded and scaled PNG texture
          xScale: 1,
          yScale: 1,
        },
      },
      level: entity.level,
      isStatic: true,
    });
  
    Matter.World.add(engineRef.current!.world, newEntity);
    currentEntityRef.current = newEntity;
    setIsDragging(true);
  };  
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling during dragging
    e.stopPropagation(); // Stop propagation to parent elements
  
    if (!isDragging || !currentEntityRef.current) return;
  
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0]; // Get the first touch
    let x = touch.clientX - rect.left;
  
    // Clamp the x-coordinate to the canvas bounds
    x = Math.max(0, Math.min(rect.width, x));
  
    // Only update the x position; keep y fixed to TRACKING_ZONE_Y
    Matter.Body.setPosition(currentEntityRef.current, { x, y: TRACKING_ZONE_Y });
  };
  
  const handleTouchEnd = () => {
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
    <div className="relative" >
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border-2 border-gray-300 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-lg font-semibold">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;