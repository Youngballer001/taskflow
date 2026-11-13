package com.taskflow.mapper;

import com.taskflow.dto.response.CommentResponse;
import com.taskflow.entity.TaskComment;

public final class CommentMapper {

    private CommentMapper() {
    }

    public static CommentResponse toResponse(TaskComment comment) {
        if (comment == null) {
            return null;
        }
        return new CommentResponse(
                comment.getId(),
                comment.getTask() != null ? comment.getTask().getId() : null,
                comment.getUser() != null ? comment.getUser().getId() : null,
                comment.getUser() != null ? comment.getUser().getFullName() : null,
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
