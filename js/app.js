// --- KONFIGURACJA GRY ---
const CONFIG = {
    BOARD: { WIDTH: 10, HEIGHT: 20 },
    SCORING: { LINE_CLEAR: 10 },
    SPEED: { INITIAL_DROP_INTERVAL: 500 }
};


const SHAPES = {
    I: [
        [[0, 0], [1, 0], [2, 0], [3, 0]], // poziomo
        [[1, 0], [1, 1], [1, 2], [1, 3]]  // pionowo
    ],
    O: [
        [[1, 0], [2, 0], [1, 1], [2, 1]] // kwadrat nie rotuje
    ],
    T: [
        [[1, 0], [0, 1], [1, 1], [2, 1]], // górą
        [[1, 0], [1, 1], [1, 2], [2, 1]], // prawa
        [[0, 1], [1, 1], [2, 1], [1, 2]], // dół
        [[0, 1], [1, 0], [1, 1], [1, 2]]  // lewa
    ],
    S: [
        [[1, 0], [2, 0], [0, 1], [1, 1]], // poziomo
        [[1, 0], [1, 1], [2, 1], [2, 2]]  // pionowo
    ],
    Z: [
        [[0, 0], [1, 0], [1, 1], [2, 1]], // poziomo
        [[2, 0], [1, 1], [2, 1], [1, 2]]  // pionowo
    ],
    J: [
        [[0, 0], [0, 1], [1, 1], [2, 1]], // górą
        [[1, 0], [2, 0], [1, 1], [1, 2]], // prawa
        [[0, 1], [1, 1], [2, 1], [2, 2]], // dół
        [[1, 0], [1, 1], [0, 2], [1, 2]]  // lewa
    ],
    L: [
        [[2, 0], [0, 1], [1, 1], [2, 1]], // górą
        [[1, 0], [1, 1], [1, 2], [2, 2]], // prawa
        [[0, 1], [1, 1], [2, 1], [0, 2]], // dół
        [[0, 0], [1, 0], [1, 1], [1, 2]]  // lewa
    ]
};

const COLORS = {
    I: 'cyan',
    O: 'yellow',
    T: 'purple',
    S: 'green',
    Z: 'red',
    J: 'blue',
    L: 'orange'
};


// --- KLASA TETROMINO ---
class Tetromino
{
    constructor(type, position = { x: 3, y: 0 })
    {
        this.type = type;
        this.shape = SHAPES[type];
        this.color = COLORS[type];
        this.rotationIndex = 0;
        this.position = { ...position };
    }

    get blocks()
    {
        return this.shape[this.rotationIndex].map(([dx, dy]) => ({
            x: this.position.x + dx,
            y: this.position.y + dy
        }));
    }

    rotate()
    {
        this.rotationIndex = (this.rotationIndex + 1) % this.shape.length;
    }

    clone()
    {
        const copy = new Tetromino(this.type, { ...this.position });
        copy.rotationIndex = this.rotationIndex;
        return copy;
    }
}

// --- KLASA BOARD ---
class Board
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.grid = Array.from({ length: height }, () => Array(width).fill(null));
    }

    inside(x, y)
    {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isValidPosition(tetromino)
    {
        return tetromino.blocks.every(({ x, y }) =>
            this.inside(x, y) && this.grid[y][x] === null
        );
    }

    place(tetromino)
    {
        tetromino.blocks.forEach(({ x, y }) =>
        {
            this.grid[y][x] = tetromino.color;
        });
    }

    isFull(row)
    {
        return row.every(cell => cell !== null);
    }

    clearLines()
    {
        let cleared = 0;
        this.grid = this.grid.reduce((acc, row) =>
        {
            if (this.isFull(row)) {
                cleared++;
                return acc;
            }
            acc.push(row);
            return acc;
        }, []);
        while (this.grid.length < this.height) {
            this.grid.unshift(Array(this.width).fill(null));
        }
        return cleared;
    }
}

// --- KLASA SCORE ---
class Score
{
    constructor(displayElement)
    {
        this.score = 0;
        this.display = displayElement;
        this.update();
    }

