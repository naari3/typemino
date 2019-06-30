import { Observable } from "./Observable";
import { Tetromino } from "./Tetromino";

export class TetrominoQueue extends Observable {
  public queue: Tetromino[];

  public constructor() {
    super();
    this.queue = Tetromino.getRandomQueue().concat(Tetromino.getRandomQueue());
  }

  public pop(): Tetromino {
    if (this.queue.length < 7) {
      Array.prototype.push.apply(this.queue, Tetromino.getRandomQueue());
    }
    const tetromino = this.queue.shift();
    this.notify();
    return tetromino;
  }
}
