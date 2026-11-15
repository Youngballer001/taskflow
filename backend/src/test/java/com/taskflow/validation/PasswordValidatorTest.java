package com.taskflow.validation;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PasswordValidatorTest {
    private final PasswordValidator validator = new PasswordValidator();

    @Test
    void acceptsPasswordWithMinimumLengthLetterAndDigit() {
        assertTrue(validator.isValid("Taskflow2026", null));
    }

    @Test
    void rejectsWeakOrOverlongPassword() {
        assertFalse(validator.isValid("short1", null));
        assertFalse(validator.isValid("password-without-number", null));
        assertFalse(validator.isValid("a".repeat(101) + "1", null));
        assertFalse(validator.isValid(null, null));
    }
}
