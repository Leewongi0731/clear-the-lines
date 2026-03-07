<div align="center">
  <h1>🟩 Clear The Lines 🟪</h1>
  <p><strong>A modern, web-based Tetris game built with SvelteKit and PixiJS.</strong></p>
  
  [![SvelteKit](https://img.shields.io/badge/sveltekit-%23FF3E00.svg?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
  [![PixiJS](https://img.shields.io/badge/PixiJS-FF0041?style=for-the-badge&logo=Webgl&logoColor=white)](https://pixijs.com/)
  [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br />

## 🎮 Play the Game
*(Add your GitHub Pages URL here once deployed)*
[Play **Clear The Lines** Here]()

## 🚀 Overview
**Clear The Lines** is a classic Tetris clone with a modern tech stack. It leverages the raw WebGL rendering power of **PixiJS** for the game board and the reactive, component-driven UI of **SvelteKit** for the HUD and menus.

The goal of this project is not just to build another Tetris game, but to provide a clean, typed, and well-structured implementation using TypeScript, demonstrating how to bridge a low-level graphics engine (PixiJS) with a modern web framework (SvelteKit).

## ✨ Features
*   **Classic Gameplay**: Familiar I, J, L, O, S, T, Z pieces, standard rotation logic, and scoring.
*   **Ghost Piece**: A helpful projection showing where your block will land.
*   **Next Piece Preview**: Look ahead to plan your upcoming moves.
*   **Level Progression**: Speed increases as you clear more lines.
*   **Sleek UI**: Minimalist, dark-themed retro HUD built with Svelte.

## ⌨️ Controls
| Key | Action |
| :--- | :--- |
| `Left Arrow` | Move Left |
| `Right Arrow` | Move Right |
| `Down Arrow` | Soft Drop |
| `Up Arrow` | Rotate |
| `Spacebar` | Hard Drop |
| `P` | Pause / Resume |

## 🛠️ Technology Stack
*   **Framework**: [SvelteKit](https://kit.svelte.dev/)
*   **Rendering**: [PixiJS (v8)](https://pixijs.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: Vanilla CSS

## 📦 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/clear-the-lines.git
   cd clear-the-lines
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Play!**
   Open your browser and navigate to `http://localhost:5173`.

## 🏗️ Architecture
The project is strictly divided into two layers:
1.  **Game Engine (`src/lib/game/`)**: The core game logic (`Game.ts`, `Board.ts`, `Tetromino.ts`) and the visual representation (`Renderer.ts`). This layer is completely independent of the UI framework.
2.  **User Interface (`src/routes/`, `src/lib/components/`)**: The SvelteKit layer that handles the DOM, binds keyboard events, and reactively displays the score and state from the Game Engine.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
