// DOM Elements
const elements = {
    backBtn: document.getElementById('backBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    trackOrderBtn: document.getElementById('trackOrderBtn'),
    bulkUpdateBtn: document.getElementById('bulkUpdateBtn'),
    notificationBtn: document.getElementById('notificationBtn'),
    orderSearchInput: document.getElementById('orderSearchInput'),
    statusSelect: document.getElementById('statusSelect'),
    ordersTable: document.getElementById('ordersTable'),
    orderModal: document.getElementById('orderModal'),
    closeModalBtn: document.querySelector('.close-btn'),
    orderDetailsContent: document.getElementById('orderDetailsContent'),
    statusSteps: document.querySelectorAll('.status-step')
};

// Initialize Supabase client
const supabaseClient = supabase.createClient(
    'https://iradphcrwwokdrnhxpnd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
);

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        await loadOrders();
        setupEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize application');
    }
}

function setupEventListeners() {
    // Navigation buttons
    elements.backBtn.addEventListener('click', () => window.location.href = '/dashboard.html');
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Order actions
    elements.trackOrderBtn.addEventListener('click', trackOrder);
    elements.bulkUpdateBtn.addEventListener('click', bulkUpdateStatus);
    elements.notificationBtn.addEventListener('click', openNotificationSettings);
    
    // Modal close button
    elements.closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    elements.orderModal.addEventListener('click', (e) => {
        if (e.target === elements.orderModal) {
            closeModal();
        }
    });
    
    // Status step click handlers
    elements.statusSteps.forEach(step => {
        step.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            filterOrdersByStatus(status);
        });
    });
}

// ========== ORDER FUNCTIONS ========== //
async function loadOrders() {
    const tbody = elements.ordersTable.querySelector('tbody');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading orders...</td></tr>';
        
        const { data, error } = await supabaseClient
            .from('orders')
            .select(`
                order_id,
                status,
                subtotal,
                tax_amount,
                discount_amount,
                total_amount,
                created_at,
                shipping_address
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No orders found.</td></tr>';
            return;
        }
        
        renderOrdersTable(data);
    } catch (error) {
        console.error('Error loading orders:', error);
        showError('Failed to load orders data');
    }
}

function renderOrdersTable(orders) {
    const tbody = elements.ordersTable.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const shipping = order.shipping_address ? JSON.parse(order.shipping_address) : {};
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>
                <strong>${shipping.name || 'No name'}</strong>
                <br><small>${shipping.city || ''}, ${shipping.state || ''}</small>
            </td>
            <td>${renderOrderStatusBadge(order.status || 'pending')}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${formatCurrency(order.total_amount)}</td>
            <td>
                <button class="table-action view-btn" data-order-id="${order.order_id}">View</button>
                <button class="table-action edit-btn" data-order-id="${order.order_id}">Edit</button>
                <button class="table-action delete-btn" data-order-id="${order.order_id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => viewOrderDetails(e.target.dataset.orderId));
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editOrder(e.target.dataset.orderId));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteOrder(e.target.dataset.orderId));
    });
}

async function filterOrdersByStatus(status) {
    const tbody = elements.ordersTable.querySelector('tbody');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading orders...</td></tr>';
        
        const { data, error } = await supabaseClient
            .from('orders')
            .select(`
                order_id,
                status,
                subtotal,
                tax_amount,
                discount_amount,
                total_amount,
                created_at,
                shipping_address
            `)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No ${status} orders found.</td></tr>`;
            return;
        }
        
        renderOrdersTable(data);
        updateStatusProgress(status);
    } catch (error) {
        console.error('Error filtering orders:', error);
        showError('Failed to filter orders by status');
    }
}

async function trackOrder() {
    const orderId = elements.orderSearchInput.value.trim();
    if (!orderId) {
        showError('Please enter an Order ID');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();

        if (error || !data) throw error || new Error('Order not found');
        
        viewOrderDetails(data.order_id);
        updateStatusProgress(data.status);
    } catch (error) {
        showError('Order not found: ' + error.message);
    }
}

