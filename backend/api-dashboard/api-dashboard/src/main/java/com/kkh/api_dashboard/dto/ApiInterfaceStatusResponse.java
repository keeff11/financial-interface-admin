package com.kkh.api_dashboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApiInterfaceStatusResponse {
    private Long id;
    private String institution;
    private String apiName;
    private String protocol;
    private String targetUrl;
    private boolean active;
    private String status;
    private Integer responseTime;
    private String errorMessage;
    private LocalDateTime checkedAt;
}
