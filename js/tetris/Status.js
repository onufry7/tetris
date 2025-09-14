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
        this.#setText("&#127861;<br>PAUSE");
    }
}
