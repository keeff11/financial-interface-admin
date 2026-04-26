package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;
import org.springframework.stereotype.Component;

@Component
public class BatchProtocolExecutor extends AbstractProtocolExecutor {

    @Override
    public boolean supports(String protocol) {
        return "BATCH".equals(safeUpper(protocol));
    }

    @Override
    public ExecutionResult execute(ApiInfo apiInfo) {
        return simulate(apiInfo, "Batch", 800, 1600, 2000, 3500, 72, 12);
    }
}
