import { TetrominoType } from "./TetrominoData";
import { Observable } from "./Observable";

export class Holder extends Observable {
  public holdedTetrominoType: TetrominoType;

  public constructor() {
    super();
    this.holdedTetrominoType = null;
  }

  public hold(type: TetrominoType): TetrominoType | null {
    let previousTetrominoType = null;
    if (this.holdedTetrominoType !== null) {
      previousTetrominoType = this.holdedTetrominoType;
    }
    this.holdedTetrominoType = type;
    this.notify();
    return previousTetrominoType;
  }
}
