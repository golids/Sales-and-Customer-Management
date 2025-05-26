document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'main.html';
    });

    // Form submission handlers
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.returns-card').querySelector('h2').textContent;
            
            // Simulate form processing
            const formInputs = this.closest('.card-content').querySelectorAll('.form-input');
            let isValid = true;
            
            formInputs.forEach(input => {
                if (input.value.trim() === '' && input.required) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '#303f60';
                }
            });
            
            if (isValid) {
                alert(`${cardTitle} processed successfully!\n\nThis would submit to your backend in a real application.`);
            } else {
                alert('Please fill in all required fields');
            }
        });
    });
});