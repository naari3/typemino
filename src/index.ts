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

const field = Array.from(new Array(width), (): (BlockColor | null)[] =>
  new Array(height).fill(null)
);

let pressUp = false;
let pressDown = false;
let pressLeft = false;
let pressRight = false;
let playerX = Math.floor(width / 2) - 1;
let playerY = 0;

const initializeKeyEvents = (): void => {
  const onKeyDownEvent = (e: KeyboardEvent): void => {
    if (e.key == "ArrowUp") {
      pressUp = true;
    } else if (e.key == "ArrowDown") {
      pressDown = true;
    } else if (e.key == "ArrowLeft") {
      pressLeft = true;
    } else if (e.key == "ArrowRight") {
      pressRight = true;
    }
  };
  document.addEventListener("keydown", onKeyDownEvent);
  const onKeyUpEvent = (e: KeyboardEvent): void => {
    if (e.key == "ArrowUp") {
      pressUp = false;
    } else if (e.key == "ArrowDown") {
      pressDown = false;
    } else if (e.key == "ArrowLeft") {
      pressLeft = false;
    } else if (e.key == "ArrowRight") {
      pressRight = false;
    }
  };
  document.addEventListener("keyup", onKeyUpEvent);
};
initializeKeyEvents();

const blockSprites = Array.from(new Array(width), (): (PIXI.Sprite | null)[] =>
  new Array(height).fill(null)
);

app.ticker.add((): void => {
  field[playerX][playerY] = null;
  if (playerY < height - 1) {
    playerY++;
  }
  if (pressLeft && playerX > 0) {
    playerX--;
  } else if (pressRight && playerX < width - 1) {
    playerX++;
  }
  // console.log({ playerX, playerY });
  // console.log({ pressUp, pressDown, pressLeft, pressRight });
  field[playerX][playerY] = BlockColor.Purple;

  field.forEach((yList, x): void => {
    yList.forEach((color, y): void => {
      if (color != null) {
        const block = BlockFactory(x, y, color);
        container.addChild(block);
        if (blockSprites[x][y]) {
          blockSprites[x][y].destroy();
          delete blockSprites[x][y];
        }
        blockSprites[x][y] = block;
      } else {
        if (blockSprites[x][y]) {
          blockSprites[x][y].destroy();
          delete blockSprites[x][y];
        }
      }
    });
  });
});
