class OneClueCrosswords {
    constructor() {
        this.currentPuzzle = null;
        this.grid = [];
        this.currentCell = { row: 0, col: 0 };
        this.activeClue = null;
        this.isGameActive = false;
        this.themeName = '';
        this.initializeElements();
        this.bindEvents();
        this.loadPuzzles();
        this.startNewPuzzle();
    }

    initializeElements() {
        this.themeTitle = document.getElementById('themeTitle');
        this.themeNameElem = document.getElementById('themeName');
        this.crosswordGrid = document.getElementById('crosswordGrid');
        this.acrossCluesElem = document.getElementById('acrossClues');
        this.downCluesElem = document.getElementById('downClues');
        this.activeClueBox = document.getElementById('activeClueBox');
        this.activeClueLabel = document.getElementById('activeClueLabel');
        this.activeClueText = document.getElementById('activeClueText');
        this.completionModal = document.getElementById('completionModal');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.newPuzzleBtn = document.getElementById('newPuzzleBtn');
    }

    bindEvents() {
        this.newPuzzleBtn.addEventListener('click', () => this.startNewPuzzle());
        this.playAgainBtn.addEventListener('click', () => this.closeModal());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', (e) => this.handleClick(e));
    }

    loadPuzzles() {
        // Each puzzle: theme, words, clues, grid layout
        this.puzzles = [
            {
                theme: "Fall",
                words: [
                    { word: "PUMPKIN", clue: "gourd", direction: "across", start: { row: 0, col: 0 } },
                    { word: "LEAF", clue: "tree dropper", direction: "down", start: { row: 0, col: 2 } },
                    { word: "ACORN", clue: "oak seed", direction: "down", start: { row: 0, col: 4 } }
                ],
                gridSize: 7
            },
            {
                theme: "Fire",
                words: [
                    { word: "EMBER", clue: "glowing coal", direction: "across", start: { row: 1, col: 1 } },
                    { word: "BLAZE", clue: "intense flame", direction: "down", start: { row: 0, col: 3 } },
                    { word: "SMOKE", clue: "rising vapor", direction: "across", start: { row: 3, col: 2 } }
                ],
                gridSize: 7
            },
            {
                theme: "Ocean",
                words: [
                    { word: "WAVE", clue: "moving ridge", direction: "across", start: { row: 2, col: 1 } },
                    { word: "FISH", clue: "gilled swimmer", direction: "down", start: { row: 0, col: 3 } },
                    { word: "SALT", clue: "ocean taste", direction: "across", start: { row: 4, col: 2 } }
                ],
                gridSize: 7
            }
        ];
    }

    startNewPuzzle() {
        this.currentPuzzle = this.puzzles[Math.floor(Math.random() * this.puzzles.length)];
        this.themeName = this.currentPuzzle.theme;
        this.isGameActive = true;
        this.grid = [];
        this.activeClue = null;
        this.renderPuzzle();
    }

    renderPuzzle() {
        this.themeNameElem.textContent = this.themeName;
        this.generateGrid();
        this.renderGrid();
        this.renderClues();
        this.setActiveClueByIndex(0, 'across');
    }

    generateGrid() {
        // Create empty grid
        const size = this.currentPuzzle.gridSize;
        this.grid = Array.from({ length: size }, () => Array(size).fill(null));
        // Place words
        this.cellNumbers = Array.from({ length: size }, () => Array(size).fill(null));
        this.wordNumbers = [];
        let clueNum = 1;
        for (const word of this.currentPuzzle.words) {
            let { row, col } = word.start;
            for (let i = 0; i < word.word.length; i++) {
                if (word.direction === 'across') {
                    this.grid[row][col + i] = '';
                } else {
                    this.grid[row + i][col] = '';
                }
            }
            // Assign clue numbers
            if (!this.cellNumbers[row][col]) {
                this.cellNumbers[row][col] = clueNum;
                this.wordNumbers.push({ ...word, number: clueNum });
                word.number = clueNum;
                clueNum++;
            } else {
                word.number = this.cellNumbers[row][col];
                this.wordNumbers.push({ ...word, number: word.number });
            }
        }
    }

