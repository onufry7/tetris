import { Config } from './classes/Config.js';
import { Game } from './classes/Game.js';

document.addEventListener("DOMContentLoaded", () =>
{
    const domElements = {
        grid: document.getElementById("grid"),
        miniGrid: document.getElementById("mini-grid"),
        score: document.getElementById("score"),
        lines: document.getElementById("lines"),
        status: document.getElementById("status"),
        sound: document.getElementById("sound")
    };

    new Game(new Config(domElements));
});