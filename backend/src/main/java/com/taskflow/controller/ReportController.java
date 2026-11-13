package com.taskflow.controller;

import com.taskflow.dto.response.ReportResponse;
import com.taskflow.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> getReport(@RequestParam(required = false, defaultValue = "monthly") String period) {
        return ResponseEntity.ok(reportService.getSummaryReport(period));
    }
}

