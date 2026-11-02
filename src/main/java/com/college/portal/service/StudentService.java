
package com.college.portal.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.college.portal.model.Student;
import com.college.portal.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    // 1. Add a new student
    public Student addStudent(Student student) {

        if (studentRepository.existsByUsn(student.getUsn())) {
            throw new RuntimeException("Student with this USN already exists");
        }

        return studentRepository.save(student);
    }

    // 2. Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // 3. Get student by ID
    public Student getStudentById(String id) {

        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // 4. Update student details
    public Student updateStudent(String id, Student updatedStudent) {

        Student existingStudent = getStudentById(id);

        // Check if the new USN belongs to another student
        if (!existingStudent.getUsn().equals(updatedStudent.getUsn())
                && studentRepository.existsByUsn(updatedStudent.getUsn())) {
            throw new RuntimeException("USN already exists");
        }

        existingStudent.setUsn(updatedStudent.getUsn());
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setSemester(updatedStudent.getSemester());
        existingStudent.setSection(updatedStudent.getSection());
        existingStudent.setPhone(updatedStudent.getPhone());

        return studentRepository.save(existingStudent);
    }

    // 5. Delete student
    public void deleteStudent(String id) {

        Student student = getStudentById(id);

        studentRepository.deleteById(student.getId());
    }
}
