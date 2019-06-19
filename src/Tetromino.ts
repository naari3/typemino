import { TetrominoData, TetrominoType, TetrominoDatum } from "./TetrominoData";
import { BlockFactory } from "./blockFactory";
import { AngleType } from "./AngleType";

function enumValues<T>(anEnum: T): T[keyof T][] {
  return (Object.keys(anEnum)
    .map((n): number => Number.parseInt(n))
    .filter((n): boolean => !Number.isNaN(n)) as unknown) as T[keyof T][];
}

function randomEnum<T>(anEnum: T): T[keyof T] {
  const values = enumValues(anEnum);
  const randomIndex = Math.floor(Math.random() * values.length);
  const randomEnumValue = values[randomIndex];
  return randomEnumValue;
}

function shuffle<T>(arr: T[]): T[] {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

export class Tetromino {
  public data: TetrominoDatum;
  public type: TetrominoType;
  public angle: AngleType;
  public previousAngle: AngleType;
  public x: number;
  public y: number;
  private container: PIXI.Container;
  private sprites: PIXI.Sprite[];

  public constructor(type: TetrominoType, container: PIXI.Container) {
    this.type = type;
    this.data = TetrominoData[type];
    this.angle = 0;
    this.previousAngle = 0;
    this.x = Math.floor(Math.floor(10 / 2) - this.data.shapes[0][0].length / 2);
    this.y = 0;
    this.container = container;
    this.sprites = [];
  }

  public static getRandom(container: PIXI.Container): Tetromino {
    return new Tetromino(randomEnum(TetrominoType), container);
  }

  public static getRandomQueue(container: PIXI.Container): Tetromino[] {
    return shuffle(
      enumValues(TetrominoType).map(
        (type): Tetromino => new Tetromino(type, container)
      )
    );
  }

  public currentShape(): number[][] {
    return this.data.shapes[this.angle];
  }

  public render(ghost?: boolean): void {
    this.currentShape().forEach((xList, y): void => {
      xList.forEach((b, x): void => {
        if (b === 1) {
          let block: PIXI.Sprite;
          if (ghost === true) {
            block = BlockFactory(this.x + x, this.y + y, this.data.color, true);
          } else {
            block = BlockFactory(this.x + x, this.y + y, this.data.color);
          }
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

  public rotateRight(): void {
    this.previousAngle = this.angle;
    this.angle += 1;
    this.angle %= 4;
  }

  public rotateLeft(): void {
    this.previousAngle = this.angle;
    this.angle -= 1;
    if (this.angle === -1) {
      this.angle = AngleType.D;
    }
  }

  public isType(type: TetrominoType): boolean {
    return this.data === TetrominoData[type];
  }
}
