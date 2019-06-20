import * as PIXI from "pixi.js";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";
import { TetrominoRenderer } from "./TetrominoRenderer";

export class GhostRenderer {
  private container: PIXI.Container;
  private tetrominoRenderer: TetrominoRenderer;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.tetrominoRenderer = new TetrominoRenderer(this.container);
  }

  public render(original: Tetromino, field: Field): void {
    this.clearRendered();
    const ghost = new Tetromino(original.type);
    ghost.angle = original.angle;
    ghost.x = original.x;
    ghost.y = original.y;
    while (!field.isCollision(ghost)) {
      ghost.y++;
    }
    ghost.y--;
    this.tetrominoRenderer.render(ghost, true);
  }

  public clearRendered(): void {
    this.tetrominoRenderer.clearRendered();
  }
}
