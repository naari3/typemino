import * as PIXI from "pixi.js";
import { Field } from "../Field";
import { BlockFactory } from "../BlockFactory";

export class FieldRenderer {
  private container: PIXI.Container;
  private field: Field;
  private blockSprites: PIXI.Sprite[][];

  public constructor(contaienr: PIXI.Container, field: Field) {
    this.container = contaienr;
    this.field = field;
    this.blockSprites = Array.from(
      new Array(field.actualBlockHeight),
      (): (PIXI.Sprite | null)[] => new Array(field.blockWidth).fill(null)
    );
  }

  public render(): void {
    this.field.blockColors.forEach((xList, y): void => {
      xList.forEach((color, x): void => {
        if (!(this.field.actualBlockHeight - y > this.field.blockHeight)) {
          if (color != null) {
            const block = BlockFactory(
              x,
              y - this.field.invisibleHeight,
              color
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
}
