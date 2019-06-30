import * as PIXI from "pixi.js";
import { Field } from "../Field";
import { BlockFactory } from "../BlockFactory";
import { Observer } from "../Observer";

export class FieldRenderer implements Observer<Field> {
  protected container: PIXI.Container;
  protected field: Field;
  protected blockSprites: PIXI.Sprite[][];

  public constructor(contaienr: PIXI.Container) {
    this.container = contaienr;
  }

  public render(field: Field): void {
    field.blockColors.forEach((xList, y): void => {
      xList.forEach((color, x): void => {
        if (!(field.actualBlockHeight - y > field.blockHeight)) {
          if (color != null) {
            const block = BlockFactory(
              x,
              y - field.invisibleHeight,
              color,
              field.transparencies[y][x]
            );
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
        }
      });
    });
  }

  public update(field: Field): void {
    this.blockSprites =
      this.blockSprites ||
      Array.from(
        new Array(field.actualBlockHeight),
        (): (PIXI.Sprite | null)[] => new Array(field.blockWidth).fill(null)
      );
    this.render(field);
  }
}
