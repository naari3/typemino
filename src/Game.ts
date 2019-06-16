/* global document */

import * as PIXI from "pixi.js";
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

    this.blockWidth = 10;
    this.blockHeight = 20;

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
      if (this.isCollision()) {
        this.tetromino.x++;
      }
    } else if (this.pressRight) {
      this.tetromino.x++;
      if (this.isCollision()) {
        this.tetromino.x--;
      }
    }
    this.tetromino.remove();

    if (this.isCollision()) {
      this.tetromino.y--;
      this.putMino();
      this.tetromino = Tetromino.getRandom(this.container);
      this.clearLines();
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

  private clearLines(): number {
    let clearCount = 0;
    this.field.blockColors.forEach((xList, y): void => {
      if (xList.every((x): boolean => !!x)) {
        this.field.blockColors.splice(y, 1);
        this.field.blockColors.unshift(Array(this.blockWidth).fill(null));
        clearCount++;
      }
    });
    return clearCount;
  }

  private isCollision(): boolean {
    let collided = false;
    this.tetromino.type.shapes[0].forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          if (
            collided ||
            this.tetromino.x < 0 ||
            this.tetromino.x + x > this.blockWidth ||
            this.tetromino.y + y >= this.blockHeight ||
            this.field.blockColors[this.tetromino.y + y][
              this.tetromino.x + x
            ] !== null
          ) {
            collided = true;
          }
        }
      });
    });
    return collided;
  }

  private putMino(): void {
    this.tetromino.type.shapes[0].forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          this.field.blockColors[this.tetromino.y + y][
            this.tetromino.x + x
          ] = this.tetromino.type.color;
        }
      });
    });
  }
}
