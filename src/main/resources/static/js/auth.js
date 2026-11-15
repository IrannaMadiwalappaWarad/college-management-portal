document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Redirect if already logged in
    if (auth.getToken()) {
        redirectBasedOnRole(auth.getRole());
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Set Loading State
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...';
            submitBtn.disabled = true;

            try {
                const response = await api.login({ email, password });
                
                // Store JWT and Role
                auth.setToken(response.token);
                auth.setRole(response.role);
				localStorage.setItem('user_email', response.email);
				
                showToast('Login successful!', 'success');
                setTimeout(() => redirectBasedOnRole(response.role), 1000);
                
            } catch (error) {
                const errorMsg = error.message || 'Invalid email or password';
                showToast(errorMsg, 'error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

function redirectBasedOnRole(role) {
    if (role === 'ADMIN') {
        window.location.href = '/pages/admin-dashboard.html';
    } else if (role === 'FACULTY') {
        window.location.href = '/pages/faculty-dashboard.html';
    } else {
        window.location.href = '/pages/student-dashboard.html';
    }
}

function logout() {
    auth.clear();
    window.location.href = '/login.html';
}