package com.taskflow.repository;

import com.taskflow.entity.ActivityLog;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    List<ActivityLog> findByUserOrderByCreatedAtDesc(User user);
    
    List<ActivityLog> findByProjectOrderByCreatedAtDesc(Project project);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.project = :project ORDER BY a.createdAt DESC")
    List<ActivityLog> findRecentByProject(@Param("project") Project project);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.project IN " +
           "(SELECT p FROM Project p WHERE p.owner = :user OR p.id IN " +
           "(SELECT pm.project.id FROM ProjectMember pm WHERE pm.user = :user)) " +
           "ORDER BY a.createdAt DESC")
    List<ActivityLog> findRecentByUser(@Param("user") User user);
}
