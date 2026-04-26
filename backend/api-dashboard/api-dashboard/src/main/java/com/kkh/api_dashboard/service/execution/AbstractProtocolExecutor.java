package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;

import java.util.Locale;
import java.util.Random;

public abstract class AbstractProtocolExecutor implements ProtocolExecutor {

    protected final Random random = new Random();

    protected ExecutionResult simulate(ApiInfo apiInfo,
                                       String protocolLabel,
                                       int normalMin,
                                       int normalMax,
                                       int delayedMin,
                                       int delayedMax,
                                       int successRate,
                                       int failRate) {
        String url = safeLower(apiInfo.getTargetUrl());
        int normalResponse = randomBetween(normalMin, normalMax);

        if (url.contains("fail") || url.contains("error")) {
            return new ExecutionResult("FAIL", normalResponse + 150, protocolLabel + " 연결 실패");
        }

        if (url.contains("delay") || url.contains("slow") || url.contains("timeout")) {
            return new ExecutionResult("DELAY", randomBetween(delayedMin, delayedMax), protocolLabel + " 응답 지연");
        }

        int roll = random.nextInt(100);
        if (roll < successRate) {
            return new ExecutionResult("SUCCESS", normalResponse, null);
        }
        if (roll < successRate + failRate) {
            return new ExecutionResult("FAIL", normalResponse + 120, protocolLabel + " 처리 실패");
        }
        return new ExecutionResult("DELAY", randomBetween(delayedMin, delayedMax), protocolLabel + " 처리 지연");
    }

    protected String safeUpper(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private String safeLower(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    protected int randomBetween(int min, int max) {
        return min + random.nextInt((max - min) + 1);
    }
}
