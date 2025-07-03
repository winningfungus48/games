const events = [
    {
        event: "Fall of the Berlin Wall",
        year: 1989,
        fact: "The Berlin Wall fell on November 9, 1989, marking the symbolic end of the Cold War and paving the way for German reunification."
    },
    {
        event: "Moon Landing (Apollo 11)",
        year: 1969,
        fact: "Neil Armstrong became the first human to step on the Moon on July 20, 1969."
    },
    {
        event: "Signing of the Declaration of Independence (USA)",
        year: 1776,
        fact: "The United States Declaration of Independence was adopted on July 4, 1776."
    },
    {
        event: "Start of World War I",
        year: 1914,
        fact: "World War I began in July 1914 after the assassination of Archduke Franz Ferdinand."
    },
    {
        event: "Discovery of Penicillin",
        year: 1928,
        fact: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine."
    },
    {
        event: "French Revolution begins",
        year: 1789,
        fact: "The French Revolution started in 1789, leading to the end of monarchy in France."
    },
    {
        event: "First Powered Flight (Wright Brothers)",
        year: 1903,
        fact: "The Wright brothers made the first powered flight on December 17, 1903."
    },
    {
        event: "Invention of the Printing Press (Gutenberg)",
        year: 1440,
        fact: "Johannes Gutenberg invented the movable-type printing press around 1440."
    },
    {
        event: "Start of the Renaissance",
        year: 1300,
        fact: "The Renaissance began in Italy around 1300, sparking a period of great cultural change."
    },
    {
        event: "End of the American Civil War",
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
const yearInput = document.getElementById('yearInput');
const guessHistoryList = document.getElementById('guessHistory');
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
    guessHistoryList.innerHTML = '';
    yearInput.value = '';
    yearInput.disabled = false;
    yearInput.focus();
    guessForm.querySelector('button').disabled = false;
    hideModal();
}

function getFeedback(guess, answer) {
    if (guess === answer) return 'correct';
    if (Math.abs(guess - answer) <= 10) return 'close';
    return 'far';
}

function addGuessToHistory(guess, feedback) {
    const li = document.createElement('li');
    const badge = document.createElement('span');
    badge.classList.add('guess-badge');
    if (feedback === 'correct') badge.classList.add('badge-correct');
    else if (feedback === 'close') badge.classList.add('badge-close');
    else badge.classList.add('badge-far');
    badge.textContent = guess;
    li.appendChild(badge);
    let feedbackText = '';
    if (feedback === 'correct') feedbackText = 'Correct!';
    else if (feedback === 'close') feedbackText = 'Within 10 years';
    else feedbackText = 'More than 10 years off';
    const text = document.createElement('span');
    text.textContent = feedbackText;
    li.appendChild(text);
    guessHistoryList.appendChild(li);
}

guessForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (solved || attempts >= MAX_ATTEMPTS) return;
    const guess = parseInt(yearInput.value, 10);
    if (isNaN(guess) || guess < 1000 || guess > 2999) {
        yearInput.value = '';
        yearInput.focus();
        return;
    }
    attempts++;
    const feedback = getFeedback(guess, currentEvent.year);
    addGuessToHistory(guess, feedback);
    guessHistory.push({ guess, feedback });
    if (feedback === 'correct') {
        solved = true;
        showModal(true);
    } else if (attempts >= MAX_ATTEMPTS) {
        showModal(false);
    }
    yearInput.value = '';
    yearInput.focus();
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
    yearInput.disabled = true;
    guessForm.querySelector('button').disabled = true;
}

function hideModal() {
    resultModal.style.display = 'none';
}

playNextBtn.addEventListener('click', resetGame);

// Hide modal if user clicks outside modal content
resultModal.addEventListener('click', function(e) {
    if (e.target === resultModal) hideModal();
});

// Start the first game
resetGame(); 