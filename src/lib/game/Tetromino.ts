export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface TetrominoData {
    shape: number[][];
    color: number;
}

export const TETROMINOES: Record<TetrominoType, TetrominoData> = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: 0x00FFFF // Cyan
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 0x0000FF // Blue
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 0xFFA500 // Orange
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 0xFFFF00 // Yellow
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 0x00FF00 // Green
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 0x800080 // Purple
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 0xFF0000 // Red
    }
};

export class Tetromino {
    type: TetrominoType;
    shape: number[][];
    color: number;
    x: number;
    y: number;

    constructor(type: TetrominoType) {
        this.type = type;
        this.shape = TETROMINOES[type].shape;
        this.color = TETROMINOES[type].color;

        // Spawn at the top middle
        this.x = Math.floor(10 / 2) - Math.floor(this.shape.length / 2);
        this.y = 0; // Usually hidden at top but we'll manage in board
    }

    // Returns true if shape actually changed, false otherwise (e.g. for O shape)
    rotate(): void {
        if (this.type === 'O') return;

        const N = this.shape.length;
        const newShape: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));

        // Rotate matrix 90 degrees clockwise
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                newShape[j][N - 1 - i] = this.shape[i][j];
            }
        }
        this.shape = newShape;
    }
}
