package com.taskflow.service;

import com.taskflow.dto.request.AddProjectMemberRequest;
import com.taskflow.dto.response.ProjectMemberResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.DuplicateResourceException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.util.SecurityUtil;
import com.taskflow.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final NotificationService notificationService;

    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        validateProjectAccess(project);

        return projectMemberRepository.findByProject(project).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProjectMemberResponse addProjectMember(Long projectId, AddProjectMemberRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        User currentUser = securityUtil.getCurrentUser();

        requireProjectManager(project, currentUser);

        String email = request.getEmail().trim().toLowerCase();
        User memberUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (memberUser.getId().equals(project.getOwner().getId())) {
            throw new BadRequestException("The project owner is already a member");
        }

        if (projectMemberRepository.existsByProjectAndUser(project, memberUser)) {
            throw new DuplicateResourceException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(memberUser);
        member.setRole("MEMBER");

        ProjectMember saved = projectMemberRepository.save(member);
        notificationService.createNotification(memberUser, com.taskflow.enums.NotificationType.PROJECT_MEMBER_ADDED,
                "You were added to project " + project.getName(), project, null);
        return toResponse(saved);
    }

    @Transactional
    public void removeProjectMember(Long projectId, Long memberId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        User currentUser = securityUtil.getCurrentUser();

        requireProjectManager(project, currentUser);

        User memberUser = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + memberId));

        if (memberUser.getId().equals(project.getOwner().getId())) {
            throw new BadRequestException("The project owner cannot be removed from the project");
        }

        ProjectMember membership = projectMemberRepository.findByProjectAndUser(project, memberUser)
                .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this project"));

        projectMemberRepository.delete(membership);
    }

    private void validateProjectAccess(Project project) {
        User currentUser = securityUtil.getCurrentUser();
        if (!project.getOwner().getId().equals(currentUser.getId())
                && !projectMemberRepository.existsByProjectAndUser(project, currentUser)) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }

    private void requireProjectManager(Project project, User currentUser) {
        boolean owner = project.getOwner().getId().equals(currentUser.getId());
        boolean admin = currentUser.getRole() == UserRole.ADMIN;
        boolean managerMember = currentUser.getRole() == UserRole.PROJECT_MANAGER
                && projectMemberRepository.existsByProjectAndUser(project, currentUser);
        if (!owner && !admin && !managerMember) {
            throw new ForbiddenException("Project manager permission is required");
        }
    }

    private ProjectMemberResponse toResponse(ProjectMember member) {
        return new ProjectMemberResponse(
                member.getId(),
                member.getUser() != null ? member.getUser().getId() : null,
                member.getUser() != null ? member.getUser().getFullName() : null,
                member.getUser() != null ? member.getUser().getEmail() : null,
                member.getRole(),
                member.getJoinedAt() != null ? member.getJoinedAt().toString() : null
        );
    }
}

