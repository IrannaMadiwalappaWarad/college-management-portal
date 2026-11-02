package dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AttendanceResponseDTO {
    private String id;
    private String studentId;
    private String usn;
    private String studentName;
    private LocalDate date;
    private String subject;
    private String facultyId;
    private String status;
    private LocalDateTime createdAt;
}