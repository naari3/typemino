import { Action } from "material-flux";
import { TetrominoQueueKeys } from "../constants/TetrominoQueueKeys";
import { Tetromino } from "../Tetromino";

export default class TetrominoQueueAction extends Action<Tetromino[]> {
  public doUpdate(data: Tetromino[]): void {
    // pass the `data` to Store's `onHandler`
    // call `onHandler(data);`
    this.dispatch(TetrominoQueueKeys.doUpdate, data);
  }
}
