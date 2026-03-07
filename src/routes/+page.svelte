<script lang="ts">
	// Game page and PixiJS container will go here
</script>

<div id="app-container">
	<div class="canvas-container" id="pixi-container"></div>
	<div class="hud-container">
		<!-- Svelte UI over/next to canvas -->
		<h1>TETRIS</h1>
	</div>
</div>

<style>
	h1 {
		font-size: 3rem;
		margin: 0 0 20px 0;
		text-shadow: 0 0 10px var(--accent-color);
		color: var(--accent-color);
	}
	.hud-container {
		display: flex;
		flex-direction: column;
		background-color: var(--hud-bg);
		padding: 20px;
		border-radius: 8px;
		min-width: 200px;
	}
</style>
