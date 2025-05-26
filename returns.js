document.addEventListener('DOMContentLoaded', function () {
    // Back button functionality
    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = 'dashboard.html';
    });

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Sample return data
    const returnsData = [
        {
            id: "RET-2023-001",
            description: "Damaged product during shipping",
            type: "New Return Request",
            status: "pending",
            date: "2023-05-15",
            amount: "$89.99",
            product: "Wireless Headphones"
        },
        {
            id: "RET-2023-002",
            description: "Wrong item received",
            type: "Process Refund",
            status: "completed",
            date: "2023-05-10",
            amount: "$45.50",
            product: "T-Shirt (Blue)"
        },
        {
            id: "RET-2023-003",
            description: "Customer changed mind",
            type: "Complaint Resolution",
            status: "completed",
            date: "2023-05-08",
            amount: "$120.00",
            product: "Smart Watch"
        },
        {
            id: "RET-2023-004",
            description: "Defective product",
            type: "New Return Request",
            status: "pending",
            date: "2023-05-18",
            amount: "$199.99",
            product: "Bluetooth Speaker"
        },
        {
            id: "RET-2023-005",
            description: "Partial return - wrong color",
            type: "Process Refund",
            status: "completed",
            date: "2023-05-05",
            amount: "$32.25",
            product: "Running Shoes"
        }
    ];

    // Function to populate the returns table
    function populateReturnsTable() {
        const tableBody = document.querySelector('#returnsTable tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        returnsData.forEach(item => {
            const row = document.createElement('tr');

            let statusBadge = '';
            if (item.status === 'pending') {
                statusBadge = '<span class="status-badge status-pending">Pending</span>';
            } else if (item.status === 'completed') {
                statusBadge = '<span class="status-badge status-completed">Completed</span>';
            } else {
                statusBadge = '<span class="status-badge status-rejected">Rejected</span>';
            }

            row.innerHTML = `
                <td>${item.id}</td>
                <td>
                    <strong>${item.description}</strong><br>
                    <small>Product: ${item.product}</small>
                </td>
                <td>${item.type}</td>
                <td>${statusBadge}</td>
                <td>${item.date}</td>
                <td>${item.amount}</td>
                <td>
                    <span class="table-action" onclick="viewDetails('${item.id}')">View</span>
                    <span class="table-action" onclick="editReturn('${item.id}')">Edit</span>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Global functions for action links
    window.viewDetails = function (returnId) {
        const item = returnsData.find(r => r.id === returnId);
        if (!item) return;
        alert(`Viewing details for ${returnId}\n\n` +
            `Type: ${item.type}\n` +
            `Product: ${item.product}\n` +
            `Status: ${item.status}\n` +
            `Amount: ${item.amount}\n` +
            `Date: ${item.date}\n` +
            `Description: ${item.description}`);
    }

    window.editReturn = function (returnId) {
        alert(`Edit functionality would open for ${returnId}\n\n` +
            `In a real application, this would open a form to update the return status.`);
    }

    // Form submission handler
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const card = this.closest('.returns-card');
            const cardTitle = card.querySelector('h2').textContent;
            const formInputs = card.querySelectorAll('.form-input');
            let isValid = true;

            formInputs.forEach(input => {
                if (input.value.trim() === '' && input.required) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '#303f60';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }

            const newReturn = {
                id: "RET-2023-" + (100 + returnsData.length),
                description: "New " + cardTitle.toLowerCase(),
                type: cardTitle,
                status: "pending",
                date: new Date().toISOString().split('T')[0],
                amount: "$" + (Math.random() * 100 + 10).toFixed(2),
                product: "Sample Product"
            };

            returnsData.unshift(newReturn);
            populateReturnsTable();
            alert(`${cardTitle} processed successfully!\n\nThis would submit to your backend in a real application.`);
        });
    });

    // Initial table load
    populateReturnsTable();
});
