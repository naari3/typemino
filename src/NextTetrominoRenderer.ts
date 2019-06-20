import * as PIXI from "pixi.js";
import { Tetromino } from "./Tetromino";
import { TetrominoType } from "./TetrominoData";
import { TetrominoRenderer } from "./TetrominoRenderer";

export class NextTetrominoRenderer {
  public container: PIXI.Container;
  private tetrominoRenderer: TetrominoRenderer;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.tetrominoRenderer = new TetrominoRenderer(this.container);
  }

  public render(type: TetrominoType): void {
    const mino = new Tetromino(type);
    if (type === TetrominoType.I) {
      mino.x = -0.5;
    } else if (type === TetrominoType.O) {
      mino.x = 0.5;
    } else {
      mino.x = 0.0;
    }
    this.tetrominoRenderer.render(mino);
  }
}
