package com.college.portal.controller;

import dto.AttendanceRequestDTO;
import dto.AttendanceResponseDTO;
import dto.AttendanceSummaryDTO;
import com.college.portal.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<AttendanceResponseDTO> markAttendance(@Valid @RequestBody AttendanceRequestDTO requestDTO) {
        return new ResponseEntity<>(attendanceService.markAttendance(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponseDTO>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/student/{usn}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByUsn(@PathVariable String usn) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUsn(usn));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/summary/{usn}")
    public ResponseEntity<AttendanceSummaryDTO> getAttendanceSummary(@PathVariable String usn) {
        return ResponseEntity.ok(attendanceService.getAttendanceSummary(usn));
    }
}