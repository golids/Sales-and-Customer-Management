document.addEventListener('DOMContentLoaded', function () {

    const supabaseClient = supabase.createClient(
        'https://iradphcrwwokdrnhxpnd.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
    );

    document.getElementById('backBtn')?.addEventListener('click', () => {
        window.location.href = 'customer.html';
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    const addressForm = document.getElementById('addressForm');
    const addressTableBody = document.getElementById('addressTableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const formTitle = document.getElementById('formTitle');
    const cancelBtn = document.getElementById('cancelBtn');

    const addressTypes = {
        'home': 'Home',
        'work': 'Work',
        'other': 'Others'
    };

    async function fetchAddresses() {
        try {
            showLoading(true);

            const { data, error } = await supabaseClient
                .from('addresses')
                .select(`
                    addressid,
                    addrestype,
                    street,
                    zipcode,
                    createdat,
                    updatedat,
                    cities (cityname),
                    countries (name)
                `)
                .order('createdat', { ascending: false });
            if (error) {
        console.error('Supabase fetch error:', error); // 👈 Add this
        throw error;
        }
            if (error) throw error;

            renderAddressTable(data);
        } catch (error) {
            console.error('Error loading addresses:', error);
            alert('Failed to load addresses. See console for details.');
        } finally {
            showLoading(false);
        }
    }

    function renderAddressTable(addresses) {
        addressTableBody.innerHTML = '';

        if (!addresses || addresses.length === 0) {
            addressTableBody.innerHTML = '<tr><td colspan="6" class="no-data">No addresses found</td></tr>';
            return;
        }

        addresses.forEach(address => {
            const row = document.createElement('tr');

            const typeDisplay = addressTypes[address.addrestype] || 'Others';
            const typeClass = address.addrestype === 'home' ? 'home-badge' :
                address.addrestype === 'work' ? 'work-badge' : 'other-badge';

            row.innerHTML = `
                <td><span class="type-badge ${typeClass}">${typeDisplay}</span></td>
                <td>${address.street || ''}</td>
                <td>${address.cities?.cityname || ''}</td>
                <td>${address.countries?.name || ''}</td>
                <td>${address.zipcode || ''}</td>
                <td>
                    <button class="table-btn edit-btn" data-id="${address.addressid}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="table-btn delete-btn" data-id="${address.addressid}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            addressTableBody.appendChild(row);
        });

        addTableButtonListeners();
    }

    function addTableButtonListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const addressId = e.currentTarget.getAttribute('data-id');
                editAddress(addressId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const addressId = e.currentTarget.getAttribute('data-id');
                deleteAddress(addressId);
            });
        });
    }

    async function deleteAddress(addressId) {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            showLoading(true);

            const { error } = await supabaseClient
                .from('addresses')
                .delete()
                .eq('addressid', addressId);

            if (error) throw error;

            await fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address.');
        } finally {
            showLoading(false);
        }
    }

    addressForm?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            addrestype: document.getElementById('addressType').value,
            street: document.getElementById('street').value,
            zipcode: document.getElementById('zip').value,
            cityid: document.getElementById('city').value,
            countryid: document.getElementById('country').value,
            updatedat: new Date().toISOString()
        };

        try {
            showLoading(true);

            if (addressForm.dataset.mode === 'update') {
                const { error } = await supabaseClient
                    .from('addresses')
                    .update(formData)
                    .eq('addressid', addressForm.dataset.id);

                if (error) throw error;
            } else {
                formData.createdat = new Date().toISOString();

                const { error } = await supabaseClient
                    .from('addresses')
                    .insert(formData);

                if (error) throw error;
            }

            await fetchAddresses();
            resetForm();
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address.');
        } finally {
            showLoading(false);
        }
    });

    cancelBtn?.addEventListener('click', resetForm);

    function resetForm() {
        addressForm.reset();
        delete addressForm.dataset.mode;
        delete addressForm.dataset.id;
        formTitle.textContent = 'Add New Address';
    }

    function showLoading(show) {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }

    // Call fetch on load
    fetchAddresses();

});