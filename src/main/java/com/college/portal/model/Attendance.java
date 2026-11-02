package com.college.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "attendance")
@CompoundIndex(name = "student_date_subject_idx", def = "{'studentId': 1, 'date': 1, 'subject': 1}", unique = true)
public class Attendance {
    @Id
    private String id;

    private String studentId;
    private String usn;
    private String studentName;
    private LocalDate date;
    private String subject;
    private String facultyId;
    
    // Values: PRESENT, ABSENT, LATE
    private String status;

    @CreatedDate
    private LocalDateTime createdAt;
}