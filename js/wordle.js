// ===== WORDLE — Simple 5-Letter Word Game =====
// Pure JS Wordle clone for Pomodoro breaks

var WORD_LIST = [
    "FOCUS", "BRAIN", "STUDY", "LEARN", "THINK", "WRITE", "TRACE", "SPACE",
    "PLANT", "DANCE", "DREAM", "SHARE", "SMILE", "BRAVE", "CLIMB", "FLAME",
    "GRACE", "HOUSE", "JUICE", "KNEEL", "LIGHT", "MOUSE", "NIGHT", "OCEAN",
    "PEACE", "QUEEN", "RIVER", "STORM", "TIGER", "UNITY", "VOICE", "WATCH",
    "ABOUT", "BELOW", "CHASE", "DRIVE", "EARTH", "FRESH", "GREAT", "HAPPY",
    "INPUT", "JOLLY", "KNOCK", "LEMON", "MAGIC", "NOVEL", "OLIVE", "PIANO",
    "QUIET", "ROBOT", "SLEEP", "TRAIN", "ULTRA", "VALUE", "WORLD", "YOUNG",
    "CHAIR", "TABLE", "WATER", "MUSIC", "CLOUD", "STONE", "BREAD", "CANDY"
];

var targetWord = "";
var currentRow = 0;
var currentCol = 0;
var maxRows = 6;
var wordLength = 5;
var gameOver = false;
var currentGuess = "";

function initWordle() {
    targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    currentRow = 0;
    currentCol = 0;
    currentGuess = "";
    gameOver = false;

    createGrid();
    createKeyboard();
    updateWordleMessage("");
}

function createGrid() {
    var grid = document.getElementById("wordleGrid");
    if (!grid) return;
    grid.innerHTML = "";

    for (var r = 0; r < maxRows; r++) {
        var row = document.createElement("div");
        row.className = "wordle-row";
        for (var c = 0; c < wordLength; c++) {
            var cell = document.createElement("div");
            cell.className = "wordle-cell";
            cell.id = "cell-" + r + "-" + c;
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

function createKeyboard() {
    var keyboard = document.getElementById("wordleKeyboard");
    if (!keyboard) return;
    keyboard.innerHTML = "";

    var rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    for (var r = 0; r < rows.length; r++) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        for (var k = 0; k < rows[r].length; k++) {
            var key = rows[r][k];
            var btn = document.createElement("button");
            btn.className = "key-btn";
            btn.id = "key-" + key;
            btn.innerText = key;
            if (key === "ENTER" || key === "⌫") {
                btn.classList.add("key-special");
            }
            btn.addEventListener("click", (function (keyVal) {
                return function () { handleWordleKey(keyVal); };
            })(key));
            rowDiv.appendChild(btn);
        }
        keyboard.appendChild(rowDiv);
    }
}

function handleWordleKey(key) {
    if (gameOver) return;

    if (key === "⌫") {
        if (currentCol > 0) {
            currentCol--;
            currentGuess = currentGuess.slice(0, -1);
            var cell = document.getElementById("cell-" + currentRow + "-" + currentCol);
            cell.innerText = "";
            cell.classList.remove("wordle-filled");
        }
        return;
    }

    if (key === "ENTER") {
        if (currentGuess.length !== wordLength) {
            updateWordleMessage("Not enough letters!");
            return;
        }
        submitGuess();
        return;
    }

    if (currentCol < wordLength) {
        currentGuess += key;
        var cell = document.getElementById("cell-" + currentRow + "-" + currentCol);
        cell.innerText = key;
        cell.classList.add("wordle-filled");
        currentCol++;
    }
}

function submitGuess() {
    var guess = currentGuess.toUpperCase();

    // Check each letter
    var targetArr = targetWord.split("");
    var result = [];
    var used = [];

    // First pass: correct positions (green)
    for (var i = 0; i < wordLength; i++) {
        if (guess[i] === targetArr[i]) {
            result[i] = "correct";
            used[i] = true;
        } else {
            result[i] = "absent";
            used[i] = false;
        }
    }

    // Second pass: wrong position (yellow)
    for (var i = 0; i < wordLength; i++) {
        if (result[i] === "correct") continue;
        for (var j = 0; j < wordLength; j++) {
            if (!used[j] && guess[i] === targetArr[j]) {
                result[i] = "present";
                used[j] = true;
                break;
            }
        }
    }

    // Apply colors with animation delay
    for (var i = 0; i < wordLength; i++) {
        (function (idx) {
            setTimeout(function () {
                var cell = document.getElementById("cell-" + currentRow + "-" + idx);
                cell.classList.add("wordle-" + result[idx]);
                cell.classList.add("wordle-flip");

                // Update keyboard colors
                var keyBtn = document.getElementById("key-" + guess[idx]);
                if (keyBtn) {
                    if (result[idx] === "correct") {
                        keyBtn.className = "key-btn wordle-correct";
                    } else if (result[idx] === "present" && !keyBtn.classList.contains("wordle-correct")) {
                        keyBtn.className = "key-btn wordle-present";
                    } else if (result[idx] === "absent" && !keyBtn.classList.contains("wordle-correct") && !keyBtn.classList.contains("wordle-present")) {
                        keyBtn.className = "key-btn wordle-absent";
                    }
                }
            }, idx * 200);
        })(i);
    }

    // Check win
    if (guess === targetWord) {
        setTimeout(function () {
            updateWordleMessage("🎉 You got it in " + (currentRow + 1) + " tries!");
            gameOver = true;
        }, wordLength * 200 + 200);
        return;
    }

    currentRow++;
    currentCol = 0;
    currentGuess = "";

    if (currentRow >= maxRows) {
        setTimeout(function () {
            updateWordleMessage("The word was: " + targetWord);
            gameOver = true;
        }, wordLength * 200 + 200);
    }
}

function updateWordleMessage(msg) {
    var el = document.getElementById("wordleMessage");
    if (el) el.innerText = msg;
}

function newWordleGame() {
    initWordle();
}

// Physical keyboard support
document.addEventListener("keydown", function (e) {
    if (gameOver) return;
    // Only handle keys if on games page
    if (!document.getElementById("wordleGrid")) return;

    if (e.key === "Backspace") {
        handleWordleKey("⌫");
    } else if (e.key === "Enter") {
        handleWordleKey("ENTER");
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleWordleKey(e.key.toUpperCase());
    }
});

// Init on page load
window.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("wordleGrid")) {
        initWordle();
    }
});
