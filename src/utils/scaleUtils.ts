// Base game width used for scaling calculations
const BASE_GAME_WIDTH = 320;
const MIN_SCALE_FACTOR = 0.5; // Prevent extremely small scales

export function getScaleFactor(currentWidth: number): number {
  return Math.max(currentWidth / BASE_GAME_WIDTH, MIN_SCALE_FACTOR);
}

export function scaleRadius(baseRadius: number, scaleFactor: number): number {
  return Math.round(baseRadius * scaleFactor);
}