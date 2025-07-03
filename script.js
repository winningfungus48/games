// Game state
let gameState = {
    secretNumber: '',
    currentRow: 0,
    currentCol: 0,
    gameOver: false,
    gameWon: false,
    maxAttempts: 6,
    numberLength: 5
};

// Statistics
let stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0
};

// DOM elements
const board = document.getElementById('board');
const message = document.getElementById('message');
const numberPad = document.getElementById('number-pad');
const deleteBtn = document.getElementById('delete-btn');
const enterBtn = document.getElementById('enter-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const statsDiv = document.getElementById('stats');
const playAgainBtn = document.getElementById('play-again-btn');
const closeModalBtn = document.getElementById('close-modal');

// Welcome modal logic
const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomePlay = document.getElementById('welcome-play');
const welcomeClose = document.getElementById('welcome-close');

function showWelcomeModal() {
    welcomeOverlay.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function hideWelcomeModal() {
    welcomeOverlay.classList.add('hide');
    setTimeout(() => {
        welcomeOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

welcomePlay.addEventListener('click', hideWelcomeModal);
welcomeClose.addEventListener('click', hideWelcomeModal);

// Initialize the game
function initGame() {
    loadStats();
    generateSecretNumber();
    createBoard();
    createNumberPad();
    setupEventListeners();
    updateEnterButton();
}

// Generate a random 5-digit number (allowing repeated digits, but max 2 of any digit)
function generateSecretNumber() {
    let number;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops
    
    do {
        number = '';
        for (let i = 0; i < gameState.numberLength; i++) {
            number += Math.floor(Math.random() * 10);
        }
        attempts++;
    } while (!isValidSecretNumber(number) && attempts < maxAttempts);
    
    // If we couldn't generate a valid number after max attempts, use the last generated one
    if (attempts >= maxAttempts) {
        console.warn('Could not generate valid number after', maxAttempts, 'attempts, using:', number);
    }
    
    gameState.secretNumber = number;
    console.log('Secret number:', gameState.secretNumber); // For debugging
}

// Check if a number is valid (no more than 2 instances of any digit)
function isValidSecretNumber(number) {
    const digitCounts = {};
    
    for (let digit of number) {
        digitCounts[digit] = (digitCounts[digit] || 0) + 1;
        if (digitCounts[digit] > 2) {
            return false;
        }
    }
    
    return true;
}

// Create the game board
function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < gameState.maxAttempts; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        rowDiv.dataset.row = row;
        
        for (let col = 0; col < gameState.numberLength; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.row = row;
            tile.dataset.col = col;
            rowDiv.appendChild(tile);
        }
        
        board.appendChild(rowDiv);
    }
}

// Create the virtual number pad
function createNumberPad() {
    numberPad.innerHTML = '';
    
    // Create number buttons 0-9
    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i;
        btn.dataset.number = i;
        btn.addEventListener('click', () => inputNumber(i));
        numberPad.appendChild(btn);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard input
    document.addEventListener('keydown', handleKeydown);
    
    // Button clicks
    deleteBtn.addEventListener('click', deleteNumber);
    enterBtn.addEventListener('click', submitGuess);
    playAgainBtn.addEventListener('click', startNewGame);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Modal backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Handle keyboard input
function handleKeydown(e) {
    if (gameState.gameOver) return;
    
    if (e.key >= '0' && e.key <= '9') {
        inputNumber(parseInt(e.key));
    } else if (e.key === 'Enter') {
        submitGuess();
    } else if (e.key === 'Backspace') {
        deleteNumber();
    }
}

// Input a number
function inputNumber(num) {
    if (gameState.gameOver || gameState.currentCol >= gameState.numberLength) return;
    
    const tile = getCurrentTile();
    if (tile) {
        tile.textContent = num;
        tile.classList.add('filled');
        gameState.currentCol++;
        updateEnterButton();
    }
}

// Delete the last number
function deleteNumber() {
    if (gameState.gameOver || gameState.currentCol <= 0) return;
    
    gameState.currentCol--;
    const tile = getCurrentTile();
    if (tile) {
        tile.textContent = '';
        tile.classList.remove('filled');
        updateEnterButton();
    }
}

// Get the current tile
function getCurrentTile() {
    return document.querySelector(`[data-row="${gameState.currentRow}"][data-col="${gameState.currentCol}"]`);
}

// Update enter button state
function updateEnterButton() {
    const isComplete = gameState.currentCol === gameState.numberLength;
    enterBtn.disabled = !isComplete;
}

// Submit the current guess
function submitGuess() {
    if (gameState.gameOver || gameState.currentCol !== gameState.numberLength) return;
    
    const guess = getCurrentGuess();
    if (!isValidGuess(guess)) {
        showMessage('Please enter exactly 5 digits');
        shakeRow();
        return;
    }
    
    const feedback = evaluateGuess(guess);
    displayFeedback(feedback);
    
    if (guess === gameState.secretNumber) {
        gameWon();
    } else if (gameState.currentRow === gameState.maxAttempts - 1) {
        gameLost();
    } else {
        nextRow();
    }
}

// Get the current guess as a string
function getCurrentGuess() {
    let guess = '';
    for (let col = 0; col < gameState.numberLength; col++) {
        const tile = document.querySelector(`[data-row="${gameState.currentRow}"][data-col="${col}"]`);
        guess += tile.textContent;
    }
    return guess;
}

// Validate the guess
function isValidGuess(guess) {
    return /^\d{5}$/.test(guess);
}

// Evaluate the guess and return feedback
function evaluateGuess(guess) {
    const feedback = [];
    const secretArray = gameState.secretNumber.split('');
    const guessArray = guess.split('');
    const used = new Array(gameState.numberLength).fill(false);
    
    // First pass: mark correct digits
    for (let i = 0; i < gameState.numberLength; i++) {
        if (guessArray[i] === secretArray[i]) {
            feedback[i] = 'correct';
            used[i] = true;
        }
    }
    
    // Second pass: mark present digits
    for (let i = 0; i < gameState.numberLength; i++) {
        if (feedback[i] === 'correct') continue;
        
        for (let j = 0; j < gameState.numberLength; j++) {
            if (!used[j] && guessArray[i] === secretArray[j]) {
                feedback[i] = 'present';
                used[j] = true;
                break;
            }
        }
        
        if (!feedback[i]) {
            feedback[i] = 'absent';
        }
    }
    
    return feedback;
}

// Display feedback on the board
function displayFeedback(feedback) {
    for (let col = 0; col < gameState.numberLength; col++) {
        const tile = document.querySelector(`[data-row="${gameState.currentRow}"][data-col="${col}"]`);
        tile.classList.add(feedback[col]);
    }
}

// Move to the next row
function nextRow() {
    gameState.currentRow++;
    gameState.currentCol = 0;
    updateEnterButton();
    clearMessage();
}

// Shake the current row
function shakeRow() {
    const row = document.querySelector(`[data-row="${gameState.currentRow}"]`);
    const tiles = row.querySelectorAll('.tile');
    tiles.forEach(tile => tile.classList.add('shake'));
    
    setTimeout(() => {
        tiles.forEach(tile => tile.classList.remove('shake'));
    }, 500);
}

// Game won
function gameWon() {
    gameState.gameOver = true;
    gameState.gameWon = true;
    updateStats(true);
    showGameOverModal('Congratulations!', `You found the number in ${gameState.currentRow + 1} tries!`);
}

// Game lost
function gameLost() {
    gameState.gameOver = true;
    gameState.gameWon = false;
    updateStats(false);
    showGameOverModal('Game Over', `The number was ${gameState.secretNumber}`);
}

// Show game over modal
function showGameOverModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    displayStats();
    modal.classList.add('show');
}

// Display statistics
function displayStats() {
    statsDiv.innerHTML = `
        <div class="stat">
            <div class="stat-value">${stats.gamesPlayed}</div>
            <div class="stat-label">Games Played</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stats.gamesWon}</div>
            <div class="stat-label">Games Won</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stats.currentStreak}</div>
            <div class="stat-label">Current Streak</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stats.bestStreak}</div>
            <div class="stat-label">Best Streak</div>
        </div>
    `;
}

// Update statistics
function updateStats(won) {
    stats.gamesPlayed++;
    
    if (won) {
        stats.gamesWon++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }
    } else {
        stats.currentStreak = 0;
    }
    
    saveStats();
}

// Load statistics from localStorage
function loadStats() {
    const saved = localStorage.getItem('numbler-stats');
    if (saved) {
        stats = { ...stats, ...JSON.parse(saved) };
    }
}

// Save statistics to localStorage
function saveStats() {
    localStorage.setItem('numbler-stats', JSON.stringify(stats));
}

// Start a new game
function startNewGame() {
    resetGameState();
    generateSecretNumber();
    createBoard();
    updateEnterButton();
    clearMessage();
    closeModal();
}

// Reset game state
function resetGameState() {
    gameState = {
        secretNumber: '',
        currentRow: 0,
        currentCol: 0,
        gameOver: false,
        gameWon: false,
        maxAttempts: 6,
        numberLength: 5
    };
}

// Show message
function showMessage(text) {
    message.textContent = text;
}

// Clear message
function clearMessage() {
    message.textContent = '';
}

// Close modal
function closeModal() {
    modal.classList.remove('show');
}

// Show modal on load, then start game after closing
window.addEventListener('DOMContentLoaded', () => {
    showWelcomeModal();
    // Game will still initialize, but user can't interact until modal is closed
    initGame();
}); 