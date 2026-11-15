package com.taskflow.service;

import com.taskflow.dto.request.CreateTaskRequest;
import com.taskflow.dto.request.UpdateTaskRequest;
import com.taskflow.dto.request.UpdateTaskStatusRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.enums.ActivityType;
import com.taskflow.enums.UserRole;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.mapper.TaskMapper;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SecurityUtil securityUtil;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    public List<TaskResponse> getUserTasks() {
        User currentUser = securityUtil.getCurrentUser();
        return projectRepository.findProjectsByUser(currentUser).stream()
                .flatMap(project -> taskRepository.findByProject(project).stream())
                .map(TaskMapper::toResponse)
                .toList();
    }

    public List<TaskResponse> getTasksForProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        validateProjectAccess(project);
        return taskRepository.findByProject(project).stream().map(TaskMapper::toResponse).toList();
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        validateProjectAccess(task.getProject());
        return TaskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
        validateProjectAccess(project);
        requireProjectManager(project);

        User assignedUser = null;
        if (request.getAssignedToId() != null) {
            assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            if (!projectMemberRepository.existsByProjectAndUser(project, assignedUser)) {
                throw new BadRequestException("Assigned user is not a member of the project");
            }
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setAssignedTo(assignedUser);
        task.setCreatedBy(securityUtil.getCurrentUser());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setStartDate(request.getStartDate());
        task.setDueDate(request.getDueDate());
        validateDates(task.getStartDate(), task.getDueDate());

        Task saved = taskRepository.save(task);
        activityLogService.record(task.getCreatedBy(), ActivityType.TASK_CREATED, "Created task " + saved.getTitle(), project, saved);
        if (assignedUser != null) notificationService.createNotification(assignedUser, com.taskflow.enums.NotificationType.TASK_ASSIGNED, "You were assigned: " + saved.getTitle(), project, saved);
        return TaskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        validateProjectAccess(task.getProject());
        requireProjectManager(task.getProject());
        User previousAssignee = task.getAssignedTo();

        if (request.getTitle() != null) task.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            if (!projectMemberRepository.existsByProjectAndUser(task.getProject(), assignedUser)) {
                throw new BadRequestException("Assigned user is not a member of the project");
            }
            task.setAssignedTo(assignedUser);
        }
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            if (!canManageProject(task.getProject()) && !isAssignedToCurrentUser(task)) {
                throw new ForbiddenException("Only the assignee or a project manager may change this task status");
            }
            task.setStatus(request.getStatus());
        }
        if (request.getStartDate() != null) task.setStartDate(request.getStartDate());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        validateDates(task.getStartDate(), task.getDueDate());

        Task saved = taskRepository.save(task);
        activityLogService.record(securityUtil.getCurrentUser(), ActivityType.TASK_UPDATED, "Updated task " + saved.getTitle(), saved.getProject(), saved);
        if (saved.getAssignedTo() != null && (previousAssignee == null || !previousAssignee.getId().equals(saved.getAssignedTo().getId()))) {
            notificationService.createNotification(saved.getAssignedTo(), com.taskflow.enums.NotificationType.TASK_ASSIGNED, "You were assigned: " + saved.getTitle(), saved.getProject(), saved);
        }
        return TaskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        validateProjectAccess(task.getProject());
        User currentUser = securityUtil.getCurrentUser();
        if (!canManageProject(task.getProject()) && (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("Only the assignee or a project manager may change this task status");
        }
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getStatus());
        Task saved = taskRepository.save(task);
        activityLogService.record(securityUtil.getCurrentUser(), ActivityType.TASK_STATUS_CHANGED, "Changed task status from " + oldStatus + " to " + saved.getStatus(), saved.getProject(), saved);
        return TaskMapper.toResponse(saved);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        validateProjectAccess(task.getProject());
        requireProjectManager(task.getProject());
        activityLogService.record(securityUtil.getCurrentUser(), ActivityType.TASK_DELETED, "Deleted task " + task.getTitle(), task.getProject(), task);
        taskRepository.delete(task);
    }

    private void validateProjectAccess(Project project) {
        User currentUser = securityUtil.getCurrentUser();
        if (!project.getOwner().getId().equals(currentUser.getId())
                && !projectMemberRepository.existsByProjectAndUser(project, currentUser)) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }

    private void validateDates(java.time.LocalDate startDate, java.time.LocalDate dueDate) {
        if (startDate != null && dueDate != null && dueDate.isBefore(startDate)) {
            throw new BadRequestException("Task due date cannot be before its start date");
        }
    }

    private boolean canManageProject(Project project) {
        User currentUser = securityUtil.getCurrentUser();
        return project.getOwner().getId().equals(currentUser.getId())
                || currentUser.getRole() == UserRole.ADMIN
                || (currentUser.getRole() == UserRole.PROJECT_MANAGER
                    && projectMemberRepository.existsByProjectAndUser(project, currentUser));
    }

    private void requireProjectManager(Project project) {
        if (!canManageProject(project)) throw new ForbiddenException("Project manager permission is required");
    }

    private boolean isAssignedToCurrentUser(Task task) {
        User assigned = task.getAssignedTo();
        return assigned != null && assigned.getId().equals(securityUtil.getCurrentUser().getId());
    }
}
