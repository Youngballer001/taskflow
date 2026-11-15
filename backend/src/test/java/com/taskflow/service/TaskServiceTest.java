package com.taskflow.service;

import com.taskflow.dto.request.CreateTaskRequest;
import com.taskflow.dto.request.UpdateTaskStatusRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskStatus;
import com.taskflow.enums.UserRole;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.util.SecurityUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    @Mock TaskRepository taskRepository;
    @Mock ProjectRepository projectRepository;
    @Mock UserRepository userRepository;
    @Mock ProjectMemberRepository projectMemberRepository;
    @Mock SecurityUtil securityUtil;
    @Mock ActivityLogService activityLogService;
    @InjectMocks TaskService taskService;

    @Test
    void projectOwnerCanCreateTask() {
        User manager = new User();
        manager.setId(7L);
        manager.setRole(UserRole.TEAM_MEMBER);
        Project project = new Project();
        project.setId(11L);
        project.setName("Website refresh");
        project.setOwner(manager);
        when(securityUtil.getCurrentUser()).thenReturn(manager);
        when(projectRepository.findById(11L)).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task saved = invocation.getArgument(0);
            saved.setId(20L);
            return saved;
        });
        CreateTaskRequest request = new CreateTaskRequest();
        request.setProjectId(11L);
        request.setTitle("Prepare release");

        var response = taskService.createTask(request);

        assertEquals(20L, response.getId());
        assertEquals("Prepare release", response.getTitle());
        assertEquals(11L, response.getProjectId());
        verify(activityLogService).record(eq(manager), any(), contains("Prepare release"), eq(project), any(Task.class));
    }

    @Test
    void projectMemberCannotChangeAnotherMembersTaskStatus() {
        User member = new User();
        member.setId(8L);
        member.setRole(UserRole.TEAM_MEMBER);
        User assignee = new User();
        assignee.setId(9L);
        Project project = new Project();
        project.setId(11L);
        User owner = new User();
        owner.setId(7L);
        project.setOwner(owner);
        Task task = new Task();
        task.setId(20L);
        task.setProject(project);
        task.setAssignedTo(assignee);
        when(taskRepository.findById(20L)).thenReturn(Optional.of(task));
        when(securityUtil.getCurrentUser()).thenReturn(member);
        when(projectMemberRepository.existsByProjectAndUser(project, member)).thenReturn(true);
        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.IN_PROGRESS);

        assertThrows(ForbiddenException.class, () -> taskService.updateTaskStatus(20L, request));
        verify(taskRepository, never()).save(any());
    }
}