    add(points)
    {
        this.score += points;
        this.update();
    }

    reset()
    {
        this.score = 0;
        this.update();
    }

    update()
    {
        this.display.textContent = this.score;
    }
}


// --- Klasa Status ---
class Status
{
    constructor(displayElement)
    {
        this.display = displayElement;
    }

    reset()
    {
        this.display.innerHTML = "";
    }

    showGameOver()
    {
        this.display.innerHTML = "Game\nOver !";
    }

    showPaused()
    {
        this.display.innerHTML = "&#127861;\nPAUSE";
    }
}

// --- KLASA GAME ---
class Game
{
    constructor(board, score, renderer, status)
    {
        this.board = board;
        this.score = score;
        this.renderer = renderer;
        this.status = status;

        this.current = this.randomTetromino();
        this.next = this.randomTetromino();

        this.timerId = null;
        this.dropInterval = CONFIG.SPEED.INITIAL_DROP_INTERVAL;
        this.gameOver = false;
        this.started = false;
    }

    randomTetromino()
    {
        const types = Object.keys(SHAPES);
        const t = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(t);
    }

    start()
    {
        this.started = true;
        if (this.timerId) clearInterval(this.timerId);

        // Reset pauzy
        this.paused = false;

        this.score.reset();
        this.status.reset();
        this.board.grid.forEach(row => row.fill(null));
        this.current = this.randomTetromino();
        this.next = this.randomTetromino();
        this.gameOver = false;

        this.renderer.render(this.board, this.current, this.next);
        this.timerId = setInterval(() => this.tick(), this.dropInterval);
    }

    tick()
    {
        if (this.gameOver) return;
        const moved = this.tryMove(0, 1);
        if (!moved) {
            this.board.place(this.current);
            const cleared = this.board.clearLines();
            if (cleared > 0) this.score.add(cleared * CONFIG.SCORING.LINE_CLEAR);
            this.spawnNext();
            if (!this.board.isValidPosition(this.current)) {
                this.gameOver = true;
                clearInterval(this.timerId);
                this.status.showGameOver();
            }
        }
        this.renderer.render(this.board, this.current, this.next);
    }

    tryMove(dx, dy, rotate = false)
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

    spawnNext()
    {
        this.current = this.next;
        this.current.position = { x: Math.floor(CONFIG.BOARD.WIDTH / 2) - 2, y: 0 };
        this.next = this.randomTetromino();
    }

    handleKey(code)
    {
        // Mapa akcji: nazwy akcji → funkcje
        const actions = {
            start: () => this.start(),
            sound: () => console.log('SOUND THE POLICE!'),
            left: () => this.tryMove(-1, 0),
            right: () => this.tryMove(1, 0),
            down: () => this.tick(),
            up: () => this.tryMove(0, 0, true),
            pause: () => this.togglePause()
        };

        // Mapowanie kodów klawiszy fizycznych i przycisków wirtualnych
        const codeMap = {
            "Enter": "start",
            "Space": "pause",
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "ArrowDown": "down",
            "ArrowUp": "up",
            "KeyS": "sound",
            "start-button": "start",
            "pause-button": "pause",
            "left-button": "left",
            "right-button": "right",
            "down-button": "down",
            "rotate-button": "up",
            "sound-button": "sound"
        };

        const actionName = codeMap[code];

        // Ignorujemy nieobsługiwane klawisze
        if (!actionName) return;

        // Ignorujemy nieobsługiwane klawisze gdy gra nie wystartowała, jest w pauzie lub game over
        if ((actionName !== "start" && actionName !== "sound" && actionName !== "pause") && (this.gameOver || !this.started || this.paused)) return;

        // Wykonujemy akcję
        actions[actionName]();

        // Renderujemy planszę po ruchach klocka
        if (!this.paused && ["left", "right", "down", "up"].includes(actionName)) {
            this.renderer.render(this.board, this.current, this.next);
        }
    }

    togglePause()
    {
        if (this.gameOver) return;

        this.paused = !this.paused;

        if (this.paused) {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
            this.status.showPaused();
        } else {
            // upewnij się, że stary interwał jest wyczyszczony
            if (!this.timerId) {
                this.timerId = setInterval(() => this.tick(), this.dropInterval);
            }
            this.status.reset();
        }
    }
}

