package com.taskflow.controller;

import com.taskflow.dto.response.TaskResponse;
import com.taskflow.service.TaskService;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskControllerTest {
    @Test
    void currentTaskListDelegatesToScopedServiceMethod() {
        TaskService service = mock(TaskService.class);
        List<TaskResponse> expected = List.of();
        when(service.getUserTasks()).thenReturn(expected);

        var response = new TaskController(service).getMyTasks();

        assertEquals(200, response.getStatusCode().value());
        assertSame(expected, response.getBody());
        verify(service).getUserTasks();
    }
}
