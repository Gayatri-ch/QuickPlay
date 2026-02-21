const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let timeLeft = 60;
let gameOver = false;
let eggTimer = 0; 

const basketWidth = 100;
const basketHeight = 50;
let basketX = canvas.width / 2 - basketWidth / 2;
const basketY = canvas.height - basketHeight - 10;

const eggWidth = 40;
const eggHeight = 50;
let eggs = [];

const basketImg = new Image();
basketImg.src = "./assets1/basket.svg";

const eggImg = new Image();
eggImg.src = "./assets1/egg.svg";

canvas.focus();

window.addEventListener("keydown", function(e) {
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
});

let keys = {};
document.addEventListener("keydown", e => { keys[e.code] = true; });
document.addEventListener("keyup", e => { keys[e.code] = false; });

let timerInterval = setInterval(() => {
    if (gameOver) return;
    timeLeft--;
    updateUI();
    if (timeLeft <= 0) endGame();
}, 1000);

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys["ArrowLeft"] || keys["KeyA"]) basketX -= 7;
    if (keys["ArrowRight"] || keys["KeyD"]) basketX += 7;
    basketX = Math.max(0, Math.min(canvas.width - basketWidth, basketX));

    ctx.drawImage(basketImg, basketX, basketY, basketWidth, basketHeight);

    eggTimer++;
    if (eggTimer > 90) {
        const x = Math.random() * (canvas.width - eggWidth);
        eggs.push({x: x, y: -eggHeight});
        eggTimer = 0;
    }

    for (let i = eggs.length - 1; i >= 0; i--) {
        eggs[i].y += 4; 
        ctx.drawImage(eggImg, eggs[i].x, eggs[i].y, eggWidth, eggHeight);

        if (eggs[i].y + eggHeight >= basketY &&
            eggs[i].x + eggWidth >= basketX &&
            eggs[i].x <= basketX + basketWidth) {
            score += 10;
            eggs.splice(i,1);
        }

        else if (eggs[i].y > canvas.height) {
            lives--;
            eggs.splice(i,1);
            if (lives <= 0) endGame();
        }
    }

    updateUI();
    requestAnimationFrame(update);
}

function updateUI() {
    document.getElementById("score").innerText = score;
    const livesContainer = document.getElementById("lives");
    livesContainer.innerHTML = "";
    for (let i = 0; i < lives; i++) livesContainer.innerHTML += "❤️ ";
    document.getElementById("timeText").innerText = timeLeft + "s";
    document.getElementById("timerFill").style.width = (timeLeft/60*100) + "%";
}

function endGame() {
    gameOver = true;
    document.getElementById("finalScore").innerText = "Score: " + score;
    document.getElementById("gameOverScreen").classList.remove("hidden");
}
document.getElementById("homeBtn").onclick = () => {
    window.location.href = "index.html";
};

document.getElementById("replayBtn").addEventListener("click", () => {
    score = 0;
    lives = 3;
    timeLeft = 60;
    eggs = [];
    basketX = canvas.width/2 - basketWidth/2;
    gameOver = false;
    document.getElementById("gameOverScreen").classList.add("hidden");
    updateUI();
    update();
});

update();