package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalProjects;
    private Long totalTasks;
    private Long completedTasks;
    private Long overdueTasks;
    private Long activeMembers;
    private List<ProjectResponse> recentProjects;
    private List<TaskResponse> recentTasks;
    private List<ActivityLogResponse> recentActivity;
}
