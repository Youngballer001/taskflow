package com.taskflow.controller;

import com.taskflow.dto.request.CreateInvitationRequest;
import com.taskflow.dto.response.ProjectInvitationResponse;
import com.taskflow.service.ProjectInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectInvitationController {
    private final ProjectInvitationService invitationService;

    @PostMapping("/api/projects/{projectId}/invitations")
    public ResponseEntity<ProjectInvitationResponse> invite(@PathVariable Long projectId,
            @Valid @RequestBody CreateInvitationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invitationService.inviteUser(projectId, request.getUserId()));
    }

    @GetMapping("/api/invitations")
    public ResponseEntity<List<ProjectInvitationResponse>> getMyInvitations() {
        return ResponseEntity.ok(invitationService.getInvitationsForUser());
    }

    @PostMapping("/api/invitations/{id}/accept")
    public ResponseEntity<ProjectInvitationResponse> accept(@PathVariable Long id) {
        return ResponseEntity.ok(invitationService.respondToInvitation(id, true));
    }

    @PostMapping("/api/invitations/{id}/reject")
    public ResponseEntity<ProjectInvitationResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(invitationService.respondToInvitation(id, false));
    }
}