    renderGrid() {
        this.crosswordGrid.innerHTML = '';
        const size = this.currentPuzzle.gridSize;
        this.crosswordGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.className = 'crossword-cell';
                cell.tabIndex = -1;
                cell.dataset.row = row;
                cell.dataset.col = col;
                if (this.grid[row][col] === null) {
                    cell.classList.add('empty');
                } else {
                    cell.contentEditable = true;
                    cell.addEventListener('focus', () => this.setActiveCell(row, col));
                    cell.addEventListener('input', (e) => this.handleCellInput(e, row, col));
                }
                // Render clue number
                if (this.cellNumbers[row][col]) {
                    const num = document.createElement('span');
                    num.className = 'cell-number';
                    num.textContent = this.cellNumbers[row][col];
                    cell.appendChild(num);
                }
                this.crosswordGrid.appendChild(cell);
            }
        }
    }

    renderClues() {
        this.acrossCluesElem.innerHTML = '';
        this.downCluesElem.innerHTML = '';
        const across = this.currentPuzzle.words.filter(w => w.direction === 'across');
        const down = this.currentPuzzle.words.filter(w => w.direction === 'down');
        for (const word of across) {
            const li = this.createClueListItem(word, 'across');
            this.acrossCluesElem.appendChild(li);
        }
        for (const word of down) {
            const li = this.createClueListItem(word, 'down');
            this.downCluesElem.appendChild(li);
        }
    }

    createClueListItem(word, dir) {
        const li = document.createElement('li');
        li.className = 'clue-item';
        li.dataset.number = word.number;
        li.dataset.direction = dir;
        const badge = document.createElement('span');
        badge.className = `clue-badge ${dir}`;
        badge.textContent = `${word.number}${dir === 'across' ? 'A' : 'D'}`;
        li.appendChild(badge);
        const clueText = document.createElement('span');
        clueText.textContent = word.clue;
        li.appendChild(clueText);
        li.addEventListener('click', () => this.setActiveClue(word.number, dir));
        return li;
    }

    setActiveClue(number, direction) {
        this.activeClue = this.currentPuzzle.words.find(w => w.number === number && w.direction === direction);
        this.highlightActiveWord();
        this.updateActiveClueBox();
        // Focus first cell of the word
        const { row, col } = this.activeClue.start;
        this.setActiveCell(row, col);
    }
    setActiveClueByIndex(idx, direction) {
        const words = this.currentPuzzle.words.filter(w => w.direction === direction);
        if (words[idx]) {
            this.setActiveClue(words[idx].number, direction);
        }
    }
    setActiveCell(row, col) {
        // Remove all highlights
        document.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('active', 'active-word');
        });
        // Highlight active word path
        if (this.activeClue) {
            const { start, direction, word } = this.activeClue;
            for (let i = 0; i < word.length; i++) {
                const r = direction === 'down' ? start.row + i : start.row;
                const c = direction === 'across' ? start.col + i : start.col;
                const cell = this.getCellElement(r, c);
                if (cell) cell.classList.add('active-word');
            }
        }
        // Highlight and focus the selected cell
        const cell = this.getCellElement(row, col);
        if (cell) {
            cell.classList.add('active');
            cell.focus();
        }
        this.currentCell = { row, col };
    }
    getCellElement(row, col) {
        return document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"]`);
    }
    handleCellInput(event, row, col) {
        let value = event.target.textContent.toUpperCase().replace(/[^A-Z]/g, '');
        value = value.charAt(0) || '';
        event.target.textContent = value;
        this.grid[row][col] = value;
        // Move to next cell in word
        if (value && this.activeClue) {
            const { start, direction, word } = this.activeClue;
            for (let i = 0; i < word.length; i++) {
                const r = direction === 'down' ? start.row + i : start.row;
                const c = direction === 'across' ? start.col + i : start.col;
                if (r === row && c === col) {
                    // Move to next cell in word
                    if (i + 1 < word.length) {
                        const nextR = direction === 'down' ? start.row + i + 1 : start.row;
                        const nextC = direction === 'across' ? start.col + i + 1 : start.col;
                        this.setActiveCell(nextR, nextC);
                    }
                    break;
                }
            }
        }
        this.checkCompletion();
    }
    handleKeyPress(event) {
        if (!this.isGameActive) return;
        const { key } = event;
        const { row, col } = this.currentCell;
        if (key === 'Tab') {
            event.preventDefault();
            // Switch to next clue
            const dir = this.activeClue.direction;
            const words = this.currentPuzzle.words.filter(w => w.direction === dir);
            const idx = words.findIndex(w => w.number === this.activeClue.number);
            const nextIdx = (idx + 1) % words.length;
            this.setActiveClueByIndex(nextIdx, dir);
            return;
        }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            event.preventDefault();
            let nextRow = row, nextCol = col;
            if (key === 'ArrowUp') nextRow--;
            if (key === 'ArrowDown') nextRow++;
            if (key === 'ArrowLeft') nextCol--;
            if (key === 'ArrowRight') nextCol++;
            if (this.isValidCell(nextRow, nextCol)) {
                this.setActiveCell(nextRow, nextCol);
            }
            return;
        }
        if (key === 'Backspace') {
            const cell = this.getCellElement(row, col);
            if (cell && !cell.textContent) {
                // Move to previous cell in word
                if (this.activeClue) {
                    const { start, direction, word } = this.activeClue;
                    for (let i = 0; i < word.length; i++) {
                        const r = direction === 'down' ? start.row + i : start.row;
                        const c = direction === 'across' ? start.col + i : start.col;
                        if (r === row && c === col && i > 0) {
                            const prevR = direction === 'down' ? start.row + i - 1 : start.row;
                            const prevC = direction === 'across' ? start.col + i - 1 : start.col;
                            this.setActiveCell(prevR, prevC);
                        }
                    }
                }
            }
        }
    }
    handleClick(event) {
        // Clue click
        if (event.target.closest('.clue-item')) {
            const li = event.target.closest('.clue-item');
            const number = parseInt(li.dataset.number);
            const direction = li.dataset.direction;
            this.setActiveClue(number, direction);
            return;
        }
        // Cell click
        if (event.target.classList.contains('crossword-cell') && !event.target.classList.contains('empty')) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            // Find which word this cell belongs to (prefer active direction)
            let word = this.currentPuzzle.words.find(w => {
                const { start, direction, word: wstr } = w;
                for (let i = 0; i < wstr.length; i++) {
                    const r = direction === 'down' ? start.row + i : start.row;
                    const c = direction === 'across' ? start.col + i : start.col;
                    if (r === row && c === col) return true;
                }
                return false;
            });
            if (word) this.setActiveClue(word.number, word.direction);
            this.setActiveCell(row, col);
        }
    }
    highlightActiveWord() {
        document.querySelectorAll('.clue-item').forEach(li => {
            li.classList.remove('selected');
            const badge = li.querySelector('.clue-badge');
            badge && badge.classList.remove('selected');
        });
        if (this.activeClue) {
            // Highlight clue in list
            const clueList = this.activeClue.direction === 'across' ? this.acrossCluesElem : this.downCluesElem;
            const li = clueList.querySelector(`[data-number="${this.activeClue.number}"]`);
            if (li) {
                li.classList.add('selected');
                const badge = li.querySelector('.clue-badge');
                badge && badge.classList.add('selected');
            }
        }
        // Highlight word path in grid (done in setActiveCell)
    }
    updateActiveClueBox() {
        if (this.activeClue) {
            this.activeClueLabel.textContent = `${this.activeClue.number}${this.activeClue.direction === 'across' ? 'A' : 'D'}`;
            this.activeClueLabel.className = `clue-badge ${this.activeClue.direction}`;
            this.activeClueText.textContent = this.activeClue.clue;
        } else {
            this.activeClueLabel.textContent = '';
            this.activeClueText.textContent = '';
        }
    }
    isValidCell(row, col) {
        return row >= 0 && row < this.grid.length &&
               col >= 0 && col < this.grid[0].length &&
               this.grid[row][col] !== null;
    }
    checkCompletion() {
        let allFilled = true;
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                if (this.grid[row][col] === '' && this.isValidCell(row, col)) {
                    allFilled = false;
                }
            }
        }
        if (allFilled && this.checkSolution()) {
            this.completePuzzle();
        }
    }
    checkSolution() {
        let allCorrect = true;
        for (const word of this.currentPuzzle.words) {
            const { start, direction, word: wstr } = word;
            for (let i = 0; i < wstr.length; i++) {
                const r = direction === 'down' ? start.row + i : start.row;
                const c = direction === 'across' ? start.col + i : start.col;
                const val = this.grid[r][c];
                if (val !== wstr[i]) {
                    allCorrect = false;
                }
            }
        }
        return allCorrect;
    }
    completePuzzle() {
        this.isGameActive = false;
        this.completionModal.style.display = 'block';
    }
    closeModal() {
        this.completionModal.style.display = 'none';
        this.startNewPuzzle();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OneClueCrosswords();
}); 