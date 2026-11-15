package com.taskflow.service;

import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectStatus;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.util.SecurityUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock ProjectRepository projectRepository;
    @Mock ProjectMemberRepository projectMemberRepository;
    @Mock SecurityUtil securityUtil;
    @Mock ActivityLogService activityLogService;
    @InjectMocks ProjectService projectService;

    @Test
    void createProjectAssignsCurrentUserAsOwnerAndMember() {
        User owner = new User();
        owner.setId(3L);
        owner.setFullName("Morgan Owner");
        when(securityUtil.getCurrentUser()).thenReturn(owner);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project saved = invocation.getArgument(0);
            saved.setId(5L);
            return saved;
        });
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("New product");

        var response = projectService.createProject(request);

        assertEquals(5L, response.getId());
        assertEquals(ProjectStatus.PLANNING, response.getStatus());
        assertEquals(3L, response.getOwnerId());
        verify(projectMemberRepository).save(argThat(member -> member.getProject().getId().equals(5L) && member.getUser().equals(owner)));
    }
}
