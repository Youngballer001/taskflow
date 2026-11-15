package com.taskflow.controller;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import com.taskflow.dto.request.UpdateUserRoleRequest;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getUsers(@RequestParam(required = false) String search, Pageable pageable) {
        return ResponseEntity.ok(userService.searchUsers(search, pageable));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateRole(@PathVariable Long id, @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userService.updateRole(id, request));
    }

    @PatchMapping("/users/{id}/active")
    public ResponseEntity<UserResponse> setActive(@PathVariable Long id, @RequestParam boolean value) {
        return ResponseEntity.ok(userService.setAccountActive(id, value));
    }
}

