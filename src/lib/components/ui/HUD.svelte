<script lang="ts">
  import type { Tetromino } from '$lib/game/Tetromino';

  // Svelte 5 Props
  let { 
    score = 0, 
    level = 1, 
    lines = 0, 
    nextTetromino = null 
  }: { 
    score: number; 
    level: number; 
    lines: number; 
    nextTetromino: Tetromino | null 
  } = $props();

  // 다음 블록을 4x4 미니 그리드로 렌더링하기 위한 헬퍼 변수
  const miniGridSize = 4;
</script>

<div class="hud-container">
  <div class="stat-box">
    <h3>SCORE</h3>
    <p class="value">{score}</p>
  </div>

  <div class="stat-box">
    <h3>LEVEL</h3>
    <p class="value">{level}</p>
  </div>

  <div class="stat-box">
    <h3>LINES</h3>
    <p class="value">{lines}</p>
  </div>

  <div class="stat-box next-piece-box">
    <h3>NEXT</h3>
    <div class="mini-board">
      {#if nextTetromino}
        <!-- 4x4 격자를 렌더링 -->
        {#each [0, 1, 2, 3] as row}
          <div class="mini-row">
            {#each [0, 1, 2, 3] as col}
              {#if nextTetromino.shape[row] && nextTetromino.shape[row][col]}
                <!-- 색상 코드(0xFF0000 등)를 CSS HEX 문자열(#FF0000)로 변환 -->
                <div 
                  class="mini-cell filled" 
                  style="background-color: #{nextTetromino.color.toString(16).padStart(6, '0')}"
                ></div>
              {:else}
                <div class="mini-cell empty"></div>
              {/if}
            {/each}
          </div>
        {/each}
      {/if}
    </div>
  </div>
  
  <div class="controls-help">
    <p>⬅️ ➡️ : Move</p>
    <p>⬇️ : Soft Drop</p>
    <p>⬆️ : Rotate</p>
    <p>Space : Hard Drop</p>
    <p>P : Pause</p>
  </div>
</div>

<style>
  .hud-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    background-color: #2a2a2a;
    border-radius: 8px;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    min-width: 150px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }

  .stat-box {
    text-align: right;
  }

  .stat-box h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #aaaaaa;
    letter-spacing: 2px;
  }

  .value {
    margin: 0.5rem 0 0 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
  }

  .next-piece-box {
    text-align: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #444;
  }

  .mini-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    gap: 2px;
  }

  .mini-row {
    display: flex;
    gap: 2px;
  }

  .mini-cell {
    width: 20px;
    height: 20px;
  }

  .mini-cell.empty {
    background-color: transparent;
  }

  .mini-cell.filled {
    border: 1px solid rgba(0,0,0,0.5);
    box-shadow: inset 2px 2px 2px rgba(255,255,255,0.2), inset -2px -2px 2px rgba(0,0,0,0.2);
  }
  
  .controls-help {
    margin-top: 2rem;
    font-size: 0.8rem;
    color: #888;
    text-align: left;
    line-height: 1.5;
  }
  
  .controls-help p {
    margin: 0;
  }
</style>
