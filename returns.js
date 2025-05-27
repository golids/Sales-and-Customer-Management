// Initialize Supabase client
const supabaseClient = supabase.createClient(
  'https://iradphcrwwokdrnhxpnd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
);

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
  try {
    setupNavigation();
    await loadReturns();
    setupActionButtons();
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to initialize application');
  }
});

function setupNavigation() {
  document.getElementById('dashboardBtn').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

async function loadReturns() {
  const tbody = document.querySelector('#returnsTable tbody');
  if (!tbody) return;

  try {
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading data...</td></tr>';
    
    const { data, error } = await supabaseClient
      .from('returns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="loading">No return records found</td></tr>';
      return;
    }
    
    renderReturnsTable(data);
  } catch (error) {
    console.error('Error loading returns:', error);
    showError('Failed to load returns data');
  }
}

function renderReturnsTable(data) {
  const tbody = document.querySelector('#returnsTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.rma_number || `RET-${item.id.slice(0, 8)}`}</td>
      <td>
        <strong>${item.reason || 'No description'}</strong>
        ${item.product ? `<br><small>Product: ${item.product}</small>` : ''}
      </td>
      <td>${getRequestType(item)}</td>
      <td>${renderStatusBadge(item.status || 'pending')}</td>
      <td>${formatDate(item.created_at)}</td>
      <td>${formatCurrency(item.amount)}</td>
      <td>
        <span class="table-action" onclick="viewDetails('${item.id}')">View</span>
        <span class="table-action" onclick="editReturn('${item.id}')">Edit</span>
        <span class="table-action delete-action" onclick="deleteReturn('${item.id}')">Delete</span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function getRequestType(item) {
  if (item.request_type) {
    return item.request_type.charAt(0).toUpperCase() + item.request_type.slice(1);
  }
  return item.ticket_id ? 'Complaint' : 'Return';
}

function renderStatusBadge(status) {
  const statusText = status.toLowerCase();
  const badgeMap = {
    pending: ['Pending', 'status-pending'],
    completed: ['Completed', 'status-completed'],
    rejected: ['Rejected', 'status-rejected'],
    processed: ['Processed', 'status-completed']
  };
  
  const [label, className] = badgeMap[statusText] || ['Unknown', ''];
  return `<span class="status-badge ${className}">${label}</span>`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
}

function formatCurrency(amount) {
  return amount ? `$${parseFloat(amount).toFixed(2)}` : '$0.00';
}

function showError(message) {
  const tbody = document.querySelector('#returnsTable tbody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" class="error-message">${message}</td></tr>`;
  } else {
    alert(message);
  }
}

function setupActionButtons() {
  document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const card = e.target.closest('.card');
      
      const customerInput = card.querySelector('[placeholder="Customer ID"]');
      const reasonInput = card.querySelector('textarea');
      
      if (!customerInput || !reasonInput) {
        showError('Form elements missing');
        return;
      }

      if ((!customerInput.value || !reasonInput.value) && !e.target.textContent.includes('Refund')) {
        showError('Please fill in all required fields');
        return;
      }

      const requestType = card.querySelector('h2').textContent.trim().toLowerCase();
      
      try {
        const { error } = await supabaseClient
          .from('returns')
          .insert([{
            customer_id: customerInput.value,
            reason: reasonInput.value,
            status: 'pending',
            rma_number: `RMA-${Date.now()}`,
            request_type: requestType,
            amount: (Math.random() * 100).toFixed(2)
          }]);

        if (error) throw error;
        
        alert(`${requestType} submitted successfully!`);
        await loadReturns();
        
        // Clear form
        customerInput.value = '';
        reasonInput.value = '';
      } catch (error) {
        console.error('Submission error:', error);
        showError(`Failed to submit ${requestType}: ${error.message}`);
      }
    });
  });
}

// Global action handlers
window.viewDetails = async (id) => {
  try {
    const { data, error } = await supabaseClient
      .from('returns')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw error || new Error('Return not found');
    
    alert(`Return #${data.rma_number || id}\n\n` +
          `Type: ${getRequestType(data)}\n` +
          `Status: ${data.status}\n` +
          `Customer: ${data.customer_id || 'N/A'}\n` +
          `Reason: ${data.reason || 'N/A'}\n` +
          `Amount: ${formatCurrency(data.amount)}\n` +
          `Date: ${formatDate(data.created_at)}`);
  } catch (error) {
    showError('Failed to load details: ' + error.message);
  }
};

window.editReturn = (id) => {
  alert(`Edit functionality for return ${id} would open here`);
};

window.deleteReturn = async (id) => {
  if (!confirm('Are you sure you want to delete this return?')) return;
  
  try {
    const { error } = await supabaseClient
      .from('returns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    alert('Return deleted successfully');
    await loadReturns();
  } catch (error) {
    showError('Failed to delete return: ' + error.message);
  }
};