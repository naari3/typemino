import { Game } from "./Game";
import { SettingData } from "./Settings";
import { Master3Field } from "./Master3Field";
import Constants from "./Constants";
import { Master3InfoRenderer } from "./renderers/Master3InfoRenderer";
import { Master3TetrominoQueue } from "./Master3TetrominoQueue";

const defaultSettings = {
  lockDelayTime: 30,
  areTime: 25,
  lineClearTime: 40,
  dasTime: 14,
  gravity: 65536 / 64,
  gravityDenominator: 65536,
  rotateLockResetLimitMove: 10,
  ghost: true
};

const coolTimeTable = [3120, 3120, 2940, 2700, 2700, 2520, 2520, 2280, 2280, 0]; // prettier-ignore
const regretTimeTable = [5400, 4500, 4500, 4080, 3600, 3600, 3000, 3000, 3000, 3000]; // prettier-ignore

// prettier-ignore
const gravityChangeTable = {
  0: 1024, 30: 1536, 35: 2048, 40: 2560, 50: 3072, 60: 4096, 70: 8192, 80: 12288, 90: 16384,
  100: 20480, 120: 24576, 140: 28672, 160: 32768, 170: 36864,
  200: 1024, 220: 8192, 230: 16384, 233: 24576, 236: 32768, 239: 40960, 243: 49152, 247: 57344, 251: 65536,
  300: 131072, 330: 196608, 360: 262144,
  400: 327680, 420: 262144, 450: 196608,
  500: 1310720 // here comes to 20 G
}

// prettier-ignore
const areTimeChangeTable = {
  0: 25, 700: 16, 800: 12, 1000: 6, 1100: 5, 1200: 4
};

// prettier-ignore
const lineAreTimeChangeTable = {
  0: 25, 600: 16, 700: 12, 800: 6, 1100: 5, 1200: 4
};

// prettier-ignore
const dasTimeChangeTable = {
  0: 14, 500: 8, 900: 6
};

// prettier-ignore
const lockDelayTimeChangeTable = {
  0: 30, 900: 17, 1100: 15
};

// prettier-ignore
const lineClearTimeChangeTable = {
  0: 40, 500: 25, 600: 16, 700: 12, 800: 6
};

// prettier-ignore
const ghostChangeTable = {
  0: true, 100: false
};

type gameModeType = "normal" | "fanfare" | "staffroll";

export class Master3Game extends Game {
  private master3InfoRenderer: Master3InfoRenderer;
  protected field: Master3Field;
  protected tetrominoQueue: Master3TetrominoQueue;
  private currentLevel: number;
  private currentInternalLevel: number;
  private sectionTimer: number;
  private fanfareTimer: number;
  private staffrollTimer: number;
  private skillDisplayTimer: number;
  private coolDisplayed: boolean;
  private getCoolFlag: boolean;
  private gameMode: gameModeType;
  private endTime: Date;

  public constructor(w: number, h: number, settings: SettingData) {
    const field = new Master3Field(
      Constants.blockWidth,
      Constants.blockHeight,
      Constants.invisibleHeight
    );
    const queue = new Master3TetrominoQueue();
    super(w, h, Object.assign(settings, defaultSettings), field, queue);
    this.master3InfoRenderer = new Master3InfoRenderer(this.container);

    this.currentLevel = 0;
    this.currentInternalLevel = this.currentLevel;
    this.sectionTimer = 0;
    this.getCoolFlag = false;
    this.gameMode = "normal";
    this.fanfareTimer = 0;
    this.staffrollTimer = 0;
    this.skillDisplayTimer = 0;
    this.coolDisplayed = false;
    this.endTime = null;
    this.adjustSettingsValue(this.currentLevel);

    this.master3InfoRenderer.renderLevel(this.currentLevel);
  }

  protected animate(): void {
    if (this.gameMode === "staffroll") {
      if (this.staffrollTimer > 3270) {
        if (this.tetromino !== null) {
          this.congrats();
        }
        this.tetromino = null;
        return;
      } else {
        if ((3270 - this.staffrollTimer) % 60 === 0) {
          console.log(`${(3270 - this.staffrollTimer) / 60} sec(s) remaining`); // eslint-disable-line no-console
        }
      }
    }
    if (this.gameMode === "normal") {
      super.animate();
    } else if (this.gameMode === "fanfare") {
      if (this.fanfareTimer++ > 180) {
        this.setStaffRollMode();
      }
    } else if (this.gameMode === "staffroll") {
      super.animate();
    }
  }

