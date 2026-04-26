"use client";

const statusConfig = {
  SUCCESS: { bg: "rgba(0,220,130,0.1)", color: "#00DC82", label: "정상" },
  FAIL: { bg: "rgba(255,75,75,0.1)", color: "#FF4B4B", label: "오류" },
  DELAY: { bg: "rgba(255,190,50,0.1)", color: "#FFBE32", label: "지연" },
  INACTIVE: { bg: "rgba(255,255,255,0.08)", color: "#8B90A0", label: "비활성" },
  UNKNOWN: { bg: "rgba(91,139,255,0.12)", color: "#5B8BFF", label: "대기" },
};

const protoColors = {
  REST: "#5B8BFF",
  SOAP: "#C17EFF",
  MQ: "#00DC82",
  BATCH: "#FFBE32",
  SFTP: "#FF4B4B",
};

export default function MonitoringLogs({ logs }) {
  return (
    <div style={{ background: "#13141A", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>모니터링 로그 상세</div>
          <div style={{ fontSize: 12, color: "#444" }}>최근 점검 이력 10건</div>
        </div>
        <span
          style={{
            fontSize: 11.5,
            color: "#5B8BFF",
            background: "#5B8BFF12",
            border: "1px solid #5B8BFF30",
            borderRadius: 6,
            padding: "3px 9px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {logs.length} rows
        </span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["점검시각", "기관명", "API 이름", "프로토콜", "상태", "응답속도"].map((h) => (
              <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, color: "#444" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "28px 20px", textAlign: "center", color: "#666", fontSize: 13 }}>
                아직 표시할 로그가 없습니다.
              </td>
            </tr>
          ) : (
            logs.map((row, index) => {
              const sc = statusConfig[row.status] || { bg: "rgba(255,255,255,0.1)", color: "#fff", label: row.status || "알수없음" };
              const protocolColor = protoColors[row.protocol] || "#888";
              return (
                <tr key={`${row.id}-${row.checkedAt || index}`} className="table-row">
                  <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#bbb", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {row.checkedAt
                      ? new Date(row.checkedAt).toLocaleString("ko-KR", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, fontWeight: 500 }}>{row.institution}</td>
                  <td style={{ padding: "14px 20px" }} title={row.targetUrl || ""}>
                    <span className="endpoint-text">{row.apiName}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: `${protocolColor}15`,
                        color: protocolColor,
                        border: `1px solid ${protocolColor}30`,
                      }}
                    >
                      {row.protocol}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className="badge" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 12.5, color: row.responseTime > 500 ? "#FF4B4B" : "#00DC82" }}>
                    {row.responseTime == null ? "-" : `${row.responseTime}ms`}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
