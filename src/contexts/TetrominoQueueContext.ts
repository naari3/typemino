import { Context } from "material-flux";
import TetrominoQueueAction from "../actions/TetrominoQueueAction";
import TetrominoQueueStore from "../stores/TetrominoQueueStore";

export default class TetrominoQueueContext extends Context {
  public tetrominoQueueAction: TetrominoQueueAction;
  public tetrominoQueueStore: TetrominoQueueStore;
  public constructor() {
    super();
    this.tetrominoQueueAction = new TetrominoQueueAction(this);
    this.tetrominoQueueStore = new TetrominoQueueStore(this);
  }
}
