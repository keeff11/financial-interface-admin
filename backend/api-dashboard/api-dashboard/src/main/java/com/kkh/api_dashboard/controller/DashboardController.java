package com.kkh.api_dashboard.controller;

import com.kkh.api_dashboard.domain.ApiInfo;
import com.kkh.api_dashboard.domain.ApiInfoRepository;
import com.kkh.api_dashboard.dto.ApiInterfaceStatusResponse;
import com.kkh.api_dashboard.dto.ApiLogResponse;
import com.kkh.api_dashboard.dto.SummaryResponse;
import com.kkh.api_dashboard.service.ApiExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class DashboardController {

    private final ApiInfoRepository apiInfoRepository;
    private final ApiExecutionService apiExecutionService;

    @GetMapping("/summary")
    public SummaryResponse getSummary() {
        return apiExecutionService.getSummary();
    }

    @GetMapping("/interfaces")
    public List<ApiInterfaceStatusResponse> getInterfaces() {
        return apiExecutionService.getInterfaces();
    }

    @GetMapping("/api-info")
    public List<ApiInfo> getAllApiInfo() {
        return apiInfoRepository.findAll().stream()
                .sorted((a, b) -> Long.compare(a.getId(), b.getId()))
                .toList();
    }

    @PostMapping("/register")
    public ApiInfo registerApi(@RequestBody ApiInfo request) {
        request.setId(null);
        if (request.getProtocol() != null) {
            request.setProtocol(request.getProtocol().trim().toUpperCase());
        }
        if (request.getTargetUrl() != null) {
            request.setTargetUrl(request.getTargetUrl().trim());
        }
        return apiInfoRepository.save(request);
    }

    @PutMapping("/api-info/{id}/toggle")
    public ApiInfo toggleApi(@PathVariable Long id) {
        ApiInfo info = apiInfoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("API를 찾을 수 없습니다. id=" + id));
        info.setActive(!info.isActive());
        return apiInfoRepository.save(info);
    }

    @PostMapping("/api-info/{id}/execute")
    public ApiLogResponse executeApi(@PathVariable Long id) {
        return apiExecutionService.executeNow(id);
    }
}
