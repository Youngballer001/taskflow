package com.taskflow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateInvitationRequest {
    @NotNull
    private Long userId;
}
