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