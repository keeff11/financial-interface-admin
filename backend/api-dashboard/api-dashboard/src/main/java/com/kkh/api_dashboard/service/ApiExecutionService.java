package com.kkh.api_dashboard.service;

import com.kkh.api_dashboard.domain.ApiInfo;
import com.kkh.api_dashboard.domain.ApiInfoRepository;
import com.kkh.api_dashboard.domain.ApiLog;
import com.kkh.api_dashboard.domain.ApiLogRepository;
import com.kkh.api_dashboard.dto.ApiInterfaceStatusResponse;
import com.kkh.api_dashboard.dto.ApiLogResponse;
import com.kkh.api_dashboard.dto.SummaryResponse;
import com.kkh.api_dashboard.service.execution.ExecutionResult;
import com.kkh.api_dashboard.service.execution.ProtocolExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiExecutionService {

    private final ApiInfoRepository apiInfoRepository;
    private final ApiLogRepository apiLogRepository;
    private final List<ProtocolExecutor> protocolExecutors;

    public SummaryResponse getSummary() {
        return SummaryResponse.builder()
                .totalCalls(apiLogRepository.count())
                .successCalls(apiLogRepository.countByStatus("SUCCESS"))
                .errorCalls(apiLogRepository.countByStatus("FAIL"))
                .delayedCalls(apiLogRepository.countByStatus("DELAY"))
                .activeInterfaces(apiInfoRepository.countByActiveTrue())
                .build();
    }

    public List<ApiInterfaceStatusResponse> getInterfaces() {
        List<ApiInfo> apiInfos = apiInfoRepository.findAll().stream()
                .sorted(Comparator.comparing(ApiInfo::getId))
                .toList();

        Map<Long, ApiLog> latestLogMap = apiLogRepository.findLatestLogPerApiInfo().stream()
                .filter(log -> log.getApiInfo() != null)
                .collect(Collectors.toMap(log -> log.getApiInfo().getId(), Function.identity(), (a, b) -> a));

        List<ApiInterfaceStatusResponse> responses = new ArrayList<>();
        for (ApiInfo apiInfo : apiInfos) {
            ApiLog latestLog = latestLogMap.get(apiInfo.getId());
            String status = !apiInfo.isActive() ? "INACTIVE" : latestLog == null ? "UNKNOWN" : latestLog.getStatus();

            responses.add(ApiInterfaceStatusResponse.builder()
                    .id(apiInfo.getId())
                    .institution(apiInfo.getInstitution())
                    .apiName(apiInfo.getApiName())
                    .protocol(apiInfo.getProtocol())
                    .targetUrl(apiInfo.getTargetUrl())
                    .active(apiInfo.isActive())
                    .status(status)
                    .responseTime(latestLog == null ? null : latestLog.getResponseTime())
                    .errorMessage(latestLog == null ? null : latestLog.getErrorMessage())
                    .checkedAt(latestLog == null ? null : latestLog.getCreatedAt())
                    .build());
        }
        return responses;
    }

    public List<ApiLogResponse> getRecentLogs(String status, String protocol, String keyword, int limit) {
        String normalizedStatus = normalize(status);
        String normalizedProtocol = normalize(protocol);
        String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        int safeLimit = Math.max(1, Math.min(limit, 100));

        return apiLogRepository.searchRecent(normalizedStatus, normalizedProtocol, normalizedKeyword, PageRequest.of(0, safeLimit))
                .stream()
                .map(this::toLogResponse)
                .toList();
    }

    public ApiLogResponse getLogDetail(Long logId) {
        return toLogResponse(findLog(logId));
    }

    @Transactional
    public ApiLogResponse executeNow(Long apiInfoId) {
        ApiInfo apiInfo = findApiInfo(apiInfoId);
        return toLogResponse(execute(apiInfo, "MANUAL", null));
    }

    @Transactional
    public ApiLogResponse retryLog(Long logId) {
        ApiLog sourceLog = findLog(logId);
        if (sourceLog.getApiInfo() == null) {
            throw new IllegalArgumentException("재처리할 인터페이스 정보가 없습니다.");
        }
        return toLogResponse(execute(sourceLog.getApiInfo(), "RETRY", sourceLog.getId()));
    }

    @Transactional
    public ApiLog execute(ApiInfo apiInfo, String triggeredBy, Long retriedFromLogId) {
        ProtocolExecutor protocolExecutor = protocolExecutors.stream()
                .filter(executor -> executor.supports(apiInfo.getProtocol()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 프로토콜입니다: " + apiInfo.getProtocol()));

        ExecutionResult result = protocolExecutor.execute(apiInfo);

        ApiLog apiLog = ApiLog.builder()
                .apiInfo(apiInfo)
                .institution(apiInfo.getInstitution())
                .apiName(apiInfo.getApiName())
                .protocol(apiInfo.getProtocol())
                .status(result.getStatus())
                .responseTime(result.getResponseTime())
                .errorMessage(result.getErrorMessage())
                .triggeredBy(triggeredBy)
                .retriedFromLogId(retriedFromLogId)
                .build();

        return apiLogRepository.save(apiLog);
    }

    public ApiLogResponse toLogResponse(ApiLog apiLog) {
        return ApiLogResponse.builder()
                .id(apiLog.getId())
                .apiInfoId(apiLog.getApiInfo() == null ? null : apiLog.getApiInfo().getId())
                .institution(apiLog.getInstitution())
                .apiName(apiLog.getApiName())
                .protocol(apiLog.getProtocol())
                .status(apiLog.getStatus())
                .responseTime(apiLog.getResponseTime())
                .errorMessage(apiLog.getErrorMessage())
                .triggeredBy(apiLog.getTriggeredBy())
                .retriedFromLogId(apiLog.getRetriedFromLogId())
                .checkedAt(apiLog.getCreatedAt())
                .build();
    }

    private ApiInfo findApiInfo(Long apiInfoId) {
        return apiInfoRepository.findById(apiInfoId)
                .orElseThrow(() -> new IllegalArgumentException("API를 찾을 수 없습니다. id=" + apiInfoId));
    }

    private ApiLog findLog(Long logId) {
        return apiLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("로그를 찾을 수 없습니다. id=" + logId));
    }

    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
