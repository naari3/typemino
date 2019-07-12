import { TetrominoData, TetrominoType, TetrominoDatum } from "./TetrominoData";
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

  public constructor(type: TetrominoType) {
    this.type = type;
    this.data = TetrominoData[type];
    this.angle = 0;
    this.previousAngle = 0;
    this.x = Math.floor(Math.floor(10 / 2) - this.data.shapes[0][0].length / 2);
    this.y = type === TetrominoType.I ? -1 : 0;

    this.y--;
    this.y--;
  }

  public static getRandom(): Tetromino {
    return new Tetromino(randomEnum(TetrominoType));
  }

  public static getRandomQueue(): Tetromino[] {
    return shuffle(
      enumValues(TetrominoType).map((type): Tetromino => new Tetromino(type))
    );
  }

  public currentShape(): number[][] {
    return this.data.shapes[this.angle];
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
