// All global variables 
var timer = 60;
var score = 0;
var newHit;
var timesHit = 0;
let wrongHit = 0;
let timerInterval;
const bubbleCont = document.querySelector('.cont-bottom');
const addDecTime = document.querySelector('.incDecTimeBtn');

// Function for creating bubbles
function makeBubbles() {
    // console.log(bubbleCont);
    let bubble = '';

    for (let i = 0; i < 112; i++) {
        let randNum = Math.floor(Math.random() * 10);
        bubble += `<div class="bubble">${randNum}</div>`;
    }

    bubbleCont.innerHTML = bubble;
}

// Function for running Timer
function runTimer() {
    const tmr = document.querySelector('#timerval')
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            tmr.innerHTML = timer;
        }
        else {
            clearInterval(timerInterval);
            bubbleCont.innerHTML = "";
            onTimeOver();
            bubbleCont.classList.add("forGameOver");
            removeClickListener();
        }
    }, 1000);
}

// Function for getting new hit
function getNewHit() {
    const hit = document.querySelector('#hit');
    newHit = Math.floor(Math.random() * 10);
    hit.innerHTML = newHit;
}

// Functions for updating score
function increaseScore() {
    const scoreBox = document.querySelector('#scoreBox')
    score += 10;
    scoreBox.innerHTML = score;
    
}
function decreaseScore() {
    const scoreBox = document.querySelector('#scoreBox')
    score -= 10;
    scoreBox.innerHTML = score;
}

// for resetting score to 0
function resetScore() {
    const scoreBox = document.querySelector('#scoreBox')
    score = 0;
    scoreBox.innerHTML = score;
    
}

// Click event listener function
function handleBubbleClick(details) {
    makeBubbles();
    // can also use parseInt() instead of Number()
    var clickedNum = Number(details.target.textContent);
    console.log(clickedNum);
    if (clickedNum == newHit) {
        increaseScore();
    }
    else {
        decreaseScore();
        wrongHit++;

    }
    getNewHit();
    timesHit++;
}


// Function for Running the actual game from 
function runTheGame() {
    runTimer();
    makeBubbles();
    getNewHit();
    
    bubbleCont.addEventListener("click", handleBubbleClick);
}

// Function for display time over with score and hitCount
function onTimeOver() {
    bubbleCont.innerHTML = `
    <h1>Time's Up!</h1>
    <h2>Your score is : ${score}</h2>
    <h2>You hitted ${timesHit} times</h2>
    <h2>Wrong hits : ${wrongHit}</h2>
    `
}


// Increasing and decreasing time by 10 seconds
function incTime() {
    timer += 10;
}
function decTime() {
    timer -= 10;
}

// Function for removing the click event listener
function removeClickListener() {
    bubbleCont.removeEventListener("click", handleBubbleClick);
}

function baseOfRestsrtingGame() {
    bubbleCont.classList.remove("forGameOver");
    clearInterval(timerInterval)
    removeClickListener();
    resetScore();
    timer = 60;
    wrongHit = 0;
    timesHit = 0;
    runTheGame();
}

function restartGame() {
    baseOfRestsrtingGame();
}

// Running game and timer of game
runTheGame();
