package com.taskflow.service;

import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectInvitation;
import com.taskflow.entity.User;
import com.taskflow.entity.ProjectMember;
import com.taskflow.dto.response.ProjectInvitationResponse;
import com.taskflow.enums.NotificationType;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.ProjectInvitationRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProjectInvitationService {

    private final ProjectInvitationRepository projectInvitationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final ProjectMemberRepository projectMemberRepository;
    private final NotificationService notificationService;

    public List<ProjectInvitationResponse> getInvitationsForUser() {
        User currentUser = securityUtil.getCurrentUser();
        return projectInvitationRepository.findByInvitedUser(currentUser).stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProjectInvitationResponse inviteUser(Long projectId, Long invitedUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        User currentUser = securityUtil.getCurrentUser();

        if (!project.getOwner().getId().equals(currentUser.getId())
                && currentUser.getRole() != com.taskflow.enums.UserRole.ADMIN
                && (currentUser.getRole() != com.taskflow.enums.UserRole.PROJECT_MANAGER
                    || !projectMemberRepository.existsByProjectAndUser(project, currentUser))) {
            throw new ForbiddenException("Project manager permission is required to invite members");
        }

        User invitedUser = userRepository.findById(invitedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + invitedUserId));

        if (projectInvitationRepository.existsByProjectAndInvitedUserAndStatus(project, invitedUser, "PENDING")) {
            throw new BadRequestException("An invitation is already pending for this user");
        }
        if (projectMemberRepository.existsByProjectAndUser(project, invitedUser)) throw new BadRequestException("User is already a project member");

        ProjectInvitation invitation = new ProjectInvitation();
        invitation.setProject(project);
        invitation.setInvitedUser(invitedUser);
        invitation.setInvitedBy(currentUser);
        invitation.setStatus("PENDING");
        ProjectInvitation saved = projectInvitationRepository.save(invitation);
        notificationService.createNotification(invitedUser, NotificationType.PROJECT_INVITATION,
                "You were invited to project " + project.getName(), project, null);
        return toResponse(saved);
    }

    @Transactional
    public ProjectInvitationResponse respondToInvitation(Long invitationId, boolean accept) {
        User currentUser = securityUtil.getCurrentUser();
        ProjectInvitation invitation = projectInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id: " + invitationId));

        if (!invitation.getInvitedUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("This invitation is not for the current user");
        }

        if (!"PENDING".equals(invitation.getStatus())) throw new BadRequestException("This invitation has already been answered");

        if (accept) {
            if (!projectMemberRepository.existsByProjectAndUser(invitation.getProject(), currentUser)) {
                ProjectMember membership = new ProjectMember();
                membership.setProject(invitation.getProject());
                membership.setUser(currentUser);
                membership.setRole("MEMBER");
                projectMemberRepository.save(membership);
            }
        }

        invitation.setStatus(accept ? "ACCEPTED" : "DECLINED");
        invitation.setRespondedAt(LocalDateTime.now());
        ProjectInvitation saved = projectInvitationRepository.save(invitation);
        notificationService.createNotification(invitation.getInvitedBy(), NotificationType.PROJECT_UPDATED,
                currentUser.getFullName() + (accept ? " accepted" : " declined") + " the invitation to " + invitation.getProject().getName(), invitation.getProject(), null);
        return toResponse(saved);
    }

    private ProjectInvitationResponse toResponse(ProjectInvitation invitation) {
        return new ProjectInvitationResponse(invitation.getId(), invitation.getProject().getId(), invitation.getProject().getName(),
                invitation.getInvitedUser().getId(), invitation.getInvitedUser().getFullName(), invitation.getInvitedUser().getEmail(),
                invitation.getInvitedBy().getFullName(), invitation.getStatus(), invitation.getCreatedAt(), invitation.getRespondedAt());
    }
}

