// script.js
let currentQuestion = 0;
let score = 0;
let playerName = "";
let totalCoins = 0;
let totalStars = 0;
let gamesPlayed = 0;
let gamesWon = 0;

function startGame() {
    playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert("Please enter your name!");
        return;
    }
    
    loadStats();
    document.getElementById('nameSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    document.getElementById('currentPlayer').textContent = playerName;
    generateQuestion();
}

function generateQuestion() {
    currentQuestion++;
    if(currentQuestion > 5) return endGame();
    
    let number = Math.floor(Math.random() * 50) + 1;
    document.getElementById('currentNumber').textContent = number;
    document.getElementById('beforeNumber').value = '';
    document.getElementById('afterNumber').value = '';
    document.getElementById('questionsLeft').textContent = 5 - currentQuestion + 1;
    
    // Remove previous highlight classes
    document.getElementById('beforeNumber').classList.remove('correct', 'wrong');
    document.getElementById('afterNumber').classList.remove('correct', 'wrong');
}

function checkAnswer() {
    const currentNumber = parseInt(document.getElementById('currentNumber').textContent);
    const before = parseInt(document.getElementById('beforeNumber').value);
    const after = parseInt(document.getElementById('afterNumber').value);
    
    const correctBefore = currentNumber - 1;
    const correctAfter = currentNumber + 1;
    
    let correct = true;
    
    if(before === correctBefore) {
        document.getElementById('beforeNumber').classList.add('correct');
    } else {
        document.getElementById('beforeNumber').classList.add('wrong');
        correct = false;
    }
    
    if(after === correctAfter) {
        document.getElementById('afterNumber').classList.add('correct');
    } else {
        document.getElementById('afterNumber').classList.add('wrong');
        correct = false;
    }
    
    if(correct) {
        score++;
        totalCoins++;
        document.getElementById('coins').textContent = totalCoins;
        if(score === 5) totalStars++;
    }
    
    setTimeout(() => {
        generateQuestion();
        if(currentQuestion > 5) endGame();
    }, 1500);
}

function endGame() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    
    gamesPlayed++;
    if(score >= 4) {
        gamesWon++;
        if(score === 5) {
            totalCoins += 4; // 1 already added per question
            createFireworks();
            document.getElementById('winSound').play();
        }
        showResultAnimation(true);
    } else {
        showResultAnimation(false);
    }
    
    saveStats();
}

function createFireworks() {
    const container = document.getElementById('winAnimation');
    for(let i=0; i<20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 90 + '%';
        balloon.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 60%)`;
        container.appendChild(balloon);
    }
    
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = '⭐';
    star.style.left = '45%';
    star.style.top = '50%';
    container.appendChild(star);
}

function showResultAnimation(won) {
    const resultDiv = document.getElementById('winAnimation');
    resultDiv.innerHTML = won ? 
        `<h1>🎉 Congratulations ${playerName}! You Win! 🎉</h1>
         <h2>⭐⭐⭐⭐⭐</h2>
         <p>You earned 5 coins!</p>` :
        `<h1>😢 Try Again ${playerName}!</h1>
         <p>You got ${score}/5 correct</p>`;
}

function loadStats() {
    const stats = JSON.parse(localStorage.getItem(playerName)) || { coins: 0, stars: 0, played: 0, won: 0 };
    totalCoins = stats.coins;
    totalStars = stats.stars;
    gamesPlayed = stats.played;
    gamesWon = stats.won;
    updateStatsDisplay();
}

function saveStats() {
    const stats = {
        coins: totalCoins,
        stars: totalStars,
        played: gamesPlayed,
        won: gamesWon
    };
    localStorage.setItem(playerName, JSON.stringify(stats));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('coins').textContent = totalCoins;
    document.getElementById('stars').textContent = totalStars;
}

function restartGame() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('winAnimation').innerHTML = '';
    generateQuestion();
}