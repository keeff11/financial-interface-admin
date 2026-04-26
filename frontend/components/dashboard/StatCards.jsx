"use client";

export default function StatCards({ summaryData, animatedCards }) {
  const cards = [
    {
      label: "활성 API 수",
      value: summaryData.activeInterfaces,
      unit: "개",
      sub: "현재 점검 대상",
      accent: "#5B8BFF",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      label: "정상 응답",
      value: summaryData.successCalls,
      unit: "건",
      sub: "누적 정상 처리",
      accent: "#00DC82",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "오류 응답",
      value: summaryData.errorCalls,
      unit: "건",
      sub: "누적 오류 처리",
      accent: "#FF4B4B",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: "지연 응답",
      value: summaryData.delayedCalls,
      unit: "건",
      sub: "누적 지연 처리",
      accent: "#C17EFF",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`stat-card ${animatedCards ? "visible" : ""}`}
          style={{
            "--accent": card.accent,
            transitionDelay: `${i * 80}ms`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#555", letterSpacing: "-0.01em" }}>{card.label}</div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `${card.accent}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.accent,
              }}
            >
              {card.icon}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em", color: "#fff" }}>
              {(card.value ?? 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: "#555" }}>{card.unit}</span>
          </div>
          <div style={{ fontSize: 11.5, color: card.accent === "#FF4B4B" ? "#FF4B4B" : "#444" }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
