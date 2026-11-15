package com.taskflow.service;

import com.taskflow.dto.response.ReportResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.TaskPriority;
import com.taskflow.enums.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final SecurityUtil securityUtil;

    public ReportResponse getSummaryReport(String period) {
        User currentUser = securityUtil.getCurrentUser();
        List<Project> projects = projectRepository.findProjectsByUser(currentUser);
        List<Task> tasks = projects.stream()
                .flatMap(project -> taskRepository.findByProject(project).stream())
                .collect(Collectors.toList());

        Map<String, Long> projectStatusCounts = new HashMap<>();
        for (ProjectStatus status : ProjectStatus.values()) {
            projectStatusCounts.put(status.name(), (long) projectRepository.findByStatus(status).stream()
                    .filter(project -> project.getOwner().getId().equals(currentUser.getId())
                            || projectRepository.findProjectsByUser(currentUser).stream().anyMatch(p -> p.getId().equals(project.getId())))
                    .count());
        }

        Map<String, Long> taskStatusCounts = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            taskStatusCounts.put(status.name(), tasks.stream().filter(task -> task.getStatus() == status).count());
        }

        Map<String, Long> taskPriorityCounts = new HashMap<>();
        for (TaskPriority priority : TaskPriority.values()) {
            taskPriorityCounts.put(priority.name(), tasks.stream().filter(task -> task.getPriority() == priority).count());
        }

        long completed = tasks.stream().filter(task -> task.getStatus() == TaskStatus.COMPLETED).count();
        long overdue = tasks.stream().filter(task -> task.getDueDate() != null && task.getDueDate().isBefore(LocalDate.now())
                        && task.getStatus() != TaskStatus.COMPLETED && task.getStatus() != TaskStatus.CANCELLED).count();
        long activeProjects = projects.stream().filter(project -> project.getStatus() == ProjectStatus.ACTIVE).count();

        double completionRate = tasks.isEmpty() ? 0.0 : (completed * 100.0) / tasks.size();

        return new ReportResponse(
                period == null ? "monthly" : period,
                projectStatusCounts,
                taskStatusCounts,
                taskPriorityCounts,
                completionRate,
                overdue,
                activeProjects
        );
    }
}

