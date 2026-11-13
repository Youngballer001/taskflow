package com.taskflow.dto.response;

import com.taskflow.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private NotificationType type;
    private String message;
    private Boolean isRead;
    private Long relatedProjectId;
    private Long relatedTaskId;
    private LocalDateTime createdAt;
}
