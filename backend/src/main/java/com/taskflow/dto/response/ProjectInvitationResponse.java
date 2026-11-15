package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectInvitationResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long invitedUserId;
    private String invitedUserName;
    private String invitedUserEmail;
    private String invitedByName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
}
