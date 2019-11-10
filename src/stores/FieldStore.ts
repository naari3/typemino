import { Store, Context } from "material-flux";
import { FieldKeys } from "../constants/FieldKeys";
import { BlockColor } from "../BlockColor";
import deepcopy from "deepcopy";

interface FieldState {
  blockColors: BlockColor[][];
  transparencies: number[][];
}

export default class FieldStore extends Store {
  private state: FieldState;
  public constructor(context: Context) {
    super(context);
    this.state = {
      blockColors: deepcopy([[]]),
      transparencies: deepcopy([[]])
    };
    this.register(FieldKeys.doUpdate, this.onHandler);
  }

  public onHandler(state: FieldState): void {
    // data is come from Action
    this.setState(deepcopy(state));
  }

  // just getter method
  public getField(): FieldState {
    return deepcopy(this.state);
  }
}
