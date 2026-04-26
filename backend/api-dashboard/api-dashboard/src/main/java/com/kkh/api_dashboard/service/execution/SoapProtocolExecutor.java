package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;
import org.springframework.stereotype.Component;

@Component
public class SoapProtocolExecutor extends AbstractProtocolExecutor {

    @Override
    public boolean supports(String protocol) {
        return "SOAP".equals(safeUpper(protocol));
    }

    @Override
    public ExecutionResult execute(ApiInfo apiInfo) {
        return simulate(apiInfo, "SOAP", 220, 700, 1200, 2200, 75, 12);
    }
}
