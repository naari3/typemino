import { SettingData } from "./Settings";

const defaultSettings: SettingData = {
  blockWidth: 10,
  blockHeight: 20,
  invisibleHeight: 1,
  holdMinoScale: 0.8,
  nextnextMinoScale: 0.8,
  lockDelayTime: 30,
  areTime: 16,
  lineClearTime: 12,
  dasTime: 8,
  gravity: 65536 / 64, // gravity / gravityDenominator G
  gravityDenominator: 65536,
  rotateLockResetLimitMove: 10,
  ghost: true,
  controller: {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    rotateLeft: "j",
    rotateRight: "k",
    hold: " "
  }
};

export default { defaultSettings };
