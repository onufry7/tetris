import { Tetromino } from './Tetromino.js';

export class TetrominoFactory
{
    /** @type {{[key: string]: {rotations: number[][][], color: string}}} */
    static SHAPES = {
        I: {
            rotations: [
                [[0, 0], [1, 0], [2, 0], [3, 0]], // poziomo
                [[1, 0], [1, 1], [1, 2], [1, 3]]  // pionowo
            ],
            color: '#1A6D75'
        },
        O: {
            rotations: [
                [[1, 0], [2, 0], [1, 1], [2, 1]] // kwadrat nie rotuje
            ],
            color: '#00886e'
        },
        T: {
            rotations: [
                [[1, 0], [0, 1], [1, 1], [2, 1]], // górą
                [[1, 0], [1, 1], [1, 2], [2, 1]], // prawa
                [[0, 1], [1, 1], [2, 1], [1, 2]], // dół
                [[0, 1], [1, 0], [1, 1], [1, 2]]  // lewa
            ],
            color: '#542D7D'
        },
        S: {
            rotations: [
                [[1, 0], [2, 0], [0, 1], [1, 1]], // poziomo
                [[1, 0], [1, 1], [2, 1], [2, 2]]  // pionowo
            ],
            color: '#2E6B2E'
        },
        Z: {
            rotations: [
                [[0, 0], [1, 0], [1, 1], [2, 1]], // poziomo
                [[2, 0], [1, 1], [2, 1], [1, 2]]  // pionowo
            ],
            color: '#8B1A1A'
        },
        J: {
            rotations: [
                [[0, 0], [0, 1], [1, 1], [2, 1]], // górą
                [[1, 0], [2, 0], [1, 1], [1, 2]], // prawa
                [[0, 1], [1, 1], [2, 1], [2, 2]], // dół
                [[1, 0], [1, 1], [0, 2], [1, 2]]  // lewa
            ],
            color: '#1E3F73'
        },
        L: {
            rotations: [
                [[2, 0], [0, 1], [1, 1], [2, 1]], // górą
                [[1, 0], [1, 1], [1, 2], [2, 2]], // prawa
                [[0, 1], [1, 1], [2, 1], [0, 2]], // dół
                [[0, 0], [1, 0], [1, 1], [1, 2]]  // lewa
            ],
            color: '#862872'
        }
    }

    static TYPES = Object.keys(this.SHAPES);

    static randomTetromino()
    {
        const randomType = this.TYPES[Math.floor(Math.random() * this.TYPES.length)];
        const shapeData = this.SHAPES[randomType];
        const rotationIndex = Math.floor(Math.random() * shapeData.rotations.length);
        return new Tetromino(randomType, shapeData, rotationIndex);
    }
}
