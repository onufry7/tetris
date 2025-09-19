export class Score
{
    #score = 0;
    #lines = 0;
    #combo = 0;

    constructor(configScore)
    {
        this.scoreIndicator = configScore.scoreIndicator;
        this.linesIndicator = configScore.linesIndicator;
        this.multiplier = configScore.multiplier;
        this.bonus = configScore.bonus;
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
        if (lines > 1) points += points * this.multiplier
        if (this.#combo > 1) points += points * (this.bonus * (this.#combo - 1))
        return points;
    }


    add(lines)
    {
        if (lines > 0) {
            this.#lines += lines;
            this.#combo++;
            this.#score += this.#calculatePoints(lines);
            this.#updateDisplay();
        } else {
            this.#combo = 0;
        }

    }

    reset()
    {
        this.#score = 0;
        this.#lines = 0;
        this.#combo = 0;
        this.#updateDisplay();
    }
}
