import * as PIXI from "pixi.js";
import { TetrominoType } from "./TetrominoData";
import Constants from "./Constants";
import { Tetromino } from "./Tetromino";

export class Holder {
  private container: PIXI.Container;
  public holdedTetrominoType: TetrominoType;
  public holdedTetromino: Tetromino;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.holdedTetrominoType = null;
    this.holdedTetromino = null;
    container.scale.x = container.scale.y = Constants.holdMinoScale;
  }

  public hold(type: TetrominoType): TetrominoType | null {
    let previousTetrominoType = null;
    if (this.holdedTetrominoType !== null) {
      previousTetrominoType = this.holdedTetrominoType;
    }
    this.holdedTetrominoType = type;
    this.render();
    return previousTetrominoType;
  }

  public render(): void {
    if (this.holdedTetromino) this.holdedTetromino.clearRendered();
    this.holdedTetromino = new Tetromino(
      this.holdedTetrominoType,
      this.container
    );
    this.holdedTetromino.render();
  }
}
