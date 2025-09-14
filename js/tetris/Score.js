export class Score
{
    #score = 0;

    constructor(configScore)
    {
        this.element = configScore.element;
        this.#updateDisplay();
    }

    get score()
    {
        return this.#score;
    }

    #updateDisplay()
    {
        this.element.textContent = this.#score;
    }

    add(points)
    {
        this.#score += points;
        this.#updateDisplay();
    }

    reset()
    {
        this.#score = 0;
        this.#updateDisplay();
    }
}
