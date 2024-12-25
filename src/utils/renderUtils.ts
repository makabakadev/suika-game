import { GAME_OVER_LINE_Y } from './gameConstants';

export function drawGameOverLine(ctx: CanvasRenderingContext2D, width: number) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(0, GAME_OVER_LINE_Y);
  ctx.lineTo(width, GAME_OVER_LINE_Y);
  ctx.stroke();
  ctx.restore();
}