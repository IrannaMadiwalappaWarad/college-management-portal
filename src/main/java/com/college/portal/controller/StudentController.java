package com.college.portal.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.college.portal.model.Student;
import com.college.portal.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // 1. Add a student
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

    // 2. Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // 3. Get student by ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable String id) {
        return studentService.getStudentById(id);
    }

    // 4. Update student
    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable String id,
            @RequestBody Student student) {

        return studentService.updateStudent(id, student);
    }

    // 5. Delete student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable String id) {

        studentService.deleteStudent(id);

        return "Student deleted successfully";
    }
}
