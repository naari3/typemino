import { Game } from "./Game";
import { SettingData } from "./Settings";

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

const coolTimeTable    = [3120, 3120, 2940, 2700, 2700, 2520, 2520, 2280, 2280, 0]; // prettier-ignore
const regretTimeTable = [5400, 4500, 4500, 4080, 3600, 3600, 3000, 3000, 3000, 3000]; // prettier-ignore

// prettier-ignore
const gravityChangeTable = {
  0: 1024, 30: 1536, 35: 2048, 40: 2560, 50: 3072, 60: 4096, 70: 8192, 80: 12288, 90: 16384,
  100: 20480, 120: 24576, 140: 28672,  160: 32768,  170: 36864,
  200: 1024, 239: 40960, 243: 49152, 247: 57344, 251: 65536,
  300: 131072, 330: 196608, 360: 262144,
  400: 327680, 420: 262144, 450: 196608,
  500: 1310720 // here comes to 20 G
}

// prettier-ignore
const areTimeChangeTable = {
  0: 25, 700: 16, 800: 12, 1000: 6, 1100: 5, 1200: 4
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

export class Master3Game extends Game {
  private currentLevel: number;
  private currentInternalLevel: number;
  private sectionTimer: number;
  private getCoolFlag: boolean;

  public constructor(w: number, h: number, settings: SettingData) {
    super(w, h, Object.assign(settings, defaultSettings));

    this.currentLevel = 0;
    this.currentInternalLevel = 0;
    this.sectionTimer = 0;
    this.getCoolFlag = false;
    this.adjustSettingsValue(this.currentLevel);
  }

  protected fixMino(): void {
    if (this.currentLevel % 100 !== 99) {
      this.currentLevel++;
      this.currentInternalLevel++;
    }

    let prevLevel = this.currentLevel;
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
        console.log("%cCOOL!!", "font-weight: bold;font-size: 20px;"); // eslint-disable-line no-console
      }
    }

    // maybe level up
    if (prevLevel % 100 > this.currentLevel % 100) {
      if (
        regretTimeTable[Math.floor(this.currentLevel / 100)] < this.sectionTimer
      ) {
        console.log("%cREGRET!!", "font-weight: bold;font-size: 20px;"); // eslint-disable-line no-console
      }
      if (this.getCoolFlag) this.currentInternalLevel += 100;
    }

    this.sectionTimer = 0;
    this.adjustSettingsValue(this.currentInternalLevel);

    console.log(this.currentLevel); // eslint-disable-line no-console
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
  }

  protected tickTimer(): void {
    super.tickTimer();
    this.sectionTimer++;
  }
}
