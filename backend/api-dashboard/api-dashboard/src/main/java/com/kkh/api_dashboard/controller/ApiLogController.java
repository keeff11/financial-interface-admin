package com.kkh.api_dashboard.controller;

import com.kkh.api_dashboard.dto.ApiLogResponse;
import com.kkh.api_dashboard.service.ApiExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ApiLogController {

    private final ApiExecutionService apiExecutionService;

    @GetMapping("/recent")
    public List<ApiLogResponse> getRecentLogs(@RequestParam(required = false) String status,
                                              @RequestParam(required = false) String protocol,
                                              @RequestParam(required = false) String keyword,
                                              @RequestParam(defaultValue = "50") int limit) {
        return apiExecutionService.getRecentLogs(status, protocol, keyword, limit);
    }

    @GetMapping("/{id}")
    public ApiLogResponse getLogDetail(@PathVariable Long id) {
        return apiExecutionService.getLogDetail(id);
    }

    @PostMapping("/{id}/retry")
    public ApiLogResponse retryLog(@PathVariable Long id) {
        return apiExecutionService.retryLog(id);
    }
}
