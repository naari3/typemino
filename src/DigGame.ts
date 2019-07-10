import { Game } from "./Game";
import { SettingData } from "./Settings";
import { Field } from "./Field";
import Constants from "./Constants";
import { BlockColor } from "./BlockColor";
import deepcopy from "deepcopy";

const noAre = {
  areTime: 0,
  lineAreTime: 0,
  lineClearTime: 0
};

export class DigGame extends Game {
  public constructor(w: number, h: number, settings: SettingData) {
    const field = new Field(
      Constants.blockWidth,
      Constants.blockHeight,
      Constants.invisibleHeight
    );
    let prevHole: number;
    let hole: number;
    field.blockColors = field.blockColors.map((xList, y): BlockColor[] => {
      while ((hole = Math.floor(Math.random() * xList.length)) === prevHole);
      prevHole = hole;
      return xList.map(
        (_, x): BlockColor => {
          if (hole === x) return null;
          if (y > Constants.blockHeight - 10) return BlockColor.White;
          else return null;
        }
      );
    });
    field.transparencies = field.transparencies.map((xList, y): number[] => {
      return xList.map((_, x): number => {
        if (field.blockColors[y][x] !== null) return 1;
        else return null;
      });
    });

    super(w, h, Object.assign(settings, noAre), field);
    field.notify();
  }
  protected fixMino(): void {
    const field = new Field(
      this.field.blockWidth,
      this.field.blockHeight,
      this.field.invisibleHeight
    );
    field.blockColors = deepcopy(this.field.blockColors);
    field.putMino(this.tetromino);

    const clearedLastLine = field.blockColors[
      field.blockColors.length - 1
    ].every((x): boolean => !!x);

    super.fixMino();
    if (clearedLastLine) this.gameState = "gameover";
  }
}
