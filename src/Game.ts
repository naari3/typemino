import * as PIXI from "pixi.js";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";
import { Keyboard } from "./Keyboard";
import { Wallkick } from "./Wallkick";
import { Holder } from "./Holder";
import { SettingData } from "./Settings";
import { GameRenderer } from "./renderer/GameRenderer";
import Constants from "./Constants";
import { BlockColor } from "./BlockColor";

type exclusionFlagType = "left" | "right";
type gameStateType = "playing" | "gameover";

export class Game {
  protected app: PIXI.Application;
  protected container: PIXI.Container;
  protected loader: PIXI.loaders.Loader;
  protected window: { w: number; h: number };

  protected settings: SettingData;

  protected upKey: Keyboard;
  protected downKey: Keyboard;
  protected leftKey: Keyboard;
  protected rightKey: Keyboard;
  protected rotateLeftKey: Keyboard;
  protected rotateRightKey: Keyboard;
  protected holdKey: Keyboard;

  protected field: Field;
  protected tetromino: Tetromino;
  protected tetrominoQueue: Tetromino[];
  protected holder: Holder;
  protected isHolded: boolean;

  protected lockDelayTimer: number;
  protected areTimer: number;
  protected lineClearTimer: number;
  protected dasTimer: number;
  protected gravityTimer: number;

  protected rotateCount: number;
  protected moveCount: number;

  protected moveExclusionFlag: exclusionFlagType;
  protected gameState: gameStateType;

  protected startTime: Date;

  protected gameRenderer: GameRenderer;

  public constructor(
    w: number,
    h: number,
    settings: SettingData,
    field?: Field
  ) {
    this.app = new PIXI.Application({
      width: w,
      height: h,
      backgroundColor: 0xdddddd
    });

    this.settings = settings;

    document.querySelector("#typemino").appendChild(this.app.view);

    this.window = { w: w, h: h };

    this.tetrominoQueue = Tetromino.getRandomQueue().concat(
      Tetromino.getRandomQueue()
    );

    this.field =
      field ||
      new Field(
        Constants.blockWidth,
        Constants.blockHeight,
        Constants.invisibleHeight
      );
    this.holder = new Holder();

    this.container = new PIXI.Container();
    this.gameRenderer = new GameRenderer(
      this.container,
      this.field,
      this.tetrominoQueue,
      this.holder
    );
    this.app.stage.addChild(this.container);

    this.tetromino = this.popTetrominoQueue();

    this.lockDelayTimer = 0;
    this.areTimer = 0;
    this.lineClearTimer = 0;
    this.dasTimer = 0;
    this.gravityTimer = 0;

    this.rotateCount = 0;
    this.moveCount = 0;

    this.moveExclusionFlag = null;
    this.gameState = null;

    this.startTime = new Date();

    this.initializeKeyEvents();

    this.loader = new PIXI.Loader();

    this.app.ticker.add((): void => {
      this.animate();
    });
  }

  protected renderGhost(): void {
    if (this.settings.ghost)
      this.gameRenderer.renderGhost(this.tetromino, this.field);
  }

  protected animate(): void {
    if (this.gameState === "gameover") return;
    if (this.tetromino !== null) {
      this.freeFall();
    } else if (!this.isLockTime()) {
      this.tetromino = this.popTetrominoQueue();
      // initial hold system
      if (this.holdKey.isDown) {
        this.holdMino();
      }

      // initial rotate system
      if (this.rotateLeftKey.isDown) {
        this.rotateLeft();
      } else if (this.rotateRightKey.isDown) {
        this.rotateRight();
      }

      // check gameover
      if (this.field.isCollision(this.tetromino)) {
        this.gameState = "gameover";
        this.fixMino();
        this.field.fillAllBlock(BlockColor.Glay);
        this.gameRenderer.clearRenderedGhost();
        this.gameRenderer.clearRenderedTetromino();
        this.gameRenderer.renderField();
        return;
      }
    }

    if (this.leftKey.isDown && this.rightKey.isDown) {
      this.moveExclusionFlag === "left" ? this.moveLeft() : this.moveRight();
    } else if (this.leftKey.isDown) {
      this.moveLeft();
    } else if (this.rightKey.isDown) {
      this.moveRight();
    }
    if (this.tetromino !== null) {
      this.renderGhost();
    }

    this.tickTimer();
  }

