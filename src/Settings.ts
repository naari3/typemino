export interface SettingData {
  blockWidth: number;
  blockHeight: number;
  invisibleHeight: number;
  holdMinoScale: number;
  nextnextMinoScale: number;
  lockDelayTime: number;
  areTime: number;
  lineClearTime: number;
  dasTime: number;
  gravity: number;
  gravityDenominator: number; // gravity / gravityDenominator G
  rotateLockResetLimitMove: number;
  ghost: boolean;
  controller: {
    up: string;
    down: string;
    left: string;
    right: string;
    rotateLeft: string;
    rotateRight: string;
    hold: string;
  };
}
