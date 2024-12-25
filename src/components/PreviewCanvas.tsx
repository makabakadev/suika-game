import React, { useEffect, useRef } from 'react';
import { Entity } from '../types/game';
import { useGameSize } from '../hooks/useGameSize';
import { usePreloadedCircularTextures } from '../hooks/usePreloadedCircularTextures';
import { getScaleFactor, scaleRadius } from '../utils/scaleUtils';

interface PreviewCanvasProps {
  entity: Entity; // Make sure `entity.level` is part of your Entity type
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ entity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width } = useGameSize();
  const scaleFactor = getScaleFactor(width);

  // 1) Grab the preloaded textures (mapping level -> circle-cropped data URL).
  const circleTextures = usePreloadedCircularTextures();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the entire 160x160 preview area
    ctx.clearRect(0, 0, 160, 160);

    // 2) See if we've got a preloaded texture for this entity level
    const texture = circleTextures[entity.level];
    if (texture) {
      // Since the texture is already “circle-cropped” at 64x64,
      // we can draw it as an image at whatever size we need.
      const scaledRadius = scaleRadius(entity.radius, scaleFactor);
      const diameter = scaledRadius * 2;

      const image = new Image();
      image.src = texture; // data URL from preloaded textures

      image.onload = () => {
        // Clear again in case the image loaded after a short delay
        ctx.clearRect(0, 0, 160, 160);

        // Center the image at (80,80)
        ctx.drawImage(
          image,
          80 - scaledRadius,  // top-left X
          80 - scaledRadius,  // top-left Y
          diameter,           // width
          diameter            // height
        );
      };
    } else {
      // 3) Fallback: no preloaded texture found (or still loading),
      // so just draw the old fillStyle circle
      ctx.beginPath();
      const scaledRadius = scaleRadius(entity.radius, scaleFactor);
      ctx.arc(80, 80, scaledRadius, 0, Math.PI * 2);
      ctx.fillStyle = entity.color;
      ctx.fill();
      ctx.closePath();
    }
  }, [entity, scaleFactor, circleTextures]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={160}
      className="rounded-lg"
    />
  );
};

export default PreviewCanvas;
