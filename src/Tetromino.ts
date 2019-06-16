import { TetrominoData, TetrominoType, TetrominoDatum } from "./TetrominoData";

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
  public angle: number; // 0 (0), 1 (90), 2 (180), 3 (270)

  public constructor(type: TetrominoDatum) {
    this.type = type;
    this.angle = 0;
  }

  public static getRandom(): Tetromino {
    return new Tetromino(TetrominoData[randomEnum(TetrominoType)]);
  }
}
