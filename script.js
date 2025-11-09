const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const flapSound = document.getElementById("flapSound");
const scoreSound = document.getElementById("scoreSound");
const hitSound = document.getElementById("hitSound");
const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 0.3;
bgMusic.play().catch(() => {});

const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");

// Colors
const birdColor = "#ffd700";
const pipeColor = "#4caf50";
const scoreColor = "#ffffff";

// Game variables
let bird, pipes, frame, score, gameOver;

// Initialize game
function initGame() {
  bird = { x: 80, y: 300, width: 34, height: 24, gravity: 0.6, velocity: 0, lift: -10 };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  bgMusic.play().catch(()=>{});
}

initGame();

// Input
document.addEventListener("keydown", flap);
canvas.addEventListener("click", flap);

function flap() {
  if (!gameOver) {
    bird.velocity = bird.lift;
    flapSound.currentTime = 0;
    flapSound.play();
  }
}

// Generate pipes
function addPipe() {
  const topHeight = Math.random() * (canvas.height - 180 - 100) + 50;
  pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - topHeight - 180 });
}

// Collision detection
function checkCollision(pipe) {
  if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + 60) return true;
  }
  return false;
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.fillStyle = birdColor;
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Pipes
  ctx.fillStyle = pipeColor;
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 60, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 60, pipe.bottom);
  });

  // Score
  ctx.fillStyle = scoreColor;
  ctx.font = "28px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Update
function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) hit();

  pipes.forEach(pipe => {
    pipe.x -= 3;
    if (!pipe.scored && pipe.x + 60 < bird.x) {
      score++;
      pipe.scored = true;
      scoreSound.currentTime = 0;
      scoreSound.play();
    }
    if (checkCollision(pipe)) hit();
  });

  pipes = pipes.filter(pipe => pipe.x + 60 > 0);

  if (frame % 90 === 0) addPipe();

  frame++;
}

// Game over
function hit() {
  if (gameOver) return;
  hitSound.play();
  gameOver = true;
  bgMusic.pause();
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#ff5555";
  ctx.font = "48px Arial";
  ctx.fillText("GAME OVER", 80, canvas.height/2 - 20);
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 180, canvas.height/2 + 20);
}

// Main loop
function loop() {
  if(!gameOver){
    update();
    draw();
    requestAnimationFrame(loop);
  }
}
loop();

// Restart button
restartBtn.addEventListener("click", () => {
  initGame();
  loop();
});

// Theme button
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});
