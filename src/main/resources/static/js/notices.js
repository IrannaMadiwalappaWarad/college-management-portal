let noticeModal;
let allNotices = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = auth.getToken();
    if (!token || auth.getRole() !== 'ADMIN') {
        auth.clear();
        window.location.href = '../login.html';
        return;
    }

    noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'));

    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('dropdownLogout').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('saveNoticeBtn').addEventListener('click', saveNotice);
    
    // Live Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allNotices.filter(n => n.title.toLowerCase().includes(searchTerm));
        renderTable(filtered);
    });

    fetchNotices();
});

async function fetchNotices() {
    try {
        // Fetch ALL notices for admin management
        allNotices = await fetchAPI('/notices', 'GET');
        renderTable(allNotices);
    } catch (error) {
        showToast('Failed to load notices', 'error');
        document.getElementById('noticeTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load data.</td></tr>`;
    }
}

function renderTable(notices) {
    const tbody = document.getElementById('noticeTableBody');
    tbody.innerHTML = '';

    if (notices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No notices found.</td></tr>`;
        return;
    }

    notices.forEach(notice => {
        const statusBadge = notice.status === 'ACTIVE' ? 'bg-light-success' : 'bg-light-danger';
        
        // Format dates for display
        const pubDate = new Date(notice.publishDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        const expDate = new Date(notice.expiryDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        
        const row = `
            <tr>
                <td>
                    <div class="fw-semibold text-dark">${notice.title}</div>
                    <div class="text-muted small text-truncate" style="max-width: 250px;">${notice.description}</div>
                </td>
                <td><span class="badge bg-light text-secondary border">${notice.category}</span></td>
                <td>${notice.audience}</td>
                <td class="small">${pubDate}</td>
                <td class="small">${expDate}</td>
                <td><span class="badge ${statusBadge} border-0 px-2 py-1">${notice.status}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light text-primary me-2" onclick="editNotice('${notice.id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light text-danger" onclick="deleteNotice('${notice.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function openNoticeModal() {
    document.getElementById('noticeForm').reset();
    document.getElementById('noticeId').value = '';
    
    // Set default dates (Today to Next Month)
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);
    
    // Format to YYYY-MM-DDThh:mm for the input fields
    document.getElementById('publishDate').value = now.toISOString().slice(0, 16);
    document.getElementById('expiryDate').value = nextMonth.toISOString().slice(0, 16);
    
    document.getElementById('modalTitle').innerText = 'Create New Notice';
    noticeModal.show();
}

async function editNotice(id) {
    const notice = allNotices.find(n => n.id === id);
    if (!notice) return;

    document.getElementById('noticeId').value = notice.id;
    document.getElementById('title').value = notice.title;
    document.getElementById('description').value = notice.description;
    document.getElementById('category').value = notice.category;
    document.getElementById('audience').value = notice.audience;
    document.getElementById('publishedBy').value = notice.publishedBy;
    document.getElementById('status').value = notice.status;
    
    // Slice off seconds/milliseconds so it fits in the datetime-local input
    document.getElementById('publishDate').value = notice.publishDate.slice(0, 16);
    document.getElementById('expiryDate').value = notice.expiryDate.slice(0, 16);
    
    document.getElementById('modalTitle').innerText = 'Edit Notice';
    noticeModal.show();
}

async function saveNotice() {
    const form = document.getElementById('noticeForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('noticeId').value;
    
    // Ensure seconds are attached for Spring Boot's LocalDateTime parsing
    let pubDate = document.getElementById('publishDate').value;
    let expDate = document.getElementById('expiryDate').value;
    if (pubDate.length === 16) pubDate += ':00';
    if (expDate.length === 16) expDate += ':00';

    const noticeData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        audience: document.getElementById('audience').value,
        publishedBy: document.getElementById('publishedBy').value,
        publishDate: pubDate,
        expiryDate: expDate,
        status: document.getElementById('status').value
    };

    const btn = document.getElementById('saveNoticeBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
    btn.disabled = true;

    try {
        if (id) {
            await fetchAPI(`/notices/${id}`, 'PUT', noticeData);
            showToast('Notice updated successfully');
        } else {
            await fetchAPI('/notices', 'POST', noticeData);
            showToast('Notice created successfully');
        }
        
        noticeModal.hide();
        fetchNotices(); 
    } catch (error) {
        showToast(error.message || 'Error saving notice', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function deleteNotice(id) {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
        await fetchAPI(`/notices/${id}`, 'DELETE');
        showToast('Notice deleted successfully');
        fetchNotices();
    } catch (error) {
        showToast(error.message || 'Failed to delete notice', 'error');
    }
}