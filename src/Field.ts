import * as PIXI from "pixi.js";
import { BlockColor } from "./BlockColor";
import { BlockFactory } from "./blockFactory";

export class Field {
  public blockColors: BlockColor[][];
  public blockSprites: PIXI.Sprite[][];
  private container: PIXI.Container;

  public constructor(container: PIXI.Container) {
    this.container = container;
    this.blockColors = Array.from(new Array(20), (): (BlockColor | null)[] =>
      new Array(10).fill(null)
    );

    this.blockSprites = Array.from(new Array(20), (): (PIXI.Sprite | null)[] =>
      new Array(10).fill(null)
    );
  }

  public render(): void {
    this.blockColors.forEach((xList, y): void => {
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
}
