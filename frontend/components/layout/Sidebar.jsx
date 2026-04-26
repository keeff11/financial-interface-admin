"use client";

const navItems = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "api",
    label: "API 등록",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "logs",
    label: "모니터링 로그",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeNav, setActiveNav, alertCount = 0 }) {
  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#0E0F14",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 8px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #5B8BFF 0%, #C17EFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.02em" }}>FinBridge</span>
        </div>
        <div style={{ fontSize: 10.5, color: "#3D3F4D", paddingLeft: 36, fontFamily: "'IBM Plex Mono', monospace" }}>
          금융 IT 통합관리
        </div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div className="section-title" style={{ paddingLeft: 8 }}>
          메인
        </div>
        {navItems.map((item) => (
          <div key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`} onClick={() => setActiveNav(item.id)}>
            <span style={{ opacity: activeNav === item.id ? 1 : 0.5 }}>{item.icon}</span>
            {item.label}
            {item.id === "logs" && alertCount > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "#FF4B4B",
                  color: "#fff",
                  borderRadius: 4,
                  fontSize: 10,
                  padding: "1px 6px",
                  fontWeight: 600,
                }}
              >
                {alertCount}
              </span>
            )}
          </div>
        ))}
      </nav>

      <div
        style={{
          background: "#13141A",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: "12px 14px",
        }}
      >
        <div style={{ fontSize: 11, color: "#444", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>SYSTEM STATUS</div>
        {[
          { label: "API Gateway", ok: true },
          { label: "Auth Server", ok: true },
          { label: "Log Stream", ok: true },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{s.label}</span>
            <span
              className="pulse-dot"
              style={{
                color: s.ok ? "#00DC82" : "#FF4B4B",
                background: s.ok ? "#00DC82" : "#FF4B4B",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
