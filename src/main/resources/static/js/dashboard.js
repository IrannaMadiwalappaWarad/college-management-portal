document.addEventListener('DOMContentLoaded', async () => {
    const token = auth.getToken();
    const role = auth.getRole();
    
    if (!token || role !== 'ADMIN') {
        auth.clear();
        window.location.href = '../login.html';
        return;
    }

    // Populate Topbar Profile Data
    const email = localStorage.getItem('user_email') || 'admin@college.edu';
    const namePrefix = email.split('@')[0];
    document.getElementById('topbarName').innerText = namePrefix;
    document.getElementById('topbarRole').innerText = role;
    document.getElementById('topbarAvatar').src = `https://ui-avatars.com/api/?name=${namePrefix}&background=6655D9&color=fff`;

    // Handle Logout
    const handleLogout = (e) => {
        e.preventDefault();
        auth.clear();
        window.location.href = '../login.html';
    };
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('dropdownLogout').addEventListener('click', handleLogout);

    // Global Search Logic
    const searchInput = document.getElementById('dashboardSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.toLowerCase();
                
                // Smart Routing based on keywords
                if (query.includes('student')) {
                    window.location.href = 'students.html';
                } else if (query.includes('faculty') || query.includes('teacher')) {
                    window.location.href = 'faculty.html';
                } else if (query.includes('attend')) {
                    window.location.href = 'attendance.html';
                } else {
                    // Filter Notices visually on the dashboard
                    const notices = document.querySelectorAll('.notice-item');
                    let found = false;
                    notices.forEach(notice => {
                        if (notice.innerText.toLowerCase().includes(query)) {
                            notice.style.display = 'block';
                            found = true;
                        } else {
                            notice.style.display = 'none';
                        }
                    });
                    if(!found) showToast('No notices match your search.', 'warning');
                }
            }
        });
    }

    try {
        const [dashboardData, noticesData] = await Promise.all([
            api.getDashboardSummary(),
            api.getActiveNotices()
        ]);

        document.getElementById('statTotalStudents').innerText = dashboardData.totalStudents;
        document.getElementById('statTotalFaculty').innerText = dashboardData.totalFaculty;
        document.getElementById('statActiveNotices').innerText = dashboardData.activeNotices;
        document.getElementById('statTodayAttendance').innerText = dashboardData.todayAttendance.presentCount;

        renderAttendanceChart(dashboardData.todayAttendance);
        renderNotices(noticesData);

    } catch (error) {
        console.error("Failed to load dashboard data", error);
    }
});

function renderAttendanceChart(attendanceData) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // If no attendance marked today, show a grey placeholder
    const total = attendanceData.totalMarked;
    const data = total === 0 ? [1] : [
        attendanceData.presentCount,
        attendanceData.absentCount,
        attendanceData.lateCount
    ];
    const bgColors = total === 0 ? ['#E2E8F0'] : ['#27AE75', '#E85B65', '#F4A340'];
    const labels = total === 0 ? ['No Data'] : ['Present', 'Absent', 'Late'];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColors,
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}

function renderNotices(notices) {
    const noticeContainer = document.getElementById('noticeBoardList');
    noticeContainer.innerHTML = ''; // Clear loading spinner

    if (notices.length === 0) {
        noticeContainer.innerHTML = '<p class="text-muted text-center py-4">No active notices available.</p>';
        return;
    }

    notices.forEach(notice => {
        // Assign a CSS class based on category for color coding
        let borderClass = '';
        if (notice.category === 'Examination') borderClass = 'exam';
        if (notice.category === 'Events') borderClass = 'event';

        // Format Date
        const dateObj = new Date(notice.publishDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const noticeHtml = `
            <div class="notice-item ${borderClass}">
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <h6 class="fw-semibold mb-0 text-dark">${notice.title}</h6>
                    <span class="badge bg-light text-secondary border">${notice.category}</span>
                </div>
                <p class="text-muted small mb-2 text-truncate">${notice.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted"><i class="bi bi-calendar3 me-1"></i> ${formattedDate}</small>
                    <a href="#" class="text-primary text-decoration-none small fw-medium">View Details</a>
                </div>
            </div>
        `;
        noticeContainer.insertAdjacentHTML('beforeend', noticeHtml);
    });
}