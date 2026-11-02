package dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceRequestDTO {
    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "USN is required")
    private String usn;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Faculty ID is required")
    private String facultyId;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PRESENT|ABSENT|LATE)$", message = "Status must be PRESENT, ABSENT, or LATE")
    private String status;
}