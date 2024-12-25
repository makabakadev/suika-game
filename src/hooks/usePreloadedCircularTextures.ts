import { useEffect, useRef } from 'react';
import { ENTITIES } from '../constants/entities';
import { createCircularImage } from './createCircularImage';

export function usePreloadedCircularTextures() {
  const textures = useRef<{ [level: number]: string }>({});

  useEffect(() => {
    ENTITIES.forEach((entity) => {
      createCircularImage(entity.path, 64)
        .then((base64) => {
          textures.current[entity.level] = base64;
          console.log(`Texture preloaded for level ${entity.level}:`, base64);
        })
        .catch((error) => {
          console.error(`Error preloading texture for level ${entity.level}:`, error);
        });
    });
  }, []);

  return textures.current;
}
