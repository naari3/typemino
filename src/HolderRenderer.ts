import * as PIXI from "pixi.js";
import { Holder } from "./Holder";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { Tetromino } from "./Tetromino";
import { TetrominoType } from "./TetrominoData";

export class HolderRenderer {
  private container: PIXI.Container;
  private holder: Holder;
  private tetrominoRenderer: TetrominoRenderer;

  public constructor(container: PIXI.Container, holder: Holder) {
    this.container = container;
    this.holder = holder;
    this.tetrominoRenderer = new TetrominoRenderer(this.container);
  }

  public render(): void {
    const holdedTetromino = new Tetromino(this.holder.holdedTetrominoType);
    if (this.holder.holdedTetrominoType === TetrominoType.I) {
      holdedTetromino.y = -0.5;
      holdedTetromino.x = -0.5;
    } else if (this.holder.holdedTetrominoType === TetrominoType.O) {
      holdedTetromino.x = 0.5;
    } else {
      holdedTetromino.x = 0.0;
    }
    this.tetrominoRenderer.render(holdedTetromino);
  }
}
