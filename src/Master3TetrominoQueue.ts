import { TetrominoType } from "./TetrominoData";
import { TetrominoQueue } from "./TetrominoQueue";
import TetrominoQueueContext from "./contexts/TetrominoQueueContext";

export class Master3TetrominoQueue extends TetrominoQueue {
  public constructor(context: TetrominoQueueContext) {
    super(context);

    const queue = this.context.tetrominoQueueStore.getTetrominoQueue();
    // Fisrt 3 minos must not be S or Z
    for (let i = 0; i < 3; i++) {
      if ([TetrominoType.S, TetrominoType.Z].includes(queue[i].type)) {
        for (let j = 3; j < 7; j++) {
          if (![TetrominoType.S, TetrominoType.Z].includes(queue[j].type)) {
            [queue[i], queue[j]] = [queue[j], queue[i]];
            break;
          }
        }
      }
    }
    this.context.tetrominoQueueAction.doUpdate(queue);
  }
}
