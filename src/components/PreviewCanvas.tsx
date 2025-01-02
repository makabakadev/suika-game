import React, { useEffect, useRef } from 'react';
import { Entity } from '../types/game';
import { useGameSize } from '../hooks/useGameSize';
import { usePreloadedCircularTextures } from '../hooks/usePreloadedCircularTextures';
import { getScaleFactor, scaleRadius } from '../utils/scaleUtils';
import Matter from 'matter-js';

interface PreviewCanvasProps {
  entity: Entity; // Ensure `entity.level` is part of your Entity type
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ entity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width } = useGameSize();
  const scaleFactor = getScaleFactor(width);
  const { textures: circleTextures, isLoaded } = usePreloadedCircularTextures(scaleFactor);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: 160,
        height: 160,
        wireframes: false,
        background: '#1a1a1a',
        pixelRatio: window.devicePixelRatio
      },
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    const scaledRadius = scaleRadius(entity.radius, scaleFactor);
    // Get texture data and dimensions
    const textureData = circleTextures[entity.level];
    if (!textureData) return;
    
    const { data: texture, radius: textureRadius } = textureData;
    
    if (texture) {
      const image = new Image();
      image.src = texture;
      const diameter = textureRadius * 2;

      image.onload = () => {
        ctx.clearRect(0, 0, 160, 160);
        ctx.drawImage(
          image,
          80 - scaledRadius, // Top-left X
          80 - scaledRadius, // Top-left Y
          diameter,          // Width
          diameter           // Height
        );
      };
    } else {
      const circle = Matter.Bodies.circle(80, 80, scaledRadius, {
        render: {
          fillStyle: entity.color,
        },
      });
      Matter.World.add(engine.world, circle);
    }

    return () => {
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
    };
  }, [entity, scaleFactor, circleTextures, isLoaded]);

  return (
    <div
      className="relative"
      style={{
        position: 'relative', // Ensure the container establishes a stacking context
        zIndex: 10,           // Set z-index higher than other elements
      }}
    >
      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        className="rounded-lg"
        style={{
          zIndex: 11, // Ensure the canvas itself is rendered above the container
        }}
      />
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75"
          style={{
            zIndex: 12, // Overlay for the loading screen
          }}
        >
          <div className="text-white text-lg font-semibold">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default PreviewCanvas;
