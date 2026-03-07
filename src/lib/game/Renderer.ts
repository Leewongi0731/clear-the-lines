import { Application, Graphics } from 'pixi.js';
import type { Game } from './Game';
import { BOARD_WIDTH, BOARD_HEIGHT } from './Board';

export const CELL_SIZE = 30; // 1칸의 픽셀 크기

export class Renderer {
    public app: Application;
    private game: Game;
    private graphics: Graphics;

    // 타임 루프 제어용
    private timeSinceLastTick = 0;

    constructor(game: Game) {
        this.game = game;
        this.app = new Application();
        this.graphics = new Graphics();
    }

    /**
     * PixiJS 어플리케이션을 초기화하고 HTML 요소에 부착합니다.
     */
    public async init(container: HTMLElement): Promise<void> {
        // v8 초기화 방식 (WebGL 선호, 자동 Fallback)
        await this.app.init({
            width: BOARD_WIDTH * CELL_SIZE,
            height: BOARD_HEIGHT * CELL_SIZE,
            backgroundColor: 0x1a1a1a, // 어두운 회색 (테두리로 활용)
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.graphics);

        // PixiJS 내부 Ticker(프레임 루프)에 로직 연결
        this.app.ticker.add(this.update.bind(this));
    }

    /**
     * Ticker가 매 프레임마다 호출하는 메인 루프입니다.
     */
    private update(ticker: any): void {
        const deltaMs = ticker.deltaMS;

        // --- 1. 논리(Logic) 업데이트 ---
        if (!this.game.isGameOver && !this.game.isPaused) {
            this.timeSinceLastTick += deltaMs;

            // 레벨에 따라 떨어지는 속도 조절 (레벨이 높을수록 tickInterval 감소)
            // 예: 레벨 1 -> 800ms, 레벨 2 -> ~720ms ... (최소 100ms)
            const tickInterval = Math.max(100, 800 - (this.game.level - 1) * 80);

            if (this.timeSinceLastTick >= tickInterval) {
                this.game.tick();
                this.timeSinceLastTick = 0;
            }
        }

        // --- 2. 화면(Render) 업데이트 ---
        this.render();
    }

    /**
     * 캔버스를 지우고 게임 상태를 기반으로 다시 그립니다.
     */
    private render(): void {
        this.graphics.clear();

        this.drawBackground();
        this.drawBoard();
        this.drawGhostTetromino();
        this.drawCurrentTetromino();
    }

    /**
     * 배경 칸을 구별하기 위한 희미한 격자를 그립니다.
     */
    private drawBackground(): void {
        this.graphics.setStrokeStyle({ width: 1, color: 0x333333 });

        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                this.graphics.rect(
                    x * CELL_SIZE,
                    y * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
        this.graphics.stroke();
    }

    /**
     * 이미 바닥에 고정된(굳은) 블록들을 그립니다.
     */
    private drawBoard(): void {
        const grid = this.game.board.grid;

        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const color = grid[y][x];
                if (color !== 0) {
                    this.drawCell(x, y, color);
                }
            }
        }
    }

    /**
     * 현재 떨어지고 있는 블록을 그립니다.
     */
    private drawCurrentTetromino(): void {
        const tetro = this.game.currentTetromino;
        if (!tetro) return;

        for (let row = 0; row < tetro.shape.length; row++) {
            for (let col = 0; col < tetro.shape[row].length; col++) {
                if (tetro.shape[row][col] !== 0) {
                    this.drawCell(tetro.x + col, tetro.y + row, tetro.color);
                }
            }
        }
    }

    /**
     * 블록이 떨어질 예상 위치를 반투명하게 그립니다 (고스트).
     */
    private drawGhostTetromino(): void {
        const tetro = this.game.currentTetromino;
        if (!tetro) return;

        let ghostY = tetro.y;

        // y를 계속 내리면서 충돌 지점을 찾습니다.
        while (this.game.board.isValidMove(tetro.shape, tetro.x, ghostY + 1)) {
            ghostY++;
        }

        // 고스트 위치가 현재 위치와 같다면(이미 바닥에 거의 닿았다면) 그리지 않음
        if (ghostY === tetro.y) return;

        for (let row = 0; row < tetro.shape.length; row++) {
            for (let col = 0; col < tetro.shape[row].length; col++) {
                if (tetro.shape[row][col] !== 0) {
                    // drawCell 대신, 직접 alpha(투명도) 값을 넣어서 흐리게 그립니다.
                    this.graphics.setFillStyle({ color: tetro.color, alpha: 0.3 });
                    this.graphics.rect(
                        (tetro.x + col) * CELL_SIZE,
                        (ghostY + row) * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                    this.graphics.fill();

                    this.graphics.setStrokeStyle({ width: 1, color: 0x000000, alpha: 0.5 });
                    this.graphics.rect(
                        (tetro.x + col) * CELL_SIZE,
                        (ghostY + row) * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                    this.graphics.stroke();
                }
            }
        }
    }

    /**
     * 지정된 x, y 좌표에 1칸 크기의 네모를 색칠합니다.
     */
    private drawCell(gridX: number, gridY: number, color: number): void {
        // 화면 위쪽으로 나간 블록(y < 0)은 그리지 않음
        if (gridY < 0) return;

        const pxX = gridX * CELL_SIZE;
        const pxY = gridY * CELL_SIZE;

        // 안쪽 색상 채우기
        this.graphics.setFillStyle({ color });
        this.graphics.rect(pxX, pxY, CELL_SIZE, CELL_SIZE);
        this.graphics.fill();

        // 테두리 뚜렷하게 (블록 사이의 경계선)
        this.graphics.setStrokeStyle({ width: 1, color: 0x000000, alpha: 0.5 });
        this.graphics.rect(pxX, pxY, CELL_SIZE, CELL_SIZE);
        this.graphics.stroke();

        // 하이라이트 효과 (살짝 입체감) - 오른쪽 하단 모서리를 어둡게
        this.graphics.setStrokeStyle({ width: 2, color: 0x000000, alpha: 0.3 });
        this.graphics.moveTo(pxX, pxY + CELL_SIZE);
        this.graphics.lineTo(pxX + CELL_SIZE, pxY + CELL_SIZE);
        this.graphics.lineTo(pxX + CELL_SIZE, pxY);
        this.graphics.stroke();

        // 왼쪽 상단 모서리를 밝게
        this.graphics.setStrokeStyle({ width: 2, color: 0xFFFFFF, alpha: 0.3 });
        this.graphics.moveTo(pxX, pxY + CELL_SIZE);
        this.graphics.lineTo(pxX, pxY);
        this.graphics.lineTo(pxX + CELL_SIZE, pxY);
        this.graphics.stroke();
    }

    /**
     * 컴포넌트가 파괴될 때 캔버스와 타이머를 완전 해제합니다 (메모리 누수 방지).
     */
    public destroy(): void {
        if (this.app) {
            this.app.destroy({ removeView: true });
        }
    }
}
