class Board
{
    constructor(gridSelector, width)
    {
        this.grid = document.querySelector(gridSelector);
        this.width = width;
        this.cells = Array.from(this.grid.querySelectorAll('div'));
    }

    draw(tetromino)
    {
        tetromino.shape.forEach(index =>
        {
            this.cells[tetromino.position + index].classList.add('tetromino');
            this.cells[tetromino.position + index].style.backgroundColor = tetromino.color;
        });
    }

    undraw(tetromino)
    {
        tetromino.shape.forEach(index =>
        {
            this.cells[tetromino.position + index].classList.remove('tetromino');
            this.cells[tetromino.position + index].style.backgroundColor = '';
        });
    }
}


document.addEventListener('DOMContentLoaded', () =>
{
    const board = new Board('.grid', 10);
    const scoreDisplay = document.getElementById('score')
    const startButton = document.getElementById('start-button')
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    const colors = ['orange', 'red', 'purple', 'blue', 'green', 'yellow', 'pink']

    // The Tetrominoes
    const jTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]
    const sTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    // Other posible tetrominos
    // const lTetromino = [
    //     [0, 1, width + 1, width * 2 + 1],
    //     [width * 2, width * 2 + 1, width * 2 + 2, width + 2],
    //     [1, width + 1, width * 2 + 1, width * 2 + 2],
    //     [width, width + 1, width + 2, width * 2]
    // ]

    // const zTetromino = [
    //     [width, width + 1, width * 2 + 1, width * 2 + 2],
    //     [1, width, width + 1, width * 2],
    //     [width, width + 1, width * 2 + 1, width * 2 + 2],
    //     [1, width, width + 1, width * 2]
    // ]

    const tetrominoes = [jTetromino, sTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0
    let random = Math.floor(Math.random() * tetrominoes.length)
    let current = tetrominoes[random][currentRotation]

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
        //[0, 1, displayWidth + 1, displayWidth * 2 + 1], // L Tetromino
        //[width, width + 1, width * 2 + 1, width * 2 + 2] // Z Tetromino
    ]

    // --- FUNKCJE ---

    function draw()
    {
        current.forEach(index =>
        {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw()
    {
        current.forEach(index =>
        {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    function control(e)
    {
        switch (e.key) {
            case 'ArrowLeft': moveLeft(); break
            case 'ArrowRight': moveRight(); break
            case 'ArrowDown': moveDown(); break
            case 'ArrowUp': rotate(); break
        }
    }

    function freeze()
    {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * tetrominoes.length)
            current = tetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveDown()
    {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function moveLeft()
    {
        undraw()
        const canMove = current.every(index =>
        {
            const pos = currentPosition + index - 1
            return pos >= 0 && !squares[pos].classList.contains('taken') && (pos % width !== width - 1)
        })
        if (canMove) currentPosition -= 1
        draw()
    }

    function moveRight()
    {
        undraw()
        const canMove = current.every(index =>
        {
            const pos = currentPosition + index + 1
            return pos < squares.length && !squares[pos].classList.contains('taken') && (pos % width !== 0)
        })
        if (canMove) currentPosition += 1
        draw()
    }

    function wallKick(nextPattern, position)
    {
        const shifts = [0, -1, 1, -2, 2]
        for (let shift of shifts) {
            const canRotate = nextPattern.every(index =>
            {
                const pos = position + index + shift
                const col = pos % width
                return pos >= 0 &&
                    pos < squares.length &&
                    !squares[pos].classList.contains('taken') &&
                    col >= 0 && col < width
            })
            if (canRotate) return position + shift
        }
        return null
    }

    function rotate()
    {
        undraw()
        const nextRotation = (currentRotation + 1) % tetrominoes[random].length
        const nextPattern = tetrominoes[random][nextRotation]
        const newPosition = wallKick(nextPattern, currentPosition)

        if (newPosition !== null) {
            currentPosition = newPosition
            currentRotation = nextRotation
            current = nextPattern
        }

        draw()
    }

    function displayShape()
    {
        displaySquares.forEach(square =>
        {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index =>
        {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    function addScore()
    {
        for (let i = 0; i < 200; i += width) {
            const row = Array.from({ length: width }, (_, j) => i + j)
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.textContent = score
                row.forEach(index =>
                {
                    squares[index].classList.remove('taken', 'tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver()
    {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.textContent = 'Game Over'
            clearInterval(timerId)
            document.removeEventListener('keyup', control)
        }
    }


    startButton.addEventListener('click', () =>
    {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            displayShape()
        }
    })

    document.addEventListener('keyup', control)
})