document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Mobile Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');

    if (openBtn && sidebar) {
        openBtn.addEventListener('click', () => {
            sidebar.classList.add('show');
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });

    // 2. Global Token Check (Safety fallback)
    const publicPages = ['/login.html', '/index.html', '/'];
    const currentPath = window.location.pathname;
    
    const isPublicPage = publicPages.some(page => currentPath.endsWith(page));
    
    if (!isPublicPage && typeof auth !== 'undefined' && !auth.getToken()) {
        window.location.href = '../login.html';
    }
});