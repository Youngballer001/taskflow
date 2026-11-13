package com.taskflow.repository;

import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectInvitation;
import com.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {
    
    List<ProjectInvitation> findByInvitedUser(User user);
    
    List<ProjectInvitation> findByProject(Project project);
    
    List<ProjectInvitation> findByInvitedUserAndStatus(User user, String status);
    
    Optional<ProjectInvitation> findByProjectAndInvitedUserAndStatus(Project project, User user, String status);
    
    Boolean existsByProjectAndInvitedUserAndStatus(Project project, User user, String status);
}
