import * as PIXI from "pixi.js";
import constants from "./Constants";
import { BlockColor } from "./BlockColor";
import { BlockFactory } from "./blockFactory";
import { Tetromino } from "./Tetromino";

export class Field {
  public blockColors: BlockColor[][];
  public blockSprites: PIXI.Sprite[][];
  private container: PIXI.Container;
  private blockWidth: number;
  private blockHeight: number;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.blockWidth = constants.blockWidth;
    this.blockHeight = constants.blockHeight;

    this.blockColors = Array.from(
      new Array(this.blockHeight),
      (): (BlockColor | null)[] => new Array(this.blockWidth).fill(null)
    );

    this.blockSprites = Array.from(
      new Array(this.blockHeight),
      (): (PIXI.Sprite | null)[] => new Array(this.blockWidth).fill(null)
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

  public isCollision(tetromino: Tetromino): boolean {
    let collided = false;
    tetromino.type.shapes[0].forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          if (
            collided ||
            tetromino.x < 0 ||
            tetromino.x + x > this.blockWidth ||
            tetromino.y + y >= this.blockHeight ||
            this.blockColors[tetromino.y + y][tetromino.x + x] !== null
          ) {
            collided = true;
          }
        }
      });
    });
    return collided;
  }

  public clearLines(): number {
    let clearCount = 0;
    this.blockColors.forEach((xList, y): void => {
      if (xList.every((x): boolean => !!x)) {
        this.blockColors.splice(y, 1);
        this.blockColors.unshift(Array(this.blockWidth).fill(null));
        clearCount++;
      }
    });
    return clearCount;
  }
}
