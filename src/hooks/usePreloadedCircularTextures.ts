import { ENTITIES } from '../constants/entities';
import { createCircularImage } from '../hooks/createCircularImage';
import { useEffect, useState } from 'react';

// This returns a dictionary: { [level: number]: string } of circled textures
export function usePreloadedCircularTextures() {
  const [textures, setTextures] = useState<{ [level: number]: string }>({});
  
  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      const newTextures: { [level: number]: string } = {};
      for (const entity of ENTITIES) {
        try {
          // Preload the circle-cropped texture once
          const circledTexture = await createCircularImage(entity.path, 64);
          newTextures[entity.level] = circledTexture;
        } catch (e) {
          console.error('Failed to preload texture for', entity.name, e);
        }
      }
      if (isMounted) {
        setTextures(newTextures);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return textures;
}
