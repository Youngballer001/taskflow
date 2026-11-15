package com.taskflow.service;

import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.request.UpdateProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.ActivityType;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.mapper.ProjectMapper;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SecurityUtil securityUtil;
    private final ActivityLogService activityLogService;

    public List<ProjectResponse> getUserProjects() {
        User currentUser = securityUtil.getCurrentUser();
        return projectRepository.findProjectsByUser(currentUser).stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        User currentUser = securityUtil.getCurrentUser();
        if (!project.getOwner().getId().equals(currentUser.getId())
                && !projectMemberRepository.existsByProjectAndUser(project, currentUser)
                && currentUser.getRole() != com.taskflow.enums.UserRole.ADMIN) {
            throw new ForbiddenException("You do not have access to this project");
        }
        return ProjectMapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User currentUser = securityUtil.getCurrentUser();
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Project name is required");
        }

        Project project = new Project();
        project.setName(request.getName().trim());
        project.setDescription(request.getDescription());
        project.setOwner(currentUser);
        project.setStartDate(request.getStartDate());
        project.setDueDate(request.getDueDate());
        validateDates(project.getStartDate(), project.getDueDate());
        project.setStatus(ProjectStatus.PLANNING);

        Project savedProject = projectRepository.save(project);
        ProjectMember member = new ProjectMember();
        member.setProject(savedProject);
        member.setUser(currentUser);
        member.setRole("OWNER");
        projectMemberRepository.save(member);
        activityLogService.record(currentUser, ActivityType.PROJECT_CREATED, "Created project " + savedProject.getName(), savedProject, null);
        return ProjectMapper.toResponse(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        User currentUser = securityUtil.getCurrentUser();
        if (!canManageProject(project, currentUser)) {
            throw new ForbiddenException("You do not have permission to update this project");
        }

        validateDates(request.getStartDate() != null ? request.getStartDate() : project.getStartDate(),
                request.getDueDate() != null ? request.getDueDate() : project.getDueDate());

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        if (request.getStartDate() != null) project.setStartDate(request.getStartDate());
        if (request.getDueDate() != null) project.setDueDate(request.getDueDate());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        Project saved = projectRepository.save(project);
        activityLogService.record(currentUser, ActivityType.PROJECT_UPDATED, "Updated project " + saved.getName(), saved, null);
        return ProjectMapper.toResponse(saved);
    }

    private void validateDates(java.time.LocalDate startDate, java.time.LocalDate dueDate) {
        if (startDate != null && dueDate != null && dueDate.isBefore(startDate)) {
            throw new BadRequestException("Project due date cannot be before its start date");
        }
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        User currentUser = securityUtil.getCurrentUser();
        if (!canManageProject(project, currentUser)) {
            throw new ForbiddenException("You do not have permission to delete this project");
        }
        activityLogService.record(currentUser, ActivityType.PROJECT_DELETED, "Deleted project " + project.getName(), project, null);
        projectRepository.delete(project);
    }

    public boolean canManageProject(Project project, User user) {
        return project.getOwner().getId().equals(user.getId())
                || user.getRole() == com.taskflow.enums.UserRole.ADMIN;
    }
}
