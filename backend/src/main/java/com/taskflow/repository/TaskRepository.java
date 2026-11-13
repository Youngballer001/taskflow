package com.taskflow.repository;

import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.enums.TaskPriority;
import com.taskflow.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByProject(Project project);
    
    List<Task> findByAssignedTo(User user);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByPriority(TaskPriority priority);
    
    List<Task> findByProjectAndStatus(Project project, TaskStatus status);
    
    List<Task> findByAssignedToAndStatus(User user, TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user AND t.status != 'COMPLETED' AND t.status != 'CANCELLED'")
    List<Task> findActiveTasksByUser(@Param("user") User user);
    
    @Query("SELECT t FROM Task t WHERE t.dueDate < :date AND t.status != 'COMPLETED' AND t.status != 'CANCELLED'")
    List<Task> findOverdueTasks(@Param("date") LocalDate date);
    
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :startDate AND :endDate " +
           "AND t.status != 'COMPLETED' AND t.status != 'CANCELLED'")
    List<Task> findTasksDueSoon(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    Long countByStatus(TaskStatus status);
    
    Long countByProject(Project project);
    
    Long countByAssignedTo(User user);
    
    Long countByProjectAndStatus(Project project, TaskStatus status);
}
