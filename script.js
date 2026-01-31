// 0 = wall, 1 = path, 2 = start, 3 = goal
const levels = [
  [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,1,1,0,1,1,1,1,1,1,0],
    [0,0,0,1,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,0,1,1,0,1,0],
    [0,1,0,0,0,0,0,1,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,0,1,1,1,1,3,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,1,1,1,0,1,1,1,1,1,0],
    [0,1,0,0,1,0,1,0,0,0,1,0],
    [0,1,1,0,1,1,1,1,1,0,1,0],
    [0,0,1,0,0,0,0,0,1,0,1,0],
    [0,1,1,1,1,1,1,0,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,0,1,1,1,1,3,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ]
];

let levelIndex = 0;
let level = levels[levelIndex];

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const correctEl = document.getElementById("correct");

const backdrop = document.getElementById("modalBackdrop");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitAnswer = document.getElementById("submitAnswer");
const cancelMove = document.getElementById("cancelMove");
const feedback = document.getElementById("feedback");
const toast = document.getElementById("toast");


let rows = level.length;
let cols = level[0].length;

let player = findTile(2); // start
let goal = findTile(3);

let playerName = "You";
let playerAvatar = "🙂";

let moves = 0;
let correct = 0;

function loadLevel(index){
  levelIndex = index;
  level = levels[levelIndex];

  // recompute sizes
  rows = level.length;
  cols = level[0].length;

  player = findTile(2);
  goal = findTile(3);

  const startBackdrop = document.getElementById("startBackdrop");
const nameInput = document.getElementById("nameInput");
const avatarPicker = document.getElementById("avatarPicker");
const startGameBtn = document.getElementById("startGame");

const avatars = ["🙂","😺","🐸","🦊","🐼","🐵","🧙‍♂️","👩‍🚀"];

let selectedAvatarIndex = 0;

function buildAvatarPicker(){
  avatarPicker.innerHTML = "";
  avatars.forEach((a, i) => {
    const b = document.createElement("button");
    b.className = "avatarBtn" + (i === selectedAvatarIndex ? " selected" : "");
    b.textContent = a;
    b.addEventListener("click", () => {
      selectedAvatarIndex = i;
      buildAvatarPicker();
    });
    avatarPicker.appendChild(b);
  });
}

buildAvatarPicker();

startGameBtn.addEventListener("click", () => {
  playerName = (nameInput.value.trim() || "Player").slice(0, 12);
  playerAvatar = avatars[selectedAvatarIndex];
  startBackdrop.classList.add("hidden");

  // Start at level 1
  loadLevel(0);
});

  
  // Show start screen initially
startBackdrop.classList.remove("hidden");


function findTile(val){
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(level[r][c] === val) return {r,c};
    }
  }
  return {r:1,c:1};
}

function render(){
  boardEl.style.gridTemplateColumns = `repeat(${cols}, var(--tileSize))`;
  boardEl.innerHTML = "";

  if(player.r === r && player.c === c){
  tile.classList.add("player");
  tile.dataset.name = playerName;
  tile.dataset.avatar = playerAvatar;
}

  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const tile = document.createElement("div");
      tile.className = "tile";

      const v = level[r][c];
      if(v === 0) tile.classList.add("wall");
      if(v === 1) tile.classList.add("path");
      if(v === 2) tile.classList.add("start");
      if(v === 3) tile.classList.add("goal");

      if(player.r === goal.r && player.c === goal.c){
  winEffects();

  setTimeout(() => {
    const next = levelIndex + 1;
    if(next < levels.length){
      loadLevel(next);
    } else {
      showToast("🏆 You beat all levels!");
    }
  }, 900);
}


      boardEl.appendChild(tile);
    }
  }

  movesEl.textContent = String(moves);
  correctEl.textContent = String(correct);
}

function isWalkable(r,c){
  if(r<0 || c<0 || r>=rows || c>=cols) return false;
  return level[r][c] !== 0;
}

function tryMove(dx,dy){
  const nr = player.r + dy;
  const nc = player.c + dx;

  if(!isWalkable(nr,nc)){
    showToast("Bump! That's a wall.");
    return;
  }

  // Store move on the modal element (robust)
  backdrop.dataset.dx = String(dx);
  backdrop.dataset.dy = String(dy);

  openMathModal();
}




function doMove(dx,dy){
  player = { r: player.r + dy, c: player.c + dx };
  moves++;

  render();

  if(player.r === goal.r && player.c === goal.c){
    showToast("🎉 Level complete! Refresh to play again.");
  }
}

function randomQuestion(){
  // Age 7–9 friendly: small sums/subtractions
  const ops = ["+","-"];
  const op = ops[Math.floor(Math.random()*ops.length)];

  let a = randInt(1,12);
  let b = randInt(1,12);

  // avoid negatives for subtraction
  if(op === "-" && b > a) [a,b] = [b,a];

  const answer = op === "+" ? a+b : a-b;
  return { a, b, op, answer };
}

