const API_BASE_URL = 'http://localhost:8080/api';

const auth = {
    setToken: (token) => localStorage.setItem('jwt_token', token),
    getToken: () => localStorage.getItem('jwt_token'),
    setRole: (role) => localStorage.setItem('user_role', role),
    getRole: () => localStorage.getItem('user_role'),
    clear: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_role');
    }
};

async function fetchAPI(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = auth.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (response.status === 401 || response.status === 403) {
            auth.clear();
            window.location.href = '/login.html';
            throw new Error('Session expired or unauthorized access.');
        }

        if (response.status === 204) {
            return null; // No content on successful delete
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw responseData; // Pass backend ErrorResponse structure
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// API Methods mapped directly to Spring Boot Endpoints
const api = {
    // Auth
    login: (credentials) => fetchAPI('/auth/login', 'POST', credentials),
    
    // Dashboard
    getDashboardSummary: () => fetchAPI('/dashboard/summary', 'GET'),
    
    // Notices
    getActiveNotices: () => fetchAPI('/notices/active', 'GET'),
    
    // Students
    getStudents: () => fetchAPI('/students', 'GET'),
    addStudent: (data) => fetchAPI('/students', 'POST', data),
    
    // Faculty
    getFaculty: () => fetchAPI('/faculty', 'GET'),
    
    // Attendance
    markAttendance: (data) => fetchAPI('/attendance', 'POST', data),
    getAttendanceSummary: (usn) => fetchAPI(`/attendance/summary/${usn}`, 'GET')
};

// Global Toast Notification Utility
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const toastHtml = `
        <div class="toast align-items-center text-white ${bgClass} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
}