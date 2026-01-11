const arena = document.getElementById('arena');
const box = document.getElementById('box');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('overlay');
const finalScoreEl = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgain');
const soundToggle = document.getElementById('soundToggle');

const tapSound = document.getElementById('tapSound');
const bgMusic = document.getElementById('bgMusic');
const beepSound = document.getElementById('beepSound');

let score = 0;
let timeLeft = 30;
let running = false;
let timerId = null;
let soundOn = true;

const best = Number(localStorage.getItem('bestScore') || 0);
bestEl.textContent = best;

function randomPos() {
  const rect = arena.getBoundingClientRect();
  const padding = 50;
  const x = Math.random() * (rect.width - padding * 2) + padding;
  const y = Math.random() * (rect.height - padding * 2) + padding;
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
}

function start() {
  if (running) return;
  score = 0;
  timeLeft = 30;
  running = true;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  overlay.classList.add('hidden');
  randomPos();
  box.disabled = false;

  if (soundOn) bgMusic.play();

  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 5 && soundOn) beepSound.play();
    if (timeLeft <= 0) end();
  }, 1000);
}

function end() {
  running = false;
  clearInterval(timerId);
  box.disabled = true;
  finalScoreEl.textContent = score;
  overlay.classList.remove('hidden');
  bgMusic.pause();
  bgMusic.currentTime = 0;

  const currentBest = Number(localStorage.getItem('bestScore') || 0);
  if (score > currentBest) localStorage.setItem('bestScore', String(score));
  bestEl.textContent = Math.max(score, currentBest);
}

box.addEventListener('click', () => {
  if (!running) return;
  score++;
  scoreEl.textContent = score;
  if (soundOn) {
    tapSound.currentTime = 0;
    tapSound.play().catch(()=>{});
  }
  randomPos();
});

startBtn.addEventListener('click', start);
playAgainBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  start();
});

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
  if (!soundOn) {
    bgMusic.pause();
  }
});
