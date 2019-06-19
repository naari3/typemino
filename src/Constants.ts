export default {
  blockWidth: 10,
  blockHeight: 20,
  holdMinoScale: 0.8,
  nextnextMinoScale: 0.8,
  lockDelayTime: 30,
  areTime: 16,
  lineClearTime: 12,
  dasTime: 8,
  gravity: 65536 * 20, // 1 / gravityDenominator G
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
