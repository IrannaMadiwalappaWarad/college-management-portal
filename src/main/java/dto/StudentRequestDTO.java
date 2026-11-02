package dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentRequestDTO {
    @NotBlank(message = "USN is required")
    @Pattern(regexp = "^[0-9]{1}[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$", message = "Invalid USN format (e.g., 1RV21CS001)")
    private String usn;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 8, message = "Semester cannot exceed 8")
    private Integer semester;

    @NotBlank(message = "Section is required")
    private String section;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    private String status = "ACTIVE";
}