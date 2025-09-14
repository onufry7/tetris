export class Config
{
    constructor({ grid, miniGrid, score, status, sound })
    {
        // Rozmiar planszy
        this.board = {
            width: 10,
            height: 20
        }

        // Punktacja i prędkość spadania
        this.scoring = {
            lineClear: 10
        }

        this.speed = {
            initialDropInterval: 500
        }

        // Rozmiar mini planszy
        this.miniSize = 4;

        // Elementy DOM
        this.render = {
            gridElement: grid,
            miniGridElement: miniGrid
        }

        this.score = {
            element: score
        }

        this.status = {
            element: status
        }

        this.sound = {
            element: sound
        }
    }
}
