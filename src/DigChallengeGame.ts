import { Game } from "./Game";
import { SettingData } from "./Settings";
import { BlockColor } from "./BlockColor";

const noAre = {
  areTime: 0,
  lineAreTime: 0,
  lineClearTime: 0
};

export class DigChallengeGame extends Game {
  private fieldUpTimer: number;
  private prevHole: number;

  public constructor(w: number, h: number, settings: SettingData) {
    super(w, h, Object.assign(settings, noAre));
    this.fieldUpTimer = 180;
  }

  protected animate(): void {
    super.animate();
  }

  protected tickTimer(): void {
    super.tickTimer();
    if (this.fieldUpTimer > 0) {
      this.fieldUpTimer--;
      if (this.fieldUpTimer === 0) {
        this.fieldUp();
        this.fieldUpTimer = 180;
      }
    }
  }

  private fieldUp(): void {
    const colorLine = this.field.blockColors.shift();
    this.field.transparencies.shift();

    let hole: number;
    while (
      (hole = Math.floor(Math.random() * colorLine.length)) === this.prevHole
    );
    this.prevHole = hole;

    this.field.blockColors.push(
      colorLine.map(
        (v, x): BlockColor => {
          if (x === hole) return null;
          else return BlockColor.White;
        }
      )
    );

    this.field.transparencies.push(
      colorLine.map((_, x): number => {
        if (x === hole) return null;
        else return 1;
      })
    );
    this.field.notify();
  }
}
