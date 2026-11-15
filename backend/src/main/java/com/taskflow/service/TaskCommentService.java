package com.taskflow.service;

import com.taskflow.dto.request.CreateCommentRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskComment;
import com.taskflow.entity.User;
import com.taskflow.enums.ActivityType;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.mapper.CommentMapper;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskCommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SecurityUtil securityUtil;
    private final ActivityLogService activityLogService;

    public List<CommentResponse> getCommentsForTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        validateProjectAccess(task.getProject());
        return taskCommentRepository.findByTaskOrderByCreatedAtDesc(task).stream()
                .map(CommentMapper::toResponse)
                .toList();
    }

    @Transactional
    public CommentResponse createComment(Long taskId, CreateCommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        validateProjectAccess(task.getProject());

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new BadRequestException("Comment content is required");
        }

        User currentUser = securityUtil.getCurrentUser();
        TaskComment comment = new TaskComment();
        comment.setTask(task);
        comment.setUser(currentUser);
        comment.setContent(request.getContent().trim());

        TaskComment saved = taskCommentRepository.save(comment);
        activityLogService.record(currentUser, ActivityType.TASK_COMMENT_ADDED, "Commented on task " + task.getTitle(), task.getProject(), task);
        return CommentMapper.toResponse(saved);
    }

    @Transactional
    public void deleteComment(Long taskId, Long commentId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getTask().getId().equals(task.getId())) {
            throw new BadRequestException("Comment does not belong to this task");
        }

        User currentUser = securityUtil.getCurrentUser();
        boolean isOwner = comment.getUser().getId().equals(currentUser.getId());
        boolean isProjectOwner = task.getProject().getOwner().getId().equals(currentUser.getId());
        if (!isOwner && !isProjectOwner) {
            throw new ForbiddenException("You do not have permission to delete this comment");
        }

        taskCommentRepository.delete(comment);
    }

    @Transactional
    public CommentResponse updateComment(Long taskId, Long commentId, CreateCommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        validateProjectAccess(task.getProject());
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (!comment.getTask().getId().equals(taskId)) throw new BadRequestException("Comment does not belong to this task");
        User currentUser = securityUtil.getCurrentUser();
        if (!comment.getUser().getId().equals(currentUser.getId())) throw new ForbiddenException("Only the comment author can edit it");
        comment.setContent(request.getContent().trim());
        return CommentMapper.toResponse(taskCommentRepository.save(comment));
    }

    private void validateProjectAccess(Project project) {
        User currentUser = securityUtil.getCurrentUser();
        if (!project.getOwner().getId().equals(currentUser.getId())
                && !projectMemberRepository.existsByProjectAndUser(project, currentUser)) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }
}

