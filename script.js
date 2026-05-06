const size = 4;
const puzzle = document.getElementById("puzzle");

let tiles = [];
let emptyIndex = 15;

function createPuzzle() {
  tiles = [...Array(size * size - 1).keys()];
  tiles.push(null);
  shuffle(tiles);
  render();
}

function render() {
  puzzle.innerHTML = "";

  const puzzleWidth = puzzle.clientWidth;
  const puzzleHeight = puzzle.clientHeight;

  const tileWidth = puzzleWidth / size;
  const tileHeight = puzzleHeight / size;

  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.classList.add("tile");

    div.style.width = `${tileWidth}px`;
    div.style.height = `${tileHeight}px`;
    div.style.backgroundSize = `${puzzleWidth}px ${puzzleHeight}px`;

    if (tile === null) {
      div.classList.add("empty");
      emptyIndex = index;
    } else {
      const row = Math.floor(tile / size);
      const col = tile % size;

      div.style.backgroundPosition =
        `-${col * tileWidth}px -${row * tileHeight}px`;

      div.addEventListener("click", () => moveTile(index));
    }

    puzzle.appendChild(div);
  });
}

function moveTile(index) {
  const validMoves = [
    emptyIndex - 1,
    emptyIndex + 1,
    emptyIndex - size,
    emptyIndex + size
  ];

  if (validMoves.includes(index)) {
    [tiles[index], tiles[emptyIndex]] =
      [tiles[emptyIndex], tiles[index]];

    emptyIndex = index;
    render();
    checkWin();
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i) return;
  }

  document.getElementById("overlay").classList.add("show");
  startConfetti();
}

function restartGame() {
  document.getElementById("overlay").classList.remove("show");
  stopConfetti();
  createPuzzle();
}

window.addEventListener("resize", render);

createPuzzle();

/* ======================
   CONFETI FUNCIONAL
====================== */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confettiPieces = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function startConfetti() {
  confettiPieces = [];

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 8 + 4;

    confettiPieces.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: Math.random() * 8 + 4,
      gravity: 0.2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach(piece => {
    piece.vy += piece.gravity;
    piece.x += piece.vx;
    piece.y += piece.vy;

    ctx.fillStyle = piece.color;
    ctx.fillRect(piece.x, piece.y, piece.size, piece.size);
  });

  animationId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}