import { Observable } from "./Observable";
import { Tetromino } from "./Tetromino";
import { TetrominoType } from "./TetrominoData";

export class Master3TetrominoQueue extends Observable {
  public queue: Tetromino[];

  public constructor() {
    super();
    this.queue = Tetromino.getRandomQueue().concat(Tetromino.getRandomQueue());

    // Fisrt 3 minos must not be S or Z
    for (let i = 0; i < 3; i++) {
      if ([TetrominoType.S, TetrominoType.Z].includes(this.queue[i].type)) {
        for (let j = 3; j < 7; j++) {
          if (
            ![TetrominoType.S, TetrominoType.Z].includes(this.queue[j].type)
          ) {
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
            break;
          }
        }
      }
    }
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
