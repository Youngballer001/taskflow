package com.taskflow.repository;

import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwner(User owner);
    
    List<Project> findByStatus(ProjectStatus status);
    
    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);
    
    @Query("SELECT p FROM Project p WHERE p.owner = :user OR p.id IN " +
           "(SELECT pm.project.id FROM ProjectMember pm WHERE pm.user = :user)")
    List<Project> findProjectsByUser(@Param("user") User user);
    
    @Query("SELECT p FROM Project p WHERE p.owner = :user " +
           "OR p.id IN (SELECT pm.project.id FROM ProjectMember pm WHERE pm.user = :user) " +
           "ORDER BY p.updatedAt DESC")
    List<Project> findRecentProjectsByUser(@Param("user") User user);
    
    List<Project> findByNameContainingIgnoreCase(String name);
    
    Long countByStatus(ProjectStatus status);
    
    Long countByOwner(User owner);
}
