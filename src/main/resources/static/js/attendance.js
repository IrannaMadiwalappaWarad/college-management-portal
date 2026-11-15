let loadedStudents = [];

// 1. Subject Database
const subjectDatabase = {
    "CSE": {
        1: ["Engineering Physics", "Engineering Calculus", "Basic Electronics", "Engineering Mechanics", "English"],
        2: ["Engineering Chemistry", "Advanced Calculus", "C Programming", "Electrical Engineering", "CAD"],
        3: ["Data Structures", "Analog & Digital Electronics", "Computer Organization", "Discrete Mathematics", "OOP with C++"],
        4: ["Design & Analysis of Algorithms", "Operating Systems", "Microcontrollers", "DBMS", "Data Communication"],
        5: ["Software Engg and Project Mangmt", "Computer Networks (CN)", "Theory of Computation (TOC)", "Artificial Intelligence (AI)", "Research Methodology (RMIP)"],
        6: ["Machine Learning", "Compiler Design", "Web Technologies", "Cryptography", "Software Testing"],
        7: ["Cloud Computing", "Big Data Analytics", "User Interface Design", "Internet of Things", "Network Security"],
        8: ["Internship", "Technical Seminar", "Project Work Phase-1", "Project Work Phase-2", "System Modeling"]
    },
    "DEFAULT": {
        1: ["Engineering Physics", "Engineering Calculus", "Basic Electronics", "Engineering Mechanics", "English"],
        2: ["Engineering Chemistry", "Advanced Calculus", "C Programming", "Electrical Engineering", "CAD"],
        3: ["Data Structures", "Analog & Digital Electronics", "Computer Organization", "Discrete Mathematics", "OOP with C++"],
        4: ["Design & Analysis of Algorithms", "Operating Systems", "Microcontrollers", "DBMS", "Data Communication"],
        5: ["Software Engg and Project Mangmt", "Computer Networks (CN)", "Theory of Computation (TOC)", "Artificial Intelligence (AI)", "Research Methodology (RMIP)"],
        6: ["Machine Learning", "Compiler Design", "Web Technologies", "Cryptography", "Software Testing"],
        7: ["Cloud Computing", "Big Data Analytics", "User Interface Design", "Internet of Things", "Network Security"],
        8: ["Internship", "Technical Seminar", "Project Work Phase-1", "Project Work Phase-2", "System Modeling"]
    }
};

// 2. Initialization on Page Load
document.addEventListener('DOMContentLoaded', async () => {
    const token = auth.getToken();
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    // Set today's date automatically
    document.getElementById('attendanceDate').valueAsDate = new Date();

    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    document.getElementById('dropdownLogout').addEventListener('click', () => auth.clear() || (window.location.href = '../login.html'));
    
    document.getElementById('attendanceFilterForm').addEventListener('submit', loadStudentsForAttendance);
    document.getElementById('submitAttendanceBtn').addEventListener('click', submitBulkAttendance);
    document.getElementById('deptSelect').addEventListener('change', populateSubjects);
    document.getElementById('semSelect').addEventListener('change', populateSubjects);

    // FETCH FACULTY IMMEDIATELY ON LOAD
    await populateFacultyDropdown();
});

