package dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FacultyResponseDTO {
    private String id;
    private String employeeId;
    private String name;
    private String email;
    private String department;
    private String designation;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}