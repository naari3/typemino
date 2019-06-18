import * as PIXI from "pixi.js";
import { Tetromino } from "./Tetromino";
import { TetrominoType } from "./TetrominoData";

export class NextTetrominoRenderer {
  public container: PIXI.Container;
  public prevMino: Tetromino;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.prevMino = null;
  }

  public render(type: TetrominoType): void {
    if (this.prevMino !== null) this.prevMino.clearRendered();
    const mino = new Tetromino(type, this.container);
    if (type === TetrominoType.I) {
      mino.x = -0.5;
    } else if (type === TetrominoType.O) {
      mino.x = 0.5;
    } else {
      mino.x = 0.0;
    }
    mino.render();
    this.prevMino = mino;
  }
}
