import * as PIXI from "pixi.js";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";

export class GhostRenderer {
  private container: PIXI.Container;
  private prevGhost: Tetromino;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.prevGhost = null;
  }

  public render(original: Tetromino, field: Field): void {
    this.clearRendered();
    const ghost = new Tetromino(original.type, this.container);
    ghost.angle = original.angle;
    ghost.x = original.x;
    ghost.y = original.y;
    while (!field.isCollision(ghost)) {
      ghost.y++;
    }
    ghost.y--;
    ghost.render(true);
    this.prevGhost = ghost;
  }

  public clearRendered(): void {
    if (this.prevGhost !== null) {
      this.prevGhost.clearRendered();
    }
  }
}
