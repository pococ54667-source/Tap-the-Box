// Premium clicker logic — smooth, fast, mobile-first
const arena = document.getElementById('arena');
const box = document.getElementById('box');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('overlay');
const finalScoreEl = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgain');
const shareBtn = document.getElementById('shareBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboardPanel = document.getElementById('leaderboard');
const lbList = document.getElementById('lbList');
const howBtn = document.getElementById('howBtn');
const howPanel = document.getElementById('howPanel');
const soundToggle = document.getElementById('soundToggle');
const tapSound = document.getElementById('tapSound');

let score = 0;
let timeLeft = 30;
let running = false;
let timerId = null;
let soundOn = true;

// Load best score from localStorage
const best = Number(localStorage.getItem('bestScore') || 0);
bestEl.textContent = best;

// Random position inside arena
function randomPos() {
  const rect = arena.getBoundingClientRect();
  const padding = 50; // keep inside bounds
  const x = Math.random() * (rect.width - padding * 2) + padding;
  const y = Math.random() * (rect.height - padding * 2) + padding;
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
}

// Start round
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

  // Move box every 700–1100ms for premium feel
  const moveLoop = () => {
    if (!running) return;
    randomPos();
    const next = 700 + Math.random() * 400;
    setTimeout(moveLoop, next);
  };
  moveLoop();

  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) end();
  }, 1000);
}

// End round
function end() {
  running = false;
  clearInterval(timerId);
  box.disabled = true;
  finalScoreEl.textContent = score;
  overlay.classList.remove('hidden');

  // Save best + leaderboard
  const currentBest = Number(localStorage.getItem('bestScore') || 0);
  if (score > currentBest) localStorage.setItem('bestScore', String(score));
  bestEl.textContent = Math.max(score, currentBest);

  const lb = JSON.parse(localStorage.getItem('lb') || '[]');
  lb.push({ score, ts: Date.now() });
  lb.sort((a,b) => b.score - a.score);
  localStorage.setItem('lb', JSON.stringify(lb.slice(0,10)));
  renderLeaderboard();
}

// Tap handler
box.addEventListener('click', () => {
  if (!running) return;
  score++;
  scoreEl.textContent = score;
  // subtle feedback
  box.style.transform = 'translate(-50%,-50%) scale(.96)';
  setTimeout(() => (box.style.transform = 'translate(-50%,-50%) scale(1)'), 80);
  if (soundOn) {
    // play tiny click (replace source in HTML for real sound)
    tapSound.currentTime = 0;
    tapSound.play().catch(()=>{});
  }
  // small chance to jump immediately for excitement
  if (Math.random() < 0.25) randomPos();
});

// Buttons
startBtn.addEventListener('click', start);
playAgainBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  start();
});

shareBtn.addEventListener('click', async () => {
  const text = `I scored ${score} in Tap the Box! Can you beat me?`;
  const url = location.href;
  if (navigator.share) {
    try { await navigator.share({ title: 'Tap the Box', text, url }); } catch {}
  } else {
    navigator.clipboard.writeText(`${text} ${url}`).then(()=>{
      alert('Copied! Share it anywhere.');
    });
  }
});

leaderboardBtn.addEventListener('click', () => {
  leaderboardPanel.classList.toggle('hidden');
});

howBtn.addEventListener('click', () => {
  howPanel.classList.toggle('hidden');
});

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
});

// Render leaderboard
function renderLeaderboard() {
  const lb = JSON.parse(localStorage.getItem('lb') || '[]');
  lbList.innerHTML = lb
    .map((item, i) => `<li><strong>${i+1}.</strong> ${item.score} pts</li>`)
    .join('');
}

// Initial placement
randomPos();
renderLeaderboard();
