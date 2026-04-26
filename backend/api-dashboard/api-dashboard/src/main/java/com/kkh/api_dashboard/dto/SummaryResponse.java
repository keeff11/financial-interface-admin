package com.kkh.api_dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SummaryResponse {
    private long totalCalls;
    private long successCalls;
    private long errorCalls;
    private long delayedCalls;
    private long activeInterfaces;
}
