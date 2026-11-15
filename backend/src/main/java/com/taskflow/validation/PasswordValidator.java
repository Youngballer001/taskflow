package com.taskflow.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.length() >= 8 && value.length() <= 100
                && value.matches(".*[A-Za-z].*") && value.matches(".*\\d.*");
    }
}
