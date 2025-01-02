import { useEffect, useRef, useState } from 'react';
import { ENTITIES } from '../constants/entities';
import { createCircularImage } from './createCircularImage';

/**
 * Preloads circular textures for game entities based on the game width.
 * @param currentWidth The current width of the game canvas.
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
          // Create a dummy image to get dimensions
          const img = new Image();
          img.src = entity.path;
          img.crossOrigin = 'anonymous';

          const loadImage = new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });

          await loadImage;
          
          const radius = entity.radius * scaleFactor;
          
          const base64 = await createCircularImage(entity.path, radius); // Preload the texture
          if (!isCancelled) {
            textures.current[entity.level] = {
              data: base64,
              radius: radius
            };
            console.log(`Texture preloaded for level ${entity.level}:`);
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
