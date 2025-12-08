const board = document.querySelector(".board");
const blockSize = 30;

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);

board.style.display = "grid";
board.style.gridTemplateColumns = `repeat(${cols}, ${blockSize}px)`;

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = "right";
let intervalId = null;

const highScoreElement = document.querySelector(".highScore");
const currentScoreElement = document.querySelector(".currentScore");
const timeElement = document.querySelector(".currentTime");

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};

let highScore = localStorage.getItem("snakeHighScore") 
                ? Number(localStorage.getItem("snakeHighScore")) 
                : 0;

highScoreElement.innerText = "High Score: " + highScore;

let currentScore = 0;

// TIMER 
let seconds = 0;
let timerId = null;

function startTimer() {
    timerId = setInterval(() => {
        seconds++;
        let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        let secs = String(seconds % 60).padStart(2, "0");
        timeElement.innerText = `${mins}:${secs}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    seconds = 0;
    timeElement.innerText = "00:00";
}
// create board blocks
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function startGame() {
    document.querySelector(".starting-modal").style.display = "none";
    currentScore = 0;
    currentScoreElement.innerText = "Score: " + currentScore;

    resetTimer();
    startTimer();

    if (!intervalId) intervalId = setInterval(render, 200);
}

function tryAgain() {
    document.querySelector(".gameover-modal").style.display = "none";

    snake = [{ x: 1, y: 3 }];
    direction = "right";

    document.querySelectorAll(".fill").forEach(el => el.classList.remove("fill"));
    document.querySelectorAll(".food").forEach(el => el.classList.remove("food"));

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    currentScore = 0;
    currentScoreElement.innerText = "Score: " + currentScore;

    resetTimer();
    startTimer();

    if (!intervalId) intervalId = setInterval(render, 300);
}

document.querySelector(".starting-modal").style.display = "block";

function render() {

    let head;

    if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
    else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        clearInterval(timerId);
        intervalId = null;
        document.querySelector(".gameover-modal").style.display = "block";
        return;
    }

    document.querySelectorAll(".fill").forEach(el => el.classList.remove("fill"));

    snake.unshift(head);

    //HIGHSCORE 
    if (head.x === food.x && head.y === food.y) {
        document.querySelectorAll(".food")
            .forEach(el => el.classList.remove("food"));

        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

        currentScore += 10;
        currentScoreElement.innerText = "Score: " + currentScore;

        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElement.innerText = "High Score: " + highScore;
            localStorage.setItem("snakeHighScore", highScore);
        }

    } else {
        snake.pop();
    }

    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`]?.classList.add("fill");
    });

    blocks[`${food.x}-${food.y}`].classList.add("food");
}

addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});
