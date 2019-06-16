/* global document */

import * as PIXI from "pixi.js";
import { BlockFactory } from "./BlockFactory";
import { BlockColor } from "./BlockColor";
import { Tetromino } from "./Tetromino";

export class Game {
  protected app: PIXI.Application;
  protected container: PIXI.Container;
  protected loader: PIXI.loaders.Loader;
  protected window: { w: number; h: number };
  private pressLeft: boolean = false;
  private pressRight: boolean = false;
  private playerX: number;
  private playerY: number;
  private blockWidth: number;
  private blockHeight: number;
  private field: (BlockColor | null)[][];
  private blockSprites: (PIXI.Sprite | null)[][];
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

    this.playerX = Math.floor(this.blockWidth / 2) - 1;
    this.playerY = 0;

    this.tetromino = Tetromino.getRandom(this.container);

    this.field = Array.from(
      new Array(this.blockHeight),
      (): (BlockColor | null)[] => new Array(this.blockWidth).fill(null)
    );
    this.blockSprites = Array.from(
      new Array(this.blockHeight),
      (): (PIXI.Sprite | null)[] => new Array(this.blockWidth).fill(null)
    );

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
    if (this.playerY < this.blockHeight - 1) {
      this.playerY++;
      this.tetromino.y++;
    }
    if (
      this.pressLeft &&
      this.playerX > 0 &&
      this.field[this.playerY][this.playerX - 1] == null
    ) {
      this.playerX--;
      this.tetromino.x--;
    } else if (
      this.pressRight &&
      this.playerX < this.blockWidth - 1 &&
      this.field[this.playerY][this.playerX + 1] == null
    ) {
      this.playerX++;
      this.tetromino.x++;
    }
    this.tetromino.remove();

    // console.log({ aa: blockSprites[field.length - 1] });
    // console.log({ playerX, playerY });
    // console.log({ pressUp, pressDown, pressLeft, pressRight });
    if (
      (!!this.field[this.playerY + 1] &&
        this.field[this.playerY + 1][this.playerX] != null) ||
      this.playerY == this.blockHeight - 1
    ) {
      this.putMino();
      this.playerX = Math.floor(this.blockWidth / 2) - 1;
      this.playerY = 0;
      this.tetromino = Tetromino.getRandom(this.container);
      this.clearLines();
    }

    this.renderField();
    this.renderMino();
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
    this.field.forEach((xList, y): void => {
      if (xList.every((x): boolean => !!x)) {
        delete this.field[y];
        this.field.unshift(Array(this.blockWidth).fill(null));
        clearCount++;
      }
    });
    return clearCount;
  }

  private renderField(): void {
    this.field.forEach((xList, y): void => {
      xList.forEach((color, x): void => {
        if (color != null) {
          const block = BlockFactory(x, y, color);
          this.container.addChild(block);
          if (this.blockSprites[y][x]) {
            this.blockSprites[y][x].destroy();
          }
          this.blockSprites[y][x] = block;
        } else {
          if (this.blockSprites[y][x]) {
            this.blockSprites[y][x].destroy();
            this.blockSprites[y][x] = null;
          }
        }
      });
    });
  }

  private renderMino(): void {
    this.tetromino.render();

    const color = this.tetromino.type.color;
    if (this.prevMinoSprite) {
      this.prevMinoSprite.destroy();
    }
    const block = BlockFactory(this.playerX, this.playerY, color);
    this.container.addChild(block);
    this.prevMinoSprite = block;
  }

  private putMino(): void {
    this.field[this.playerY][this.playerX] = this.tetromino.type.color;
  }
}
