import * as PIXI from "pixi.js";
import { Field } from "../Field";
import { BlockFactory } from "../BlockFactory";

export class FieldRenderer {
  protected container: PIXI.Container;
  protected field: Field;
  protected blockSprites: PIXI.Sprite[][];
  protected hideOuts: number[][];

  public constructor(contaienr: PIXI.Container, field: Field) {
    this.container = contaienr;
    this.field = field;
    this.blockSprites = Array.from(
      new Array(field.actualBlockHeight),
      (): (PIXI.Sprite | null)[] => new Array(field.blockWidth).fill(null)
    );
    this.hideOuts = Array.from(
      new Array(field.actualBlockHeight),
      (): (null)[] => new Array(field.blockWidth).fill(null)
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
              color,
              this.field.transparencies[y][x]
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
