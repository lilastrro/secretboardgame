// import Firebase modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// کانفیگ Firebase (مقادیر خودت رو وارد کن)
const firebaseConfig = {
    apiKey: "AIzaSyDNzRHt4iuRDkZE8TECCk1CLQCTMmGLdzk",
    authDomain: "astroboardgame.firebaseapp.com",
    databaseURL: "https://astroboardgame-default-rtdb.firebaseio.com",
    projectId: "astroboardgame",
    storageBucket: "astroboardgame.appspot.com",  // اصلاح شد
    messagingSenderId: "355264324961",
    appId: "1:355264324961:web:0c720c1b25bf0359895120",
    measurementId: "G-0SNDJTTHDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// تعریف ثابت‌ها
const boardSize = 56;
const hokmPositions = [1, 2, 3, 4, 5, 7, 8, 10, 11, 13, 15, 16, 18, 19, 20, 22, 23, 24, 25, 27, 29, 30, 31, 32, 34, 35, 36, 38, 39, 40, 41, 42, 44, 45, 46, 47, 49, 50, 52, 54, 55, 56];
const hokms = {
    1: 'Make a orgasm face for 30 seconds',
    2: "Moan for 1 minute",
    3: "lick a cucumber or a banana",
    4: "Jerk off for 3 minute but only show your eyes",
    5: "Suck for 1 minute",
    7: "3 خونه برگرد به عقب",
    8: "Do a sexy dance for 1 minute",
    10: "Take off your shirt",
    11: "Spank yourself 10 times",
    13: "Show your underwear",
    15: "Do a sexy pose",
    16: "Show me a porn video that turns you on",
    18: "7 خونه برگرد به عقب",
    19: "Do a sexy voice for 1 minute",
    20: "Tell a sexy fantasy you have while moaning",
    22: "3 خونه برگرد به عقب",
    23: "Take off your pants",
    24: "Flirt with your partner while touching yourself",
    25: "5 خونه برگرد به عقب",
    27: "Suck for 5 minute",
    29: "Show your nipples",
    30: "Do a sexy voice for 2 minutes",
    31: "10 خونه برگرد به عقب",
    32: "Play with your nipples for 1 minute while moaning",
    34: "Roleplay a rough sex with voice",
    35: "Find a sex toy online that you'd like to try with me",
    36: "Jerk off until you are close to orgasm but stop before you finish",
    38: "Drop an ice cube in your pants",
    39: "Whisper some dirty talk in my ear while your partner jerking",
    40: "2 خونه برگرد به عقب",
    41: "Spank yourself 20 times",
    42: "Roleplay a deep throat / face sitting",
    44: "Take off your bra / underwear",
    45: "Blindfold yourself and Jerk off for 2 minutes",
    46: "3 خونه برگرد به عقب",
    47: "Roleplay a sex position",
    49: "Spank yourself 30 times",
    50: "Tell a sexy fantasy you have while moaning and ",
    52: "Close your eyes and describe our last sex while moaning",
    54: "7 خونه برگرد به عقب",
    55: "Spank yourself 50 times",
    56: "Jerk off with ice cubes until you are close to orgasm but stop before you finish"
};

let positions = { p1: 0, p2: 0 };
let currentPlayer = 'p1';

const board = document.getElementById('board');
const rollBtn = document.getElementById('rollBtn');
const currentPlayerLabel = document.getElementById('currentPlayerLabel');

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        if (hokmPositions.includes(i)) cell.classList.add('hokm');
        board.appendChild(cell);
    }
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
    for (let key in positions) {
        const pos = positions[key];
        if (pos < boardSize) {
            const pawn = document.createElement('div');
            pawn.classList.add('pawn', key);
            const cell = document.querySelector(`.cell[data-index='${pos}']`);
            if (cell) cell.appendChild(pawn);
        }
    }
    rollBtn.textContent = '🎲';
}

function rollDice() {
  console.log("Player in localStorage:", localStorage.getItem('playerId'), "Current player:", currentPlayer);
  if (localStorage.getItem('playerId') !== currentPlayer) {
    alert("الان نوبت شما نیست!");
    return;
  }
  rollBtn.disabled = true;
  const rand = Math.floor(Math.random() * 6) + 1;
  rollBtn.textContent = rand;
  movePawn(rand);
}

function movePawn(steps) {
    let step = 0;
    const moveInterval = setInterval(() => {
        if (step < steps) {
            if (positions[currentPlayer] < boardSize - 1) {
                positions[currentPlayer]++;
                updateBoard();
            }
            step++;
        } else {
            clearInterval(moveInterval);
            checkSpecialCell(positions[currentPlayer]);
        }
    }, 250);
}

function checkSpecialCell(pos) {
    if (pos === boardSize - 1) {
        Swal.fire({
            title: `🎉 بازیکن ${currentPlayer === 'p1' ? 'قرمز' : 'آبی'} برنده شد!`,
            icon: 'success',
            confirmButtonText: 'شروع مجدد'
        }).then(() => resetGame());
        return;
    }
    if (hokmPositions.includes(pos)) {
        Swal.fire({
            title: hokms[pos],
            icon: 'info',
            confirmButtonText: 'باشه'
        }).then(() => applyHokmEffect(pos));
    } else {
        endTurn();
    }
}

function applyHokmEffect(pos) {
    const backSteps = { 7: 3, 18: 7, 22: 3, 25: 5, 31: 10, 40: 2, 46: 3, 54: 7 };
    if (backSteps[pos]) {
        positions[currentPlayer] = Math.max(0, positions[currentPlayer] - backSteps[pos]);
        updateBoard();
        checkSpecialCell(positions[currentPlayer]);
    } else {
        endTurn();
    }
}

function endTurn() {
    currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
    currentPlayerLabel.textContent = currentPlayer === 'p1' ? 'قرمز' : 'آبی';
    updateBoard();
    syncToFirebase();
    rollBtn.disabled = false;
}

function resetGame() {
    const initialState = { positions: { p1: 0, p2: 0 }, currentPlayer: 'p1' };
    set(ref(db, 'gameState'), initialState);
}

function syncToFirebase() {
    set(ref(db, 'gameState'), { positions, currentPlayer });
}

// گوش دادن به تغییرات دیتابیس
onValue(ref(db, 'gameState'), snapshot => {
    const data = snapshot.val();
    if (data) {
        positions = data.positions || { p1: 0, p2: 0 };
        currentPlayer = data.currentPlayer || 'p1';
        currentPlayerLabel.textContent = currentPlayer === 'p1' ? 'قرمز' : 'آبی';
        updateBoard();
    }
});

// انتخاب بازیکن در لوکال استوریج
if (!localStorage.getItem('playerId')) {
    const selected = prompt("بازیکن خودت رو وارد کن: p1 یا p2");
    if (selected === 'p1' || selected === 'p2') {
        localStorage.setItem('playerId', selected);
    } else {
        alert("لطفا فقط p1 یا p2 وارد کنید");
        location.reload();
    }
}

rollBtn.addEventListener('click', () => {
    console.log('salam');
    rollDice();
});

createBoard();
updateBoard();