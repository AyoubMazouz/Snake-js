const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const scoreLabel = document.getElementById("score");
const speedLabel = document.getElementById("speed");
const hightScoreLabel = document.getElementById("hight-score");
const speedSlider = document.getElementById("slider");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("reset");

canvas.width = gameSize.width;
canvas.height = gameSize.height;

class Vector2D {
    constructor(x, y) {
        [this.x, this.y] = [x, y];
    }

    plus(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    isEqualTo(vector) {
        return (this.x === vector.x && this.y === vector.y);
    }
}
const getRandomVector2D = () => {
    return new Vector2D(
        (Math.random() * gridSize.x) | 0,
        (Math.random() * gridSize.y) | 0
    );
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!! > Functions < !!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const stopGameLoop = loop => clearInterval(loop);
const startGameLoop = (loop, fps) => gameLoop = setInterval(loop, fps);
const updateSpeedLabel = () => speedLabel.innerHTML = speedString[player.speed];
const updateScoreLabel = () => scoreLabel.innerHTML = player.score;

const updateHightScoreLabel = () => {
    player.hightScore = localStorage.hightScore ? localStorage.hightScore : 0;
    hightScoreLabel.innerText = player.hightScore
}

const updateHightScore = () => {
    const hScore = localStorage.getItem("hightScore");
    localStorage.hightScore = player.score > hScore ? player.score : hScore;
}

const turnIsValid = (v1, v2) => {
    if (Math.abs(v1.x) !== Math.abs(v2.x) &&
        Math.abs(v1.y) !== Math.abs(v2.y)) return true
    return false
}

const collision = () => {
    const head = player.body[0];
    if (head.isEqualTo(food.pos)) {
        player.score += 10;
        player.grow();
        food.newFood();
        updateScoreLabel();
    } else if (head.x < 0) head.plus(new Vector2D(20, 0));
    else if (head.x >= gridSize.x) head.plus(new Vector2D(-20, 0));
    else if (head.y < 0) head.plus(new Vector2D(0, 20));
    else if (head.y >= gridSize.y) head.plus(new Vector2D(0, -20));

    for (let i = 2; i < player.body.length; i++) {
        if (head.isEqualTo(player.body[i])) reset(gameLoop);
    }
}

const reset = loop => {
    stopGameLoop(loop);
    updateHightScore();
    player.score = 0;
    player.body = [new Vector2D(10, 10), new Vector2D(11, 10)];
    player.speed = speedSlider.value;
    food.newFood();
    updateSpeedLabel();
    updateScoreLabel();
    updateHightScoreLabel();
    startGameLoop(update, player.speed);
}

const pause = loop => {
    if (player.isPaused) {
        startGameLoop(update, player.speed);
        player.isPaused = false;
    } else {
        stopGameLoop(loop);
        player.isPaused = true;
    }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!! > Draw < !!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const drawSnake = () => {
    player.body.forEach(part => drawBlock(part.x, part.y, colors.snake));
}

const drawApple = () => drawCircle(food.pos.x, food.pos.y, colors.apple);

const drawBlock = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

const drawCircle = (x, y, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2,
        blockSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

const drawBackground = () => {
    let switchColor = false;
    for (let x = 0; x < gridSize.x; x++) {
        for (let y = 0; y < gridSize.y; y++) {
            drawBlock(x, y, switchColor ? colors.bgLight : colors.bgDark);
            switchColor = !switchColor;
        }
        switchColor = !switchColor;
    }
}

const draw = () => {
    drawBackground();
    drawApple();
    drawSnake();
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!! > Objects < !!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const food = {
    pos: getRandomVector2D(),
    newFood() { this.pos = getRandomVector2D() }
}

const dir = {
    left: new Vector2D(-1, 0), right: new Vector2D(1, 0),
    down: new Vector2D(0, 1), up: new Vector2D(0, -1)
}

const player = {
    score: 0,
    hightScore: 0,
    speed: speedSlider.value,
    dir: new Vector2D(-1, 0),
    body: [
        new Vector2D(10, 10),
        new Vector2D(11, 10),
        new Vector2D(12, 10),
        new Vector2D(13, 10)
    ],

    grow(dir = this.dir) {
        const head = new Vector2D(
            this.body[0].x,
            this.body[0].y
        );
        this.body.unshift(head.plus(dir));
    },

    move(dir = this.dir) {
        this.body.pop();
        this.grow(dir);
    },

    turn(dir) {
        if (this.dir !== dir) {
            if (turnIsValid(dir, this.dir)) {
                this.dir = dir;
            }
        }
    },
}

let gameLoop;
const update = () => {
    draw();
    collision();
    player.move();
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!! > Events < !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
pauseBtn.addEventListener("click", () => pause(gameLoop));
restartBtn.addEventListener("click", () => reset(gameLoop));
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) player.turn(dir.left);
    else if (event.keyCode === 39) player.turn(dir.right);
    else if (event.keyCode === 40) player.turn(dir.down);
    else if (event.keyCode === 38) player.turn(dir.up);
})

const init = () => {
    gameLoop = setInterval(update, player.speed);
    updateSpeedLabel();
    initHighScore();
}; init()