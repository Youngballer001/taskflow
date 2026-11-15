package com.taskflow.service;

import com.taskflow.dto.request.ChangePasswordRequest;
import com.taskflow.dto.request.UpdateProfileRequest;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.dto.request.UpdateUserRoleRequest;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.mapper.UserMapper;
import com.taskflow.repository.UserRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import com.taskflow.enums.UserRole;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtil securityUtil;

    public UserResponse getCurrentUser() {
        return UserMapper.toResponse(securityUtil.getCurrentUser());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserMapper.toResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserMapper::toResponse);
    }

    public Page<UserResponse> searchUsers(String query, Pageable pageable) {
        if (query == null || query.isBlank()) return getAllUsers(pageable);
        String term = query.trim();
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, pageable)
                .map(UserMapper::toResponse);
    }

    @Transactional
    public UserResponse updateRole(Long id, UpdateUserRoleRequest request) {
        requireAdministrator();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(request.getRole());
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse setAccountActive(Long id, boolean active) {
        requireAdministrator();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (!active && user.getId().equals(securityUtil.getCurrentUser().getId())) {
            throw new BadRequestException("You cannot deactivate your own administrator account");
        }
        user.setIsActive(active);
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User currentUser = securityUtil.getCurrentUser();
        if (!currentUser.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        currentUser.setFullName(request.getFullName());
        currentUser.setEmail(request.getEmail().trim().toLowerCase());
        return UserMapper.toResponse(userRepository.save(currentUser));
    }

    @Transactional
    public UserResponse changePassword(ChangePasswordRequest request) {
        User currentUser = securityUtil.getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password confirmation does not match");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return UserMapper.toResponse(userRepository.save(currentUser));
    }

    @Transactional
    public void deactivateUser(Long id) {
        setAccountActive(id, false);
    }

    private void requireAdministrator() {
        if (securityUtil.getCurrentUser().getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Administrator permission is required");
        }
    }
}
