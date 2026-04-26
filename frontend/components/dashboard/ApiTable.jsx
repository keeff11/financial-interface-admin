"use client";

const statusConfig = {
  SUCCESS: {
    bg: "rgba(0,220,130,0.1)",
    color: "#00DC82",
    dot: "#00DC82",
    label: "정상",
  },
  FAIL: {
    bg: "rgba(255,75,75,0.1)",
    color: "#FF4B4B",
    dot: "#FF4B4B",
    label: "오류",
  },
  DELAY: {
    bg: "rgba(255,190,50,0.1)",
    color: "#FFBE32",
    dot: "#FFBE32",
    label: "지연",
  },
  INACTIVE: {
    bg: "rgba(255,255,255,0.08)",
    color: "#8B90A0",
    dot: "#8B90A0",
    label: "비활성",
  },
  UNKNOWN: {
    bg: "rgba(91,139,255,0.12)",
    color: "#5B8BFF",
    dot: "#5B8BFF",
    label: "대기",
  },
};

const protoColors = {
  REST: "#5B8BFF",
  SOAP: "#C17EFF",
  MQ: "#00DC82",
  BATCH: "#FFBE32",
  SFTP: "#FF4B4B",
};

function formatLastUpdated(apiData) {
  const timestamps = apiData
    .map((row) => row.checkedAt)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (!timestamps.length) return "데이터 없음";

  const latest = new Date(Math.max(...timestamps));
  return latest.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ApiTable({ apiData }) {
  const activeCount = apiData.filter((row) => row.active).length;

  return (
    <div
      style={{
        background: "#13141A",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
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
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>외부 기관 API 상태</div>
          <div style={{ fontSize: 12, color: "#444" }}>
            마지막 갱신: <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#555" }}>{formatLastUpdated(apiData)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { label: `전체 ${apiData.length}`, color: "#5B8BFF" },
            { label: `활성 ${activeCount}`, color: "#00DC82" },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                fontSize: 11.5,
                color: s.color,
                background: `${s.color}12`,
                border: `1px solid ${s.color}30`,
                borderRadius: 6,
                padding: "3px 9px",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["API ID", "기관명", "API 이름", "프로토콜", "상태", "응답속도"].map((h) => (
              <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, color: "#444" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apiData.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "28px 20px", textAlign: "center", color: "#666", fontSize: 13 }}>
                등록된 API가 없습니다.
              </td>
            </tr>
          ) : (
            apiData.map((row) => {
              const sc = statusConfig[row.status] || {
                bg: "rgba(255,255,255,0.1)",
                color: "#fff",
                dot: "#fff",
                label: row.status || "알수없음",
              };
              const protocolColor = protoColors[row.protocol] || "#888";
              const responseTime = row.responseTime == null ? "-" : `${row.responseTime}ms`;
              const responseColor = row.responseTime == null ? "#666" : row.responseTime > 500 ? "#FF4B4B" : "#00DC82";

              return (
                <tr key={row.id} className="table-row">
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: 13, color: "#bbb" }}>#{row.id}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{row.institution}</div>
                  </td>
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
                      <span className="pulse-dot" style={{ background: sc.dot, color: sc.dot, width: 6, height: 6 }} />
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: 12.5, color: responseColor }}>{responseTime}</span>
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
