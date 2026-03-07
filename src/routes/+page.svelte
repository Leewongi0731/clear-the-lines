<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Game } from '$lib/game/Game';
  import { Renderer } from '$lib/game/Renderer';
  import HUD from '$lib/components/ui/HUD.svelte';

  let pixiContainer: HTMLElement;
  let game: Game;
  let renderer: Renderer | null = null;
  
  // Svelte reactivity triggers
  let score = $state(0);
  let level = $state(1);
  let lines = $state(0);
  let nextTetromino = $state(null);
  let isGameOver = $state(false);
  let isPaused = $state(false);

  // 게임루프 상의 변화를 Svelte UI에 반영시키기 위한 타이머
  let syncInterval: number;

  onMount(async () => {
    game = new Game();
    game.reset(); // 최초 시작

    renderer = new Renderer(game);
    await renderer.init(pixiContainer);

    // 1초에 30번 정도 Svelte 상태 동기화 (PixiJS 렌더링과는 별도로 UI 갱신용)
    syncInterval = setInterval(() => {
      score = game.score;
      level = game.level;
      lines = game.lines;
      nextTetromino = game.nextTetromino as any; // 타입 단언
      isGameOver = game.isGameOver;
      isPaused = game.isPaused;
    }, 1000 / 30);
    
    // 키보드 이벤트 리스너 추가 (svelte window 리스너 대신 onMount 내 등록)
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    clearInterval(syncInterval);
    if (renderer) renderer.destroy();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (!game || isGameOver) return;
    
    // 기본 브라우저 스크롤 동작 방지 (방향키, 스페이스)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowUp':
        game.rotate();
        break;
      case ' ': // 스페이스바
        game.hardDrop();
        break;
      case 'p':
      case 'P':
        game.togglePause();
        break;
    }
  }

  function togglePause() {
    if (game && !isGameOver) {
      game.togglePause();
    }
  }
  
  function restartGame() {
    if (game) {
      game.reset();
    }
  }
</script>

<div id="app-container">
  <div class="game-wrapper">
    <!-- PIXI JS Canvas 들어갈 자리 -->
    <div bind:this={pixiContainer} id="pixi-container">
      {#if isGameOver}
        <div class="overlay">
          <h2>GAME OVER</h2>
          <button class="btn" onclick={restartGame}>Try Again</button>
        </div>
      {/if}
      
      {#if isPaused && !isGameOver}
        <div class="overlay">
          <h2>PAUSED</h2>
          <button class="btn" onclick={togglePause}>Resume</button>
        </div>
      {/if}
    </div>

    <!-- Svelte UI 컴포넌트 -->
    <HUD {score} {level} {lines} {nextTetromino} />
  </div>
</div>

<style>
  #app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #121212;
  }

  .game-wrapper {
    display: flex;
    gap: 20px;
    padding: 20px;
    background-color: #1e1e1e;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  #pixi-container {
    position: relative;
    width: 300px;
    height: 600px;
    background-color: #000;
    overflow: hidden;
  }

  /* 게임 오버, 일시정지 오버레이 화면 요소들 */
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    color: white;
    font-family: 'Courier New', Courier, monospace;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #ff3366;
    text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
  }

  .btn {
    padding: 10px 20px;
    font-size: 1.2rem;
    font-family: inherit;
    color: white;
    background-color: #3366ff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }

  .btn:hover {
    background-color: #4477ff;
  }

  .btn:active {
    transform: scale(0.95);
  }
</style>
