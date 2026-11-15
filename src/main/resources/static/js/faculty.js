let facultyModal;
let allFaculty = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = auth.getToken();
    if (!token || auth.getRole() !== 'ADMIN') {
        auth.clear();
        window.location.href = '../login.html';
        return;
    }

    facultyModal = new bootstrap.Modal(document.getElementById('facultyModal'));

    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('dropdownLogout').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('saveFacultyBtn').addEventListener('click', saveFaculty);
    
    // Live Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allFaculty.filter(f => 
            f.name.toLowerCase().includes(searchTerm) || 
            f.employeeId.toLowerCase().includes(searchTerm)
        );
        renderTable(filtered);
    });

    fetchFaculty();
});

async function fetchFaculty() {
    try {
        allFaculty = await api.getFaculty();
        renderTable(allFaculty);
    } catch (error) {
        showToast('Failed to load faculty', 'error');
        document.getElementById('facultyTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load data.</td></tr>`;
    }
}

function renderTable(facultyList) {
    const tbody = document.getElementById('facultyTableBody');
    tbody.innerHTML = '';

    if (facultyList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No faculty found.</td></tr>`;
        return;
    }

    facultyList.forEach(faculty => {
        let statusBadge = 'bg-light-success';
        if (faculty.status === 'INACTIVE') statusBadge = 'bg-light-danger';
        if (faculty.status === 'ON_LEAVE') statusBadge = 'bg-light-warning';
        
        const row = `
            <tr>
                <td class="fw-semibold text-dark">${faculty.employeeId}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex justify-content-center align-items-center me-3" style="width: 35px; height: 35px; font-weight:600;">
                            ${faculty.name.charAt(0)}
                        </div>
                        ${faculty.name}
                    </div>
                </td>
                <td>${faculty.designation}</td>
                <td>${faculty.department}</td>
                <td class="text-muted">${faculty.email}</td>
                <td><span class="badge ${statusBadge} border-0 px-2 py-1">${faculty.status.replace('_', ' ')}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light text-primary me-2" onclick="editFaculty('${faculty.id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light text-danger" onclick="deleteFaculty('${faculty.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function openFacultyModal() {
    document.getElementById('facultyForm').reset();
    document.getElementById('facultyId').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Faculty';
    facultyModal.show();
}

async function editFaculty(id) {
    const faculty = allFaculty.find(f => f.id === id);
    if (!faculty) return;

    document.getElementById('facultyId').value = faculty.id;
    document.getElementById('employeeId').value = faculty.employeeId;
    document.getElementById('name').value = faculty.name;
    document.getElementById('email').value = faculty.email;
    document.getElementById('phone').value = faculty.phone;
    document.getElementById('department').value = faculty.department;
    document.getElementById('designation').value = faculty.designation;
    document.getElementById('status').value = faculty.status;
    
    document.getElementById('modalTitle').innerText = 'Edit Faculty';
    facultyModal.show();
}

async function saveFaculty() {
    const form = document.getElementById('facultyForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('facultyId').value;
    const facultyData = {
        employeeId: document.getElementById('employeeId').value.toUpperCase(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        designation: document.getElementById('designation').value,
        status: document.getElementById('status').value
    };

    const btn = document.getElementById('saveFacultyBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
    btn.disabled = true;

    try {
        if (id) {
            await fetchAPI(`/faculty/${id}`, 'PUT', facultyData);
            showToast('Faculty updated successfully');
        } else {
            await fetchAPI('/faculty', 'POST', facultyData);
            showToast('Faculty added successfully');
        }
        
        facultyModal.hide();
        fetchFaculty(); 
    } catch (error) {
        showToast(error.message || 'Error saving faculty', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function deleteFaculty(id) {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    
    try {
        await fetchAPI(`/faculty/${id}`, 'DELETE');
        showToast('Faculty deleted successfully');
        fetchFaculty();
    } catch (error) {
        showToast(error.message || 'Failed to delete faculty', 'error');
    }
}