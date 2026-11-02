package com.college.portal.controller;

import dto.FacultyRequestDTO;
import dto.FacultyResponseDTO;
import com.college.portal.service.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @PostMapping
    public ResponseEntity<FacultyResponseDTO> addFaculty(@Valid @RequestBody FacultyRequestDTO requestDTO) {
        return new ResponseEntity<>(facultyService.addFaculty(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FacultyResponseDTO>> getAllFaculty() {
        return ResponseEntity.ok(facultyService.getAllFaculty());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyResponseDTO> getFacultyById(@PathVariable String id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyResponseDTO> updateFaculty(
            @PathVariable String id,
            @Valid @RequestBody FacultyRequestDTO requestDTO) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable String id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/employee-id/{employeeId}")
    public ResponseEntity<FacultyResponseDTO> searchByEmployeeId(@PathVariable String employeeId) {
        return ResponseEntity.ok(facultyService.searchByEmployeeId(employeeId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<FacultyResponseDTO>> filterByDepartment(@RequestParam String department) {
        return ResponseEntity.ok(facultyService.filterByDepartment(department));
    }
}