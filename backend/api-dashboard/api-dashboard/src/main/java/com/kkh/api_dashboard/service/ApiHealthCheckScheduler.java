package com.kkh.api_dashboard.service;

import com.kkh.api_dashboard.domain.ApiInfo;
import com.kkh.api_dashboard.domain.ApiInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApiHealthCheckScheduler {

    private final ApiInfoRepository apiInfoRepository;
    private final ApiExecutionService apiExecutionService;

    @Scheduled(fixedDelay = 5000)
    public void checkActiveApis() {
        List<ApiInfo> activeApis = apiInfoRepository.findByActiveTrueOrderByIdAsc();
        for (ApiInfo apiInfo : activeApis) {
            try {
                apiExecutionService.execute(apiInfo, "SCHEDULER", null);
            } catch (Exception e) {
                log.error("스케줄러 실행 중 오류 - apiId={}", apiInfo.getId(), e);
            }
        }
    }
}
