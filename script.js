class WordGame {
    constructor() {
        this.WORD_LENGTH = 5;
        this.MAX_ATTEMPTS = 6;
        this.words = [
            'APPLE', 'BEACH', 'CHAIR', 'DREAM', 'EARTH', 'FLAME', 'GRAPE', 'HEART',
            'IMAGE', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PEACE',
            'QUEEN', 'RADIO', 'SMILE', 'TABLE', 'UNITY', 'VOICE', 'WATER', 'YOUTH',
            'ZEBRA', 'BRAVE', 'CLOUD', 'DANCE', 'EAGLE', 'FAITH', 'GLORY', 'HAPPY',
            'IDEAL', 'JOYCE', 'KARMA', 'LIGHT', 'MAGIC', 'NOBLE', 'OPERA', 'PRIDE',
            'QUIET', 'RIVER', 'SPACE', 'TRUTH', 'UNITY', 'VALUE', 'WORLD', 'YIELD',
            'ALIVE', 'BLESS', 'CLEAN', 'DREAM', 'EAGER', 'FRESH', 'GREEN', 'HUMAN',
            'INNER', 'JOYCE', 'KIND', 'LIVED', 'MIGHT', 'NEVER', 'ORDER', 'PLACE',
            'QUICK', 'RIGHT', 'SMALL', 'THING', 'UNDER', 'VOICE', 'WATCH', 'YEAR'
        ];
        
        this.currentWord = '';
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameOver = false;
        this.guesses = [];
        
        this.board = document.getElementById('board');
        this.message = document.getElementById('message');
        this.keyboard = document.getElementById('keyboard');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.shareResult = document.getElementById('share-result');
        this.shareButton = document.getElementById('share-button');
        this.closeModal = document.getElementById('close-modal');
        
        this.init();
    }
    
    init() {
        this.setDailyWord();
        this.createBoard();
        this.createKeyboard();
        this.setupEventListeners();
        this.loadGameState();
    }
    
    setDailyWord() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const wordIndex = dayOfYear % this.words.length;
        this.currentWord = this.words[wordIndex];
        console.log('Today\'s word:', this.currentWord); // For debugging
    }
    
    createBoard() {
        for (let i = 0; i < this.MAX_ATTEMPTS; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            
            for (let j = 0; j < this.WORD_LENGTH; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = i;
                tile.dataset.col = j;
                row.appendChild(tile);
            }
            
            this.board.appendChild(row);
        }
    }
    
    createKeyboard() {
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
        ];
        
        keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const button = document.createElement('button');
                button.className = 'key';
                button.textContent = key;
                
                if (key === 'Enter' || key === 'Backspace') {
                    button.classList.add('wide');
                }
                
                button.addEventListener('click', () => this.handleKeyPress(key));
                keyboardRow.appendChild(button);
            });
            
            this.keyboard.appendChild(keyboardRow);
        });
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            const key = e.key.toUpperCase();
            if (key === 'ENTER') {
                this.handleKeyPress('Enter');
            } else if (key === 'BACKSPACE') {
                this.handleKeyPress('Backspace');
            } else if (/^[A-Z]$/.test(key)) {
                this.handleKeyPress(key);
            }
        });
        
        this.shareButton.addEventListener('click', () => this.shareGame());
        this.closeModal.addEventListener('click', () => this.hideModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }
    
    handleKeyPress(key) {
        if (this.gameOver) return;
        
        if (key === 'Enter') {
            this.submitGuess();
        } else if (key === 'Backspace') {
            this.deleteLetter();
        } else if (/^[A-Z]$/.test(key) && this.currentTile < this.WORD_LENGTH) {
            this.addLetter(key);
        }
    }
    
    addLetter(letter) {
        if (this.currentTile < this.WORD_LENGTH) {
            const tile = this.getCurrentTile();
            tile.textContent = letter;
            tile.classList.add('filled');
            this.currentTile++;
        }
    }
    
    deleteLetter() {
        if (this.currentTile > 0) {
            this.currentTile--;
            const tile = this.getCurrentTile();
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    }
    
    submitGuess() {
        if (this.currentTile !== this.WORD_LENGTH) {
            this.showMessage('Not enough letters');
            this.shakeRow();
            return;
        }
        
        const guess = this.getCurrentGuess();
        if (!this.words.includes(guess)) {
            this.showMessage('Not in word list');
            this.shakeRow();
            return;
        }
        
        this.evaluateGuess(guess);
        this.guesses.push(guess);
        this.saveGameState();
        
        if (guess === this.currentWord) {
            this.gameOver = true;
            setTimeout(() => this.showGameEnd('Congratulations!', 'You got it!'), 1500);
        } else if (this.currentRow === this.MAX_ATTEMPTS - 1) {
            this.gameOver = true;
            setTimeout(() => this.showGameEnd('Game Over', `The word was ${this.currentWord}`), 1500);
        } else {
            this.currentRow++;
            this.currentTile = 0;
        }
    }
    
    evaluateGuess(guess) {
        const result = [];
        const wordArray = this.currentWord.split('');
        const guessArray = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < this.WORD_LENGTH; i++) {
            if (guessArray[i] === wordArray[i]) {
                result[i] = 'correct';
                wordArray[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < this.WORD_LENGTH; i++) {
            if (result[i] !== 'correct') {
                const letterIndex = wordArray.indexOf(guessArray[i]);
                if (letterIndex !== -1) {
                    result[i] = 'present';
                    wordArray[letterIndex] = null; // Mark as used
                } else {
                    result[i] = 'absent';
                }
            }
        }
        
        this.animateRow(result);
        this.updateKeyboard(guess, result);
    }
    
    animateRow(result) {
        const row = this.board.children[this.currentRow];
        const tiles = row.children;
        
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('flip');
                setTimeout(() => {
                    tile.classList.add(result[index]);
                    tile.classList.remove('flip');
                }, 300);
            }, index * 200);
        });
    }
    
    updateKeyboard(guess, result) {
        const keys = this.keyboard.querySelectorAll('.key');
        
        guess.split('').forEach((letter, index) => {
            keys.forEach(key => {
                if (key.textContent === letter) {
                    const currentClass = key.className;
                    const newClass = result[index];
                    
                    if (!currentClass.includes('correct')) {
                        if (newClass === 'correct' || 
                            (newClass === 'present' && !currentClass.includes('present'))) {
                            key.className = `key ${newClass}`;
                        } else if (newClass === 'absent' && 
                                   !currentClass.includes('correct') && 
                                   !currentClass.includes('present')) {
                            key.className = 'key absent';
                        }
                    }
                }
            });
        });
    }
    
    shakeRow() {
        const row = this.board.children[this.currentRow];
        const tiles = row.children;
        
        tiles.forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => tile.classList.remove('shake'), 500);
        });
    }
    
    showMessage(text) {
        this.message.textContent = text;
        setTimeout(() => {
            this.message.textContent = '';
        }, 2000);
    }
    
    showGameEnd(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.shareResult.textContent = this.generateShareText();
        this.modal.style.display = 'block';
    }
    
    generateShareText() {
        const emojiMap = {
            'correct': '🟩',
            'present': '🟨',
            'absent': '⬜'
        };
        
        let shareText = `Daily Word Game ${this.getDayNumber()}\n`;
        shareText += `${this.guesses.length}/${this.MAX_ATTEMPTS}\n\n`;
        
        this.guesses.forEach(guess => {
            const result = this.evaluateGuessForShare(guess);
            const emojiRow = result.map(status => emojiMap[status]).join('');
            shareText += emojiRow + '\n';
        });
        
        return shareText;
    }
    
    evaluateGuessForShare(guess) {
        const result = [];
        const wordArray = this.currentWord.split('');
        const guessArray = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < this.WORD_LENGTH; i++) {
            if (guessArray[i] === wordArray[i]) {
                result[i] = 'correct';
                wordArray[i] = null;
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < this.WORD_LENGTH; i++) {
            if (result[i] !== 'correct') {
                const letterIndex = wordArray.indexOf(guessArray[i]);
                if (letterIndex !== -1) {
                    result[i] = 'present';
                    wordArray[letterIndex] = null;
                } else {
                    result[i] = 'absent';
                }
            }
        }
        
        return result;
    }
    
    getDayNumber() {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    shareGame() {
        const shareText = this.generateShareText();
        
        if (navigator.share) {
            navigator.share({
                title: 'Daily Word Game',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.shareButton.textContent = 'Copied!';
                setTimeout(() => {
                    this.shareButton.textContent = 'Share Result';
                }, 2000);
            });
        }
    }
    
    hideModal() {
        this.modal.style.display = 'none';
    }
    
    getCurrentTile() {
        return this.board.children[this.currentRow].children[this.currentTile];
    }
    
    getCurrentGuess() {
        const row = this.board.children[this.currentRow];
        let guess = '';
        for (let i = 0; i < this.WORD_LENGTH; i++) {
            guess += row.children[i].textContent;
        }
        return guess;
    }
    
    saveGameState() {
        const gameState = {
            currentRow: this.currentRow,
            currentTile: this.currentTile,
            gameOver: this.gameOver,
            guesses: this.guesses,
            day: this.getDayNumber()
        };
        localStorage.setItem('wordGameState', JSON.stringify(gameState));
    }
    
    loadGameState() {
        const saved = localStorage.getItem('wordGameState');
        if (saved) {
            const gameState = JSON.parse(saved);
            
            // Only load if it's the same day
            if (gameState.day === this.getDayNumber()) {
                this.currentRow = gameState.currentRow;
                this.currentTile = gameState.currentTile;
                this.gameOver = gameState.gameOver;
                this.guesses = gameState.guesses;
                
                // Restore the board
                this.guesses.forEach((guess, rowIndex) => {
                    const row = this.board.children[rowIndex];
                    const result = this.evaluateGuessForShare(guess);
                    
                    guess.split('').forEach((letter, colIndex) => {
                        const tile = row.children[colIndex];
                        tile.textContent = letter;
                        tile.classList.add('filled', result[colIndex]);
                    });
                });
                
                // Restore current row if game is not over
                if (!this.gameOver && this.currentTile > 0) {
                    const currentGuess = this.guesses[this.currentRow] || '';
                    for (let i = 0; i < this.currentTile; i++) {
                        const tile = this.board.children[this.currentRow].children[i];
                        tile.textContent = currentGuess[i] || '';
                        if (currentGuess[i]) {
                            tile.classList.add('filled');
                        }
                    }
                }
                
                // Update keyboard colors
                this.guesses.forEach(guess => {
                    const result = this.evaluateGuessForShare(guess);
                    this.updateKeyboard(guess, result);
                });
            } else {
                // Clear old game state
                localStorage.removeItem('wordGameState');
            }
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordGame();
}); 