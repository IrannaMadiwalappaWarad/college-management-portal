package dto;



import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudentResponseDTO {
    private String id;
    private String usn;
    private String name;
    private String email;
    private String department;
    private Integer semester;
    private String section;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}