// 3. Fetch Faculty from Backend
async function populateFacultyDropdown() {
    try {
        const facultyList = await api.getFaculty();
        const select = document.getElementById('facultySelect');
        
        // Reset dropdown
        select.innerHTML = '<option value="">Select your name...</option>';
        
        // Inject faculty from database
        facultyList.forEach(f => {
            const option = document.createElement('option');
            option.value = f.id; // Uses the MongoDB ID to link attendance properly
            option.textContent = `${f.name} (${f.department})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading faculty", error);
        showToast('Error loading faculty list', 'error');
    }
}

// 4. Dynamic Subject Population
function populateSubjects() {
    const dept = document.getElementById('deptSelect').value;
    const sem = document.getElementById('semSelect').value;
    const subjectDropdown = document.getElementById('subjectName');
    
    subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
    
    if (dept && sem) {
        const deptSubjects = subjectDatabase[dept] || subjectDatabase["DEFAULT"];
        const semSubjects = deptSubjects[sem] || [];
        
        semSubjects.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subjectDropdown.appendChild(option);
        });
    }
}

// 5. Load and Filter Students
async function loadStudentsForAttendance(e) {
    e.preventDefault();
    
    const dept = document.getElementById('deptSelect').value;
    const sem = document.getElementById('semSelect').value;
    const sec = document.getElementById('secSelect').value.toUpperCase();
    const btn = document.getElementById('loadStudentsBtn');

    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btn.disabled = true;

    try {
        const allStudents = await api.getStudents();
        
        loadedStudents = allStudents.filter(student => 
            student.department === dept && 
            student.semester == sem && 
            student.section === sec
        );
        
        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = '';

        if (loadedStudents.length === 0) {
            showToast('No students found for this class.', 'error');
            document.getElementById('attendanceListCard').style.display = 'none';
            return;
        }

        loadedStudents.forEach((student, index) => {
            const row = `
                <tr data-student-id="${student.id}" data-student-usn="${student.usn}" data-student-name="${student.name}">
                    <td class="fw-semibold">${student.usn}</td>
                    <td>${student.name}</td>
                    <td class="text-center">
                        <div class="btn-group attendance-radio" role="group">
                            <input type="radio" class="btn-check" name="status_${index}" id="present_${index}" value="PRESENT" checked>
                            <label class="btn btn-outline-success" for="present_${index}">Present</label>

                            <input type="radio" class="btn-check" name="status_${index}" id="absent_${index}" value="ABSENT">
                            <label class="btn btn-outline-danger" for="absent_${index}">Absent</label>

                            <input type="radio" class="btn-check" name="status_${index}" id="late_${index}" value="LATE">
                            <label class="btn btn-outline-warning" for="late_${index}">Late</label>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        document.getElementById('attendanceListCard').style.display = 'block';
        showToast(`Loaded ${loadedStudents.length} students.`, 'success');

    } catch (error) {
        console.error(error);
        showToast('Error loading students. Ensure backend is running.', 'error');
    } finally {
        btn.innerHTML = 'Load';
        btn.disabled = false;
    }
}

// 6. Submit Attendance to Backend
async function submitBulkAttendance() {
    const btn = document.getElementById('submitAttendanceBtn');
    
    const date = document.getElementById('attendanceDate').value;
    const facultyId = document.getElementById('facultySelect').value;
    const subject = document.getElementById('subjectName').value;

    const rows = document.querySelectorAll('#attendanceTableBody tr');
    let successCount = 0;
    let failCount = 0;

    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Submitting...';
    btn.disabled = true;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const studentId = row.getAttribute('data-student-id');
        const usn = row.getAttribute('data-student-usn');
        const studentName = row.getAttribute('data-student-name');
        
        const status = row.querySelector(`input[name="status_${i}"]:checked`).value;

        const payload = { studentId, usn, studentName, date, subject, facultyId, status };

        try {
            await api.markAttendance(payload);
            successCount++;
            row.classList.add('table-success'); 
        } catch (error) {
            failCount++;
            row.classList.add('table-danger'); 
            console.error(`Failed to mark for ${usn}:`, error);
        }
    }

    btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Submit Attendance';
    btn.disabled = false;

    if (failCount === 0) {
        showToast(`Successfully marked attendance for ${successCount} students!`, 'success');
        setTimeout(() => {
            document.getElementById('attendanceListCard').style.display = 'none';
            document.getElementById('attendanceTableBody').innerHTML = '';
        }, 2000);
    } else {
        showToast(`Marked ${successCount}. ${failCount} failed (already marked?).`, 'error');
    }
}