import * as PIXI from "pixi.js";
import { BlockColor } from "./BlockColor";
import blockImage from "./images/n2.png";

const blockSize = 16;

const BlockFactory = (
  x: number,
  y: number,
  color: BlockColor,
  ghost?: boolean
): PIXI.Sprite => {
  if (color === BlockColor.Invisible) return new PIXI.Sprite();

  const baseTexture = PIXI.BaseTexture.from(blockImage);
  const texture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(color * blockSize, 0, blockSize, blockSize)
  );
  const sprite = new PIXI.Sprite(texture);
  sprite.x = x * blockSize;
  sprite.y = y * blockSize;
  if (ghost === true) {
    sprite.alpha = 0.5;
  }
  return sprite;
};
export { BlockFactory };
