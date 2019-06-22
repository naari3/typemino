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

  private settings: SettingData;

  private upKey: Keyboard;
  private downKey: Keyboard;
  private leftKey: Keyboard;
  private rightKey: Keyboard;
  private rotateLeftKey: Keyboard;
  private rotateRightKey: Keyboard;
  private holdKey: Keyboard;

  private field: Field;
  private tetromino: Tetromino;
  private tetrominoQueue: Tetromino[];
  private holder: Holder;
  private isHolded: boolean;

  private lockDelayTimer: number;
  private areTimer: number;
  private lineClearTimer: number;
  private dasTimer: number;
  private gravityTimer: number;

  private rotateCount: number;

  private moveExclusionFlag: exclusionFlagType;
  private gameState: gameStateType;

  private gameRenderer: GameRenderer;

  public constructor(w: number, h: number, settings: SettingData) {
    this.app = new PIXI.Application({
      width: w,
      height: h,
      backgroundColor: 0xdddddd
    });

    this.settings = settings;

    document.querySelector("#minomino").appendChild(this.app.view);

    this.window = { w: w, h: h };

    this.tetrominoQueue = Tetromino.getRandomQueue().concat(
      Tetromino.getRandomQueue()
    );

    this.field = new Field(
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

    this.moveExclusionFlag = null;

    this.initializeKeyEvents();

    this.loader = new PIXI.Loader();

    this.app.ticker.add((): void => {
      this.animate();
    });
  }

  private renderGhost(): void {
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

    if (this.tetromino !== null) {
      if (this.leftKey.isDown && this.rightKey.isDown) {
        this.moveExclusionFlag === "left" ? this.moveLeft() : this.moveRight();
      } else if (this.leftKey.isDown) {
        this.moveLeft();
      } else if (this.rightKey.isDown) {
        this.moveRight();
      }
      this.renderGhost();
    }

    this.tickTimer();
  }

  private initializeKeyEvents(): void {
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

  private setControllerExclusion(direction: exclusionFlagType): void {
    if (this.moveExclusionFlag !== direction) {
      this.moveExclusionFlag = direction;
      this.dasTimer = 0;
    }
  }

  private freeFall(): void {
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

  private hardDrop(): void {
    if (this.isLockTime()) return;
    while (!this.field.isCollision(this.tetromino)) {
      this.tetromino.y++;
    }
    this.tetromino.y--;
    this.fixMino();
  }

  private fixMino(): void {
    this.field.putMino(this.tetromino);
    if (this.field.transparentLines() !== 0) {
      this.lineClearTimer = this.settings.lineClearTime;
      if (this.lineClearTimer === 0) {
        this.field.clearLines();
      }
    }
    this.gameRenderer.clearRenderedTetromino();
    this.gameRenderer.clearRenderedGhost();
    this.gameRenderer.renderField();
    this.tetromino = null;
    this.areTimer = this.settings.areTime;
    this.isHolded = false;
    this.rotateCount = 0;
    this.gravityTimer = 0;
  }

  private moveLeft(): void {
    this.setControllerExclusion("left");
    if (this.dasTimer === 0 || this.dasTimer >= this.settings.dasTime) {
      this.tetromino.x--;
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.x++;
      }
    }
  }

  private moveRight(): void {
    this.setControllerExclusion("right");
    if (this.dasTimer === 0 || this.dasTimer >= this.settings.dasTime) {
      this.tetromino.x++;
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.x--;
      }
    }
  }

  private rotateLeft(): void {
    if (this.tetromino !== null) {
      const result = this.doRotate(
        this.tetromino.rotateLeft.bind(this.tetromino),
        this.tetromino.rotateRight.bind(this.tetromino)
      );
      if (result) this.increaseRotateCount();
    }
  }

  private rotateRight(): void {
    if (this.tetromino !== null) {
      const result = this.doRotate(
        this.tetromino.rotateRight.bind(this.tetromino),
        this.tetromino.rotateLeft.bind(this.tetromino)
      );
      if (result) this.increaseRotateCount();
    }
  }

  private doRotate(expect: Function, recover: Function): boolean {
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

  private increaseRotateCount(): void {
    if (this.isLockDelayReset()) {
      this.lockDelayTimer = 0;
    }
    this.rotateCount += 1;
  }

  private holdMino(): boolean {
    if (this.tetromino === null || this.isHolded || this.isLockTime())
      return false;
    this.isHolded = true;

    const previousHoldedTetrominoType = this.holder.hold(this.tetromino.type);
    this.gameRenderer.renderHolder();
    if (previousHoldedTetrominoType !== null) {
      this.tetromino = new Tetromino(previousHoldedTetrominoType);
    } else {
      this.tetromino = this.popTetrominoQueue();
    }
    return true;
  }

  private popTetrominoQueue(): Tetromino {
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

  private tickTimer(): void {
    if (this.tetromino !== null) {
      this.tetromino.y++;
      if (this.field.isCollision(this.tetromino)) {
        this.lockDelayTimer += 1;
      } else {
        this.rotateCount = 0;
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
  }

  // Can't move anything if this return true
  private isLockTime(): boolean {
    return this.lineClearTimer !== 0 || this.areTimer !== 0;
  }

  private isFallOneBlock(): boolean {
    if (this.settings.gravity >= this.settings.gravityDenominator) return true;
    if (this.gravityTimer >= this.settings.gravityDenominator) {
      this.gravityTimer = 0;
      return true;
    } else {
      return false;
    }
  }

  private isLockDelayReset(): boolean {
    return this.rotateCount < this.settings.rotateLockResetLimitMove;
  }
}
