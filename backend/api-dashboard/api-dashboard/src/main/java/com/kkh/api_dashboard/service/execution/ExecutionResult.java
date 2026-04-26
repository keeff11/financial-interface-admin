package com.kkh.api_dashboard.service.execution;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ExecutionResult {
    private final String status;
    private final int responseTime;
    private final String errorMessage;
}
