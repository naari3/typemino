/* global document */

import * as PIXI from "pixi.js";
import { BlockFactory } from "./BlockFactory";
import { BlockColor } from "./BlockColor";

const width = 10;
const height = 20;

const displayWidth = width * 16;
const displayHeight = height * 16;

const app = new PIXI.Application({
  width: displayWidth,
  height: displayHeight,
  backgroundColor: 0x000000
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const field = Array.from(new Array(width), (): BlockColor[] =>
  new Array(height).fill(BlockColor.Cyan)
);

field.forEach((yList, x): void => {
  yList.forEach((color, y): void => {
    const block = BlockFactory(x, y, color);
    container.addChild(block);
  });
});
