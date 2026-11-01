package com.college.portal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.college.portal.model.Student;

public interface StudentRepository extends MongoRepository<Student, String> {

    boolean existsByUsn(String usn);

    Student findByUsn(String usn);
}
