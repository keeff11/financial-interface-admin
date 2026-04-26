package com.kkh.api_dashboard.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiInfoRepository extends JpaRepository<ApiInfo, Long> {
    long countByActiveTrue();
    List<ApiInfo> findByActiveTrueOrderByIdAsc();
}
