package com.taskflow.service;

import com.taskflow.dto.response.NotificationResponse;
import com.taskflow.entity.Notification;
import com.taskflow.entity.User;
import com.taskflow.enums.NotificationType;
import com.taskflow.exception.ForbiddenException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.NotificationRepository;
import com.taskflow.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtil securityUtil;

    public List<NotificationResponse> getMyNotifications() {
        User currentUser = securityUtil.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(currentUser).stream()
                .map(this::toResponse)
                .toList();
    }

    public long getUnreadCount() {
        User currentUser = securityUtil.getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(currentUser);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User currentUser = securityUtil.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have access to this notification");
        }

        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead() {
        User currentUser = securityUtil.getCurrentUser();
        notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser)
                .forEach(notification -> notification.setIsRead(true));
    }

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUser() != null ? notification.getUser().getId() : null,
                notification.getType(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getRelatedProject() != null ? notification.getRelatedProject().getId() : null,
                notification.getRelatedTask() != null ? notification.getRelatedTask().getId() : null,
                notification.getCreatedAt()
        );
    }

    public void createNotification(User user, NotificationType type, String message) {
        createNotification(user, type, message, null, null);
    }

    public void createNotification(User user, NotificationType type, String message, com.taskflow.entity.Project project, com.taskflow.entity.Task task) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setRelatedProject(project);
        notification.setRelatedTask(task);
        notificationRepository.save(notification);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        User currentUser = securityUtil.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have access to this notification");
        }
        notificationRepository.delete(notification);
    }
}

