package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;
import org.springframework.stereotype.Component;

@Component
public class RestProtocolExecutor extends AbstractProtocolExecutor {

    @Override
    public boolean supports(String protocol) {
        return "REST".equals(safeUpper(protocol));
    }

    @Override
    public ExecutionResult execute(ApiInfo apiInfo) {
        return simulate(apiInfo, "REST API", 80, 350, 900, 1700, 82, 10);
    }
}
