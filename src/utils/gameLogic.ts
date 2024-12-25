import Matter from 'matter-js';
import { VELOCITY_THRESHOLD, GAME_OVER_LINE_Y } from './gameConstants';

export function checkGameOver(bodies: Matter.Body[]): boolean {
  return bodies.some(body => {
    const bodyWithLevel = body as Matter.Body & { level?: number };
    if (!bodyWithLevel.level) return false;

    const radius = (body.bounds.max.x - body.bounds.min.x) / 2;
    const centerY = body.position.y;
    const isAboveLine = centerY < GAME_OVER_LINE_Y;
    const isSettled = Math.abs(body.velocity.y) < VELOCITY_THRESHOLD && 
                     Math.abs(body.velocity.x) < VELOCITY_THRESHOLD;
    
    return isAboveLine && isSettled;
  });
}