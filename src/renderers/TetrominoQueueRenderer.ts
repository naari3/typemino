import * as PIXI from "pixi.js";
import { Tetromino } from "../Tetromino";
import { TetrominoType } from "../TetrominoData";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { TetrominoQueue } from "../TetrominoQueue";
import { Observer } from "../Observer";

export class TetrominoQueueRenderer implements Observer<TetrominoQueue> {
  public containers: PIXI.Container[];
  private tetrominoRenderers: TetrominoRenderer[];

  public constructor(...containers: PIXI.Container[]) {
    this.containers = containers;
    this.tetrominoRenderers = containers.map(
      (container): TetrominoRenderer => new TetrominoRenderer(container)
    );
  }

  public render(queue: TetrominoQueue): void {
    for (let i = 0; i < this.containers.length; i++) {
      const type = queue.queue[i].type;
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

  public update(queue: TetrominoQueue): void {
    this.render(queue);
  }
}
