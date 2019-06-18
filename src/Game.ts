import * as PIXI from "pixi.js";
import Constants from "./Constants";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";
import { Keyboard } from "./Keyboard";
import { Wallkick } from "./Wallkick";
import { Holder } from "./Holder";
import { NextTetrominoRenderer } from "./NextTetrominoRenderer";

export class Game {
  protected app: PIXI.Application;
  protected container: PIXI.Container;
  protected holdContainer: PIXI.Container;
  protected nextContainer: PIXI.Container;
  protected nextnext1Container: PIXI.Container;
  protected nextnext2Container: PIXI.Container;
  protected loader: PIXI.loaders.Loader;
  protected window: { w: number; h: number };

  private upKey: Keyboard;
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

  private nextRenderer: NextTetrominoRenderer;
  private nextnext1Renderer: NextTetrominoRenderer;
  private nextnext2Renderer: NextTetrominoRenderer;

  public constructor(w: number, h: number) {
    this.app = new PIXI.Application({
      width: w,
      height: h,
      backgroundColor: 0xdddddd
    });

    this.adjustFrames();
    document.body.appendChild(this.app.view);

    this.window = { w: w, h: h };

    this.tetrominoQueue = Tetromino.getRandomQueue(this.container).concat(
      Tetromino.getRandomQueue(this.container)
    );
    this.tetromino = this.popTetrominoQueue();

    this.nextRenderer = new NextTetrominoRenderer(this.nextContainer);
    this.nextnext1Renderer = new NextTetrominoRenderer(this.nextnext1Container);
    this.nextnext2Renderer = new NextTetrominoRenderer(this.nextnext2Container);
    this.renderNext();

    this.field = new Field(this.container);
    this.holder = new Holder(this.holdContainer);

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
    this.container.position = fieldBackground.position;
    this.app.stage.addChild(fieldBackground);
    this.app.stage.addChild(this.container);

    const holdBackground = this.holdBackground();
    this.holdContainer = new PIXI.Container();
    const holdPositionX = 16 * 1;
    const holdPositionY = 16 * 7;
    holdBackground.position.x = holdPositionX;
    holdBackground.position.y = holdPositionY;
    this.holdContainer.position = holdBackground.position;
    this.holdContainer.position.x += 16 - 4;
    this.holdContainer.position.y += 16 * 1;
    this.app.stage.addChild(holdBackground);
    this.app.stage.addChild(this.holdContainer);

    const nextBackground = this.nextBackground();
    this.nextContainer = new PIXI.Container();
    const nextPositionX = 16 * 18;
    const nextPositionY = 16 * 4;
    nextBackground.position.x = nextPositionX;
    nextBackground.position.y = nextPositionY;
    this.nextContainer.position = nextBackground.position;
    this.nextContainer.position.y += 16 * 1 + 8;
    this.nextContainer.position.x += 16;
    this.app.stage.addChild(nextBackground);
    this.app.stage.addChild(this.nextContainer);

    const nextnext1Background = this.nextnextBackground();
    const nextnext2Background = this.nextnextBackground();
    this.nextnext1Container = new PIXI.Container();
    this.nextnext2Container = new PIXI.Container();
    const nextnextPositionX = 16 * 18 + 8;
    const nextnextPosition1Y = 16 * 10;
    const nextnextPosition2Y = 16 * 15;
    nextnext1Background.position.x = nextnextPositionX;
    nextnext1Background.position.y = nextnextPosition1Y;
    this.nextnext1Container.position = nextnext1Background.position;
    this.nextnext1Container.position.x += 16 - 4;
    this.nextnext1Container.position.y += 16 * 1;
    nextnext2Background.x = nextnextPositionX;
    nextnext2Background.y = nextnextPosition2Y;
    this.nextnext2Container.position = nextnext2Background.position;
    this.nextnext2Container.position.x += 16 - 4;
    this.nextnext2Container.position.y += 16 * 1;
    this.nextnext1Container.scale.x = this.nextnext1Container.scale.y =
      Constants.nextnextMinoScale;
    this.nextnext2Container.scale.x = this.nextnext2Container.scale.y =
      Constants.nextnextMinoScale;
    this.app.stage.addChild(nextnext1Background);
    this.app.stage.addChild(nextnext2Background);
    this.app.stage.addChild(this.nextnext1Container);
    this.app.stage.addChild(this.nextnext2Container);
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

  protected renderNext(): void {
    this.nextRenderer.render(
      this.tetrominoQueue[this.tetrominoQueue.length - 1].type
    );

    this.nextnext1Renderer.render(
      this.tetrominoQueue[this.tetrominoQueue.length - 2].type
    );

    this.nextnext2Renderer.render(
      this.tetrominoQueue[this.tetrominoQueue.length - 3].type
    );
  }

  protected animate(): void {
    this.freeFall();

    if (this.leftKey.isDown) {
      this.moveLeft();
    } else if (this.rightKey.isDown) {
      this.moveRight();
    }

    this.tetromino.render();
  }

  private initializeKeyEvents(): void {
    this.upKey = new Keyboard(Constants.controller.up);
    this.upKey.press = this.hardDrop.bind(this);

    this.leftKey = new Keyboard(Constants.controller.left);
    this.rightKey = new Keyboard(Constants.controller.right);

    this.rotateLeftKey = new Keyboard(Constants.controller.rotateLeft);
    this.rotateLeftKey.press = this.rotateLeft.bind(this);

    this.rotateRightKey = new Keyboard(Constants.controller.rotateRight);
    this.rotateRightKey.press = this.rotateRight.bind(this);

    this.holdKey = new Keyboard(Constants.controller.hold);
    this.holdKey.press = this.holdMino.bind(this);
  }

  private freeFall(): void {
    this.tetromino.clearRendered();
    this.tetromino.y++;
    this.field.render();
    if (this.field.isCollision(this.tetromino)) {
      this.tetromino.y--;
      this.tetromino.lockDelayCounter++;
      if (this.tetromino.isForcedLock()) {
        this.fixMino();
      }
    } else {
      this.tetromino.lockDelayCounter = 0;
    }
  }

  private hardDrop(): void {
    this.tetromino.clearRendered();
    while (!this.field.isCollision(this.tetromino)) {
      this.tetromino.y++;
    }
    this.tetromino.y--;
    this.fixMino();
  }

  private fixMino(): void {
    this.field.putMino(this.tetromino);
    this.tetromino = this.popTetrominoQueue();
    this.field.clearLines();
    this.field.render();
    this.tetromino.clearRendered();
    this.isHolded = false;
    this.renderNext();
  }

  private moveLeft(): void {
    this.tetromino.x--;
    if (this.field.isCollision(this.tetromino)) {
      this.tetromino.x++;
    }
  }

  private moveRight(): void {
    this.tetromino.x++;
    if (this.field.isCollision(this.tetromino)) {
      this.tetromino.x--;
    }
  }

  private rotateLeft(): void {
    this.tetromino.rotateLeft();
    if (this.field.isCollision(this.tetromino)) {
      if (!new Wallkick().executeWallkick(this.tetromino, this.field)) {
        this.tetromino.rotateRight();
      }
    }
  }

  private rotateRight(): void {
    this.tetromino.rotateRight();
    if (this.field.isCollision(this.tetromino)) {
      if (!new Wallkick().executeWallkick(this.tetromino, this.field)) {
        this.tetromino.rotateLeft();
      }
    }
  }

  private holdMino(): boolean {
    if (this.isHolded) return false;
    this.isHolded = true;

    this.tetromino.clearRendered();
    const previousHoldedTetrominoType = this.holder.hold(this.tetromino.type);
    if (previousHoldedTetrominoType !== null) {
      this.tetromino = new Tetromino(
        previousHoldedTetrominoType,
        this.container
      );
    } else {
      this.tetromino = this.popTetrominoQueue();
    }
    return true;
  }

  private popTetrominoQueue(): Tetromino {
    if (this.tetrominoQueue.length < 7) {
      this.tetrominoQueue = Tetromino.getRandomQueue(this.container).concat(
        this.tetrominoQueue
      );
    }
    return this.tetrominoQueue.pop();
  }
}
