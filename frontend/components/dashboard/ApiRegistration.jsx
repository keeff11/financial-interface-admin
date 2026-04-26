"use client";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const PROTOCOLS = ["REST", "SOAP", "MQ", "BATCH", "SFTP", "FTP"];

export default function ApiRegistration({ onRefresh }) {
  const [apis, setApis] = useState([]);
  const [formData, setFormData] = useState({
    institution: "",
    apiName: "",
    protocol: "REST",
    targetUrl: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [executingId, setExecutingId] = useState(null);

  const activeCount = useMemo(() => apis.filter((api) => api.active).length, [apis]);

  const fetchApis = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/api-info`, { cache: "no-store" });
      if (res.ok) {
        setApis(await res.json());
      }
    } catch (error) {
      console.error("API 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  const refreshAll = async () => {
    await fetchApis();
    if (onRefresh) {
      await onRefresh();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "등록에 실패했습니다.");
      }

      alert("API가 등록되었습니다.");
      setFormData({ institution: "", apiName: "", protocol: "REST", targetUrl: "", active: true });
      await refreshAll();
    } catch (error) {
      console.error("API 등록 실패:", error);
      alert(error.message || "등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/api-info/${id}/toggle`, { method: "PUT" });
      if (!res.ok) {
        throw new Error("상태 변경에 실패했습니다.");
      }
      await refreshAll();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleExecute = async (id) => {
    setExecutingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/api-info/${id}/execute`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "수동 실행에 실패했습니다.");
      }
      await refreshAll();
      alert("수동 실행이 완료되었습니다.");
    } catch (error) {
      console.error("수동 실행 실패:", error);
      alert(error.message || "수동 실행 중 오류가 발생했습니다.");
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ background: "#13141A", padding: "24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: 12 }}>
          <h3 style={{ fontSize: "16px" }}>신규 API 인터페이스 등록</h3>
          <div style={{ fontSize: "12px", color: "#555", fontFamily: "'IBM Plex Mono', monospace" }}>
            등록 {apis.length}건 · 활성 {activeCount}건
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <input
            type="text"
            placeholder="기관명"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="API 이름"
            value={formData.apiName}
            onChange={(e) => setFormData({ ...formData, apiName: e.target.value })}
            style={inputStyle}
            required
          />
          <select
            value={formData.protocol}
            onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
            style={inputStyle}
          >
            {PROTOCOLS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Target URL / Endpoint"
            value={formData.targetUrl}
            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: "span 2",
              padding: "12px",
              background: loading ? "rgba(91,139,255,0.55)" : "#5B8BFF",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </div>

      <div style={{ background: "#13141A", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["기관", "API명", "프로토콜", "상태", "제어"].map((h) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", color: "#444" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apis.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "24px 20px", color: "#666", fontSize: "13px", textAlign: "center" }}>
                  아직 등록된 API가 없습니다.
                </td>
              </tr>
            ) : (
              apis.map((api) => (
                <tr key={api.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "16px 20px" }}>{api.institution}</td>
                  <td style={{ padding: "16px 20px" }}>{api.apiName}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ color: "#5B8BFF", fontSize: "11px" }}>{api.protocol}</span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>{api.active ? "🟢 활성" : "🔴 차단"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleExecute(api.id)}
                        disabled={executingId === api.id}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "rgba(91,139,255,0.15)",
                          color: "#5B8BFF",
                          border: "none",
                          cursor: executingId === api.id ? "not-allowed" : "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {executingId === api.id ? "실행 중" : "수동 실행"}
                      </button>
                      <button
                        onClick={() => handleToggle(api.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: api.active ? "#FF4B4B20" : "#00DC8220",
                          color: api.active ? "#FF4B4B" : "#00DC82",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {api.active ? "차단하기" : "활성화"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "#0C0D11",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "10px",
  color: "#fff",
};
