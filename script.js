const events = [
    {
        event: "In what year did the Berlin Wall fall, marking the symbolic end of the Cold War?",
        year: 1989,
        fact: "The Berlin Wall fell on November 9, 1989, marking the symbolic end of the Cold War and paving the way for German reunification."
    },
    {
        event: "In what year did Neil Armstrong become the first human to step on the Moon?",
        year: 1969,
        fact: "Neil Armstrong became the first human to step on the Moon on July 20, 1969."
    },
    {
        event: "In what year was the United States Declaration of Independence adopted?",
        year: 1776,
        fact: "The United States Declaration of Independence was adopted on July 4, 1776."
    },
    {
        event: "In what year did World War I begin?",
        year: 1914,
        fact: "World War I began in July 1914 after the assassination of Archduke Franz Ferdinand."
    },
    {
        event: "In what year did Alexander Fleming discover penicillin, revolutionizing medicine?",
        year: 1928,
        fact: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine."
    },
    {
        event: "In what year did the French Revolution begin, leading to the end of monarchy in France?",
        year: 1789,
        fact: "The French Revolution started in 1789, leading to the end of monarchy in France."
    },
    {
        event: "In what year did the Wright brothers make the first powered flight?",
        year: 1903,
        fact: "The Wright brothers made the first powered flight on December 17, 1903."
    },
    {
        event: "In what year did Johannes Gutenberg invent the movable-type printing press?",
        year: 1440,
        fact: "Johannes Gutenberg invented the movable-type printing press around 1440."
    },
    {
        event: "Around what year did the Renaissance begin in Italy, sparking a period of great cultural change?",
        year: 1300,
        fact: "The Renaissance began in Italy around 1300, sparking a period of great cultural change."
    },
    {
        event: "In what year did the American Civil War end with the surrender of the Confederate Army?",
        year: 1865,
        fact: "The American Civil War ended in 1865 with the surrender of the Confederate Army."
    }
];

const MAX_ATTEMPTS = 6;
let currentEvent = null;
let attempts = 0;
let solved = false;
let guessHistory = [];

const eventPrompt = document.getElementById('eventPrompt');
const guessForm = document.getElementById('guessForm');
const digitInputs = [
    document.getElementById('digit1'),
    document.getElementById('digit2'),
    document.getElementById('digit3'),
    document.getElementById('digit4')
];
const guessBtn = document.getElementById('guessBtn');
const guessResult = document.getElementById('guessResult');
const guessHistoryDiv = document.getElementById('guessHistory');
const resultModal = document.getElementById('resultModal');
const modalTitle = document.getElementById('modalTitle');
const modalAnswer = document.getElementById('modalAnswer');
const modalFact = document.getElementById('modalFact');
const playNextBtn = document.getElementById('playNextBtn');

function pickRandomEvent() {
    return events[Math.floor(Math.random() * events.length)];
}

function resetGame() {
    currentEvent = pickRandomEvent();
    attempts = 0;
    solved = false;
    guessHistory = [];
    eventPrompt.textContent = currentEvent.event;
    guessHistoryDiv.innerHTML = '';
    guessResult.textContent = '';
    digitInputs.forEach(input => {
        input.value = '';
        input.disabled = false;
        input.classList.remove('error');
    });
    digitInputs[0].focus();
    guessBtn.disabled = true;
    hideModal();
}

function getFeedback(guess, answer) {
    if (guess === answer) return 'correct';
    if (Math.abs(guess - answer) <= 10) return 'close';
    return 'far';
}

function getDirectionArrow(guess, answer, color) {
    // Use flat Unicode arrows, color is for accessibility
    if (guess === answer) return '';
    if (guess < answer) return '<span class="guess-arrow">↑</span>';
    return '<span class="guess-arrow">↓</span>';
}

function getYearBlockColor(feedback) {
    if (feedback === 'correct') return 'green';
    if (feedback === 'close') return 'yellow';
    return 'gray';
}

function addGuessToHistory(guess, feedback) {
    const row = document.createElement('div');
    row.className = 'guess-row';
    // Year block
    const yearBlock = document.createElement('div');
    yearBlock.className = 'guess-year-block ' + getYearBlockColor(feedback);
    yearBlock.innerHTML =
        `<span>${String(guess).padStart(4, '0')}</span>` +
        (feedback === 'correct' ?
            '<span class="guess-correct">✔️</span>' :
            getDirectionArrow(guess, currentEvent.year, getYearBlockColor(feedback))
        );
    row.appendChild(yearBlock);
    // Insert at the top
    if (guessHistoryDiv.firstChild) {
        guessHistoryDiv.insertBefore(row, guessHistoryDiv.firstChild);
    } else {
        guessHistoryDiv.appendChild(row);
    }
}

function setGuessBtnState() {
    const allFilled = digitInputs.every(input => input.value.match(/^[0-9]$/));
    guessBtn.disabled = !allFilled;
}

digitInputs.forEach((input, idx) => {
    input.addEventListener('input', e => {
        const val = input.value;
        // Only allow one digit
        if (!val.match(/^[0-9]$/)) {
            input.value = '';
            return;
        }
        // Move to next input if not last
        if (val && idx < 3) {
            digitInputs[idx + 1].focus();
        }
        setGuessBtnState();
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Backspace') {
            if (input.value === '' && idx > 0) {
                digitInputs[idx - 1].focus();
            }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            digitInputs[idx - 1].focus();
        } else if (e.key === 'ArrowRight' && idx < 3) {
            digitInputs[idx + 1].focus();
        } else if (e.key === 'Enter') {
            if (!guessBtn.disabled) {
                guessForm.requestSubmit();
            }
        }
    });
});

guessForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (solved || attempts >= MAX_ATTEMPTS) return;
    const guessStr = digitInputs.map(input => input.value).join('');
    if (!guessStr.match(/^\d{4}$/)) {
        digitInputs.forEach(input => input.classList.add('error'));
        return;
    }
    digitInputs.forEach(input => input.classList.remove('error'));
    const guess = parseInt(guessStr, 10);
    attempts++;
    const feedback = getFeedback(guess, currentEvent.year);
    addGuessToHistory(guess, feedback);
    guessHistory.push({ guess, feedback });
    // Remove result label for later/earlier
    if (feedback === 'correct') {
        solved = true;
        guessResult.textContent = '';
        showModal(true);
    } else if (attempts >= MAX_ATTEMPTS) {
        guessResult.textContent = '';
        showModal(false);
    } else {
        guessResult.textContent = '';
    }
    digitInputs.forEach(input => input.value = '');
    digitInputs[0].focus();
    setGuessBtnState();
});

function showModal(won) {
    resultModal.style.display = 'flex';
    if (won) {
        modalTitle.textContent = 'Correct!';
    } else {
        modalTitle.textContent = 'Out of Attempts';
    }
    modalAnswer.textContent = `The correct year was ${currentEvent.year}.`;
    modalFact.textContent = currentEvent.fact;
    digitInputs.forEach(input => input.disabled = true);
    guessBtn.disabled = true;
    // Add Enter key support for Play Again
    document.addEventListener('keydown', handleModalEnter, { once: true });
}

function hideModal() {
    resultModal.style.display = 'none';
    document.removeEventListener('keydown', handleModalEnter);
}

function handleModalEnter(e) {
    if (e.key === 'Enter') {
        playNextBtn.click();
    }
}

playNextBtn.addEventListener('click', resetGame);

// Hide modal if user clicks outside modal content
resultModal.addEventListener('click', function(e) {
    if (e.target === resultModal) hideModal();
});

// Start the first game
resetGame(); 