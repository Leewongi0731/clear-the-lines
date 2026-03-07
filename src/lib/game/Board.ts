import { TETROMINOES, type TetrominoData } from './Tetromino';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export class Board {
    // 10x20 그리드. 0은 빈 칸, 0 초과 값은 색상 코드(블록이 채워짐)
    public grid: number[][];

    constructor() {
        this.grid = this.createEmptyGrid();
    }

    // 보드를 빈 상태로 초기화합니다.
    public reset(): void {
        this.grid = this.createEmptyGrid();
    }

    private createEmptyGrid(): number[][] {
        return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    }

    /**
     * 블록이 해당 좌표로 이동/회전 가능한지 검사합니다 (충돌 판정).
     * @param shape - 검사할 블록의 2차원 배열 형태
     * @param x - 보드 상의 블록 x 위치 (왼쪽 상단 기준)
     * @param y - 보드 상의 블록 y 위치 (왼쪽 상단 기준)
     */
    public isValidMove(shape: number[][], x: number, y: number): boolean {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                // 블록의 빈 공간(0)은 무시
                if (shape[row][col] === 0) continue;

                // 보드 상에서 블록 일부가 위치하게 될 실제 좌표
                const boardX = x + col;
                const boardY = y + row;

                // 1. 벽 충돌: 보드의 가로 범위를 벗어남
                if (boardX < 0 || boardX >= BOARD_WIDTH) return false;

                // 2. 바닥 충돌: 보드의 아래쪽 끝을 벗어남
                // y 범위가 0보다 작은 것(보드 위쪽)은 아직 화면에 들어오기 전이므로 허용합니다.
                if (boardY >= BOARD_HEIGHT) return false;

                // 3. 블록 충돌: 이동하려는 칸에 이미 다른 블록이 있음
                if (boardY >= 0 && this.grid[boardY][boardX] !== 0) return false;
            }
        }
        return true; // 모든 검사를 통과하면 이동/회전 가능
    }

    /**
     * 블록을 보드에 고정합니다. (바닥이나 다른 블록에 닿았을 때)
     * @param shape - 고정할 블록의 2차원 배열 형태
     * @param x - 보드 상의 x 위치
     * @param y - 보드 상의 y 위치
     * @param color - 고정할 블록의 색상값
     */
    public lockTetromino(shape: number[][], x: number, y: number, color: number): void {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const boardY = y + row;
                    const boardX = x + col;

                    // 게임 오버 상태가 아니라면(보드 안쪽이라면) 그리드에 색상 저장
                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                        this.grid[boardY][boardX] = color;
                    }
                }
            }
        }
    }

    /**
     * 완성된(꽉 찬) 줄을 찾아서 삭제하고 비어있는 새 줄을 위에 추가합니다.
     * @returns 한 번에 지운 줄의 개수
     */
    public clearLines(): number {
        let linesCleared = 0;

        // 맨 아래(19)부터 맨 위(0)까지 역순으로 검사합니다.
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            // 해당 줄(y)의 모든 칸(cell)이 0이 아니면 꽉 찬 줄입니다.
            const isLineFull = this.grid[y].every(cell => cell !== 0);

            if (isLineFull) {
                // 꽉 찬 줄 삭제
                this.grid.splice(y, 1);

                // 맨 위에 새로운 빈 줄 삽입
                this.grid.unshift(Array(BOARD_WIDTH).fill(0));

                linesCleared++;

                // y 인덱스를 하나 증가시켜서 방금 내려온 윗줄을 다시 검사하게 합니다.
                // splice로 배열이 한 칸씩 밀렸기 때문입니다.
                y++;
            }
        }

        return linesCleared;
    }
}
