class OneClueCrosswords {
    constructor() {
        this.currentPuzzle = null;
        this.grid = [];
        this.currentCell = { row: 0, col: 0 };
        this.startTime = null;
        this.hintsUsed = 0;
        this.isGameActive = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadPuzzles();
        this.startNewPuzzle();
    }

    initializeElements() {
        this.clueDisplay = document.getElementById('clueDisplay');
        this.crosswordGrid = document.getElementById('crosswordGrid');
        this.progressDisplay = document.getElementById('progressDisplay');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.completionModal = document.getElementById('completionModal');
        this.hintModal = document.getElementById('hintModal');
        this.hintText = document.getElementById('hintText');
        this.finalTime = document.getElementById('finalTime');
        this.hintsUsed = document.getElementById('hintsUsed');
        this.completionMessage = document.getElementById('completionMessage');
    }

    bindEvents() {
        document.getElementById('newPuzzleBtn').addEventListener('click', () => this.startNewPuzzle());
        document.getElementById('checkBtn').addEventListener('click', () => this.checkSolution());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('closeHintBtn').addEventListener('click', () => this.closeHintModal());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', (e) => this.handleClick(e));
    }

    loadPuzzles() {
        this.puzzles = [
            {
                clue: "Fire",
                grid: [
                    [1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1]
                ],
                words: [
                    { word: "EMBER", start: { row: 1, col: 1 }, direction: "across" },
                    { word: "BLAZE", start: { row: 2, col: 1 }, direction: "down" },
                    { word: "SMOKE", start: { row: 1, col: 2 }, direction: "down" }
                ],
                hints: [
                    "A glowing piece of coal or wood",
                    "A bright, intense flame",
                    "The visible vapor from burning"
                ]
            },
            {
                clue: "Ocean",
                grid: [
                    [1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1]
                ],
                words: [
                    { word: "WAVE", start: { row: 1, col: 1 }, direction: "across" },
                    { word: "FISH", start: { row: 1, col: 1 }, direction: "down" },
                    { word: "SALT", start: { row: 2, col: 2 }, direction: "down" }
                ],
                hints: [
                    "A moving ridge of water",
                    "Aquatic creature with gills",
                    "What makes ocean water taste different"
                ]
            },
            {
                clue: "Music",
                grid: [
                    [1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1]
                ],
                words: [
                    { word: "BEAT", start: { row: 1, col: 1 }, direction: "across" },
                    { word: "SONG", start: { row: 1, col: 1 }, direction: "down" },
                    { word: "TUNE", start: { row: 2, col: 2 }, direction: "down" }
                ],
                hints: [
                    "Rhythmic pattern in music",
                    "A musical composition with lyrics",
                    "A melody or musical piece"
                ]
            },
            {
                clue: "Food",
                grid: [
                    [1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1]
                ],
                words: [
                    { word: "BREAD", start: { row: 1, col: 1 }, direction: "across" },
                    { word: "APPLE", start: { row: 1, col: 1 }, direction: "down" },
                    { word: "PIZZA", start: { row: 2, col: 2 }, direction: "down" }
                ],
                hints: [
                    "Baked food made from flour",
                    "A round, red or green fruit",
                    "Italian dish with cheese and toppings"
                ]
            },
            {
                clue: "Nature",
                grid: [
                    [1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 1, 1, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1]
                ],
                words: [
                    { word: "TREE", start: { row: 1, col: 1 }, direction: "across" },
                    { word: "FLOWER", start: { row: 1, col: 1 }, direction: "down" },
                    { word: "GRASS", start: { row: 2, col: 2 }, direction: "down" }
                ],
                hints: [
                    "Tall plant with a trunk and branches",
                    "Colorful part of a plant that produces seeds",
                    "Green ground cover in fields and lawns"
                ]
            }
        ];
    }

    startNewPuzzle() {
        this.currentPuzzle = this.puzzles[Math.floor(Math.random() * this.puzzles.length)];
        this.hintsUsed = 0;
        this.startTime = Date.now();
        this.isGameActive = true;
        
        this.renderPuzzle();
        this.startTimer();
        this.updateProgress();
    }

    renderPuzzle() {
        this.clueDisplay.textContent = this.currentPuzzle.clue;
        this.renderGrid();
    }

