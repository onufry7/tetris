export class Board
{
    constructor(config)
    {
        this.width = config.width;
        this.height = config.height;
        this.reset();
    }

    reset()
    {
        this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(null));
    }

    isInside(x, y)
    {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isValidPosition(tetromino)
    {
        return tetromino.blocks.every(({ x, y }) =>
            this.isInside(x, y) && this.grid[y][x] === null
        );
    }

    place(tetromino)
    {
        tetromino.blocks.forEach(({ x, y }) =>
        {
            if (!this.isInside(x, y)) {
                throw new Error(`Tetromino out of bounds at (${x},${y})`);
            }
            this.grid[y][x] = tetromino.color;
        });
    }

    isFull(row)
    {
        return row.every(cell => cell !== null);
    }

    clearLines()
    {
        const before = this.grid.length;
        this.grid = this.grid.filter(row => !this.isFull(row));
        const cleared = before - this.grid.length;
        while (this.grid.length < this.height) {
            this.grid.unshift(Array(this.width).fill(null));
        }
        return cleared;
    }

}
