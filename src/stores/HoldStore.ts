import { Store, Context } from "material-flux";
import { HoldKeys } from "../constants/HoldKeys";
import { TetrominoType } from "../TetrominoData";

export default class HoldStore extends Store {
  private state: Record<string, TetrominoType>;
  public constructor(context: Context) {
    super(context);
    this.state = {
      holdedMinoType: null
    };
    this.register(HoldKeys.doUpdate, this.onHandler);
  }

  public onHandler(type: TetrominoType): void {
    // data is come from Action
    this.setState({
      holdedMinoType: type
    });
  }

  // just getter method
  public getTetrominoType(): TetrominoType {
    return this.state.holdedMinoType;
  }
}
