import { SettingData } from "./Settings";

const defaultSettings: SettingData = {
  lockDelayTime: 30,
  areTime: 27,
  lineAreTime: 27,
  lineClearTime: 40,
  dasTime: 16,
  gravity: 65536 / 64, // gravity / gravityDenominator G
  gravityDenominator: 65536,
  rotateLockResetLimitMove: 8,
  moveLockResetLimitMove: 10,
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

export default {
  defaultSettings,
  settingsKey: "settings",
  blockWidth: 10,
  blockHeight: 20,
  invisibleHeight: 3
};
