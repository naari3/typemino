import * as PIXI from "pixi.js";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { Tetromino } from "../Tetromino";
import { TetrominoType } from "../TetrominoData";
import HoldStore from "../stores/HoldStore";
import HoldContext from "../contexts/HoldContext";

export class HolderRenderer {
  private container: PIXI.Container;
  private tetrominoRenderer: TetrominoRenderer;
  private store: HoldStore;

  public constructor(container: PIXI.Container, context: HoldContext) {
    this.container = container;
    this.store = context.holdStore;
    this.tetrominoRenderer = new TetrominoRenderer(this.container);
    this.store.onChange(this._onChange.bind(this));
  }

  public _onChange(): void {
    this.render(this.store.getTetrominoType());
  }

  public render(type: TetrominoType): void {
    const holdedTetromino = new Tetromino(type);
    holdedTetromino.x = 0.0;
    holdedTetromino.y = 0.0;
    if (type === TetrominoType.I) {
      holdedTetromino.y = -0.5;
      holdedTetromino.x = -0.5;
    } else if (type === TetrominoType.O) {
      holdedTetromino.x = 0.5;
    }
    this.tetrominoRenderer.render(holdedTetromino);
  }
}
