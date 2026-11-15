package com.taskflow.controller;

import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.service.ProjectService;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectControllerTest {
    @Test
    void listEndpointReturnsOnlyServiceProvidedProjectDtos() {
        ProjectService service = mock(ProjectService.class);
        List<ProjectResponse> expected = List.of(new ProjectResponse(1L, "Roadmap", null, 2L, "Owner", null, null, null, null, null));
        when(service.getUserProjects()).thenReturn(expected);

        var response = new ProjectController(service).getUserProjects();

        assertEquals(200, response.getStatusCode().value());
        assertSame(expected, response.getBody());
    }
}
