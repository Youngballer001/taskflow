package com.taskflow.service;

import com.taskflow.entity.ActivityLog;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.ActivityType;
import com.taskflow.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    public void record(User actor, ActivityType type, String description, Project project, Task task) {
        ActivityLog log = new ActivityLog();
        log.setUser(actor);
        log.setActivityType(type);
        log.setDescription(description);
        log.setProject(project);
        log.setTask(task);
        activityLogRepository.save(log);
    }
}
