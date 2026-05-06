const size = 4;
const puzzle = document.getElementById("puzzle");
let tiles = [];
let emptyIndex = 15;

function createPuzzle() {
  tiles = [...Array(15).keys()];
  tiles.push(null);
  shuffle(tiles);
  render();
}

function render() {
  puzzle.innerHTML = "";

  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.classList.add("tile");

    if (tile === null) {
      div.classList.add("empty");
      emptyIndex = index;
    } else {
      const row = Math.floor(tile / size);
      const col = tile % size;

      div.style.backgroundPosition = `
        ${(-col * 100) / (size - 1)}% 
        ${(-row * 100) / (size - 1)}%
      `;

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
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
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
  for (let i = 0; i < 15; i++) {
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

/* CONFETI OPTIMIZADO MOVIL */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let confetti = [];
let confettiInterval;

function startConfetti() {
  confettiInterval = setInterval(() => {
    confetti.push({
      x: Math.random() * canvas.width,
      y: 0,
      r: Math.random() * 6 + 4,
      d: Math.random() * 4 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }, 120);

  requestAnimationFrame(updateConfetti);
}

function stopConfetti() {
  clearInterval(confettiInterval);
  confetti = [];
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((c, i) => {
    c.y += c.d;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();

    if (c.y > canvas.height) confetti.splice(i, 1);
  });

  if (confetti.length > 0) {
    requestAnimationFrame(updateConfetti);
  }
}

createPuzzle();