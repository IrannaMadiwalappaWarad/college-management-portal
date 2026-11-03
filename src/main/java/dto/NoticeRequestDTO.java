package dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "^(Academic|Examination|Events|General)$", message = "Invalid category")
    private String category;

    @NotBlank(message = "Audience is required")
    @Pattern(regexp = "^(ALL|STUDENTS|FACULTY)$", message = "Invalid audience")
    private String audience;

    @NotBlank(message = "Publisher name is required")
    private String publishedBy;

    @NotNull(message = "Publish date is required")
    private LocalDateTime publishDate;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    private String status = "ACTIVE";
}