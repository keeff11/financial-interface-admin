package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;

public interface ProtocolExecutor {
    boolean supports(String protocol);
    ExecutionResult execute(ApiInfo apiInfo);
}
