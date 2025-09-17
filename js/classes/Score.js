export class Score
{
    #score = 0;
    #lines = 0;

    constructor(configScore)
    {
        this.scoreIndicator = configScore.scoreIndicator;
        this.linesIndicator = configScore.linesIndicator;
        this.pointForLine = configScore.lineClear
        this.#updateDisplay();
    }

    get score()
    {
        return this.#score;
    }

    get lines()
    {
        return this.#lines;
    }

    #updateDisplay()
    {
        this.scoreIndicator.textContent = this.#score;
        this.linesIndicator.textContent = this.#lines;
    }

    #calculatePoints(lines)
    {
        let points = 0;
        points += lines * this.pointForLine;
        return points;
    }


    add(lines)
    {
        let points = this.#calculatePoints(lines);
        this.#score += points;
        this.#lines += lines;
        this.#updateDisplay();
    }

    reset()
    {
        this.#score = 0;
        this.#lines = 0;
        this.#updateDisplay();
    }
}
