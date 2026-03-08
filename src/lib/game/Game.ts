import { Board, BOARD_WIDTH, BOARD_HEIGHT } from './Board';
import { Tetromino, type TetrominoType } from './Tetromino';

export class Game {
    public board: Board;
    public currentTetromino: Tetromino | null = null;
    public nextTetrominoes: Tetromino[] = [];

    public score: number = 0;
    public level: number = 1;
    public lines: number = 0;

    public isGameOver: boolean = false;
    public isPaused: boolean = false;

    constructor() {
        this.board = new Board();
    }

    /**
     * 게임을 완전히 초기화하고 새 게임을 시작합니다.
     */
    public reset(): void {
        this.board.reset();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.isGameOver = false;
        this.isPaused = false;

        this.spawnTetromino(); // 다음 나올 블록을 준비하고 현재 블록을 생성
    }

    /**
     * 랜덤한 타입의 블록을 새로 생성하고 현재/다음 블록을 교체합니다.
     */
    private spawnTetromino(): void {
        if (this.nextTetrominoes.length === 0) {
            for (let i = 0; i < 3; i++) {
                this.nextTetrominoes.push(this.createRandomTetromino());
            }
        }

        this.currentTetromino = this.nextTetrominoes.shift()!;
        this.nextTetrominoes.push(this.createRandomTetromino());

        // 초기 위치 보정: 보드 정중앙 맨 위에서 시작하도록
        this.currentTetromino.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.currentTetromino.shape[0].length / 2);
        this.currentTetromino.y = 0;

        // 막 태어났는데 충돌하면 게임 오버 (블록이 천장에 닿음)
        if (!this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x, this.currentTetromino.y)) {
            this.isGameOver = true;
        }
    }

    private createRandomTetromino(): Tetromino {
        const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(randomType);
    }

    /**
     * 주기적으로 실행되는 논리 업데이트 (블록 1칸 하강)
     */
    public tick(): void {
        if (this.isGameOver || this.isPaused || !this.currentTetromino) return;

        // 1칸 내려갈 수 있는지 검사
        if (this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x, this.currentTetromino.y + 1)) {
            this.currentTetromino.y += 1;
        } else {
            // 바닥이나 다른 블록에 닿았으면 현재 위치에 고정
            this.lockCurrentTetromino();
        }
    }

    /**
     * 현재 블록을 보드에 굳히고 다음 줄 삭제/점수 처리/새 블록 생성을 담당합니다.
     */
    private lockCurrentTetromino(): void {
        if (!this.currentTetromino) return;

        this.board.lockTetromino(
            this.currentTetromino.shape,
            this.currentTetromino.x,
            this.currentTetromino.y,
            this.currentTetromino.color
        );

        const clearedLines = this.board.clearLines();
        if (clearedLines > 0) {
            this.updateScore(clearedLines);
        }

        this.spawnTetromino();
    }

    /**
     * 지운 줄 수에 비례하여 점수를 올리고, 레벨업을 처리합니다.
     */
    private updateScore(clearedLines: number): void {
        this.lines += clearedLines;

        // классический тетрис 점수 (예시)
        const lineScores = [0, 40, 100, 300, 1200];
        this.score += lineScores[clearedLines] * this.level;

        // 매 10줄마다 레벨업
        this.level = Math.floor(this.lines / 10) + 1;
    }

    // ============== 사용자 입력 동작 ==============

    public moveLeft(): void {
        if (this.isGameOver || this.isPaused || !this.currentTetromino) return;
        if (this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x - 1, this.currentTetromino.y)) {
            this.currentTetromino.x -= 1;
        }
    }

    public moveRight(): void {
        if (this.isGameOver || this.isPaused || !this.currentTetromino) return;
        if (this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x + 1, this.currentTetromino.y)) {
            this.currentTetromino.x += 1;
        }
    }

    public moveDown(): void {
        if (this.isGameOver || this.isPaused || !this.currentTetromino) return;
        if (this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x, this.currentTetromino.y + 1)) {
            this.currentTetromino.y += 1;
            this.score += 1; // Soft drop 점수 (보너스)
        } else {
            this.lockCurrentTetromino();
        }
    }

    public rotate(): void {
        if (this.isGameOver || this.isPaused || !this.currentTetromino) return;

        // 현재 복사본을 만들어 돌려봄
        const originalShape = this.currentTetromino.shape;
        this.currentTetromino.rotate(); // 블록 내부 배열이 회전됨

        // 회전된 상태로 충돌 검사
        if (!this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x, this.currentTetromino.y)) {
            // 충돌하면 (가장자리나 블록에 끼면) 다시 원래 상태로 복구 (임시 방편)
            // 고급 테트리스에서는 벽 차기(Wall Kick) 로직이 들어가지만, 여기서는 기본형으로 막습니다.
            this.currentTetromino.shape = originalShape;
        }
    }

    /**
     * 스페이스바를 누르면 바닥에 닿을 때까지 바로 떨어짐
     */
    public hardDrop(): void {
        if (this.isGameOver || this.isPaused || !this.currentTetromino) return;

        while (this.board.isValidMove(this.currentTetromino.shape, this.currentTetromino.x, this.currentTetromino.y + 1)) {
            this.currentTetromino.y += 1;
            this.score += 2; // Hard drop 점수
        }

        this.lockCurrentTetromino();
    }

    public togglePause(): void {
        if (this.isGameOver) return;
        this.isPaused = !this.isPaused;
    }
}
