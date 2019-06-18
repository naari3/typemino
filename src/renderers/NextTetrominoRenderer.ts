import * as PIXI from "pixi.js";
import { Tetromino } from "../Tetromino";
import { TetrominoType } from "../TetrominoData";

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
    mino.x = 0;
    mino.render();
    this.prevMino = mino;
  }
}