  protected fixMino(): void {
    if (this.gameMode === "staffroll") return super.fixMino();

    let prevLevel = this.currentLevel;
    if (
      (this.currentLevel % 100 !== 99 &&
        Math.floor(this.currentLevel / 100) !== 9) ||
      (Math.floor(this.currentLevel / 100) === 9 && this.currentLevel !== 998)
    ) {
      this.currentLevel++;
      this.currentInternalLevel++;
    }

    super.fixMino();

    if (
      60 <= prevLevel % 100 &&
      prevLevel % 100 < 70 &&
      this.currentLevel % 100 >= 70
    ) {
      if (
        coolTimeTable[Math.floor(this.currentLevel / 100)] > this.sectionTimer
      ) {
        this.getCoolFlag = true;
      }
    }

    if (
      this.currentLevel % 100 >= 82 &&
      this.getCoolFlag &&
      !this.coolDisplayed
    ) {
      this.master3InfoRenderer.renderSkill("COOL!!");
      this.skillDisplayTimer = 180;
      this.coolDisplayed = true;
    }

    // maybe level up
    if (prevLevel % 100 > this.currentLevel % 100) {
      if (regretTimeTable[Math.floor(prevLevel / 100)] < this.sectionTimer) {
        this.master3InfoRenderer.renderSkill("REGRET");
        this.skillDisplayTimer = 180;
      }
      if (this.getCoolFlag) this.currentInternalLevel += 100;
      this.getCoolFlag = false;
      this.coolDisplayed = false;
      this.sectionTimer = 0;
    }

    this.master3InfoRenderer.renderLevel(this.currentLevel);

    if (this.currentLevel >= 999 && this.gameMode === "normal") {
      this.currentLevel = 999;
      this.gameMode = "fanfare";
      this.sectionTimer = 0;
      this.endTime = new Date();
      return;
    }

    this.adjustSettingsValue(this.currentInternalLevel);
  }

  private adjustSettingsValue(level: number): void {
    this.settings.gravity =
      gravityChangeTable[
        this.beforeLevel(level, Object.keys(gravityChangeTable).map(Number))
      ];
    this.settings.areTime =
      areTimeChangeTable[
        this.beforeLevel(level, Object.keys(areTimeChangeTable).map(Number))
      ];
    this.settings.areTime =
      lineAreTimeChangeTable[
        this.beforeLevel(level, Object.keys(lineAreTimeChangeTable).map(Number))
      ];
    this.settings.dasTime =
      dasTimeChangeTable[
        this.beforeLevel(level, Object.keys(dasTimeChangeTable).map(Number))
      ];
    this.settings.lockDelayTime =
      lockDelayTimeChangeTable[
        this.beforeLevel(
          level,
          Object.keys(lockDelayTimeChangeTable).map(Number)
        )
      ];
    this.settings.lineClearTime =
      lineClearTimeChangeTable[
        this.beforeLevel(
          level,
          Object.keys(lineClearTimeChangeTable).map(Number)
        )
      ];
    this.settings.ghost =
      ghostChangeTable[
        this.beforeLevel(level, Object.keys(ghostChangeTable).map(Number))
      ];
  }

  private beforeLevel(currentLevel: number, levelKeys: number[]): number {
    for (let i = 0; i < levelKeys.length + 1; i++) {
      if (levelKeys[i] <= currentLevel) continue;
      return levelKeys[i - 1] !== undefined
        ? levelKeys[i - 1]
        : levelKeys[levelKeys.length - 1];
    }
  }

  protected calcScore(clearLines: number): void {
    super.calcScore(clearLines);
    let plusLevels = clearLines;
    if (clearLines === 3) plusLevels = 4;
    if (clearLines === 4) plusLevels = 6;
    this.currentLevel += plusLevels;
    this.currentInternalLevel += plusLevels;
  }

  protected tickTimer(): void {
    super.tickTimer();
    this.sectionTimer++;
    this.field.tickTimer();
    if (this.gameMode === "staffroll") {
      this.staffrollTimer++;
    }
    if (this.skillDisplayTimer > 0) {
      this.skillDisplayTimer--;
      if (this.skillDisplayTimer === 0) {
        this.master3InfoRenderer.renderSkill("");
      }
    }
  }

  protected renderTimer(): void {
    if (this.endTime !== null) {
      this.gameRenderer.renderTimer(
        new Date(+this.endTime - +this.startTime).toJSON().substr(11, 11)
      );
    } else {
      this.gameRenderer.renderTimer(
        new Date(+new Date() - +this.startTime).toJSON().substr(11, 11)
      );
    }
  }

  private setStaffRollMode(): void {
    this.field.blockColors.forEach((xList, y): void => {
      xList.forEach((color, x): void => {
        if (color !== null) {
          this.field.blockColors[y][x] = null;
        }
      });
    });

    this.field.transparencies.forEach((xList, y): void => {
      xList.forEach((tp, x): void => {
        if (tp !== null) {
          this.field.transparencies[y][x] = null;
        }
      });
    });
    this.field.notify();

    this.gameMode = "staffroll";
    this.field.gameMode = "staffroll";
    this.field.hideTime = 300;
  }

  private congrats(): void {
    console.log("%cCONGRATULATIONS!!!", "font-weight: bold;font-size: 40px;"); // eslint-disable-line no-console
    for (let y = 0; y < this.field.transparencies.length; y++) {
      for (let x = 0; x < this.field.transparencies[y].length; x++) {
        this.field.transparencies[y][x] = 1;
      }
    }
    this.field.notify();
  }
}
