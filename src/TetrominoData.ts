import { BlockColor } from "./BlockColor";

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
  shapes: number[][][];
}

export const TetrominoData: {
  [key in keyof typeof TetrominoType]?: TetrominoDatum;
} = {
  [TetrominoType.I]: {
    color: BlockColor.Cyan,
    shapes: [
      [
        // 0
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        // 1
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ],
      [
        // 2
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ],
      [
        // 3
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
    ]
  },
  [TetrominoType.O]: {
    color: BlockColor.Yellow,
    shapes: [
      [
        // 0
        [1, 1],
        [1, 1]
      ],
      [
        // 1
        [1, 1],
        [1, 1]
      ],
      [
        // 2
        [1, 1],
        [1, 1]
      ],
      [
        // 3
        [1, 1],
        [1, 1]
      ]
    ]
  },
  [TetrominoType.T]: {
    color: BlockColor.Purple,
    shapes: [
      [
        // 0
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        // 1
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        // 2
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        // 3
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ]
  },
  [TetrominoType.S]: {
    color: BlockColor.Green,
    shapes: [
      [
        // 0
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        // 1
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ],
      [
        // 2
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ],
      [
        // 3
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ]
  },
  [TetrominoType.Z]: {
    color: BlockColor.Red,
    shapes: [
      [
        // 0
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        // 1
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        // 2
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
      ],
      [
        // 3
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
      ]
    ]
  },
  [TetrominoType.J]: {
    color: BlockColor.Red,
    shapes: [
      [
        // 0
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        // 1
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [
        // 2
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        // 3
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ]
  },
  [TetrominoType.L]: {
    color: BlockColor.Orange,
    shapes: [
      [
        // 0
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        // 1
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        // 2
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        // 3
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ]
  }
};
