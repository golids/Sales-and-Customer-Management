document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Reset error messages
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    // Validate inputs
    let isValid = true;
    
    if (username === '') {
        document.getElementById('usernameError').textContent = 'Username is required';
        isValid = false;
    } else if (username.length < 4) {
        document.getElementById('usernameError').textContent = 'Username must be at least 4 characters';
        isValid = false;
    }
    
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
// If form is valid, redirect to dashboard
    if (isValid) {
        window.location.href = 'dashboard.html';
    }
});

// Add focus effects
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.querySelector('label').style.color = '#64ffda';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.querySelector('label').style.color = '#ccd6f6';
    });
});