document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'customer.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });


    // DOM elements
    const addressForm = document.getElementById('addressForm');
    const addressGrid = document.querySelector('.address-grid');
    const addressTableBody = document.getElementById('addressTableBody');

    // Initialize with sample data
    function initializeData() {
        sampleAddresses.forEach(address => {
            addAddressCard(address);
            addAddressToTable(address);
        });
    }

    // Add address to table
    function addAddressToTable(address) {
        const row = document.createElement('tr');
        
        const typeClass = address.type === 'billing' ? 'billing-badge' : 
                         address.type === 'shipping' ? 'shipping-badge' : 'both-badge';
        
        row.innerHTML = `
            <td><span class="type-badge ${typeClass}">${address.type}</span></td>
            <td>${address.street}</td>
            <td>${address.city}</td>
            <td>${address.state}</td>
            <td>${address.zip}</td>
            <td>${address.country}</td>
            <td>
                <button class="table-btn edit-btn"><i class="fas fa-edit"></i></button>
                <button class="table-btn delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        addressTableBody.appendChild(row);
    }

    // Form submission
    addressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newAddress = {
            type: document.getElementById('addressType').value,
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value
        };
        
        // Add to both card and table
        addAddressToTable(newAddress);
        
        // Reset form
        addressForm.reset();
    });

    // Initialize the page
    initializeData();
});