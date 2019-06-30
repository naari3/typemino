import { BlockColor } from "./BlockColor";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";

type gameModeType = "normal" | "fanfare" | "staffroll";

export class Master3Field extends Field {
  public gameMode: gameModeType;
  public hideTime: number;
  private hideTimers: number[][];

  public constructor(width: number, height: number, invisibleHeight: number) {
    super(width, height, invisibleHeight);
    this.gameMode = "normal";
    this.hideTimers = Array.from(
      new Array(this.actualBlockHeight),
      (): (BlockColor | null)[] => new Array(this.blockWidth).fill(null)
    );
  }

  public putMino(tetromino: Tetromino): void {
    if (this.gameMode === "staffroll") {
      tetromino.currentShape().forEach((xList, y): void => {
        xList.forEach((b, x): void => {
          if (b === 1) {
            if (this.hideTime > 0) {
              this.hideTimers[tetromino.y + this.invisibleHeight + y][
                tetromino.x + x
              ] = this.hideTime;
            } else if (this.hideTime <= 0) {
              this.transparencies[tetromino.y + this.invisibleHeight + y][
                tetromino.x + x
              ] = 0;
            }
          }
        });
      });
    }

    super.putMino(tetromino);
  }

  public clearLines(): number {
    this.blockColors.forEach((xList, y): void => {
      if (xList.every((x): boolean => !!x)) {
        this.hideTimers.splice(y, 1);
        this.hideTimers.unshift(Array(this.blockWidth).fill(null));
      }
    });
    return super.clearLines();
  }

  public tickTimer(): void {
    let changed = false;
    if (this.gameMode !== "staffroll") return;
    for (let y = 0; y < this.hideTimers.length; y++) {
      for (let x = 0; x < this.hideTimers[y].length; x++) {
        if (this.hideTimers[y][x] > 0) {
          changed = true;
          this.hideTimers[y][x]--;
        }
        if (this.hideTimers[y][x] < 60) {
          changed = true;
          this.transparencies[y][x] = this.hideTimers[y][x] / 60;
        }
      }
    }
    if (changed) this.notify();
  }
}
