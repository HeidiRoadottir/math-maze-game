// 0 = wall, 1 = path, 2 = start, 3 = goal
const level = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,1,1,0,1,1,1,1,1,1,0],
  [0,0,0,1,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,0,1,1,0,1,0],
  [0,1,0,0,0,0,0,1,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0],
  [0,1,1,1,1,0,1,1,1,1,3,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

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

const rows = level.length;
const cols = level[0].length;

let player = findTile(2); // start
let goal = findTile(3);

let moves = 0;
let correct = 0;

let pendingMove = null; // {dx,dy}

function findTile(val){
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(level[r][c] === val) return {r,c};
    }
  }
  return {r:1,c:1};
}

function render(){
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 34px)`;
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

  // Ask math question first
  pendingMove = {dx,dy};
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
  pendingMove = null;
  currentQ = null;
  feedback.textContent = "";
}

function checkAnswer(){
  if(!currentQ || !pendingMove) return;

  const userVal = Number(answerInput.value.trim());
  if(Number.isNaN(userVal)){
    feedback.textContent = "Type a number 🙂";
    return;
  }

  if(userVal === currentQ.answer){
    correct++;
    feedback.textContent = "Correct! ✅";
    // small delay so they see feedback
    setTimeout(() => {
      closeMathModal();
      doMove(pendingMove.dx, pendingMove.dy);
    }, 250);
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

// Modal actions
submitAnswer.addEventListener("click", checkAnswer);
cancelMove.addEventListener("click", closeMathModal);
backdrop.addEventListener("click", (e)=>{
  if(e.target === backdrop) closeMathModal();
});

// Start
render();
