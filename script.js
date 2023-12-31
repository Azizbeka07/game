"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 100,
  paddleHeight = 10;
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - 20,
  dx: 8,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 4,
  dy: -4,
  radius: 10,
};
const bricks = [];
const brickRowCount = 5,
  brickColumnCount = 8,
  brickWidth = 71,
  brickHeight = 20,
  brickPadding = 10,
  brickOffsetTop = 30,
  brickOffsetLeft = 30,
  brickMarginTop = 10;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let score = 0;
let lives = 3;

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFF";
  ctx.marginBottom = "10px";
  ctx.fillText("Score: " + score, 20, 30);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("❤️" + lives, canvas.width - 80, 30);
}

function drawPaddle(x, y) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = "#fff";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (
        b.status === 1 &&
        ball.x > b.x &&
        ball.x < b.x + brickWidth &&
        ball.y > b.y &&
        ball.y < b.y + brickHeight
      ) {
        ball.dy = -ball.dy;
        b.status = 0;
        score++;
        if (score === brickRowCount * brickColumnCount) {
          youWin();
        }
      }
    }
  }
}

function youWin() {
  alert("Congratulations! You win!");
  document.location.reload();
}

function gameOver() {
  alert("Game Over! Your score is" + score);
  document.location.reload();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawPaddle(paddle.x, paddle.y);
  drawBall(ball.x, ball.y);
  drawScore();
  drawLives();

  collisionDetection();

  // Paddle harakatini chegaralash
  if (
    paddle.x + paddle.dx > 0 &&
    paddle.x + paddle.dx < canvas.width - paddleWidth
  ) {
    paddle.x += paddle.dx;
  }

  // Topni harakatga o'tkazish
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Topni stenarlarga urib, pastga yoki paddle ga urib o'tkazish
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.radius > canvas.height - paddleHeight) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      lives--;
      if (!lives) {
        gameOver();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        paddle.x = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // O'yinning davomi
  requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = 8;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -8;
  }
}

function keyUpHandler(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// O'yinning boshlanishi
draw();
