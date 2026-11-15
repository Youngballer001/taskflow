package com.taskflow.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Builds a consistent error response
    private ResponseEntity<Map<String, Object>> buildError(
            HttpStatus status,
            String message,
            Object details
    ) {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);

        if (details != null) {
            response.put("details", details);
        }

        return new ResponseEntity<>(response, status);
    }

    // Handles resource not found errors
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex
    ) {
        return buildError(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                null
        );
    }

    // Handles duplicate resource errors
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateResource(
            DuplicateResourceException ex
    ) {
        return buildError(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                null
        );
    }

    // Handles database integrity violations
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException ex
    ) {
        log.warn("Database integrity violation: {}", ex.getMessage());

        return buildError(
                HttpStatus.CONFLICT,
                "The request conflicts with existing database data.",
                null
        );
    }

    // Handles database access errors
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(
            DataAccessException ex
    ) {
        log.error("Database access error", ex);

        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "A database error occurred.",
                null
        );
    }

    // Handles bad requests
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(
            BadRequestException ex
    ) {
        return buildError(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                null
        );
    }

    // Handles forbidden access
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(
            ForbiddenException ex
    ) {
        return buildError(
                HttpStatus.FORBIDDEN,
                ex.getMessage(),
                null
        );
    }

    // Handles unauthorized access
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(
            UnauthorizedException ex
    ) {
        return buildError(
                HttpStatus.UNAUTHORIZED,
                ex.getMessage(),
                null
        );
    }

    // Handles authentication failures
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(
            AuthenticationException ex
    ) {
        return buildError(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed.",
                null
        );
    }

    // Handles validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return buildError(
                HttpStatus.BAD_REQUEST,
                "Validation failed.",
                errors
        );
    }

    // Handles malformed JSON request bodies
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableMessage(
            HttpMessageNotReadableException ex
    ) {
        return buildError(
                HttpStatus.BAD_REQUEST,
                "The request body is missing or contains invalid JSON.",
                null
        );
    }

    // Handles unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex
    ) {
        log.error("An unexpected error occurred", ex);

        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.",
                null
        );
    }
}