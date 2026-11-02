package com.college.portal.repository;

import com.college.portal.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends MongoRepository<Faculty, String> {
    boolean existsByEmployeeId(String employeeId);
    Optional<Faculty> findByEmployeeId(String employeeId);
    List<Faculty> findByDepartment(String department);
}