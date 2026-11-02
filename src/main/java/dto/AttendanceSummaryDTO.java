package dto;

import lombok.Data;

@Data
public class AttendanceSummaryDTO {
    private String usn;
    private String studentName;
    private long totalRecords;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private double attendancePercentage;
}