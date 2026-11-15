package com.taskflow.controller;

import com.taskflow.dto.request.LoginRequest;
import com.taskflow.dto.response.AuthResponse;
import com.taskflow.service.AuthService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {
    @Test
    void loginReturnsServiceTokenResponse() {
        AuthService service = mock(AuthService.class);
        AuthController controller = new AuthController(service);
        LoginRequest request = new LoginRequest();
        AuthResponse expected = new AuthResponse("access", "refresh", null);
        when(service.login(request)).thenReturn(expected);

        var response = controller.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertSame(expected, response.getBody());
        verify(service).login(request);
    }
}
