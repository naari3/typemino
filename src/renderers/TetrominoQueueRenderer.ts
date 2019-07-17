import * as PIXI from "pixi.js";
import { Tetromino } from "../Tetromino";
import { TetrominoType } from "../TetrominoData";
import { TetrominoRenderer } from "./TetrominoRenderer";
import TetrominoQueueContext from "../contexts/TetrominoQueueContext";
import TetrominoQueueStore from "../stores/TetrominoQueueStore";

export class TetrominoQueueRenderer {
  public containers: PIXI.Container[];
  private tetrominoRenderers: TetrominoRenderer[];
  private store: TetrominoQueueStore;

  public constructor(
    context: TetrominoQueueContext,
    ...containers: PIXI.Container[]
  ) {
    this.store = context.tetrominoQueueStore;
    this.containers = containers;
    this.tetrominoRenderers = containers.map(
      (container): TetrominoRenderer => new TetrominoRenderer(container)
    );
    this.store.onChange(this._onChange.bind(this));
  }

  public _onChange(): void {
    this.render(this.store.getTetrominoQueue());
  }

  public render(queue: Tetromino[]): void {
    for (let i = 0; i < this.containers.length; i++) {
      const type = queue[i].type;
      const mino = new Tetromino(type);
      mino.x = 0.0;
      mino.y = 0.0;
      if (type === TetrominoType.I) {
        mino.x = -0.5;
        mino.y = -0.25;
      } else if (type === TetrominoType.O) {
        mino.x = 0.5;
      }
      this.tetrominoRenderers[i].render(mino);
    }
  }
}
