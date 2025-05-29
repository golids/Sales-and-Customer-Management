const supabaseClient = supabase.createClient(
    'https://iradphcrwwokdrnhxpnd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
);

const table = document.querySelector('table tbody');

// Load customers from Supabase
async function loadCustomers() {
    const { data, error } = await supabaseClient.from('customers').select('*');

    if (error) {
        console.error('Error loading customers:', error.message);
        showError('Failed to load customer data');
        return;
    }

    table.innerHTML = ''; // Clear existing rows

    data.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customer_id}</td>
            <td contenteditable="true" data-field="name">${customer.name || ''}</td>
            <td contenteditable="true" data-field="email">${customer.email || ''}</td>
            <td contenteditable="true" data-field="phone">${customer.phone || ''}</td>
            <td>${customer.create_at ? new Date(customer.create_at).toLocaleDateString() : ''}</td>
            <td contenteditable="true" data-field="address">${customer.addressid || ''}</td>
            <td contenteditable="true" data-field="password">${customer.password || ''}</td>
            <td contenteditable="true" data-field="loyalty_points">${customer.loyalty_points ?? 0}</td>
        `;

        // Inline edit events
        row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
            cell.addEventListener('blur', async () => {
                const field = cell.dataset.field;
                let value = cell.textContent.trim();

                // Type fix: loyalty_points should be a number
                if (field === 'loyalty_points') {
                    value = parseInt(value, 10) || 0;
                    cell.textContent = value; // Update display to ensure number format
                }

                const { error } = await supabaseClient
                    .from('customers')
                    .update({ [field]: value })
                    .eq('customer_id', customer.customer_id);

                if (error) {
                    showError(`Failed to update ${field}`);
                    console.error(error);
                }
            });
        });

        table.appendChild(row);
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.padding = '10px';
    errorDiv.style.margin = '10px 0';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
    
    const content = document.querySelector('.masterlist-content');
    content.insertBefore(errorDiv, content.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Navigation buttons
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
});

document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'customer.html';
});

// Load table when DOM is ready
document.addEventListener('DOMContentLoaded', loadCustomers);