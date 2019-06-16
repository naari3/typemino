import * as PIXI from "pixi.js";
import constants from "./Constants";
import { BlockColor } from "./BlockColor";
import { BlockFactory } from "./blockFactory";
import { Tetromino } from "./Tetromino";

export class Field {
  public blockColors: BlockColor[][];
  public blockSprites: PIXI.Sprite[][];
  private container: PIXI.Container;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.blockColors = Array.from(
      new Array(constants.blockHeight),
      (): (BlockColor | null)[] => new Array(constants.blockWidth).fill(null)
    );

    this.blockSprites = Array.from(
      new Array(constants.blockHeight),
      (): (PIXI.Sprite | null)[] => new Array(constants.blockWidth).fill(null)
    );
  }

  public render(): void {
    this.blockColors.forEach((xList, y): void => {
      xList.forEach((color, x): void => {
        if (color != null) {
          const block = BlockFactory(x, y, color);
          this.container.addChild(block);
          if (this.blockSprites[y][x]) {
            this.blockSprites[y][x].destroy();
          }
          this.blockSprites[y][x] = block;
        } else {
          if (this.blockSprites[y][x]) {
            this.blockSprites[y][x].destroy();
            this.blockSprites[y][x] = null;
          }
        }
      });
    });
  }

  public putMino(tetromino: Tetromino): void {
    tetromino.type.shapes[0].forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          this.blockColors[tetromino.y + y][tetromino.x + x] =
            tetromino.type.color;
        }
      });
    });
  }
}
