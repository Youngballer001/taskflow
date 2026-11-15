package com.taskflow.controller;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.enums.UserRole;
import com.taskflow.service.UserService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {
    @Test
    void currentUserEndpointReturnsSanitizedProfileDto() {
        UserService service = mock(UserService.class);
        UserResponse expected = new UserResponse(4L, "m@example.com", "Morgan", UserRole.TEAM_MEMBER, true, null, null);
        when(service.getCurrentUser()).thenReturn(expected);

        var response = new UserController(service).getCurrentUser();

        assertEquals(200, response.getStatusCode().value());
        assertSame(expected, response.getBody());
    }
}
