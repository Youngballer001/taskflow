package com.taskflow.repository;

import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.enums.TaskStatus;
import com.taskflow.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TaskRepositoryTest {
    @Autowired TaskRepository taskRepository;
    @Autowired TestEntityManager entityManager;

    @Test
    void overdueQueryExcludesCompletedAndCancelledTasks() {
        User owner = new User(); owner.setEmail("owner@example.com"); owner.setPassword("hash"); owner.setFullName("Owner"); owner.setRole(UserRole.TEAM_MEMBER);
        owner = entityManager.persistFlushFind(owner);
        Project project = new Project(); project.setName("Project"); project.setOwner(owner); project.setStatus(ProjectStatus.ACTIVE);
        project = entityManager.persistFlushFind(project);
        persistTask(project, owner, "Past due", TaskStatus.IN_PROGRESS, LocalDate.now().minusDays(1));
        persistTask(project, owner, "Done", TaskStatus.COMPLETED, LocalDate.now().minusDays(2));
        persistTask(project, owner, "Future", TaskStatus.TODO, LocalDate.now().plusDays(1));

        var overdue = taskRepository.findOverdueTasks(LocalDate.now());
        assertEquals(1, overdue.size());
        assertEquals("Past due", overdue.get(0).getTitle());
    }

    private void persistTask(Project project, User owner, String title, TaskStatus status, LocalDate dueDate) {
        Task task = new Task(); task.setTitle(title); task.setProject(project); task.setCreatedBy(owner); task.setStatus(status); task.setDueDate(dueDate);
        entityManager.persist(task);
    }
}
