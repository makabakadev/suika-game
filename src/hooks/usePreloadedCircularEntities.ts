import { useEffect, useState } from 'react';
import Matter from 'matter-js';
import { ENTITIES } from '../constants/entities';
import { createCircularImage } from './createCircularImage';

/**
 * Preloads circular entities with their textures and scaled radii.
 * Returns a map of entities by their levels for immediate use.
 */
export function usePreloadedCircularEntities(scaleFactor: number) {
  const [entities, setEntities] = useState<{ [level: number]: Matter.Body }>({});

  useEffect(() => {
    const loadEntities = async () => {
      const entityPromises = ENTITIES.map(async (entity) => {
        try {
          // Create a circular texture
          const texture = await createCircularImage(entity.path, 64, 32);

          // Scale the radius
          const scaledRadius = entity.radius * scaleFactor;

          // Create the Matter.js body with the texture and scaled radius
          const body = Matter.Bodies.circle(0, 0, scaledRadius, {
            render: {
              sprite: {
                texture,
                xScale: (scaledRadius * 2) / 64,
                yScale: (scaledRadius * 2) / 64,
              },
            },
            level: entity.level,
          });
          
          console.log(`Preloaded entity for level ${entity.level}`);
          return { level: entity.level, body };
        } catch (error) {
          console.error(`Error preloading entity for level ${entity.level}:`, error);
          return null;
        }
      });

      const results = await Promise.all(entityPromises);

      // Map the results to a dictionary by level
      const entityMap = results.reduce((acc, result) => {
        if (result) {
          acc[result.level] = result.body;
        }
        return acc;
      }, {} as { [level: number]: Matter.Body });

      setEntities(entityMap);
    };

    loadEntities();
  }, [scaleFactor]);

  return entities;
}
