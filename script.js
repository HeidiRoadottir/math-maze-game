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

const modalBackdrop = document.getElementById("modalBackdrop");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitAnswer = document.getElementById("submitAnswer");
const cancelMove = document.getElementById("cancelMove");
const feedback = document.getElementById("feedback");
const toast = document.getElementById("toast");

// Start screen
const startBackdrop = document.getElementById("startBackdrop");
const nameInput = document.getElementById("nameInput");
const avatarPicker = document.getElementById("avatarPicker");
const startGameBtn = document.getElementById("startGame");

const controlsEl = document.querySelector(".controls");

const avatars = ["🙂","😺","🐸","🦊","🐼","🐵","🧙‍♂️","👩‍🚀"];
let selectedAvatarIndex = 0;

let rows, cols;
let player;
let goal;

let playerName = "Player";
let playerAvatar = "🙂";

let moves = 0;
let correct = 0;
let currentQ = null;

// ---------- START SCREEN ----------
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
  playerName = (nameInput.value.trim() || "Player").slice(0,12);
  playerAvatar = avatars[selectedAvatarIndex];

  startBackdrop.classList.add("hidden");
  controlsEl.classList.remove("game-hidden");

  loadLevel(0);
});

// ---------- LEVEL ----------
function loadLevel(index){
  levelIndex = index;
  level = levels[levelIndex];

  rows = level.length;
  cols = level[0].length;

  player = findTile(2);
  goal = findTile(3);

  moves = 0;
  correct = 0;

  render();
  showToast(`Level ${levelIndex + 1}`);
}

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

  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const tile = document.createElement("div");
      tile.className = "tile";

      const v = level[r][c];
      if(v === 0) tile.classList.add("wall");
      if(v === 1) tile.classList.add("path");
      if(v === 2) tile.classList.add("start");
      if(v === 3) tile.classList.add("goal");

      if(player.r === r && player.c === c){
        tile.classList.add("player");
        tile.dataset.name = playerName;
        tile.dataset.avatar = playerAvatar;
      }

      boardEl.appendChild(tile);
    }
  }

  movesEl.textContent = moves;
  correctEl.textContent = correct;
}

function isWalkable(r,c){
  if(r<0 || c<0 || r>=rows || c>=cols) return false;
  return level[r][c] !== 0;
}

// ---------- MOVEMENT ----------
function tryMove(dx,dy){
  const nr = player.r + dy;
  const nc = player.c + dx;

  if(!isWalkable(nr,nc)){
    showToast("Bump! Wall!");
    return;
  }

  modalBackdrop.dataset.dx = dx;
  modalBackdrop.dataset.dy = dy;
  openMathModal();
}

function doMove(dx,dy){
  player = { r: player.r + dy, c: player.c + dx };
  moves++;
  render();

  if(player.r === goal.r && player.c === goal.c){
    winEffects();

    setTimeout(()=>{
      if(levelIndex + 1 < levels.length){
        loadLevel(levelIndex + 1);
      } else {
        showToast("🏆 All levels complete!");
      }
    }, 1000);
  }
}

// ---------- MATH ----------
function randomQuestion(){
  const ops = ["+","-"];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a = randInt(1,12);
  let b = randInt(1,12);
  if(op === "-" && b > a) [a,b] = [b,a];
  const answer = op === "+" ? a+b : a-b;
  return { a, b, op, answer };
}

function randInt(min,max){
  return Math.floor(Math.random()*(max-min+1)) + min;
}

function openMathModal(){
  currentQ = randomQuestion();
  questionText.textContent = `${currentQ.a} ${currentQ.op} ${currentQ.b} = ?`;
  feedback.textContent = "Answer to move!";
  answerInput.value = "";
  modalBackdrop.classList.remove("hidden");
  answerInput.focus();
}

function closeMathModal(){
  modalBackdrop.classList.add("hidden");
  currentQ = null;
}

function checkAnswer(){
  if(!currentQ) return;

  const dx = Number(modalBackdrop.dataset.dx);
  const dy = Number(modalBackdrop.dataset.dy);

  const val = Number(answerInput.value.trim());
  if(Number.isNaN(val)){
    feedback.textContent = "Type a number 🙂";
    return;
  }

  if(val === currentQ.answer){
    correct++;
    soundCorrect();
    closeMathModal();
    doMove(dx,dy);
  } else {
    soundWrong();
    feedback.textContent = "Try again!";
    answerInput.select();
  }
}

// ---------- UI ----------
function showToast(msg){
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.add("hidden"),1500);
}

// Buttons
document.querySelectorAll("[data-move]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const d = btn.dataset.move;
    if(d==="up") tryMove(0,-1);
    if(d==="down") tryMove(0,1);
    if(d==="left") tryMove(-1,0);
    if(d==="right") tryMove(1,0);
  });
});

// Keyboard
window.addEventListener("keydown",(e)=>{
  if(!modalBackdrop.classList.contains("hidden")){
    if(e.key==="Enter") checkAnswer();
    if(e.key==="Escape") closeMathModal();
    return;
  }
  if(e.key==="ArrowUp") tryMove(0,-1);
  if(e.key==="ArrowDown") tryMove(0,1);
  if(e.key==="ArrowLeft") tryMove(-1,0);
  if(e.key==="ArrowRight") tryMove(1,0);
});

// ---------- SOUND ----------
let audioCtx;
function beep(freq=440, duration=0.1){
  audioCtx ??= new (window.AudioContext||window.webkitAudioContext)();
  const o=audioCtx.createOscillator();
  const g=audioCtx.createGain();
  o.frequency.value=freq;
  g.gain.value=0.07;
  o.connect(g); g.connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime+duration);
}
function soundCorrect(){beep(700);setTimeout(()=>beep(900),80);}
function soundWrong(){beep(200,0.15);}
function soundWin(){beep(500);setTimeout(()=>beep(650),120);setTimeout(()=>beep(800),240);}

// ---------- CONFETTI ----------
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

function resizeConfetti(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeConfetti);
resizeConfetti();

function launchConfetti(){
  const pieces = Array.from({length:120},()=>({
    x:Math.random()*confettiCanvas.width,
    y:-20,
    vy:2+Math.random()*4,
    vx:-2+Math.random()*4,
    size:4+Math.random()*6,
    color:`hsl(${Math.random()*360},90%,60%)`
  }));

  let frames = 0;

  function tick(){
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);

    pieces.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(p.x,p.y,p.size,p.size);
    });

    frames++;

    if(frames < 90){
      requestAnimationFrame(tick);
    } else {
      confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    }
  }

  tick();
}

function winEffects(){
  soundWin();
  launchConfetti();
  showToast("🎉 Level complete!");
}

// Modal actions
submitAnswer.addEventListener("click", checkAnswer);
cancelMove.addEventListener("click", closeMathModal);
modalBackdrop.addEventListener("click", e=>{
  if(e.target === modalBackdrop) closeMathModal();
});

// Start screen first
startBackdrop.classList.remove("hidden");
