document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'main.html';
    });

    // Status step click handler
    document.querySelectorAll('.status-step').forEach(step => {
        step.addEventListener('click', function() {
            document.querySelectorAll('.status-step').forEach(s => {
                s.classList.remove('active');
            });
            this.classList.add('active');
            
            const status = this.querySelector('span').textContent;
            alert(`Viewing all orders with status: ${status}`);
        });
    });

    // Action buttons functionality
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.order-card').querySelector('h2').textContent;
            alert(`${cardTitle} action would be processed here`);
        });
    });
});