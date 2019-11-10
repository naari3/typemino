import { Store, Context } from "material-flux";
import { TetrominoQueueKeys } from "../constants/TetrominoQueueKeys";
import { Tetromino } from "../Tetromino";

export default class TetrominoQueueStore extends Store {
  private state: Record<"tetrominoQueue", Tetromino[]>;
  public constructor(context: Context) {
    super(context);
    this.state = {
      tetrominoQueue: null
    };
    this.register(TetrominoQueueKeys.doUpdate, this.onHandler);
  }

  public onHandler(queue: Tetromino[]): void {
    // data is come from Action
    this.setState({
      tetrominoQueue: queue
    });
  }

  // just getter method
  public getTetrominoQueue(): Tetromino[] {
    return this.state.tetrominoQueue;
  }
}
