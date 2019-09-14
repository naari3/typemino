import { Action } from "material-flux";
import { FieldKeys } from "../constants/FieldKeys";
import { BlockColor } from "../BlockColor";

interface FieldState {
  blockColors: BlockColor[][];
  transparencies: number[][];
}

class FieldAction extends Action<FieldState> {
  public doUpdate(data: FieldState): void {
    // pass the `data` to Store's `onHandler`
    // call `onHandler(data);`
    this.dispatch(FieldKeys.doUpdate, data);
  }
}
export default FieldAction;
