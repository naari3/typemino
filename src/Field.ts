import * as PIXI from "pixi.js";
import { BlockColor } from "./BlockColor";

export class Field {
  public blockColors: BlockColor[][];
  public blockSprites: PIXI.Sprite[][];

  public constructor() {
    this.blockColors = Array.from(new Array(20), (): (BlockColor | null)[] =>
      new Array(10).fill(null)
    );

    this.blockSprites = Array.from(new Array(20), (): (PIXI.Sprite | null)[] =>
      new Array(10).fill(null)
    );
  }
}
