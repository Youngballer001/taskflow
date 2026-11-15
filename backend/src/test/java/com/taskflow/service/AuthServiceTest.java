package com.taskflow.service;

import com.taskflow.dto.request.RegisterRequest;
import com.taskflow.dto.response.AuthResponse;
import com.taskflow.entity.User;
import com.taskflow.enums.UserRole;
import com.taskflow.exception.DuplicateResourceException;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AuthenticationManager authenticationManager;
    @Mock JwtService jwtService;
    @Mock RefreshTokenService refreshTokenService;
    @InjectMocks AuthService authService;

    @Test
    void registerStoresHashedPasswordAndReturnsTokens() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Taylor Member");
        request.setEmail(" TAYLOR@example.com ");
        request.setPassword("Taskflow2026");
        request.setConfirmPassword("Taskflow2026");
        when(userRepository.existsByEmail("taylor@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Taskflow2026")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken("taylor@example.com")).thenReturn("access-token");
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("refresh-token");

        AuthResponse response = authService.register(request);

        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("taylor@example.com", response.getUser().getEmail());
        assertEquals(UserRole.TEAM_MEMBER, response.getUser().getRole());
        verify(userRepository).save(argThat(user -> "bcrypt-hash".equals(user.getPassword())));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }
}
