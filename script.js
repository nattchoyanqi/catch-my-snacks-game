// --- DOM ELEMENT REFERENCES ---
const startScreen = document.getElementById('start-screen');
const rulesScreen = document.getElementById('rules-screen');
const gameOverScreen = document.getElementById('game-over');
const okButton = document.getElementById('ok-button');
const finalScoreEl = document.getElementById('final-score');
const bgMusic = document.getElementById('bg-music');
const songSelect = document.getElementById('song-select');

let scoreElement = document.getElementById("score");
let highScoreElement = document.getElementById("hi-score");
let gamecontainer = document.querySelector(".game-container");
let bearElement = document.getElementById("bear");
let action = document.getElementById("actions");
let missElement = document.getElementById("misses");

// --- GAME STATE VARIABLES ---
let score = 0;
let gameMode = "pause"; 
let continuousMisses = 0;
let lastX = 0;
let movementTimeout;
let keyPressed = {};

// Load and display High Score from local browser storage
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerText = 'High Score : ' + highScore;

// --- PHASE 1: SCREEN TRANSITIONS ---

// Step 1: Click/Touch anywhere on Start Screen to see Rules
startScreen.addEventListener('click', () => {
    startScreen.style.display = 'none';
    rulesScreen.style.display = 'flex';
    
    // Warm up the browser audio context player silently
    bgMusic.play().then(() => {
        bgMusic.pause();
    }).catch(error => console.log("Audio pipeline initialized on standby mode."));
});

// Step 2: Click OK on Rules Screen to officially start playing
okButton.addEventListener('click', () => {
    rulesScreen.style.display = 'none';
    gamecontainer.style.display = 'block'; 
    gameMode = "play";
    action.innerText = "Pause";

    bgMusic.play().catch(error => console.log("Audio playback blocked by browser setup:", error));
    
    score = 0;
    continuousMisses = 0;
    scoreElement.innerText = 'Score : ' + score;
    missElement.innerText = continuousMisses;
});

// Step 3: Manual Pause / Play Toggle Button
function checkgameMode() {
    if (gameMode === "play") {
        gameMode = "pause";
        action.innerText = "Play";
        bgMusic.pause();
    } else if (gameMode === "pause") {
        gameMode = "play";
        action.innerText = "Pause";
        bgMusic.play().catch(e => console.log(e));
    }
}
action.addEventListener("click", checkgameMode);

// Step 4: Dropdown Music Track Selection Switch
songSelect.addEventListener('change', (e) => {
    const chosenTrack = e.target.value;
    const wasPlaying = !bgMusic.paused;

    bgMusic.src = chosenTrack;
    bgMusic.load(); 
    
    if (wasPlaying && gameMode === "play") {
        bgMusic.play().catch(err => console.log(err));
    }
});


// --- PHASE 2: CONTROLS & MOVING ANIMATION STATES ---

function handleMove(clientX) {
    if (gameMode === 'pause') return;
    
    let rect = gamecontainer.getBoundingClientRect();
    // Tracks pointer relative to the dynamic scale of the container element box
    let bearPosition = clientX - rect.left - bearElement.offsetWidth / 2;

    if (bearPosition >= 0 && bearPosition <= gamecontainer.clientWidth - bearElement.offsetWidth) {
        bearElement.style.left = bearPosition + 'px';
    }

    bearElement.classList.add('walking');
    clearTimeout(movementTimeout);
    movementTimeout = setTimeout(() => {
        bearElement.classList.remove('walking');
    }, 150);

    if (clientX < lastX) {
        bearElement.style.transform = 'scaleX(1)'; // Look Left
    } else if (clientX > lastX) {
        bearElement.style.transform = 'scaleX(-1)';  // Look Right
    }
    lastX = clientX;
}

function handleKeyboardMove() {
    if (gameMode === 'pause') return;
    
    let rect = gamecontainer.getBoundingClientRect();
    let bearPosition = parseInt(bearElement.style.left) || (gamecontainer.clientWidth / 2 - bearElement.offsetWidth / 2);
    
    const moveSpeed = 15;
    
    if (keyPressed['ArrowLeft']) {
        bearPosition -= moveSpeed;
        bearElement.style.transform = 'scaleX(1)'; // Look Left
    }
    if (keyPressed['ArrowRight']) {
        bearPosition += moveSpeed;
        bearElement.style.transform = 'scaleX(-1)'; // Look Right
    }
    
    if (bearPosition >= 0 && bearPosition <= gamecontainer.clientWidth - bearElement.offsetWidth) {
        bearElement.style.left = bearPosition + 'px';
    }
    
    if (keyPressed['ArrowLeft'] || keyPressed['ArrowRight']) {
        bearElement.classList.add('walking');
        clearTimeout(movementTimeout);
        movementTimeout = setTimeout(() => {
            bearElement.classList.remove('walking');
        }, 150);
    }
}

