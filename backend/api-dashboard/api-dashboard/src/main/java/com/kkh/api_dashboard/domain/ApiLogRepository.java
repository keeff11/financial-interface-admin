package com.kkh.api_dashboard.domain;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApiLogRepository extends JpaRepository<ApiLog, Long> {

    long countByStatus(String status);

    List<ApiLog> findTop10ByOrderByCreatedAtDesc();

    @Query("""
            select l
            from ApiLog l
            where l.id in (
                select max(l2.id)
                from ApiLog l2
                group by l2.apiInfo.id
            )
            order by l.apiInfo.id asc
            """)
    List<ApiLog> findLatestLogPerApiInfo();

    @Query("""
            select l
            from ApiLog l
            where (:status is null or l.status = :status)
              and (:protocol is null or l.protocol = :protocol)
              and (
                    :keyword is null
                    or lower(l.institution) like lower(concat('%', :keyword, '%'))
                    or lower(l.apiName) like lower(concat('%', :keyword, '%'))
                    or lower(coalesce(l.errorMessage, '')) like lower(concat('%', :keyword, '%'))
                  )
            order by l.createdAt desc
            """)
    List<ApiLog> searchRecent(@Param("status") String status,
                              @Param("protocol") String protocol,
                              @Param("keyword") String keyword,
                              Pageable pageable);
}
