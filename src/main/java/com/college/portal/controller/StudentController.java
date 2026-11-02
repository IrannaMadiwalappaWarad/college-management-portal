package com.college.portal.controller;

import dto.StudentRequestDTO;
import dto.StudentResponseDTO;
import com.college.portal.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentResponseDTO> addStudent(@Valid @RequestBody StudentRequestDTO requestDTO) {
        return new ResponseEntity<>(studentService.addStudent(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable String id, 
            @Valid @RequestBody StudentRequestDTO requestDTO) {
        return ResponseEntity.ok(studentService.updateStudent(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/usn/{usn}")
    public ResponseEntity<StudentResponseDTO> searchByUsn(@PathVariable String usn) {
        return ResponseEntity.ok(studentService.searchByUsn(usn));
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<StudentResponseDTO>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(studentService.searchByName(name));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<StudentResponseDTO>> filterStudents(
            @RequestParam String department,
            @RequestParam Integer semester,
            @RequestParam String section) {
        return ResponseEntity.ok(studentService.filterStudents(department, semester, section));
    }
}