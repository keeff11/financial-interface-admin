package com.kkh.api_dashboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApiLogResponse {
    private Long id;
    private Long apiInfoId;
    private String institution;
    private String apiName;
    private String protocol;
    private String status;
    private Integer responseTime;
    private String errorMessage;
    private String triggeredBy;
    private Long retriedFromLogId;
    private LocalDateTime checkedAt;
}