  protected initializeKeyEvents(): void {
    this.upKey = new Keyboard(this.settings.controller.up);
    this.upKey.press = this.hardDrop.bind(this);

    this.downKey = new Keyboard(this.settings.controller.down);
    this.leftKey = new Keyboard(this.settings.controller.left);
    this.rightKey = new Keyboard(this.settings.controller.right);

    this.rotateLeftKey = new Keyboard(this.settings.controller.rotateLeft);
    this.rotateLeftKey.press = this.rotateLeft.bind(this);

    this.rotateRightKey = new Keyboard(this.settings.controller.rotateRight);
    this.rotateRightKey.press = this.rotateRight.bind(this);

    this.holdKey = new Keyboard(this.settings.controller.hold);
    this.holdKey.press = this.holdMino.bind(this);
  }

  protected setControllerExclusion(direction: exclusionFlagType): void {
    if (this.moveExclusionFlag !== direction) {
      this.moveExclusionFlag = direction;
      this.dasTimer = 0;
    }
  }

  protected freeFall(): void {
    if (this.isFallOneBlock()) {
      for (
        let i = 0;
        i < Math.ceil(this.settings.gravity / this.settings.gravityDenominator);
        i++
      ) {
        this.tetromino.y++;
        if (this.field.isCollision(this.tetromino)) {
          break;
        }
      }
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.y--;
        if (this.lockDelayTimer > this.settings.lockDelayTime) {
          return this.fixMino();
        }
      }
    }

