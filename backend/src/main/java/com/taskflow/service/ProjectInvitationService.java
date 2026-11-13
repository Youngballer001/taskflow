package com.taskflow.service;

import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectInvitation;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.ProjectInvitationRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectInvitationService {

    private final ProjectInvitationRepository projectInvitationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    public List<ProjectInvitation> getInvitationsForUser() {
        User currentUser = securityUtil.getCurrentUser();
        return projectInvitationRepository.findByInvitedUser(currentUser);
    }

    @Transactional
    public ProjectInvitation inviteUser(Long projectId, Long invitedUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        User currentUser = securityUtil.getCurrentUser();

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Only the project owner can send invitations");
        }

        User invitedUser = userRepository.findById(invitedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + invitedUserId));

        if (projectInvitationRepository.existsByProjectAndInvitedUserAndStatus(project, invitedUser, "PENDING")) {
            throw new BadRequestException("An invitation is already pending for this user");
        }

        ProjectInvitation invitation = new ProjectInvitation();
        invitation.setProject(project);
        invitation.setInvitedUser(invitedUser);
        invitation.setInvitedBy(currentUser);
        invitation.setStatus("PENDING");
        return projectInvitationRepository.save(invitation);
    }

    @Transactional
    public ProjectInvitation respondToInvitation(Long invitationId, boolean accept) {
        User currentUser = securityUtil.getCurrentUser();
        ProjectInvitation invitation = projectInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id: " + invitationId));

        if (!invitation.getInvitedUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("This invitation is not for the current user");
        }

        invitation.setStatus(accept ? "ACCEPTED" : "DECLINED");
        return projectInvitationRepository.save(invitation);
    }
}

