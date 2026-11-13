package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    
    List<TaskComment> findByTask(Task task);
    
    List<TaskComment> findByTaskOrderByCreatedAtDesc(Task task);
    
    Long countByTask(Task task);
}
