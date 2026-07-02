let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
// draw on the screen to get the context, ask canvas to get the 2d context
// snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// speed of the game
let speed = 7;
// size and count of a tile
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
// head of the snake
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
// apple size
let appleX = 5;
let appleY = 5;
// movement
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameOverState = false;
let gulpSound = new Audio("gulp.mp3");
//game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }
  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  if (xVelocity === 0 && yVelocity === 0 && !gameOverState) {
    ctx.fillStyle = "white";
    ctx.font = "16px Verdana";
    ctx.fillText("Press an arrow key to start", canvas.width / 5, canvas.height / 2 + 60);
  }
  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }
  setTimeout(drawGame, 1000 / speed);
}
function isGameOver() {
  let gameOver = false;
  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }
  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }
  if (gameOver) {
    gameOverState = true;
    ctx.font = "50px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);

    ctx.fillStyle = "white";
    ctx.font = "15px Verdana";
    ctx.fillText("Press Space to Restart", canvas.width / 4, canvas.height / 2 + 40);
  }
  return gameOver;
}
function drawScore() {
  document.getElementById("scoreText").textContent = score;
  document.getElementById("highScoreText").textContent = highScore;
}
function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthest item from the snake parts if have more than our tail size.
  }
  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}
function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}
function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
    }
    gulpSound.play();
  }
}
function restartGame() {
  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;
  appleX = 5;
  appleY = 5;
  inputsXVelocity = 0;
  inputsYVelocity = 0;
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
  speed = 7;
  gameOverState = false;
  drawGame();
}
document.body.addEventListener("keydown", keyDown);
function keyDown(event) {
  // space to restart
  if (event.keyCode == 32 && gameOverState) {
    restartGame();
    return;
  }
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }
  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }
  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }
  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}
drawScore();
drawGame();
