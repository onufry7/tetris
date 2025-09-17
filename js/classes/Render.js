export class Render
{
    constructor(configRender)
    {
        this.gridElement = configRender.gridElement;
        this.miniGridElement = configRender.miniGridElement;
        this.miniSize = configRender.miniSize || 4;
    }

    #clearElements()
    {
        if (this.gridElement) this.gridElement.innerHTML = "";
        if (this.miniGridElement) this.miniGridElement.innerHTML = "";
    }

    drawBoard(board, current)
    {
        board.grid.forEach(row =>
        {
            row.forEach(cell =>
            {
                const div = document.createElement("div");
                div.className = "tetromino";
                if (cell) div.classList.add("placed");
                this.gridElement.appendChild(div);
            });
        });

        current.blocks.forEach(({ x, y }) =>
        {
            const idx = y * board.width + x;
            if (idx >= 0 && idx < this.gridElement.children.length) {
                const div = this.gridElement.children[idx];
                div.className = "tetromino";
                div.style.backgroundColor = current.color;
            }
        });
    }

    drawMiniGrid(next)
    {
        // normalizacja
        const coords = next.rotations[next.rotationIndex].map(([x, y]) => [x, y]);
        const minX = Math.min(...coords.map(([x]) => x));
        const minY = Math.min(...coords.map(([, y]) => y));
        const normCoords = coords.map(([x, y]) => [x - minX, y - minY]);

        // centrowanie
        const maxX = Math.max(...normCoords.map(([x]) => x));
        const maxY = Math.max(...normCoords.map(([, y]) => y));
        const offsetX = Math.floor((this.miniSize - (maxX + 1)) / 2);
        const offsetY = Math.floor((this.miniSize - (maxY + 1)) / 2);

        normCoords.forEach(([x, y]) =>
        {
            const div = document.createElement("div");
            div.className = "tetromino";
            div.style.backgroundColor = next.color;
            div.style.gridColumnStart = x + 1 + offsetX;
            div.style.gridRowStart = y + 1 + offsetY;
            this.miniGridElement.appendChild(div);
        });
    }

    render(board, current, next)
    {
        this.#clearElements();

        if (board && current) {
            this.drawBoard(board, current);
        }

        if (next) {
            this.drawMiniGrid(next);
        }
    }
}
