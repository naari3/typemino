import { TetrominoType } from "./TetrominoData";

export class Holder {
  public holdedTetrominoType: TetrominoType;

  public constructor() {
    this.holdedTetrominoType = null;
  }

  public hold(type: TetrominoType): TetrominoType | null {
    let previousTetrominoType = null;
    if (this.holdedTetrominoType !== null) {
      previousTetrominoType = this.holdedTetrominoType;
    }
    this.holdedTetrominoType = type;
    return previousTetrominoType;
  }
}
