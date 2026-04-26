package com.kkh.api_dashboard.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "api_info")
public class ApiInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String apiName;

    @Column(nullable = false)
    private String protocol;

    @Column(nullable = false)
    private String targetUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Builder
    public ApiInfo(String institution, String apiName, String protocol, String targetUrl, Boolean active) {
        this.institution = institution;
        this.apiName = apiName;
        this.protocol = protocol;
        this.targetUrl = targetUrl;
        this.active = active == null || active;
    }
}
