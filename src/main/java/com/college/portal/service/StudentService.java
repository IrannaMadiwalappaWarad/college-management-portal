package com.college.portal.service;

import dto.StudentRequestDTO;
import dto.StudentResponseDTO;
import com.college.portal.model.Student;
import com.college.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentResponseDTO addStudent(StudentRequestDTO requestDTO) {
        if (studentRepository.existsByUsn(requestDTO.getUsn())) {
            throw new RuntimeException("USN already exists: " + requestDTO.getUsn());
        }
        
        Student student = new Student();
        BeanUtils.copyProperties(requestDTO, student);
        
        Student savedStudent = studentRepository.save(student);
        return mapToResponseDTO(savedStudent);
    }

    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public StudentResponseDTO getStudentById(String id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        return mapToResponseDTO(student);
    }

    public StudentResponseDTO updateStudent(String id, StudentRequestDTO requestDTO) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        // Check if updating USN to one that already belongs to another student
        if (!existingStudent.getUsn().equals(requestDTO.getUsn()) && 
            studentRepository.existsByUsn(requestDTO.getUsn())) {
            throw new RuntimeException("USN already exists: " + requestDTO.getUsn());
        }

        BeanUtils.copyProperties(requestDTO, existingStudent);
        Student updatedStudent = studentRepository.save(existingStudent);
        return mapToResponseDTO(updatedStudent);
    }

    public void deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    public StudentResponseDTO searchByUsn(String usn) {
        Student student = studentRepository.findByUsn(usn)
                .orElseThrow(() -> new RuntimeException("Student not found with USN: " + usn));
        return mapToResponseDTO(student);
    }

    public List<StudentResponseDTO> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<StudentResponseDTO> filterStudents(String department, Integer semester, String section) {
        return studentRepository.findByDepartmentAndSemesterAndSection(department, semester, section)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private StudentResponseDTO mapToResponseDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        BeanUtils.copyProperties(student, dto);
        return dto;
    }
}