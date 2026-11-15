package com.taskflow.controller;

import com.taskflow.dto.request.CreateCommentRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.service.TaskCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @GetMapping("/{taskId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskCommentService.getCommentsForTask(taskId));
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long taskId,
                                                       @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(taskCommentService.createComment(taskId, request));
    }

    @PutMapping("/{taskId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long taskId, @PathVariable Long commentId,
                                                         @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(taskCommentService.updateComment(taskId, commentId, request));
    }

    @DeleteMapping("/{taskId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long taskId, @PathVariable Long commentId) {
        taskCommentService.deleteComment(taskId, commentId);
        return ResponseEntity.noContent().build();
    }
}

