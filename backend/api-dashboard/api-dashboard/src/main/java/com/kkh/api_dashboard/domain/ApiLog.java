package com.kkh.api_dashboard.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "api_logs")
public class ApiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_info_id")
    private ApiInfo apiInfo;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String apiName;

    @Column(nullable = false)
    private String protocol;

    @Column(nullable = false)
    private String status;

    private Integer responseTime;

    @Column(length = 500)
    private String errorMessage;

    @Column(nullable = false)
    private String triggeredBy;

    private Long retriedFromLogId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Builder
    public ApiLog(ApiInfo apiInfo,
                  String institution,
                  String apiName,
                  String protocol,
                  String status,
                  Integer responseTime,
                  String errorMessage,
                  String triggeredBy,
                  Long retriedFromLogId,
                  LocalDateTime createdAt) {
        this.apiInfo = apiInfo;
        this.institution = institution;
        this.apiName = apiName;
        this.protocol = protocol;
        this.status = status;
        this.responseTime = responseTime;
        this.errorMessage = errorMessage;
        this.triggeredBy = triggeredBy;
        this.retriedFromLogId = retriedFromLogId;
        this.createdAt = createdAt;
    }
}
