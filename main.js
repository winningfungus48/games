// Modal logic for main page
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

document.getElementById('timelBtn').addEventListener('click', function() {
    openModal('timelModal');
});
document.getElementById('numberleBtn').addEventListener('click', function() {
    openModal('numberleModal');
});
document.getElementById('crosswordBtn').addEventListener('click', function() {
    openModal('crosswordModal');
});

['timelModal', 'numberleModal', 'crosswordModal'].forEach(function(modalId) {
    const modal = document.getElementById(modalId);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal(modalId);
    });
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex' && e.key === 'Escape') closeModal(modalId);
    });
});

// Robust navigation for Play buttons (flat structure)
function goToGame(filename) {
    window.location.assign(filename);
}

document.querySelector('#timelModal .btn-primary').addEventListener('click', function() {
    goToGame('timel.html');
});
document.querySelector('#numberleModal .btn-primary').addEventListener('click', function() {
    goToGame('numberle.html');
});
document.querySelector('#crosswordModal .btn-primary').addEventListener('click', function() {
    goToGame('crossword.html');
}); 