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

const field = Array.from(new Array(height), (): (BlockColor | null)[] =>
  new Array(width).fill(null)
);
const blockSprites = Array.from(new Array(height), (): (PIXI.Sprite | null)[] =>
  new Array(width).fill(null)
);

const clearLines = (): number => {
  let clearCount = 0;
  field.forEach((xList, y): void => {
    if (xList.every((x): boolean => !!x)) {
      delete field[y];
      field.unshift(Array(width).fill(null));
      clearCount++;
    }
  });
  return clearCount;
};

app.ticker.add((): void => {
  if (playerY < height - 1) {
    playerY++;
  }
  if (pressLeft && playerX > 0 && field[playerY][playerX - 1] == null) {
    playerX--;
  } else if (
    pressRight &&
    playerX < width - 1 &&
    field[playerY][playerX + 1] == null
  ) {
    playerX++;
  }

  // console.log({ aa: blockSprites[field.length - 1] });
  // console.log({ playerX, playerY });
  // console.log({ pressUp, pressDown, pressLeft, pressRight });
  field[playerY][playerX] = BlockColor.Purple;

  field.forEach((xList, y): void => {
    xList.forEach((color, x): void => {
      if (color != null) {
        const block = BlockFactory(x, y, color);
        container.addChild(block);
        if (blockSprites[y][x]) {
          blockSprites[y][x].destroy();
        }
        blockSprites[y][x] = block;
      } else {
        if (blockSprites[y][x]) {
          blockSprites[y][x].destroy();
          blockSprites[y][x] = null;
        }
      }
    });
  });
  if (
    (!!field[playerY + 1] && field[playerY + 1][playerX] != null) ||
    playerY == height - 1
  ) {
    playerX = Math.floor(width / 2) - 1;
    playerY = 0;
    clearLines();
  } else {
    field[playerY][playerX] = null;
  }
});
