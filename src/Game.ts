import * as PIXI from "pixi.js";
import Constants from "./Constants";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";
import { Keyboard } from "./Keyboard";

export class Game {
  protected app: PIXI.Application;
  protected container: PIXI.Container;
  protected loader: PIXI.loaders.Loader;
  protected window: { w: number; h: number };
  private upKey: Keyboard;
  private leftKey: Keyboard;
  private rightKey: Keyboard;
  private pressLeft: boolean = false;
  private pressRight: boolean = false;
  private blockWidth: number;
  private blockHeight: number;
  private field: Field;
  private prevMinoSprite: PIXI.Sprite;
  private tetromino: Tetromino;

  public constructor(w: number, h: number) {
    this.app = new PIXI.Application({ width: w, height: h });
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    document.body.appendChild(this.app.view);

    this.window = { w: w, h: h };

    this.blockWidth = Constants.blockWidth;
    this.blockHeight = Constants.blockHeight;

    this.tetromino = Tetromino.getRandom(this.container);
    // this.tetromino = new Tetromino(
    //   TetrominoData[TetrominoType.O],
    //   this.container
    // );

    this.field = new Field(this.container);

    this.initializeKeyEvents();

    this.loader = new PIXI.Loader();

    this.app.ticker.add((): void => {
      this.animate();
    });
  }

  protected setSpirte(sprite: PIXI.Sprite, x: number, y: number): void {
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    this.app.stage.addChild(sprite);
  }

  protected animate(): void {
    this.tetromino.clearRendered();

    this.freeFall();

    if (this.leftKey.isDown) {
      this.moveLeft();
    } else if (this.rightKey.isDown) {
      this.moveRight();
    }

    this.field.render();
    this.tetromino.render();
  }

  private freeFall(): void {
    this.tetromino.y++;
    if (this.field.isCollision(this.tetromino)) {
      this.tetromino.y--;
      this.tetromino.lockDelayCounter++;
      if (this.tetromino.isForcedLock()) {
        this.field.putMino(this.tetromino);
        this.tetromino = Tetromino.getRandom(this.container);
        this.field.clearLines();
      }
    } else {
      this.tetromino.lockDelayCounter = 0;
    }
  }

  private initializeKeyEvents(): void {
    this.upKey = new Keyboard("ArrowUp");
    this.upKey.press = this.hardDrop;

    this.leftKey = new Keyboard("ArrowLeft");
    this.rightKey = new Keyboard("ArrowRight");
  }

  private hardDrop = (): void => {
    while (!this.field.isCollision(this.tetromino)) {
      this.tetromino.y++;
    }
    this.tetromino.y--;
    this.tetromino.clearRendered();
    this.field.putMino(this.tetromino);
    this.tetromino = Tetromino.getRandom(this.container);
    this.field.clearLines();
  };

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
}