// Desktop Support - Mouse
document.addEventListener('mousemove', (e) => {
    handleMove(e.clientX);
});

// Keyboard Support - Left/Right Arrow Keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keyPressed[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keyPressed[e.key] = false;
        bearElement.classList.remove('walking');
    }
});

// Continuous keyboard movement
setInterval(handleKeyboardMove, 20);


// --- PHASE 3: GAME CORE ENGINE ---

function createFallingObject() {
    if (gameMode !== 'play') return;

    let object = document.createElement('div');
    object.classList.add('falling-object');

    let assetList = [
        { type: 'snail', url: 'resources/snail.png' },
        { type: 'strawberry', url: 'resources/strawberry.png' },
        { type: 'honey', url: 'resources/honey.png' }
    ];
    let randomIndex = Math.floor(Math.random() * assetList.length);
    let chosenAsset = assetList[randomIndex];

    if (chosenAsset.type === 'snail') {
        object.classList.add('snail-item');
    } else if (chosenAsset.type === 'honey') {
        object.classList.add('honey-item');
    }

    // Proportional positioning bounds computation
    let objectWidth = gamecontainer.clientWidth * 0.08125;
    let randomX = Math.floor(Math.random() * (gamecontainer.clientWidth - objectWidth)); 
    object.style.backgroundImage = `url('${chosenAsset.url}')`;
    object.style.left = randomX + 'px';
    object.style.top = '0px';
    
    gamecontainer.appendChild(object);

    let fallInterval = setInterval(() => {
        if (gameMode === 'pause') return;

        let objectTop = parseInt(object.style.top, 10) || 0;

        // Adaptive scaling multipliers keep speeds consistent across large/small displays
        let speedMultiplier = gamecontainer.clientHeight / 500; 

        if (score >= 100) { objectTop += 5 * speedMultiplier; } 
        else if (score >= 50) { objectTop += 3 * speedMultiplier; } 
        else { objectTop += 2 * speedMultiplier; }
        
        object.style.top = objectTop + 'px';

        let bearLeft = bearElement.offsetLeft;
        let bearRight = bearLeft + bearElement.offsetWidth;
        // Native bounding hit checks mapped dynamically to responsive heights
        let bearTop = bearElement.offsetTop + (bearElement.offsetHeight * 0.66);
        let objectLeft = object.offsetLeft;
        let objectRight = objectLeft + object.offsetWidth;
        let objectBottom = objectTop + object.offsetHeight;

        if (objectBottom >= bearTop && objectBottom <= bearTop + 20 && objectLeft < bearRight && objectRight > bearLeft) {
            clearInterval(fallInterval);
            
            if (object.classList.contains('snail-item')) {
                score -= 20;
                if (score < 0) score = 0; 
                scoreElement.innerText = 'Score : ' + score;
                
                bearElement.classList.add('snail');
                setTimeout(() => {
                    bearElement.classList.remove('snail');
                }, 1000); 
            }
            else if (object.classList.contains('honey-item')) {
                score += 30;
                scoreElement.innerText = 'Score : ' + score;
            }
            else {
                score += 10;
                scoreElement.innerText = 'Score : ' + score;
            }

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreElement.innerText = 'High Score : ' + highScore;
            }
            object.remove();
        }

        if (objectTop >= gamecontainer.clientHeight) {
            clearInterval(fallInterval);
            object.remove();
            if (!object.classList.contains('snail-item')) {
                continuousMisses++;
                missElement.innerText = continuousMisses;
                if (continuousMisses >= 10) { endGame(); }
            }
        }
    }, 20);
}

// Adjust generation logic to safely stop timers when paused
let generatorInterval = setInterval(createFallingObject, 1200);

function endGame() {
    gameMode = "pause";
    bgMusic.pause();
    gamecontainer.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    finalScoreEl.innerText = "You caught total of " + score + " points!";
}