function randInt(min,max){
  return Math.floor(Math.random()*(max-min+1)) + min;
}

let currentQ = null;

function openMathModal(){
  currentQ = randomQuestion();
  questionText.textContent = `${currentQ.a} ${currentQ.op} ${currentQ.b} = ?`;
  feedback.textContent = "Answer to move!";
  answerInput.value = "";
  backdrop.classList.remove("hidden");
  answerInput.focus();
}

function closeMathModal(){
  backdrop.classList.add("hidden");
  backdrop.dataset.dx = "";
  backdrop.dataset.dy = "";
  currentQ = null;
  feedback.textContent = "";
}

function checkAnswer(){
  if(!currentQ) return;

  const dx = Number(backdrop.dataset.dx);
  const dy = Number(backdrop.dataset.dy);

  // If somehow OK is clicked without a move stored
  if(Number.isNaN(dx) || Number.isNaN(dy)){
    feedback.textContent = "Try moving first 🙂";
    return;
  }

  const raw = answerInput.value.trim();
  const userVal = Number(raw);

  if(raw === "" || Number.isNaN(userVal)){
    feedback.textContent = "Type a number 🙂";
    return;
  }

  if(userVal === currentQ.answer){
    correct++;
    feedback.textContent = "Correct! ✅";

    doMove(dx, dy);
    closeMathModal();
  } else {
    feedback.textContent = "Not quite — try again!";
    answerInput.select();
  }
}


function showToast(msg){
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.add("hidden"), 1500);
}

// Buttons
document.querySelectorAll("[data-move]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const dir = btn.dataset.move;
    if(dir === "up") tryMove(0,-1);
    if(dir === "down") tryMove(0, 1);
    if(dir === "left") tryMove(-1,0);
    if(dir === "right") tryMove(1,0);
  });
});

// Keyboard
window.addEventListener("keydown", (e)=>{
  // If modal open, Enter submits
  if(!backdrop.classList.contains("hidden")){
    if(e.key === "Enter") checkAnswer();
    if(e.key === "Escape") closeMathModal();
    return;
  }
  if(e.key === "ArrowUp") tryMove(0,-1);
  if(e.key === "ArrowDown") tryMove(0, 1);
  if(e.key === "ArrowLeft") tryMove(-1,0);
  if(e.key === "ArrowRight") tryMove(1,0);
});

// ---- SOUND (WebAudio) ----
let audioCtx;
function beep(freq=440, duration=0.09, type="sine", gain=0.07){
  audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + duration);
}

function soundCorrect(){
  beep(660, 0.06, "triangle", 0.06);
  setTimeout(()=>beep(880, 0.07, "triangle", 0.06), 70);
}
function soundWrong(){
  beep(220, 0.12, "sawtooth", 0.04);
}
function soundWin(){
  beep(523, 0.08, "square", 0.06);
  setTimeout(()=>beep(659, 0.08, "square", 0.06), 90);
  setTimeout(()=>beep(784, 0.12, "square", 0.06), 180);
}

// ---- CONFETTI ----
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;

function resizeConfetti(){
  confettiCanvas.width = window.innerWidth * devicePixelRatio;
  confettiCanvas.height = window.innerHeight * devicePixelRatio;
  confettiCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize", resizeConfetti);
resizeConfetti();

function launchConfetti(){
  confettiPieces = Array.from({length: 140}, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 300,
    r: 4 + Math.random() * 6,
    vy: 2 + Math.random() * 5,
    vx: -2 + Math.random() * 4,
    rot: Math.random()*Math.PI,
    vr: -0.15 + Math.random()*0.3
  }));

  confettiCanvas.classList.remove("hidden");
  confettiRunning = true;
  requestAnimationFrame(tickConfetti);

  setTimeout(() => {
    confettiRunning = false;
    confettiCanvas.classList.add("hidden");
  }, 900);
}

function tickConfetti(){
  if(!confettiRunning) return;
  confettiCtx.clearRect(0,0,window.innerWidth, window.innerHeight);

  for(const p of confettiPieces){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    // no fixed colors requested, but we can still randomize per piece:
    confettiCtx.fillStyle = `hsl(${Math.random()*360}, 90%, 60%)`;
    confettiCtx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.2);
    confettiCtx.restore();
  }

  requestAnimationFrame(tickConfetti);
}

function winEffects(){
  soundWin();
  launchConfetti();
  showToast("🎉 Level complete!");
}


// Modal actions
submitAnswer.addEventListener("click", checkAnswer);
cancelMove.addEventListener("click", closeMathModal);
backdrop.addEventListener("click", (e)=>{
  if(e.target === backdrop) closeMathModal();
});

// Start
render();
