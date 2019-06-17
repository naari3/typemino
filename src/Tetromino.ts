import { TetrominoData, TetrominoType, TetrominoDatum } from "./TetrominoData";
import { BlockFactory } from "./blockFactory";
import { AngleType } from "./AngleType";

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.keys(anEnum)
    .map((n): number => Number.parseInt(n))
    .filter((n): boolean => !Number.isNaN(n)) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumValue = enumValues[randomIndex];
  return randomEnumValue;
}

export class Tetromino {
  public type: TetrominoDatum;
  public angle: AngleType;
  public previousAngle: AngleType;
  public x: number;
  public y: number;
  private container: PIXI.Container;
  private sprites: PIXI.Sprite[];
  public lockDelayCounter: number;

  public constructor(type: TetrominoDatum, container: PIXI.Container) {
    this.type = type;
    this.angle = 0;
    this.previousAngle = 0;
    this.x = Math.floor(Math.floor(10 / 2) - this.type.shapes[0][0].length / 2);
    this.y = 0;
    this.container = container;
    this.sprites = [];
    this.lockDelayCounter = 0;
  }

  public static getRandom(container: PIXI.Container): Tetromino {
    return new Tetromino(TetrominoData[randomEnum(TetrominoType)], container);
  }

  public currentShape(): number[][] {
    return this.type.shapes[this.angle];
  }

  public render(): void {
    this.currentShape().forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          const block = BlockFactory(this.x + x, this.y + y, this.type.color);
          this.container.addChild(block);
          this.sprites.push(block);
        }
      });
    });
  }

  public clearRendered(): void {
    this.sprites.forEach((s): void => {
      s.destroy();
    });
    this.sprites = [];
  }

  public isForcedLock(): boolean {
    return this.lockDelayCounter > 30;
  }

  public rotateLeft(): void {
    this.previousAngle = this.angle;
    this.angle += 1;
    this.angle %= 4;
  }

  public rotateRight(): void {
    this.previousAngle = this.angle;
    this.angle -= 1;
    if (this.angle === AngleType.A) {
      this.angle = AngleType.D;
    }
  }
}
