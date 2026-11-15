package com.taskflow.repository;

import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProjectRepositoryTest {
    @Autowired ProjectRepository projectRepository;
    @Autowired TestEntityManager entityManager;

    @Test
    void projectQueryReturnsProjectsOwnedByOrSharedWithUser() {
        User owner = saveUser("owner@example.com");
        User member = saveUser("member@example.com");
        Project project = new Project();
        project.setName("Shared workspace");
        project.setOwner(owner);
        project.setStatus(ProjectStatus.ACTIVE);
        project = entityManager.persistFlushFind(project);
        ProjectMember membership = new ProjectMember();
        membership.setProject(project);
        membership.setUser(member);
        membership.setRole("MEMBER");
        entityManager.persistAndFlush(membership);

        assertEquals(1, projectRepository.findProjectsByUser(member).size());
        assertEquals(project.getId(), projectRepository.findProjectsByUser(member).get(0).getId());
    }

    private User saveUser(String email) {
        User user = new User(); user.setEmail(email); user.setPassword("hash"); user.setFullName(email); user.setRole(UserRole.TEAM_MEMBER);
        return entityManager.persistFlushFind(user);
    }
}
