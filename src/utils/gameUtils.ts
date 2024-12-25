import { Entity } from '../types/game';
import { ENTITIES } from '../constants/entities';

export const getRandomInitialEntity = (): Entity => {
  const initialEntities = ENTITIES.slice(0, 5); // Only first 5 entities
  const randomIndex = Math.floor(Math.random() * initialEntities.length);
  return initialEntities[randomIndex];
};