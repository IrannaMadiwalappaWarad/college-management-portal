package dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoticeResponseDTO {
    private String id;
    private String title;
    private String description;
    private String category;
    private String audience;
    private String publishedBy;
    private LocalDateTime publishDate;
    private LocalDateTime expiryDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}