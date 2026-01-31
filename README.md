# 🧩 Math Maze

**Math Maze** is a small browser game for children (ages 7–9) that combines **basic math practice** with **maze navigation**.  
To move through the maze, the player must correctly answer simple math questions like `3 + 8` or `10 - 4`.

The goal is to reach the **finish tile 🏁** and progress to the next level.

---

## 🎮 How to Play

1. Enter your name and choose a character.  
2. Use the **arrow keys** on your keyboard to move:  
   - ⬆️ Up  
   - ⬇️ Down  
   - ⬅️ Left  
   - ➡️ Right  
3. Each move opens a math question.  
4. Answer correctly to move.  
5. Reach the 🏁 finish tile to win the level.

---

## ✨ Features

- 👤 Choose your player avatar  
- 📝 Enter your name (displayed above your character)  
- ➕➖ Math questions for movement  
- 🗺️ Maze-based gameplay  
- 🎉 Confetti and sound effects on level completion  
- 🧠 Multiple levels  
- ⌨️ Keyboard controls  
- 🌈 Colorful and child-friendly UI  

---

## 🛠️ Built With

- HTML  
- CSS  
- JavaScript (Vanilla JS)  
- No external libraries  

---

## 🚀 Run the Game Locally

### Option 1: Open directly

1. Download or clone the repository  
2. Open `index.html` in your browser  

### Option 2: GitHub Pages (recommended)

1. Go to **Settings → Pages**  
2. Set source to:  
   - Branch: `main`  
   - Folder: `/root`  
3. Save and wait about 1 minute  
4. Your game will be live at:

https://yourusername.github.io/repository-name/

---

## 📂 Project Structure

.
├── index.html  
├── style.css  
├── script.js  
└── README.md  

---

## 🔧 Customization

### Add more levels

In `script.js`, edit the `levels` array:

- `0` = wall  
- `1` = path  
- `2` = start  
- `3` = goal  

You can create your own mazes by editing the number grids.

---

### Change difficulty

You can modify this function in `script.js`:

`randomQuestion()`

To add:
- Multiplication  
- Bigger numbers  
- Different age groups  

---

### Change colors

Edit the CSS variables in `style.css`:

- `--bg`  
- `--player`  
- `--goal`  

---

## 🎯 Educational Goal

This project was created to:

- Make math more fun for children  
- Combine movement with problem solving  
- Encourage learning through play  

---

## 📜 License

This project is open-source and free to use for learning and educational purposes.

---

## 💡 Ideas for Future Features

- ❤️ Lives/hearts system  
- 🧮 Difficulty levels  
- 🕶️ Fog-of-war (only see near the player)  
- 🏆 Score screen  
- ⏱️ Timer mode  
