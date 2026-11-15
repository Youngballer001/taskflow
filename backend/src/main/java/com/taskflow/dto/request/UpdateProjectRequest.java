package com.taskflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.taskflow.enums.ProjectStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 255, message = "Project name must be between 2 and 255 characters")
    private String name;

    private String description;

    private LocalDate startDate;

    private LocalDate dueDate;

    private ProjectStatus status;
}
