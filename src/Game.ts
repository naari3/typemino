import * as PIXI from "pixi.js";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";
import { Keyboard } from "./Keyboard";
import { Wallkick } from "./Wallkick";
import { Holder } from "./Holder";
import { SettingData } from "./Settings";
import { GameRenderer } from "./GameRenderer";
import Constants from "./Constants";

type exclusionFlagType = "left" | "right";

export class Game {
  protected app: PIXI.Application;
  protected container: PIXI.Container;
  protected gameContainer: PIXI.Container;
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

  private gameRenderer: GameRenderer;

  public constructor(w: number, h: number, settings: SettingData) {
    this.app = new PIXI.Application({
      width: w,
      height: h,
      backgroundColor: 0xdddddd
    });

    this.settings = settings;

    this.adjustFrames();
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

    this.gameContainer = new PIXI.Container();
    this.gameRenderer = new GameRenderer(
      this.gameContainer,
      this.field,
      this.tetrominoQueue,
      this.holder
    );
    this.app.stage.addChild(this.gameContainer);

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

  protected adjustFrames(): void {
    const fieldBackground = this.fieldBackground();
    this.container = new PIXI.Container();
    const fieldPositionX = 16 * 7;
    const fieldPositionY = 16 * 3;
    fieldBackground.position.x = fieldPositionX;
    fieldBackground.position.y = fieldPositionY;
    this.app.stage.addChild(fieldBackground);
    this.app.stage.addChild(this.container);

    const holdBackground = this.holdBackground();
    const holdPositionX = 16 * 1;
    const holdPositionY = 16 * 7;
    holdBackground.position.x = holdPositionX;
    holdBackground.position.y = holdPositionY;
    this.app.stage.addChild(holdBackground);

    const nextBackground = this.nextBackground();
    const nextPositionX = 16 * 18;
    const nextPositionY = 16 * 4;
    nextBackground.position.x = nextPositionX;
    nextBackground.position.y = nextPositionY;
    this.app.stage.addChild(nextBackground);

    const nextnext1Background = this.nextnextBackground();
    const nextnext2Background = this.nextnextBackground();
    const nextnextPositionX = 16 * 18 + 8;
    const nextnextPosition1Y = 16 * 10;
    const nextnextPosition2Y = 16 * 15;
    nextnext1Background.position.x = nextnextPositionX;
    nextnext1Background.position.y = nextnextPosition1Y;
    nextnext2Background.x = nextnextPositionX;
    nextnext2Background.y = nextnextPosition2Y;
    this.app.stage.addChild(nextnext1Background);
    this.app.stage.addChild(nextnext2Background);
  }

  protected fieldBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // field frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 10, 16 * 20);
    graphics.endFill();

    // lattice
    for (let x = 0; x < Constants.blockWidth; x++) {
      graphics.lineStyle(1, 0xffffffff, 0.1);
      graphics.moveTo(16 * (x + 1), 0);
      graphics.lineTo(16 * (x + 1), 16 * 20);
    }
    for (let y = 0; y < Constants.blockHeight; y++) {
      graphics.lineStyle(1, 0xffffffff, 0.1);
      graphics.moveTo(0, 16 * (y + 1));
      graphics.lineTo(16 * 10, 16 * (y + 1));
    }

    return graphics;
  }

  protected holdBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // hold frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 4, 16 * 4);
    graphics.endFill();
    graphics.width = 16 * 4;
    graphics.height = 16 * 4;

    return graphics;
  }

  protected nextBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // hold frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 5, 16 * 5);
    graphics.endFill();

    return graphics;
  }

  protected nextnextBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // hold frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 4, 16 * 4);
    graphics.endFill();

    return graphics;
  }

  private renderGhost(): void {
    if (this.settings.ghost)
      this.gameRenderer.renderGhost(this.tetromino, this.field);
  }

  protected animate(): void {
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
