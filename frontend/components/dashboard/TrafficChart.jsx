"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#16181F",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          padding: "10px 16px",
          fontSize: "13px",
          color: "#fff",
        }}
      >
        <div style={{ color: "#888", marginBottom: 4 }}>{label}</div>
        <div style={{ color: "#00DC82", fontWeight: 600 }}>{payload[0].value.toLocaleString()} 건</div>
      </div>
    );
  }
  return null;
};

export default function TrafficChart({ trafficData, summaryData, recentLogs }) {
  const responseTimes = recentLogs.map((log) => log.responseTime).filter((value) => Number.isFinite(value));
  const averageResponse = responseTimes.length
    ? `${Math.round(responseTimes.reduce((acc, cur) => acc + cur, 0) / responseTimes.length)}ms`
    : "-";
  const errorRate = `${((summaryData.errorCalls / Math.max(summaryData.totalCalls, 1)) * 100).toFixed(2)}%`;
  const peakResponse = responseTimes.length ? `${Math.max(...responseTimes)}ms` : "-";
  const successRate = `${((summaryData.successCalls / Math.max(summaryData.totalCalls, 1)) * 100).toFixed(2)}%`;

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div
        style={{
          flex: 2,
          background: "#13141A",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>API 호출 트래픽</div>
            <div style={{ fontSize: 12, color: "#444" }}>최근 점검 기준 · 시간대별 호출 수</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "1D", active: true },
              { label: "Recent", active: false },
              { label: "Live", active: false },
            ].map((t) => (
              <button
                key={t.label}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11.5,
                  cursor: "default",
                  background: t.active ? "rgba(91,139,255,0.15)" : "transparent",
                  border: `1px solid ${t.active ? "rgba(91,139,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: t.active ? "#5B8BFF" : "#555",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trafficData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8BFF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5B8BFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#444", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#444", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#5B8BFF"
              strokeWidth={2}
              fill="url(#trafficGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#5B8BFF", stroke: "#0C0D11", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          flex: 1,
          background: "#13141A",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>오늘의 요약</div>
          <div style={{ fontSize: 12, color: "#444" }}>최근 로그 기준</div>
        </div>

        {[
          { label: "평균 응답속도", value: averageResponse, change: "최근 10건 기준", good: true },
          { label: "오류율", value: errorRate, change: "전체 누적 기준", good: false },
          { label: "최대 응답시간", value: peakResponse, change: "최근 10건 중 최대", good: true },
          { label: "정상 비율", value: successRate, change: "누적 성공 비율", good: true },
        ].map((item) => (
          <div key={item.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: 12, color: "#555" }}>{item.label}</span>
              <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em" }}>{item.value}</span>
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: item.good ? "#00DC82" : "#FF4B4B" }}>{item.change}</div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginTop: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
