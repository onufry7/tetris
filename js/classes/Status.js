export class Status
{
    constructor(configStatus)
    {
        this.element = configStatus.element;
    }

    #setText(text)
    {
        this.element.innerHTML = text;
    }

    reset()
    {
        this.#setText("");
    }

    showGameOver()
    {
        this.#setText("Game<br>Over!");
    }

    showPaused()
    {
        this.#setText('<span class="material-symbols-outlined">coffee</span><span class="status-text">PAUSE</span>');
    }
}
