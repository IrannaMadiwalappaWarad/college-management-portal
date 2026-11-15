let studentModal;
let allStudents = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = auth.getToken();
    if (!token || auth.getRole() !== 'ADMIN') {
        auth.clear();
        window.location.href = '../login.html';
        return;
    }

    // Initialize Bootstrap Modal
    studentModal = new bootstrap.Modal(document.getElementById('studentModal'));

    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('dropdownLogout').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('saveStudentBtn').addEventListener('click', saveStudent);
    
    // Live Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allStudents.filter(s => 
            s.name.toLowerCase().includes(searchTerm) || 
            s.usn.toLowerCase().includes(searchTerm)
        );
        renderTable(filtered);
    });

    // Initial Load
    fetchStudents();
});

async function fetchStudents() {
    try {
        allStudents = await api.getStudents();
        renderTable(allStudents);
    } catch (error) {
        showToast('Failed to load students', 'error');
        document.getElementById('studentTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load data.</td></tr>`;
    }
}

function renderTable(students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No students found.</td></tr>`;
        return;
    }

    students.forEach(student => {
        const statusBadge = student.status === 'ACTIVE' ? 'bg-light-success' : 'bg-light-danger';
        
        const row = `
            <tr>
                <td class="fw-semibold text-dark">${student.usn}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center me-3" style="width: 35px; height: 35px; font-weight:600;">
                            ${student.name.charAt(0)}
                        </div>
                        ${student.name}
                    </div>
                </td>
                <td>${student.department}</td>
                <td>Sem ${student.semester} - ${student.section}</td>
                <td class="text-muted">${student.email}</td>
                <td><span class="badge ${statusBadge} border-0 px-2 py-1">${student.status}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light text-primary me-2" onclick="editStudent('${student.id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light text-danger" onclick="deleteStudent('${student.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function openStudentModal() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Student';
    studentModal.show();
}

async function editStudent(id) {
    const student = allStudents.find(s => s.id === id);
    if (!student) return;

    document.getElementById('studentId').value = student.id;
    document.getElementById('usn').value = student.usn;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('department').value = student.department;
    document.getElementById('semester').value = student.semester;
    document.getElementById('section').value = student.section;
    document.getElementById('status').value = student.status;
    
    document.getElementById('modalTitle').innerText = 'Edit Student';
    studentModal.show();
}

async function saveStudent() {
    const form = document.getElementById('studentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('studentId').value;
    const studentData = {
        usn: document.getElementById('usn').value.toUpperCase(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        semester: parseInt(document.getElementById('semester').value),
        section: document.getElementById('section').value.toUpperCase(),
        status: document.getElementById('status').value
    };

    const btn = document.getElementById('saveStudentBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
    btn.disabled = true;

    try {
        if (id) {
            // PUT request requires the ID in the URL, but our api.js setup currently only maps generic POST. 
            // We'll use the raw fetchAPI function for PUT:
            await fetchAPI(`/students/${id}`, 'PUT', studentData);
            showToast('Student updated successfully');
        } else {
            await api.addStudent(studentData);
            showToast('Student added successfully');
        }
        
        studentModal.hide();
        fetchStudents(); // Refresh table
    } catch (error) {
        showToast(error.message || 'Error saving student', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    
    try {
        await fetchAPI(`/students/${id}`, 'DELETE');
        showToast('Student deleted successfully');
        fetchStudents();
    } catch (error) {
        showToast(error.message || 'Failed to delete student', 'error');
    }
}