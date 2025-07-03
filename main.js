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

// Robust navigation for Play buttons
function goToGame(subdir) {
    // Always use the current directory as base
    var base = window.location.pathname.replace(/\/[^\/]*$/, '/');
    // If on root (index.html), just append
    if (!base.endsWith('/')) base += '/';
    window.location.assign(base + subdir + '/index.html');
}

document.querySelector('#timelModal .btn-primary').addEventListener('click', function() {
    goToGame('Timel');
});
document.querySelector('#numberleModal .btn-primary').addEventListener('click', function() {
    goToGame('Numberle');
});
document.querySelector('#crosswordModal .btn-primary').addEventListener('click', function() {
    goToGame('OneClueCrossword');
}); 