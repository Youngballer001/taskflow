package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private String period;
    private Map<String, Long> projectStatusCounts;
    private Map<String, Long> taskStatusCounts;
    private Map<String, Long> taskPriorityCounts;
    private Double completionRate;
    private Long overdueTasks;
    private Long activeProjects;
}
