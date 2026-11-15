package com.taskflow.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    @Test
    void generatedTokenContainsSubjectAndValidSignature() {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secret", "taskflow-test-secret-with-at-least-thirty-two-bytes");
        ReflectionTestUtils.setField(service, "expiration", 60_000L);
        String token = service.generateToken("member@example.com");
        assertEquals("member@example.com", service.extractUsername(token));
        assertTrue(service.isTokenValid(token, "member@example.com"));
        assertFalse(service.isTokenValid(token, "other@example.com"));
    }

    @Test
    void invalidSignatureIsRejected() {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secret", "taskflow-test-secret-with-at-least-thirty-two-bytes");
        String token = service.generateToken("member@example.com");
        ReflectionTestUtils.setField(service, "secret", "different-secret-with-at-least-thirty-two-bytes");
        assertThrows(RuntimeException.class, () -> service.extractUsername(token));
    }
}