async function bulkUpdateStatus() {
    const selectedStatus = elements.statusSelect.value;
    
    if (!selectedStatus) {
        showError('Please select a status');
        return;
    }

    // Get all checked orders (you would need checkboxes in your table)
    const checkedOrders = Array.from(document.querySelectorAll('#ordersTable input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (checkedOrders.length === 0) {
        showError('Please select at least one order');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({ status: selectedStatus })
            .in('order_id', checkedOrders);

        if (error) throw error;
        
        showSuccess(`${checkedOrders.length} orders updated to ${selectedStatus}`);
        await loadOrders();
    } catch (error) {
        console.error('Bulk update error:', error);
        showError('Failed to update orders: ' + error.message);
    }
}

// ========== ORDER DETAILS ========== //
async function viewOrderDetails(orderId) {
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();

        if (error || !data) throw error || new Error('Order not found');
        
        renderOrderDetails(data);
        updateStatusProgress(data.status);
        openModal();
    } catch (error) {
        showError('Failed to load order details: ' + error.message);
    }
}

function renderOrderDetails(order) {
    const items = order.items ? JSON.parse(order.items) : [];
    const shipping = order.shipping_address ? JSON.parse(order.shipping_address) : {};
    
    elements.orderDetailsContent.innerHTML = `
        <h2>Order #${order.order_id}</h2>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${renderOrderStatusBadge(order.status)}</span>
        </div>
        
        <div class="detail-section">
            <h3>Customer Information</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${shipping.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">
                    ${shipping.address1 || ''}<br>
                    ${shipping.address2 || ''}<br>
                    ${shipping.city || ''}, ${shipping.state || ''} ${shipping.zip || ''}
                </span>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Order Summary</h3>
            <div class="detail-row">
                <span class="detail-label">Subtotal:</span>
                <span class="detail-value">${formatCurrency(order.subtotal)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tax:</span>
                <span class="detail-value">${formatCurrency(order.tax_amount)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Discount:</span>
                <span class="detail-value">-${formatCurrency(order.discount_amount)}</span>
            </div>
            <div class="detail-row total-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value">${formatCurrency(order.total_amount)}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Order Items</h3>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.name || 'Unknown Item'}</td>
                            <td>${item.quantity || 1}</td>
                            <td>${formatCurrency(item.price || 0)}</td>
                            <td>${formatCurrency((item.quantity || 1) * (item.price || 0))}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== STATUS TRACKER ========== //
function updateStatusProgress(status) {
    // Clear all active statuses
    elements.statusSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Activate up to current status
    const statusOrder = ['pending', 'confirmed', 'partially_shipped', 'shipped', 'invoiced', 'canceled'];
    const currentIndex = statusOrder.indexOf(status);
    
    if (currentIndex >= 0) {
        for (let i = 0; i <= currentIndex; i++) {
            document.querySelector(`.status-step[data-status="${statusOrder[i]}"]`).classList.add('active');
        }
    }
}

// ========== MODAL FUNCTIONS ========== //
function openModal() {
    elements.orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ========== HELPER FUNCTIONS ========== //
function renderOrderStatusBadge(status) {
    const badgeMap = {
        pending: ['Pending', 'status-pending'],
        confirmed: ['Confirmed', 'status-confirmed'],
        partially_shipped: ['Partially Shipped', 'status-processing'],
        shipped: ['Shipped', 'status-shipped'],
        invoiced: ['Invoiced', 'status-completed'],
        canceled: ['Canceled', 'status-rejected'],
        completed: ['Completed', 'status-completed']
    };
    const [label, className] = badgeMap[status.toLowerCase()] || ['Unknown', ''];
    return `<span class="status-badge ${className}">${label}</span>`;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
        return 'N/A';
    }
}

function formatCurrency(amount) {
    return amount ? `$${parseFloat(amount).toFixed(2)}` : '$0.00';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 5000);
}

// ========== OTHER FUNCTIONS ========== //
function handleLogout() {
    // Implement logout logic
    window.location.href = '/login.html';
}

function editOrder(orderId) {
    window.location.href = `/edit-order.html?id=${orderId}`;
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('orders')
            .delete()
            .eq('order_id', orderId);

        if (error) throw error;
        
        showSuccess('Order deleted successfully!');
        await loadOrders();
    } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete order: ' + error.message);
    }
}

function openNotificationSettings() {
    alert('Notification settings would open here');
    // Implement notification settings modal
}