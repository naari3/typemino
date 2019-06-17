import { BlockColor } from "./BlockColor";
import { AngleType } from "./AngleType";

export enum TetrominoType {
  I,
  O,
  T,
  S,
  Z,
  J,
  L
}

export interface TetrominoDatum {
  color: BlockColor;
  shapes: { [key in keyof typeof AngleType]?: number[][] };
}

export const TetrominoData: {
  [key in keyof typeof TetrominoType]?: TetrominoDatum;
} = {
  [TetrominoType.I]: {
    color: BlockColor.Cyan,
    shapes: {
      [AngleType.A]: [
        // 0
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [AngleType.B]: [
        // 1
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ],
      [AngleType.C]: [
        // 2
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ],
      [AngleType.D]: [
        // 3
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
    }
  },
  [TetrominoType.O]: {
    color: BlockColor.Yellow,
    shapes: {
      [AngleType.A]: [
        // 0
        [1, 1],
        [1, 1]
      ],
      [AngleType.B]: [
        // 1
        [1, 1],
        [1, 1]
      ],
      [AngleType.C]: [
        // 2
        [1, 1],
        [1, 1]
      ],
      [AngleType.D]: [
        // 3
        [1, 1],
        [1, 1]
      ]
    }
  },
  [TetrominoType.T]: {
    color: BlockColor.Purple,
    shapes: {
      [AngleType.A]: [
        // 0
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [AngleType.B]: [
        // 1
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [AngleType.C]: [
        // 2
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [AngleType.D]: [
        // 3
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    }
  },
  [TetrominoType.S]: {
    color: BlockColor.Green,
    shapes: {
      [AngleType.A]: [
        // 0
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [AngleType.B]: [
        // 1
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ],
      [AngleType.C]: [
        // 2
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ],
      [AngleType.D]: [
        // 3
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    }
  },
  [TetrominoType.Z]: {
    color: BlockColor.Red,
    shapes: {
      [AngleType.A]: [
        // 0
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [AngleType.B]: [
        // 1
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [AngleType.C]: [
        // 2
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
      ],
      [AngleType.D]: [
        // 3
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
      ]
    }
  },
  [TetrominoType.J]: {
    color: BlockColor.Blue,
    shapes: {
      [AngleType.A]: [
        // 0
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [AngleType.B]: [
        // 1
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [AngleType.C]: [
        // 2
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [AngleType.D]: [
        // 3
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    }
  },
  [TetrominoType.L]: {
    color: BlockColor.Orange,
    shapes: {
      [AngleType.A]: [
        // 0
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [AngleType.B]: [
        // 1
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [AngleType.C]: [
        // 2
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [AngleType.D]: [
        // 3
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    }
  }
};
