
// getting all the elements from the html file

const buttons = document.getElementsByTagName('button');
const userScore = document.getElementById('user-score');
const cpuScore = document.getElementById('cpu-score');
const tiedScore = document.getElementById('tied-score')
const result = document.getElementById('result');
const scoreBoard = document.querySelector('.score-board');
const dispCpuChoice = document.getElementById('disp-cpu-choice');
const dispUserChoice = document.getElementById('disp-user-choice');


// creating array for CPU choices
let choices = ["rock", "paper", "scissors"];

// varliables for the scores
let userScoreCount = 0;
let cpuScoreCount = 0;
let tiedScoreCount = 0;

// variable for the getting winner
let winner;

// displaying winner 
const displayWinner = () => {
    if (winner == 'tie') {
        result.innerHTML = "Match tied!"
        tiedScoreCount++;
        tiedScore.innerHTML = tiedScoreCount;
    } else if (winner == 'user') {
        result.innerHTML = "You Win!"
        userScoreCount++;
        userScore.innerHTML = userScoreCount;
    } else {
        result.innerHTML = "You Lose!"
        cpuScoreCount++;
        cpuScore.innerHTML = cpuScoreCount;
    }
}

// function for getting the winner
let whoWin = (userChoice, cpuChoice) => {
    console.log("CPU : " + cpuChoice);
    console.log("User : " + userChoice);
    if (userChoice === cpuChoice) {
        winner = 'tie';

    } else if ((userChoice === 'rock' && cpuChoice === 'scissors') ||
        (userChoice === 'paper' && cpuChoice === 'rock') ||
        (userChoice === 'scissors' && cpuChoice === 'paper')) {
        winner = 'user';
    } else {
        winner = 'cpu';
    }
    displayWinner();
    console.log(winner + " is the winner");

}


// Convert buttons to an array and use forEach to attach event listeners
const arrOfButtons = Array.from(buttons);

arrOfButtons.forEach(button => {
    button.addEventListener("click", function () {
        // taking CPU choice
        let rand = Math.floor(Math.random() * 3);
        let cpuChoice = choices[rand];
        dispCpuChoice.innerHTML = "CPU : " + cpuChoice;
        dispCpuChoice.style.color = "#ffee3b";

        let userChoice = button.innerHTML.toLowerCase();
        dispUserChoice.innerHTML = "YOU : " + userChoice;
        dispUserChoice.style.color = "#88ff74";

        // calling the function to determine the winner
        whoWin(userChoice, cpuChoice);
    });
});
