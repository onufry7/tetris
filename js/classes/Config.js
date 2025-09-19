export class Config
{
    constructor({ grid, miniGrid, score, lines, status, sound })
    {
        // Rozmiar planszy
        this.board = { width: 10, height: 20 }

        // Punktacja
        this.scoring = {
            scoreIndicator: score,
            linesIndicator: lines,
            multiplier: 0.5,
            bonus: 0.1,
            lineClear: 10
        }

        // Prędkość
        this.speed = { initialDropInterval: 500 }

        // Rozmiar mini planszy
        this.miniSize = 4;

        // Elementy DOM
        this.render = {
            gridElement: grid,
            miniGridElement: miniGrid
        }

        this.status = {
            element: status
        }

        this.sound = {
            element: sound,
            sounds: {
                left: "./sounds/move.mp3",
                right: "./sounds/move.mp3",
                down: "./sounds/move.mp3",
                rotate: "./sounds/rotate.mp3",
                start: "./sounds/start.mp3",
                sound: "./sounds/move.mp3",
                pause: "./sounds/move.mp3",
                drop: "./sounds/drop.mp3",
                clear: "./sounds/clear.mp3",
                gameover: "./sounds/gameover.mp3"
            }
        };
    }
}
