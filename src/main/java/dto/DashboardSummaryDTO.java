package dto;
import lombok.Data;
import java.util.Map;

@Data
public class DashboardSummaryDTO {
    private long totalStudents;
    private long totalFaculty;
    private long totalAttendanceRecords;
    private long activeNotices;
    private TodayAttendanceSummary todayAttendance;
    private Map<String, Long> departmentWiseStudents;

    @Data
    public static class TodayAttendanceSummary {
        private long totalMarked;
        private long presentCount;
        private long absentCount;
        private long lateCount;
    }
}