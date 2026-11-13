package com.taskflow.controller;

import com.taskflow.dto.response.ActivityLogResponse;
import com.taskflow.entity.ActivityLog;
import com.taskflow.repository.ActivityLogRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogRepository activityLogRepository;
    private final SecurityUtil securityUtil;

    @GetMapping("/activity")
    public ResponseEntity<List<ActivityLogResponse>> getRecentActivity() {
        return ResponseEntity.ok(
                activityLogRepository.findRecentByUser(securityUtil.getCurrentUser()).stream()
                        .limit(20)
                        .map(log -> new ActivityLogResponse(
                                log.getId(),
                                log.getUser() != null ? log.getUser().getId() : null,
                                log.getUser() != null ? log.getUser().getFullName() : null,
                                log.getActivityType(),
                                log.getDescription(),
                                log.getProject() != null ? log.getProject().getId() : null,
                                log.getTask() != null ? log.getTask().getId() : null,
                                log.getCreatedAt()
                        ))
                        .toList()
        );
    }
}

