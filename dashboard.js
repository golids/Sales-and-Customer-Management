document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation buttons
    const navButtons = {
        customerAccount: document.getElementById('customerAccountBtn'),
        salesTransaction: document.getElementById('salesTransactionBtn'),
        promotions: document.getElementById('promotionsBtn'),
        orderTracking: document.getElementById('orderTrackingBtn'),
        returns: document.getElementById('returnsBtn'),
        salesTrends: document.getElementById('salesTrendsBtn'),
        priceTrends: document.getElementById('priceTrendsBtn')
    };

    // Get the content area
    const contentArea = document.getElementById('dashboardContent');
    
    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'index.html'; // Redirect to login page
    });

    // Function to update content area
    function updateContent(title, description) {
        contentArea.innerHTML = `
            <div class="section-content">
                <h2>${title}</h2>
                <p>${description}</p>
                <div class="content-placeholder">
                    <!-- In a real app, this would contain actual content -->
                    <p>This section would display ${title} information and functionality.</p>
                </div>
            </div>
        `;
    }

    // Add click event listeners to all navigation buttons
    navButtons.customerAccount.addEventListener('click', function() {
        window.location.href = 'customer.html'; // Redirect to customer account page
    });

    navButtons.salesTransaction.addEventListener('click', function() {
        window.location.href = 'sales.html'; // Redirect to Sales Transaction page
    });

    navButtons.promotions.addEventListener('click', function() {
        window.location.href = 'promotions.html';
    });

    navButtons.orderTracking.addEventListener('click', function() {
        window.location.href = 'order.html';
    });

    navButtons.returns.addEventListener('click', function() {
        window.location.href = 'returns.html';
    });

    navButtons.salesTrends.addEventListener('click', function() {
        window.location.href = 'sales-trends.html';
    });

    navButtons.priceTrends.addEventListener('click', function() {
        window.location.href = 'price-trends.html';
    });

    // Add hover effects to buttons
    Object.values(navButtons).forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.border = '2px solid #64ffda';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.border = 'none';
        });
    });
});