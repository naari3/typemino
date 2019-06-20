import * as PIXI from "pixi.js";
import { TetrominoType } from "./TetrominoData";
import { Tetromino } from "./Tetromino";
import { TetrominoRenderer } from "./TetrominoRenderer";

export class Holder {
  private container: PIXI.Container;
  private tetrominoRenderer: TetrominoRenderer;
  public holdedTetrominoType: TetrominoType;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.tetrominoRenderer = new TetrominoRenderer(this.container);
    this.holdedTetrominoType = null;
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
    const holdedTetromino = new Tetromino(this.holdedTetrominoType);
    if (this.holdedTetrominoType === TetrominoType.I) {
      holdedTetromino.x = -0.5;
    } else if (this.holdedTetrominoType === TetrominoType.O) {
      holdedTetromino.x = 0.5;
    } else {
      holdedTetromino.x = 0.0;
    }
    this.tetrominoRenderer.render(holdedTetromino);
  }
}
