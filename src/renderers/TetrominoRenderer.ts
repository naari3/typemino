import * as PIXI from "pixi.js";
import { Tetromino } from "../Tetromino";
import { BlockFactory } from "../BlockFactory";

export class TetrominoRenderer {
  private container: PIXI.Container;
  private sprites: PIXI.Sprite[];

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.sprites = [];
  }

  public render(tetromino: Tetromino, ghost?: boolean): void {
    this.clearRendered();
    tetromino.currentShape().forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (tetromino.y + y < 0) return;
        if (b === 1) {
          let block: PIXI.Sprite;
          if (ghost === true) {
            block = BlockFactory(
              tetromino.x + x,
              tetromino.y + y,
              tetromino.data.color,
              0.5
            );
          } else {
            block = BlockFactory(
              tetromino.x + x,
              tetromino.y + y,
              tetromino.data.color,
              1
            );
          }
          this.container.addChild(block);
          this.sprites.push(block);
        }
      });
    });
  }

  public clearRendered(): void {
    this.sprites.forEach((s): void => {
      s.destroy();
    });
    this.sprites = [];
  }
}
