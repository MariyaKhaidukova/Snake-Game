class GameEngine {

    constructor(canvas, ctx, blockSize) {
        this.blockSize = blockSize;
        this.rows = canvas.height / blockSize;
        this.columns = canvas.width / blockSize;
        this.ctx = ctx;
        const { x, y } = this.randomCoordinates();
        this.snake = new Snake(0, 0, canvas, this.ctx, "#FF4500", "#FF7F50", blockSize);
        this.apple = new Apple(x, y, ctx, "#DC143C", blockSize);
        this.currentScore = 0;
        this.highestScore = 0;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.gameLoop = this.gameLoop.bind(this);

        window.setInterval(this.gameLoop, 500);
        window.addEventListener('keydown', this.onKeyDown);

    }




    randomCoordinates() {
        return {
            x: (Math.floor(Math.random() * this.columns - 1) + 1) * this.blockSize,
            y: (Math.floor(Math.random() * this.rows - 1) + 1) * this.blockSize
        }
    }

    gameLoop() {
        // Clear Previous State
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw Apple
        this.apple.draw();
        // Update and Draw Snake
        this.snake.update();
        this.snake.draw();

        // Handle Collision
        if (this.snake.tailCollision()) {
            this.currentScore = 0;
            this.snake.total = 1;
            this.snake.tail = [];

            this.updateScore();
        }

        if (this.snake.eat(this.apple)) {
            const { x, y } = this.randomCoordinates();
            this.apple.x = x;
            this.apple.y = y;
            this.currentScore++;
            this.snake.total = this.currentScore;
            this.updateScore();
        }
    }




    updateScore() {
        if (this.currentScore > this.highestScore) { this.highestScore = this.currentScore; }
        const currentScore = document.getElementById("current-score");
        const highestScore = document.getElementById("highest-score");

        currentScore.textContent = `${this.currentScore}`
        highestScore.textContent = `${this.highestScore}`
    }

    onKeyDown(e) {
        switch(e.key) {
            case 'ArrowDown':
                this.snake.xSpeed = 0;
                this.snake.ySpeed = this.blockSize;
                break;
            case 'ArrowUp':
                this.snake.xSpeed = 0;
                this.snake.ySpeed = -this.blockSize;
                break;
            case 'ArrowLeft':
                this.snake.xSpeed = -this.blockSize;
                this.snake.ySpeed = 0;
                break;
            case 'ArrowRight':
                this.snake.xSpeed = this.blockSize;
                this.snake.ySpeed = 0;
                break;
        }
    }
}

class Apple {

    constructor(x=0, y=0, ctx, color, blockSize) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.blockSize = blockSize;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.fillStyle = "#DC143C";
        this.ctx.fillRect(this.x, this.y, this.blockSize, this.blockSize);
    }
}

class Snake {

    constructor(x, y, canvas, ctx, headColor, tailColor, blockSize) {
        this.x = 160;
        this.y = 160;
        this.blockSize = blockSize;
        this.headColor = headColor;
        this.tailColor = tailColor;
        this.xSpeed = 0; 
        this.ySpeed = 0;
        this.total = 1;
        this.tail = [];
        this.canvas = canvas;
        this.ctx = ctx;
    }

    draw() {
        for (let i=0; i<this.tail.length; i++) {
            this.ctx.fillStyle = this.tailColor;
            this.ctx.fillRect(this.tail[i].x, this.tail[i].y, this.blockSize, this.blockSize);
        }

        this.ctx.fillStyle = this.headColor;
        this.ctx.fillRect(this.x, this.y, this.blockSize, this.blockSize);
    }

    update() {
        for (let i=0; i<this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y }

        this.x += this.xSpeed
        this.y += this.ySpeed

        if (this.x > this.canvas.width) {
            this.x = 0;
        } else if (this.y > this.canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = this.canvas.height;
        } else if (this.x < 0) {
            this.x = this.canvas.width;
        }
    }

    tailCollision() {
        const hasNotCollided = this.tail.map(({ x, y }) => {
            console.log()
            return this.x == x && this.y == y;
        })
        .every(value => value == false)
        return !hasNotCollided
    }

    eat(apple) {
        const hasCollided = apple.x == this.x && apple.y == this.y;
        if (hasCollided) { this.total++; }
        return hasCollided;
    }

}



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const gameEngine = new GameEngine(canvas, ctx, 40);