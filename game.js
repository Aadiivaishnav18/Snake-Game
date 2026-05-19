const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const box = 20;

canvas.width = 600;
canvas.height = 600;

let snake = [
    { x: 300, y: 300 }
];

let direction = "RIGHT";
let nextDirection = "RIGHT";

let score = 0;
let speed = 140;

let game = null;
let paused = false;
let time = 0;

let food = generateFood();

let highScore = localStorage.getItem("highScore") || 0;

const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const timeEl = document.getElementById("time");

if (highscoreEl) {
    highscoreEl.innerText = highScore;
}

function generateFood() {

    let foodPosition;

    while (
        !foodPosition ||
        snake.some(
            segment =>
                segment.x === foodPosition.x &&
                segment.y === foodPosition.y
        )
    ) {

        foodPosition = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    }

    return foodPosition;
}

document.addEventListener("keydown", e => {

    if (paused) return;

    if (e.key === "ArrowUp" && direction !== "DOWN") {
        nextDirection = "UP";
    }

    if (e.key === "ArrowDown" && direction !== "UP") {
        nextDirection = "DOWN";
    }

    if (e.key === "ArrowLeft" && direction !== "RIGHT") {
        nextDirection = "LEFT";
    }

    if (e.key === "ArrowRight" && direction !== "LEFT") {
        nextDirection = "RIGHT";
    }

    if (e.code === "Space") {
        pauseGame();
    }
});

function drawBoard() {

    ctx.fillStyle = "#050816";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {

    snake.forEach((segment, index) => {

        if (index === 0) {
            ctx.fillStyle = "#39ff14";
            ctx.shadowColor = "#39ff14";
            ctx.shadowBlur = 15;
        } else {
            ctx.fillStyle = "#00cc66";
            ctx.shadowBlur = 0;
        }

        ctx.fillRect(
            segment.x,
            segment.y,
            box - 2,
            box - 2
        );
    });

    ctx.shadowBlur = 0;
}

function drawFood() {

    ctx.fillStyle = "red";

    ctx.fillRect(
        food.x,
        food.y,
        box - 2,
        box - 2
    );
}

function moveSnake() {

    direction = nextDirection;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    const newHead = {
        x: headX,
        y: headY
    };

    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height
    ) {
        gameOver();
        return;
    }

    for (let i = 1; i < snake.length; i++) {

        if (
            snake[i].x === newHead.x &&
            snake[i].y === newHead.y
        ) {
            gameOver();
            return;
        }
    }

    snake.unshift(newHead);

    if (
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        score++;

        if (scoreEl) {
            scoreEl.innerText = score;
        }

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "highScore",
                highScore
            );

            if (highscoreEl) {
                highscoreEl.innerText = highScore;
            }
        }

        food = generateFood();

        if (speed > 55) {

            speed -= 4;

            restartGameLoop();
        }

    } else {

        snake.pop();
    }
}

function gameLoop() {

    drawBoard();

    drawFood();

    drawSnake();

    moveSnake();
}

function restartGameLoop() {

    clearInterval(game);

    game = setInterval(gameLoop, speed);
}

function gameOver() {

    clearInterval(game);

    setTimeout(() => {

        alert(`Game Over 💀 Final Score: ${score}`);

        resetGame();

    }, 100);
}

function resetGame() {

    snake = [
        { x: 300, y: 300 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;
    speed = 140;
    time = 0;
    paused = false;

    food = generateFood();

    if (scoreEl) {
        scoreEl.innerText = score;
    }

    if (timeEl) {
        timeEl.innerText = time;
    }

    restartGameLoop();
}

function pauseGame() {

    paused = !paused;

    clearInterval(game);

    if (!paused) {
        restartGameLoop();
    }
}

restartGameLoop();

setInterval(() => {

    if (!paused) {

        time++;

        if (timeEl) {
            timeEl.innerText = `${time}s`;
        }
    }

}, 1000);