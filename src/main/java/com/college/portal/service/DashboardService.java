package com.college.portal.service;

import dto.DashboardSummaryDTO;
import com.college.portal.model.Student;
import com.college.portal.repository.AttendanceRepository;
import com.college.portal.repository.FacultyRepository;
import com.college.portal.repository.NoticeRepository;
import com.college.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        LocalDate today = LocalDate.now();

        // Basic Counts
        summary.setTotalStudents(studentRepository.count());
        summary.setTotalFaculty(facultyRepository.count());
        summary.setTotalAttendanceRecords(attendanceRepository.count());
        summary.setActiveNotices(noticeRepository.countByStatusAndExpiryDateAfter("ACTIVE", LocalDateTime.now()));

        // Today's Attendance Metrics
        DashboardSummaryDTO.TodayAttendanceSummary todaySummary = new DashboardSummaryDTO.TodayAttendanceSummary();
        todaySummary.setTotalMarked(attendanceRepository.countByDate(today));
        todaySummary.setPresentCount(attendanceRepository.countByDateAndStatus(today, "PRESENT"));
        todaySummary.setAbsentCount(attendanceRepository.countByDateAndStatus(today, "ABSENT"));
        todaySummary.setLateCount(attendanceRepository.countByDateAndStatus(today, "LATE"));
        summary.setTodayAttendance(todaySummary);

        // Department-wise Student Grouping
        Map<String, Long> deptCounts = studentRepository.findAll().stream()
                .collect(Collectors.groupingBy(Student::getDepartment, Collectors.counting()));
        summary.setDepartmentWiseStudents(deptCounts);

        return summary;
    }
}