// --- RENDERER (HTML / DOM) ---
class Renderer
{
    constructor(boardElement, nextElement)
    {
        this.boardElement = boardElement;
        this.nextElement = nextElement;
    }

    drawBoard(board, current)
    {
        this.boardElement.innerHTML = "";

        board.grid.forEach(row =>
        {
            row.forEach(cell =>
            {
                const div = document.createElement("div");
                div.className = "tetromino";
                if (cell) div.classList.add("placed");
                this.boardElement.appendChild(div);
            });
        });

        current.blocks.forEach(({ x, y }) =>
        {
            const idx = y * board.width + x;
            if (this.boardElement.children[idx]) {
                const div = this.boardElement.children[idx];
                div.className = "tetromino";
                div.style.backgroundColor = current.color;
            }
        });
    }

    drawMiniGrid(next)
    {
        this.nextElement.innerHTML = "";
        const MINI_SIZE = 4;

        // normalizacja
        const coords = next.shape[0].map(([x, y]) => [x, y]);
        const minX = Math.min(...coords.map(([x]) => x));
        const minY = Math.min(...coords.map(([, y]) => y));
        const normCoords = coords.map(([x, y]) => [x - minX, y - minY]);

        // centrowanie
        const maxX = Math.max(...normCoords.map(([x]) => x));
        const maxY = Math.max(...normCoords.map(([, y]) => y));
        const offsetX = Math.floor((MINI_SIZE - (maxX + 1)) / 2);
        const offsetY = Math.floor((MINI_SIZE - (maxY + 1)) / 2);

        normCoords.forEach(([x, y]) =>
        {
            const div = document.createElement("div");
            div.className = "tetromino";
            div.style.backgroundColor = next.color;
            div.style.gridColumnStart = x + 1 + offsetX;
            div.style.gridRowStart = y + 1 + offsetY;
            this.nextElement.appendChild(div);
        });
    }

    render(board, current, next)
    {
        this.drawBoard(board, current);
        this.drawMiniGrid(next);
    }
}


// --- URUCHOMIENIE GRY ---
document.addEventListener("DOMContentLoaded", () =>
{
    const boardElement = document.getElementById("grid");
    const nextElement = document.getElementById("mini-grid");
    const scoreElement = document.getElementById("score");
    const statusElement = document.getElementById("status");
    const soundElement = document.getElementById("sound"); // W przyszłości do dźwięku

    const pauseBtn = document.getElementById("pause-button");
    const startBtn = document.getElementById("start-button");
    const soundBtn = document.getElementById("sound-button");
    const leftBtn = document.getElementById("left-button");
    const rightBtn = document.getElementById("right-button");
    const downBtn = document.getElementById("down-button");
    const rotateBtn = document.getElementById("rotate-button");

    const board = new Board(CONFIG.BOARD.WIDTH, CONFIG.BOARD.HEIGHT);
    const score = new Score(scoreElement);
    const status = new Status(statusElement);
    const renderer = new Renderer(boardElement, nextElement);
    const game = new Game(board, score, renderer, status);


    // Przyciski wirtualne
    pauseBtn.addEventListener("click", () => game.handleKey("pause-button"));
    startBtn.addEventListener("click", () => game.handleKey("start-button"));
    soundBtn.addEventListener("click", () => game.handleKey("sound-button"));
    leftBtn.addEventListener("click", () => game.handleKey("left-button"));
    rightBtn.addEventListener("click", () => game.handleKey("right-button"));
    downBtn.addEventListener("click", () => game.handleKey("down-button"));
    rotateBtn.addEventListener("click", () => game.handleKey("rotate-button"));

    // Przyciski fizyczne
    document.addEventListener("keydown", e =>
    {
        const blockedKeys = new Set([
            "Space", "Enter", "KeyS",
            "ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"
        ]);

        if (blockedKeys.has(e.code)) e.preventDefault();

        game.handleKey(e.code);
    });
});