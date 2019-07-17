import { TetrominoType } from "./TetrominoData";
import HoldContext from "./contexts/HoldContext";

export class Holder {
  public context: HoldContext;

  public constructor(context) {
    this.context = context;
  }

  public hold(type: TetrominoType): TetrominoType | null {
    let previousTetrominoType = this.context.holdStore.getTetrominoType();
    this.context.holdAction.doUpdate(type);
    return previousTetrominoType;
  }
}
