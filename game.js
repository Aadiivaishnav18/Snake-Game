const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const box = 20;
canvas.width = 600;
canvas.height = 600;

let snake = [{ x: 200, y: 200 }];
let food = randomFood();

let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let speed = 150;
let game;
let paused = false;
let time = 0;

let highScore = localStorage.getItem("highScore") || 0;
const highscoreEl = document.getElementById("highscore");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

if (highscoreEl) highscoreEl.innerText = highScore;

function randomFood() {
    let newFood;
    while (!newFood || snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    }
    return newFood;
}

document.addEventListener("keydown", e => {
    if (paused) return;
    if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(s.x, s.y, box - 2, box - 2);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box - 2, box - 2);

    direction = nextDirection;
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some(s => s.x === head.x && s.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        if (scoreEl) scoreEl.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            if (highscoreEl) highscoreEl.innerText = highScore;
        }

        food = randomFood();

        if (score % 3 === 0 && speed > 60) {
            speed -= 10;
            clearInterval(game);
            game = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }
}

function gameOver() {
    clearInterval(game);
    alert(`Game Over 💀 Final Score: ${score}`);
    
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    speed = 150;
    time = 0;
    paused = false;

    if (scoreEl) scoreEl.innerText = score;
    if (timeEl) timeEl.innerText = time;
    
    food = randomFood();
    game = setInterval(draw, speed);
}

function pauseGame() {
    paused = !paused;
    if (paused) {
        clearInterval(game);
    } else {
        game = setInterval(draw, speed);
    }
}

game = setInterval(draw, speed);

setInterval(() => {
    if (!paused) {
        time++;
        if (timeEl) timeEl.innerText = time;
    }
}, 1000);
