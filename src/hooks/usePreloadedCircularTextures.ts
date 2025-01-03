import { useEffect, useRef, useState } from 'react';
import { ENTITIES } from '../constants/entities';

/**
 * Preloads and scales PNG textures for game entities based on the game width.
 * @param scaleFactor The current scale factor of the game canvas.
 * @returns Object containing textures and the loading state.
 */
export function usePreloadedCircularTextures(scaleFactor: number) {
  const textures = useRef<{ [level: number]: { data: string; radius: number } }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function preloadTextures() {
      const texturePromises = ENTITIES.map(async (entity) => {
        try {
          const radius = entity.radius * scaleFactor;
          const texture = await scalePngTexture(entity.path, radius * 2);

          if (!isCancelled) {
            textures.current[entity.level] = {
              data: texture, // Preloaded and scaled texture
              radius: radius,
            };
            console.log(`Texture preloaded for level ${entity.level}`);
          }
        } catch (error) {
          console.error(`Error preloading texture for level ${entity.level}:`, error);
        }
      });

      await Promise.all(texturePromises);

      if (!isCancelled) {
        setIsLoaded(true);
      }
    }

    preloadTextures();

    return () => {
      isCancelled = true;
    };
  }, [scaleFactor]);

  return { textures: textures.current, isLoaded };
}

/**
 * Scales a PNG texture to the specified diameter.
 * @param pngPath The path to the PNG file.
 * @param diameter The desired diameter for the scaled texture.
 * @returns A Promise resolving to the scaled texture as a data URL.
 */
async function scalePngTexture(pngPath: string, diameter: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = pngPath;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = diameter;
      canvas.height = diameter;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Failed to get canvas context');
        return;
      }

      // Draw the PNG image resized to fit the specified diameter
      ctx.drawImage(img, 0, 0, diameter, diameter);

      // Convert the canvas to a data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (err) => {
      console.error('Error loading PNG:', err);
      reject(err);
    };
  });
}
