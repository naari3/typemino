/* global document */

import * as PIXI from "pixi.js";
import blockImage from "./images/n2.png";

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

const texture = PIXI.Texture.from(blockImage);
const tilingSprite = new PIXI.TilingSprite(texture, width * 16, height * 16);

container.addChild(tilingSprite);
