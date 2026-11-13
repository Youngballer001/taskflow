package com.taskflow.service;

import com.taskflow.dto.response.ActivityLogResponse;
import com.taskflow.dto.response.DashboardResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.TaskStatus;
import com.taskflow.mapper.ProjectMapper;
import com.taskflow.mapper.TaskMapper;
import com.taskflow.repository.ActivityLogRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;
    private final SecurityUtil securityUtil;

    public DashboardResponse getDashboard() {
        User currentUser = securityUtil.getCurrentUser();

        List<Project> userProjects = projectRepository.findProjectsByUser(currentUser);
        List<Task> userTasks = taskRepository.findByAssignedTo(currentUser);

        List<ProjectResponse> recentProjects = userProjects.stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(5)
                .map(ProjectMapper::toResponse)
                .toList();

        List<TaskResponse> recentTasks = userTasks.stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(5)
                .map(TaskMapper::toResponse)
                .toList();

        List<ActivityLogResponse> recentActivity = activityLogRepository.findRecentByUser(currentUser).stream()
                .limit(10)
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
                .toList();

        Long totalProjects = (long) userProjects.size();
        Long totalTasks = (long) userTasks.size();
        Long completedTasks = taskRepository.findByAssignedToAndStatus(currentUser, TaskStatus.COMPLETED).stream().count();
        Long overdueTasks = (long) taskRepository.findOverdueTasks(LocalDate.now()).stream()
                .filter(task -> task.getAssignedTo() != null && task.getAssignedTo().getId().equals(currentUser.getId()))
                .count();
        Long activeMembers = (long) projectRepository.findProjectsByUser(currentUser).stream()
                .flatMap(project -> project.getOwner() != null ? java.util.stream.Stream.of(project.getOwner()) : java.util.stream.Stream.empty())
                .count();

        if (activeMembers == 0) {
            activeMembers = 1L;
        }

        return new DashboardResponse(
                totalProjects,
                totalTasks,
                completedTasks,
                overdueTasks,
                activeMembers,
                recentProjects,
                recentTasks,
                recentActivity
        );
    }
}

