package com.kkh.api_dashboard.service.execution;

import com.kkh.api_dashboard.domain.ApiInfo;
import org.springframework.stereotype.Component;

@Component
public class FileTransferProtocolExecutor extends AbstractProtocolExecutor {

    @Override
    public boolean supports(String protocol) {
        String normalized = safeUpper(protocol);
        return "SFTP".equals(normalized) || "FTP".equals(normalized);
    }

    @Override
    public ExecutionResult execute(ApiInfo apiInfo) {
        String label = "FTP".equals(safeUpper(apiInfo.getProtocol())) ? "FTP" : "SFTP";
        return simulate(apiInfo, label, 450, 1200, 1800, 3000, 74, 12);
    }
}
