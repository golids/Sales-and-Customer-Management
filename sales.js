document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Action buttons functionality
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.sales-card').querySelector('h2').textContent;
            alert(`You clicked: ${cardTitle}\n\nThis would open the specific sales transaction section in a real application.`);
        });
    });
});