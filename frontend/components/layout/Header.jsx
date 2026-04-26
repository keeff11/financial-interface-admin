"use client";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "#0C0D11",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em" }}>대시보드</div>
        <div style={{ fontSize: 12, color: "#444", marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0,220,130,0.08)",
            border: "1px solid rgba(0,220,130,0.2)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            color: "#00DC82",
          }}
        >
          <span className="pulse-dot" style={{ color: "#00DC82", background: "#00DC82", width: 6, height: 6 }} />
          실시간 모니터링 중
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #5B8BFF, #C17EFF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          관
        </div>
      </div>
    </div>
  );
}
