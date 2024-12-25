export interface Entity {
  radius: number;
  level: number;
  color: string;
  name: string;
  scoreValue: number;
}

export interface GameState {
  score: number;
  nextEntity: Entity;
  gameOver: boolean;
}