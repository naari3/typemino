import { Tetromino } from "./Tetromino";
import TetrominoQueueContext from "./contexts/TetrominoQueueContext";

export class TetrominoQueue {
  protected context: TetrominoQueueContext;

  public constructor(context: TetrominoQueueContext) {
    this.context = context;
    this.context.tetrominoQueueAction.doUpdate(
      Tetromino.getRandomQueue().concat(Tetromino.getRandomQueue())
    );
  }

  public pop(): Tetromino {
    let queue = this.context.tetrominoQueueStore.getTetrominoQueue();
    const tetromino = queue.shift();
    if (queue.length < 7) {
      queue = queue.concat(Tetromino.getRandomQueue());
    }
    this.context.tetrominoQueueAction.doUpdate(queue);
    return tetromino;
  }
}
