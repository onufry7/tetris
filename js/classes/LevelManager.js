export class LevelManager
{
    #linesPerLevel;
    #dropIntervalBase;
    #dropIntervalDecrease;
    #dropIntervalMin;
    #maxLevel;
    #level = 1;

    dropInterval;
    levelIndicator;

    constructor(configLevel)
    {
        this.#linesPerLevel = configLevel.linesPerLevel;
        this.#dropIntervalBase = configLevel.initialDropInterval;
        this.#dropIntervalDecrease = configLevel.decreasePerLevel;
        this.#dropIntervalMin = configLevel.minDropInterval;
        this.#maxLevel = Math.floor((this.#dropIntervalBase - this.#dropIntervalMin) / this.#dropIntervalDecrease) + 1;
        this.levelIndicator = configLevel.levelIndicator;
    }

    get level()
    {
        return this.#level;
    }

    get maxLevel()
    {
        return this.#maxLevel;
    }

    #calculateDropInterval(level)
    {
        return Math.max(
            this.#dropIntervalMin,
            this.#dropIntervalBase - (level - 1) * this.#dropIntervalDecrease
        );
    }

    #setLevel(newLevel)
    {
        this.#level = newLevel;
        this.dropInterval = this.#calculateDropInterval(newLevel);
        this.#updateDisplay();
    }

    #updateDisplay()
    {
        this.levelIndicator.textContent = `${this.#level}/${this.#maxLevel}`;
    }

    update(linesClearedTotal)
    {
        const newLevel = Math.min(
            Math.floor(linesClearedTotal / this.#linesPerLevel) + 1,
            this.#maxLevel
        );

        if (newLevel > this.#level) {
            this.#setLevel(newLevel);
            return true;
        }
        return false;
    }

    reset()
    {
        this.#setLevel(1);
    }

    get config()
    {
        return {
            linesPerLevel: this.#linesPerLevel,
            base: this.#dropIntervalBase,
            decrease: this.#dropIntervalDecrease,
            min: this.#dropIntervalMin,
            maxLevel: this.#maxLevel,
        };
    }
}
