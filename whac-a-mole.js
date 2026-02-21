let currTile = null;
let score = 0;
let gameOver = false;
let timeLeft = 60;

let timerInterval = null;
let spawnInterval = null;

let leaderboard = [];

/* ===========================
   LEADERBOARD
=========================== */

// Load leaderboard (7 day expiry)
function loadLeaderboard() {
    const data = localStorage.getItem("whacAMoleLeaderboard");
    if (!data) {
        leaderboard = [];
        return;
    }

    const parsed = JSON.parse(data);
    const now = Date.now();

    leaderboard = parsed.filter(entry =>
        now - entry.timestamp <= 7 * 24 * 60 * 60 * 1000
    );
}

// Save leaderboard
function saveLeaderboard() {
    localStorage.setItem("whacAMoleLeaderboard", JSON.stringify(leaderboard));
}

// Add score
function addScoreToLeaderboard() {
    const entry = {
        score: score,
        time: 60 - timeLeft,
        timestamp: Date.now()
    };

    leaderboard.push(entry);

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);

    saveLeaderboard();
    renderLeaderboard();
}

// Render leaderboard
function renderLeaderboard() {
    const list = document.getElementById("leaderboardList");
    if (!list) return;

    list.innerHTML = leaderboard
        .map((e, i) =>
            `<li>${i + 1}. Score: ${e.score} | Time: ${e.time}s</li>`
        )
        .join("");
}

/* ===========================
   GAME SETUP
=========================== */

function setGame() {
    const board = document.getElementById("board");
    if (!board) return;

    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        board.appendChild(tile);
    }

    spawnInterval = setInterval(spawnCreature, 1000);
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function spawnCreature() {
    if (gameOver) return;

    if (currTile) {
        currTile.innerHTML = "";
        delete currTile.dataset.type;
    }

    const num = getRandomTile();
    const tile = document.getElementById(num);
    currTile = tile;

    if (Math.random() < 0.7) {
        let mole = document.createElement("img");
        mole.src = "./assets1/monty-mole.png";
        tile.appendChild(mole);
        tile.dataset.type = "mole";
    } else {
        let plant = document.createElement("img");
        plant.src = "./assets1/piranha-plant.png";
        tile.appendChild(plant);
        tile.dataset.type = "plant";
    }
}

function selectTile() {
    if (gameOver || !this.dataset.type) return;

    if (this.dataset.type === "mole") {
        score += 10;
        document.getElementById("scoreValue").innerText = score;
    } else {
        endGame();
        return;
    }

    this.innerHTML = "";
    delete this.dataset.type;
}

/* ===========================
   TIMER
=========================== */

function startTimer() {
    const timerFill = document.getElementById("timerFill");
    const timeText = document.getElementById("timeText");

    timerInterval = setInterval(() => {
        if (gameOver) return;

        timeLeft--;

        if (timerFill) {
            timerFill.style.width = (timeLeft / 60) * 100 + "%";
        }

        if (timeText) {
            timeText.innerText = timeLeft + "s";
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

/* ===========================
   END GAME
=========================== */

function endGame() {
    if (gameOver) return;

    gameOver = true;

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    addScoreToLeaderboard();

    document.getElementById("scoreValue").innerText =
        "GAME OVER: " + score;
    setTimeout(showGameOverScreen, 600);
}
function showGameOverScreen() {
    document.body.innerHTML = `
        <div style="
            background:black;
            color:white;
            height:100vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            font-family:monospace;
        ">
            <h1 style="font-size:48px;">GAME OVER</h1>
            <h2>Score: ${score}</h2>

            <div style="margin-top:30px;">
                <button onclick="location.reload()" 
                    style="padding:10px 20px; margin:10px; font-size:18px;">
                    Replay
                </button>

                <button onclick="goHome()" 
                    style="padding:10px 20px; margin:10px; font-size:18px;">
                    Home
                </button>
            </div>
        </div>
    `;
}
function goHome() {
    window.location.href = "index.html"; 
}
/* ===========================
   INIT
=========================== */

window.onload = function () {
    loadLeaderboard();
    renderLeaderboard();
    setGame();
    startTimer();
};