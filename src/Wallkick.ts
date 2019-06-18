import { Tetromino } from "./Tetromino";
import { Field } from "./Field";
import { AngleType } from "./AngleType";
import { TetrominoType } from "./TetrominoData";

const wallkickNormalL = [
  /* A >> D */ [[1, 0], [1, -1], [0, 2], [1, 2]],
  /* B >> A */ [[1, 0], [1, 1], [0, -2], [1, -2]],
  /* C >> B */ [[-1, 0], [-1, -1], [0, 2], [-1, 2]],
  /* D >> C */ [[-1, 0], [-1, 1], [0, -2], [-1, -2]]
];

const wallkickNormalR = [
  /* A >> B */ [[-1, 0], [-1, -1], [0, 2], [-1, 2]],
  /* B >> C */ [[1, 0], [1, 1], [0, -2], [1, -2]],
  /* C >> D */ [[1, 0], [1, -1], [0, 2], [1, 2]],
  /* D >> A */ [[-1, 0], [-1, 1], [0, -2], [-1, -2]]
];

const wallkickIL = [
  /* A >> D */ [[-1, 0], [2, 0], [-1, -2], [2, 1]],
  /* B >> A */ [[2, 0], [-1, 0], [2, -1], [-1, 2]],
  /* C >> B */ [[1, 0], [-2, 0], [1, 2], [-2, -1]],
  /* D >> C */ [[-2, 0], [1, 0], [-2, 1], [1, -2]]
];

const wallkickIR = [
  /* A >> B */ [[-2, 0], [1, 0], [-2, 1], [1, -2]],
  /* B >> C */ [[-1, 0], [2, 0], [-1, -2], [2, 1]],
  /* C >> D */ [[2, 0], [-1, 0], [2, -1], [-1, 2]],
  /* D >> A */ [[1, 0], [-2, 0], [1, 2], [-2, -1]]
];

// SRS
export class Wallkick {
  public getWallkickTable(tetromino: Tetromino): number[][][] {
    if (
      tetromino.previousAngle - 1 === tetromino.angle ||
      (tetromino.previousAngle === AngleType.A &&
        tetromino.angle === AngleType.D)
    ) {
      // Left
      return tetromino.isType(TetrominoType.I) ? wallkickIL : wallkickNormalL;
    } else if (
      tetromino.previousAngle + 1 === tetromino.angle ||
      (tetromino.previousAngle === AngleType.D &&
        tetromino.angle === AngleType.A)
    ) {
      // Right
      return tetromino.isType(TetrominoType.I) ? wallkickIR : wallkickNormalR;
    }
  }

  public executeWallkick(tetromino: Tetromino, field: Field): boolean {
    const wallkickTable = this.getWallkickTable(tetromino);

    for (let i = 0; i < wallkickTable[tetromino.previousAngle].length; i++) {
      const x = wallkickTable[tetromino.previousAngle][i][0];
      const y = wallkickTable[tetromino.previousAngle][i][1];

      tetromino.x += x;
      tetromino.y += y;
      if (!field.isCollision(tetromino)) {
        return true;
      }
      tetromino.x -= x;
      tetromino.y -= y;
    }
    return false;
  }
}
