package com.taskflow.dto.response;

import com.taskflow.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {
    private Long id;
    private Long userId;
    private String userName;
    private ActivityType activityType;
    private String description;
    private Long projectId;
    private Long taskId;
    private LocalDateTime createdAt;
}
