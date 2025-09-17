import { Board } from './Board.js';
import { Score } from './Score.js';
import { Render } from './Render.js';
import { Status } from './Status.js';
import { SoundManager } from './SoundManager.js';
import { TetrominoFactory } from "./TetrominoFactory.js";
import { InputManager } from './InputManager.js';

export class Game
{
    #tetrominoFactory;
    #dropInterval;
    #timerId = null;
    #keyActions = [];

    board;
    score;
    lineClear;
    renderer;
    status;
    soundManager;
    current;
    next;
    paused = false;
    gameOver = false;
    started = false;


    constructor(config)
    {
        this.inputManager = new InputManager(this)
        this.board = new Board(config.board);
        this.score = new Score(config.scoring);
        this.renderer = new Render(config.render);
        this.status = new Status(config.status);
        this.soundManager = new SoundManager(config.sound);

        this.#tetrominoFactory = TetrominoFactory;
        this.#dropInterval = config.speed.initialDropInterval;

        this.#keyActions = {
            start: () => this.start(),
            sound: () => this.soundManager.toggleMute(),
            left: () => this.#tryMove(-1, 0),
            right: () => this.#tryMove(1, 0),
            down: () => this.tick(),
            rotate: () => this.#tryMove(0, 0, true),
            pause: () => this.togglePause()
        };
    }

    #tryMove(dx, dy, rotate = false)
    {
        const test = this.current.clone();
        test.position.x += dx;
        test.position.y += dy;
        if (rotate) test.rotate();

        if (this.board.isValidPosition(test)) {
            this.current = test;
            return true;
        }
        return false;
    }

    #setSpawnPosition(tetromino)
    {
        tetromino.position = { x: Math.floor(this.board.width / 2) - 2, y: 0 };
    }

    #spawnNext()
    {
        this.current = this.next;
        this.#setSpawnPosition(this.current);

        this.next = this.#tetrominoFactory.randomTetromino();
        this.#setSpawnPosition(this.next);
    }

    #scheduleTick()
    {
        this.#timerId = setInterval(() => this.tick(), this.#dropInterval);
    }

    #clearTimer()
    {
        if (this.#timerId) {
            clearInterval(this.#timerId);
            this.#timerId = null;
        }
    }

    #endGame()
    {
        this.soundManager.play('gameover');
        this.gameOver = true;
        this.#clearTimer();
        this.status.showGameOver();
    }

    #resetGameState()
    {
        // Reset stanu gry
        this.paused = false;
        this.score.reset();
        this.status.reset();
        this.board.reset();

        // Losowanie klocków
        this.current = this.#tetrominoFactory.randomTetromino();
        this.#setSpawnPosition(this.current);
        this.next = this.#tetrominoFactory.randomTetromino();

        this.gameOver = false;
    }

    async start()
    {
        this.soundManager.play('start');
        this.started = true;
        this.#clearTimer();
        this.#resetGameState();
        this.render();
        this.#scheduleTick();
    }

    handleKey(action)
    {
        this.soundManager.play(action);
        if (!action) return;

        if ((action !== "start" && action !== "sound" && action !== "pause") &&
            (this.gameOver || !this.started || this.paused)) return;

        this.#keyActions[action]();
        this.render();
    }

    togglePause()
    {
        if (this.gameOver) return;
        this.paused = !this.paused;

        if (this.paused) {
            this.#clearTimer();
            this.status.showPaused();
        } else {
            if (!this.#timerId) this.#scheduleTick();
            this.status.reset();
        }
    }

    tick()
    {
        if (this.gameOver) return;

        const moved = this.#tryMove(0, 1);
        if (!moved) {
            this.board.place(this.current);
            this.soundManager.play('drop');
            const cleared = this.board.clearLines();
            if (cleared > 0) {
                this.score.add(cleared);
                for (let i = 0; i < cleared; i++) {
                    setTimeout(() => this.soundManager.play('clear'), i * 200);
                }
            }

            this.#spawnNext();

            if (!this.board.isValidPosition(this.current)) {
                this.#endGame();
                return;
            }
        }

        this.render();
    }

    render()
    {
        this.renderer.render(this.board, this.current, this.next);
    }
}
