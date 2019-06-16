/* global document */

import * as PIXI from "pixi.js";
import Constants from "./Constants";
import { Tetromino } from "./Tetromino";
import { Field } from "./Field";

export class Game {
  protected app: PIXI.Application;
  protected container: PIXI.Container;
  protected loader: PIXI.loaders.Loader;
  protected window: { w: number; h: number };
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
    this.tetromino.y++;
    if (this.pressLeft) {
      this.tetromino.x--;
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.x++;
      }
    } else if (this.pressRight) {
      this.tetromino.x++;
      if (this.field.isCollision(this.tetromino)) {
        this.tetromino.x--;
      }
    }
    this.tetromino.remove();

    if (this.field.isCollision(this.tetromino)) {
      this.tetromino.y--;
      this.field.putMino(this.tetromino);
      this.tetromino = Tetromino.getRandom(this.container);
      this.field.clearLines();
    }

    this.field.render();
    this.tetromino.render();
  }

  private initializeKeyEvents(): void {
    const onKeyDownEvent = (e: KeyboardEvent): void => {
      if (e.key == "ArrowLeft") {
        this.pressLeft = true;
      } else if (e.key == "ArrowRight") {
        this.pressRight = true;
      }
    };
    document.addEventListener("keydown", onKeyDownEvent);
    const onKeyUpEvent = (e: KeyboardEvent): void => {
      if (e.key == "ArrowLeft") {
        this.pressLeft = false;
      } else if (e.key == "ArrowRight") {
        this.pressRight = false;
      }
    };
    document.addEventListener("keyup", onKeyUpEvent);
  }
}
