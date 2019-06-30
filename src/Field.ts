import { BlockColor } from "./BlockColor";
import { Tetromino } from "./Tetromino";
import { Observable } from "./Observable";

export class Field extends Observable {
  public blockColors: BlockColor[][];
  public transparencies: number[][];
  public blockWidth: number;
  public blockHeight: number;
  public invisibleHeight: number; // if block is setted above this, it will be ignored
  public actualBlockHeight: number;

  public constructor(width: number, height: number, invisibleHeight: number) {
    super();
    this.blockWidth = width;
    this.blockHeight = height;

    this.invisibleHeight = invisibleHeight;

    this.actualBlockHeight = this.blockHeight + this.invisibleHeight;

    this.blockColors = Array.from(
      new Array(this.actualBlockHeight),
      (): (BlockColor | null)[] => new Array(this.blockWidth).fill(null)
    );

    this.transparencies = Array.from(
      new Array(this.actualBlockHeight),
      (): (number)[] => new Array(this.blockWidth).fill(null)
    );
  }

  public putMino(tetromino: Tetromino): void {
    tetromino.currentShape().forEach((xList, y): void => {
      if (
        !(tetromino.y + this.invisibleHeight + y < 0) // if block is setted above threshold, it will be ignored
      ) {
        xList.forEach((b, x): void => {
          if (b === 1) {
            this.blockColors[tetromino.y + this.invisibleHeight + y][
              tetromino.x + x
            ] = tetromino.data.color;
            this.transparencies[tetromino.y + this.invisibleHeight + y][
              tetromino.x + x
            ] = 1;
          }
        });
      }
    });
    this.notify();
  }

  public isCollision(tetromino: Tetromino): boolean {
    let collided = false;
    tetromino.currentShape().forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          if (
            collided ||
            tetromino.x + x < 0 ||
            tetromino.x + x >= this.blockWidth ||
            tetromino.y + this.invisibleHeight + y >= this.actualBlockHeight ||
            (tetromino.y + this.invisibleHeight + y > 0 &&
              // ↑if block is setted above ceiling (in such case, y will be negative), it will be ignored
              this.blockColors[tetromino.y + this.invisibleHeight + y][
                tetromino.x + x
              ] !== null)
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

        this.transparencies.splice(y, 1);
        this.transparencies.unshift(Array(this.blockWidth).fill(null));
        clearCount++;
      }
    });
    this.notify();
    return clearCount;
  }

  // this method just make blocks transparent
  // you must call clearLines() if you need pack field
  public transparentLines(): number {
    let clearCount = 0;
    this.blockColors.forEach((xList, y): void => {
      if (xList.every((x): boolean => !!x)) {
        this.transparencies[y] = new Array(this.blockWidth).fill(0);
        clearCount++;
      }
    });
    this.notify();
    return clearCount;
  }

  public fillAllBlock(fillColor: BlockColor): void {
    this.blockColors = this.blockColors.map((xList): BlockColor[] => {
      return xList.map(
        (color): BlockColor => {
          if (color !== null) return fillColor;
          else return null;
        }
      );
    });
    this.transparencies = this.transparencies.map((xList): number[] => {
      return xList.map((color): number => {
        if (color !== null) return 1;
        else return null;
      });
    });
    this.notify();
  }

  public tickTimer(): void {}
}
