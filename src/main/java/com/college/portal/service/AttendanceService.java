package com.college.portal.service;


import dto.AttendanceRequestDTO;
import dto.AttendanceResponseDTO;
import dto.AttendanceSummaryDTO;
import com.college.portal.model.Attendance;
import com.college.portal.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceResponseDTO markAttendance(AttendanceRequestDTO requestDTO) {
        if (attendanceRepository.existsByStudentIdAndDateAndSubject(
                requestDTO.getStudentId(), requestDTO.getDate(), requestDTO.getSubject())) {
            throw new RuntimeException("Attendance already marked for this student on the given date and subject.");
        }

        Attendance attendance = new Attendance();
        BeanUtils.copyProperties(requestDTO, attendance);
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return mapToResponseDTO(savedAttendance);
    }

    public List<AttendanceResponseDTO> getAllAttendance() {
        return attendanceRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> getAttendanceByUsn(String usn) {
        return attendanceRepository.findByUsn(usn)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public AttendanceSummaryDTO getAttendanceSummary(String usn) {
        List<Attendance> records = attendanceRepository.findByUsn(usn);
        
        if (records.isEmpty()) {
            throw new RuntimeException("No attendance records found for USN: " + usn);
        }

        long presentCount = records.stream().filter(a -> a.getStatus().equals("PRESENT")).count();
        long absentCount = records.stream().filter(a -> a.getStatus().equals("ABSENT")).count();
        long lateCount = records.stream().filter(a -> a.getStatus().equals("LATE")).count();
        long totalRecords = records.size();

        // LATE is considered PRESENT for percentage calculation
        double percentage = ((double) (presentCount + lateCount) / totalRecords) * 100;

        AttendanceSummaryDTO summary = new AttendanceSummaryDTO();
        summary.setUsn(usn);
        summary.setStudentName(records.get(0).getStudentName());
        summary.setTotalRecords(totalRecords);
        summary.setPresentCount(presentCount);
        summary.setAbsentCount(absentCount);
        summary.setLateCount(lateCount);
        summary.setAttendancePercentage(Math.round(percentage * 100.0) / 100.0); // round to 2 decimal places

        return summary;
    }

    private AttendanceResponseDTO mapToResponseDTO(Attendance attendance) {
        AttendanceResponseDTO dto = new AttendanceResponseDTO();
        BeanUtils.copyProperties(attendance, dto);
        return dto;
    }
}