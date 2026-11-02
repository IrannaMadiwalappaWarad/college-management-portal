package com.college.portal.repository;

import com.college.portal.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByUsn(String usn);
    List<Attendance> findByDate(LocalDate date);
    boolean existsByStudentIdAndDateAndSubject(String studentId, LocalDate date, String subject);
}