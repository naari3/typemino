import * as PIXI from "pixi.js";
import { Holder } from "../Holder";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { Tetromino } from "../Tetromino";
import { TetrominoType } from "../TetrominoData";
import { Observer } from "../Observer";

export class HolderRenderer implements Observer<Holder> {
  private container: PIXI.Container;
  private tetrominoRenderer: TetrominoRenderer;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.tetrominoRenderer = new TetrominoRenderer(this.container);
  }

  public render(holder: Holder): void {
    const holdedTetromino = new Tetromino(holder.holdedTetrominoType);
    if (holder.holdedTetrominoType === TetrominoType.I) {
      holdedTetromino.y = -0.5;
      holdedTetromino.x = -0.5;
    } else if (holder.holdedTetrominoType === TetrominoType.O) {
      holdedTetromino.x = 0.5;
    } else {
      holdedTetromino.x = 0.0;
    }
    this.tetrominoRenderer.render(holdedTetromino);
  }

  public update(holder: Holder): void {
    this.render(holder);
  }
}
