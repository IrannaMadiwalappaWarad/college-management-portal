package com.college.portal.repository;

import com.college.portal.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    boolean existsByUsn(String usn);
    Optional<Student> findByUsn(String usn);
    List<Student> findByNameContainingIgnoreCase(String name);
    List<Student> findByDepartmentAndSemesterAndSection(String department, Integer semester, String section);
}