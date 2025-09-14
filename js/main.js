import { Config } from './tetris/Config.js';
import { Game } from './tetris/Game.js';

document.addEventListener("DOMContentLoaded", () =>
{
    const domElements = {
        grid: document.getElementById("grid"),
        miniGrid: document.getElementById("mini-grid"),
        score: document.getElementById("score"),
        status: document.getElementById("status"),
        sound: document.getElementById("sound") // W przyszłości do dźwięku
    };

    const buttons = {
        "pause-button": "pause",
        "start-button": "start",
        "sound-button": "sound",
        "left-button": "left",
        "right-button": "right",
        "down-button": "down",
        "rotate-button": "up"
    };


    const config = new Config(domElements)
    const game = new Game(config);


    // Przyciski wirtualne
    for (const id of Object.keys(buttons)) {
        document.getElementById(id)?.addEventListener("click", () => game.handleKey(id));
    }

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