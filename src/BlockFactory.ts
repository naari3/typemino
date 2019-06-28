import * as PIXI from "pixi.js";
import { BlockColor } from "./BlockColor";
import blockImage from "./images/n2.png";

const blockSize = 16;
const baseTexture = PIXI.BaseTexture.from(blockImage);
const textureDict: { [key in keyof typeof BlockColor]?: PIXI.Texture } = {};

const getBlockTexture = (color: BlockColor): PIXI.Texture => {
  if (textureDict[color] !== undefined) {
    return textureDict[color];
  }

  const texture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(color * blockSize, 0, blockSize, blockSize)
  );
  textureDict[color] = texture;
  return texture;
};

const BlockFactory = (
  x: number,
  y: number,
  color: BlockColor,
  alpha: number
): PIXI.Sprite => {
  const sprite = new PIXI.Sprite(getBlockTexture(color));
  sprite.x = x * blockSize;
  sprite.y = y * blockSize;
  sprite.alpha = alpha;
  return sprite;
};
export { BlockFactory };
