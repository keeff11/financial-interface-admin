package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;
import org.springframework.stereotype.Component;

@Component
public class MqProtocolExecutor extends AbstractProtocolExecutor {

    @Override
    public boolean supports(String protocol) {
        return "MQ".equals(safeUpper(protocol));
    }

    @Override
    public ExecutionResult execute(ApiInfo apiInfo) {
        return simulate(apiInfo, "MQ", 20, 150, 400, 900, 86, 8);
    }
}
