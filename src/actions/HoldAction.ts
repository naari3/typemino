import { Action } from "material-flux";
import { HoldKeys } from "../constants/HoldKeys";
import { TetrominoType } from "../TetrominoData";

class HoldAction extends Action<TetrominoType> {
  public doUpdate(data: TetrominoType): void {
    // pass the `data` to Store's `onHandler`
    // call `onHandler(data);`
    this.dispatch(HoldKeys.doUpdate, data);
  }
}
export default HoldAction;