    this.gameRenderer.renderTetromino(this.tetromino);
  }

  protected hardDrop(): void {
    if (this.isLockTime()) return;
    while (!this.field.isCollision(this.tetromino)) {
      this.tetromino.y++;
    }
    this.tetromino.y--;
    this.fixMino();
  }

  protected fixMino(): void {
    let clearedLines = 0;
    this.field.putMino(this.tetromino);

    this.areTimer = this.settings.areTime;
    if ((clearedLines = this.field.transparentLines()) !== 0) {
      this.lineClearTimer = this.settings.lineClearTime;
      this.areTimer = this.settings.lineAreTime;
      if (this.lineClearTimer === 0) {
        this.field.clearLines();
      }
    }
    this.gameRenderer.clearRenderedTetromino();
    this.gameRenderer.clearRenderedGhost();
    this.gameRenderer.renderField();
    this.tetromino = null;
    this.isHolded = false;
    this.rotateCount = 0;
    this.moveCount = 0;
    this.gravityTimer = 0;
    this.calcScore(clearedLines);
  }

  protected calcScore(clearLines: number): void {
    clearLines;
  }

  protected moveLeft(): void {
    this.setControllerExclusion("left");
    if (this.tetromino === null) return;
    let moved = true;
    if (this.dasTimer === 0 || this.dasTimer >= this.settings.dasTime) {
      this.tetromino.x--;
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.x++;
        moved = false;
      }
    }
    if (moved) {
      this.increaseMoveCount();
    }
  }

  protected moveRight(): void {
    this.setControllerExclusion("right");
    if (this.tetromino === null) return;
    let moved = true;
    if (this.dasTimer === 0 || this.dasTimer >= this.settings.dasTime) {
      this.tetromino.x++;
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.x--;
        moved = false;
      }
    }
    if (moved) {
      this.increaseMoveCount();
    }
  }

  protected rotateLeft(): void {
    if (this.tetromino !== null) {
      const result = this.doRotate(
        this.tetromino.rotateLeft.bind(this.tetromino),
        this.tetromino.rotateRight.bind(this.tetromino)
      );
      if (result) this.increaseRotateCount();
    }
  }

  protected rotateRight(): void {
    if (this.tetromino !== null) {
      const result = this.doRotate(
        this.tetromino.rotateRight.bind(this.tetromino),
        this.tetromino.rotateLeft.bind(this.tetromino)
      );
      if (result) this.increaseRotateCount();
    }
  }

  protected doRotate(expect: Function, recover: Function): boolean {
    if (this.isLockTime()) return false;
    expect();
    if (this.field.isCollision(this.tetromino)) {
      if (!new Wallkick().executeWallkick(this.tetromino, this.field)) {
        recover();
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  protected increaseRotateCount(): void {
    if (this.isRotateCountExceed()) {
      this.lockDelayTimer = 0;
    }
    this.rotateCount += 1;
  }

  protected increaseMoveCount(): void {
    if (this.isMoveCountExceed()) {
      this.lockDelayTimer = 0;
    }
    this.moveCount += 1;
  }

  protected holdMino(): boolean {
    if (this.tetromino === null || this.isHolded || this.isLockTime())
      return false;
    this.isHolded = true;

    const previousHoldedTetrominoType = this.holder.hold(this.tetromino.type);
    this.lockDelayTimer = 0;
    this.gameRenderer.renderHolder();
    if (previousHoldedTetrominoType !== null) {
      this.tetromino = new Tetromino(previousHoldedTetrominoType);
    } else {
      this.tetromino = this.popTetrominoQueue();
    }
    return true;
  }

  protected popTetrominoQueue(): Tetromino {
    if (this.tetrominoQueue.length < 7) {
      Array.prototype.push.apply(
        this.tetrominoQueue,
        Tetromino.getRandomQueue()
      );
    }
    const tetromino = this.tetrominoQueue.shift();
    this.lockDelayTimer = 0;
    this.gameRenderer.renderNext();
    return tetromino;
  }

  protected tickTimer(): void {
    if (this.tetromino !== null) {
      this.tetromino.y++;
      if (this.field.isCollision(this.tetromino)) {
        this.lockDelayTimer += 1;
      } else {
        this.rotateCount = 0;
        this.moveCount = 0;
        this.lockDelayTimer = 0;
      }
      this.tetromino.y--;
    }

    if (this.lineClearTimer > 0) {
      if (this.lineClearTimer === 1) {
        this.field.clearLines();
        this.gameRenderer.renderField();
      }
      this.lineClearTimer -= 1;
    } else {
      if (this.areTimer > 0) this.areTimer -= 1;
    }

    if (this.leftKey.isDown || this.rightKey.isDown) {
      this.dasTimer += 1;
    } else {
      this.dasTimer = 0;
    }

    if (this.settings.gravity < this.settings.gravityDenominator) {
      if (this.tetromino !== null) {
        if (this.downKey.isDown) {
          this.gravityTimer += this.settings.gravityDenominator;
        } else {
          this.gravityTimer += this.settings.gravity;
        }
      }
    }

    this.renderTimer();
  }

  protected renderTimer(): void {
    this.gameRenderer.renderTimer(
      new Date(+new Date() - +this.startTime).toJSON().substr(11, 11)
    );
  }

  // Can't move anything if this return true
  protected isLockTime(): boolean {
    return this.lineClearTimer !== 0 || this.areTimer !== 0;
  }

  protected isFallOneBlock(): boolean {
    if (this.settings.gravity >= this.settings.gravityDenominator) return true;
    if (this.gravityTimer >= this.settings.gravityDenominator) {
      this.gravityTimer = 0;
      return true;
    } else {
      return false;
    }
  }

  protected isRotateCountExceed(): boolean {
    return this.rotateCount < this.settings.rotateLockResetLimitMove;
  }

  protected isMoveCountExceed(): boolean {
    return this.moveCount < this.settings.moveLockResetLimitMove;
  }
}
