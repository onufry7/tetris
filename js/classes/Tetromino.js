export class Tetromino
{
    constructor(type, shapeData, rotationIndex)
    {
        this.type = type;
        this.rotations = shapeData.rotations;
        this.color = shapeData.color;
        this.rotationIndex = rotationIndex;
        this.position = { x: 3, y: 0 };
    }

    get blocks()
    {
        return this.rotations[this.rotationIndex].map(([dx, dy]) => ({
            x: this.position.x + dx,
            y: this.position.y + dy,
        }));
    }

    rotate()
    {
        if (this.rotations.length > 1) {
            this.rotationIndex = (this.rotationIndex + 1) % this.rotations.length;
        }
    }

    clone()
    {
        const rotationsCopy = this.rotations.map(rot => rot.map(([x, y]) => [x, y]));
        const tetromino = new Tetromino(this.type, { rotations: rotationsCopy, color: this.color });
        tetromino.position = { ...this.position };
        tetromino.rotationIndex = this.rotationIndex;
        return tetromino;
    }
}