    renderGrid() {
        this.crosswordGrid.innerHTML = '';
        this.grid = [];
        
        const puzzleGrid = this.currentPuzzle.grid;
        const rows = puzzleGrid.length;
        const cols = puzzleGrid[0].length;
        
        this.crosswordGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let row = 0; row < rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'crossword-cell';
                cell.maxLength = 1;
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (puzzleGrid[row][col] === 0) {
                    cell.classList.add('empty');
                    cell.disabled = true;
                    this.grid[row][col] = null;
                } else {
                    this.grid[row][col] = '';
                    cell.addEventListener('focus', () => this.setActiveCell(row, col));
                    cell.addEventListener('input', (e) => this.handleCellInput(e, row, col));
                }
                
                this.crosswordGrid.appendChild(cell);
            }
        }
        
        this.setActiveCell(0, 0);
    }

    setActiveCell(row, col) {
        // Remove active class from all cells
        document.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('active');
        });
        
        // Find the next valid cell if current is empty
        while (this.currentPuzzle.grid[row][col] === 0) {
            col++;
            if (col >= this.currentPuzzle.grid[0].length) {
                col = 0;
                row++;
                if (row >= this.currentPuzzle.grid.length) {
                    row = 0;
                }
            }
        }
        
        this.currentCell = { row, col };
        const cell = this.getCellElement(row, col);
        if (cell) {
            cell.classList.add('active');
            cell.focus();
        }
    }

    getCellElement(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    handleCellInput(event, row, col) {
        const value = event.target.value.toUpperCase();
        event.target.value = value;
        this.grid[row][col] = value;
        
        if (value && this.isValidCell(row, col + 1)) {
            this.setActiveCell(row, col + 1);
        }
        
        this.updateProgress();
        this.checkCompletion();
    }

    handleKeyPress(event) {
        if (!this.isGameActive) return;
        
        const { key } = event;
        const { row, col } = this.currentCell;
        
        switch (key) {
            case 'ArrowUp':
                event.preventDefault();
                this.moveToCell(row - 1, col);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.moveToCell(row + 1, col);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.moveToCell(row, col - 1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.moveToCell(row, col + 1);
                break;
            case 'Backspace':
                if (this.grid[row][col] === '') {
                    event.preventDefault();
                    this.moveToCell(row, col - 1);
                }
                break;
        }
    }

    moveToCell(row, col) {
        if (this.isValidCell(row, col)) {
            this.setActiveCell(row, col);
        }
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.currentPuzzle.grid.length &&
               col >= 0 && col < this.currentPuzzle.grid[0].length &&
               this.currentPuzzle.grid[row][col] === 1;
    }

    handleClick(event) {
        if (event.target.classList.contains('crossword-cell') && !event.target.disabled) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            this.setActiveCell(row, col);
        }
    }

    updateProgress() {
        let filled = 0;
        let total = 0;
        
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                if (this.currentPuzzle.grid[row][col] === 1) {
                    total++;
                    if (this.grid[row][col] && this.grid[row][col] !== '') {
                        filled++;
                    }
                }
            }
        }
        
        this.progressDisplay.textContent = `Progress: ${filled}/${total}`;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.isGameActive) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    checkSolution() {
        let allCorrect = true;
        
        // Clear previous validation
        document.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('correct', 'incorrect');
        });
        
        // Check each word
        this.currentPuzzle.words.forEach(word => {
            const wordCorrect = this.checkWord(word);
            if (!wordCorrect) {
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            this.completePuzzle();
        }
        
        return allCorrect;
    }

    checkWord(word) {
        const { start, direction, word: targetWord } = word;
        let currentWord = '';
        let isCorrect = true;
        
        for (let i = 0; i < targetWord.length; i++) {
            const row = direction === 'down' ? start.row + i : start.row;
            const col = direction === 'across' ? start.col + i : start.col;
            
            const cellValue = this.grid[row][col] || '';
            currentWord += cellValue;
            
            const cell = this.getCellElement(row, col);
            if (cellValue === targetWord[i]) {
                cell.classList.add('correct');
            } else if (cellValue !== '') {
                cell.classList.add('incorrect');
                isCorrect = false;
            }
        }
        
        return isCorrect;
    }

    checkCompletion() {
        let allFilled = true;
        let allCorrect = true;
        
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                if (this.currentPuzzle.grid[row][col] === 1) {
                    if (!this.grid[row][col] || this.grid[row][col] === '') {
                        allFilled = false;
                    }
                }
            }
        }
        
        if (allFilled) {
            allCorrect = this.checkSolution();
            if (allCorrect) {
                this.completePuzzle();
            }
        }
    }

    completePuzzle() {
        this.isGameActive = false;
        clearInterval(this.timerInterval);
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.finalTime.textContent = timeString;
        this.hintsUsed.textContent = this.hintsUsed;
        this.completionMessage.textContent = `Congratulations! You solved the "${this.currentPuzzle.clue}" puzzle!`;
        
        this.completionModal.style.display = 'block';
        
        // Add success animation to the game area
        document.querySelector('.game-area').classList.add('success-animation');
        setTimeout(() => {
            document.querySelector('.game-area').classList.remove('success-animation');
        }, 600);
    }

    showHint() {
        if (this.hintsUsed >= this.currentPuzzle.hints.length) {
            this.hintText.textContent = "No more hints available!";
        } else {
            this.hintText.textContent = this.currentPuzzle.hints[this.hintsUsed];
            this.hintsUsed++;
        }
        this.hintModal.style.display = 'block';
    }

    closeHintModal() {
        this.hintModal.style.display = 'none';
    }

    closeModal() {
        this.completionModal.style.display = 'none';
        this.startNewPuzzle();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new OneClueCrosswords();
}); 