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
    } else if (username !== 'AdminERP') {
        document.getElementById('usernameError').textContent = 'Invalid username';
        isValid = false;
    }
    
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    } else if (password !== 'AdminERP_2025') {
        document.getElementById('passwordError').textContent = 'Invalid password';
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

// Forgot password functionality
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Forgot your password? Please contact your IT Support for assistance.');
});

// Password visibility toggle with auto-hide
const passwordInput = document.getElementById('password');
const passwordField = passwordInput.parentElement;

// Create eye icon container
const toggleContainer = document.createElement('div');
toggleContainer.className = 'password-toggle-container';

// Create eye icon
const passwordToggle = document.createElement('i');
passwordToggle.className = 'password-toggle-icon';
passwordToggle.innerHTML = 'visibility'; // Material Icons "eye-off" symbol

// Add to DOM
toggleContainer.appendChild(passwordToggle);
passwordField.appendChild(toggleContainer);

// Click handler
passwordToggle.addEventListener('click', function() {
    // Toggle password visibility
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.textContent = 'visibility'; // Material Icons "eye" symbol
        passwordToggle.title = 'Show Password';
        
     //if gusto mag auto hide for seconds, add code here hehe   
    } else {
        passwordInput.type = 'password';
        passwordToggle.textContent = 'visibility';
        passwordToggle.title = 'Show password';
    }
});

// Optional: Remember me functionality
const rememberCheckbox = document.querySelector('input[name="remember"]');
if (localStorage.getItem('rememberAdmin') === 'true') {
    rememberCheckbox.checked = true;
    document.getElementById('username').value = 'AdminERP';
}

if (rememberCheckbox) {
    rememberCheckbox.addEventListener('change', function() {
        localStorage.setItem('rememberAdmin', this.checked);
    });
}