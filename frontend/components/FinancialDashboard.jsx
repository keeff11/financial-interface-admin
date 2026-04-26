"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import StatCards from "./dashboard/StatCards";
import TrafficChart from "./dashboard/TrafficChart";
import ApiTable from "./dashboard/ApiTable";
import ApiRegistration from "./dashboard/ApiRegistration";
import MonitoringLogs from "./dashboard/MonitoringLogs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function buildTrafficData(logs) {
  const hourMap = Array.from({ length: 12 }, (_, index) => {
    const hour = index * 2;
    const label = `${String(hour).padStart(2, "0")}:00`;
    return { time: label, calls: 0 };
  });

  logs.forEach((log) => {
    if (!log.checkedAt) return;
    const date = new Date(log.checkedAt);
    if (Number.isNaN(date.getTime())) return;
    const bucket = Math.floor(date.getHours() / 2);
    if (hourMap[bucket]) {
      hourMap[bucket].calls += 1;
    }
  });

  return hourMap;
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [animatedCards, setAnimatedCards] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalCalls: 0,
    successCalls: 0,
    errorCalls: 0,
    delayedCalls: 0,
    activeInterfaces: 0,
  });

  const trafficData = useMemo(() => buildTrafficData(recentLogs), [recentLogs]);
  const alertCount = useMemo(
    () => apiData.filter((item) => item.status === "FAIL" || item.status === "DELAY").length,
    [apiData]
  );

  const fetchDashboardData = async () => {
    try {
      const [summaryResponse, interfacesResponse, logsResponse] = await Promise.all([
        fetch(`${API_BASE}/api/summary`, { cache: "no-store" }),
        fetch(`${API_BASE}/api/interfaces`, { cache: "no-store" }),
        fetch(`${API_BASE}/api/logs/recent`, { cache: "no-store" }),
      ]);

      if (summaryResponse.ok) {
        setSummaryData(await summaryResponse.json());
      }
      if (interfacesResponse.ok) {
        setApiData(await interfacesResponse.json());
      }
      if (logsResponse.ok) {
        setRecentLogs(await logsResponse.json());
      }
    } catch (error) {
      console.error("데이터 통신 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedCards(true), 100);
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0C0D11",
        fontFamily: "'IBM Plex Sans KR', 'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        color: "#E8E9EF",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; border-radius: 10px;
          cursor: pointer; font-size: 13.5px; font-weight: 400;
          color: #666; transition: all 0.2s;
          letter-spacing: -0.01em;
        }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: #ccc; }
        .nav-item.active { background: rgba(255,255,255,0.07); color: #fff; font-weight: 500; }

        .stat-card {
          background: #13141A;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 24px;
          flex: 1;
          min-width: 0;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          transform: translateY(20px);
          position: relative;
          overflow: hidden;
        }
        .stat-card.visible { opacity: 1; transform: translateY(0); }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent, #5B8BFF), transparent);
          opacity: 0.6;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px) !important; }

        .table-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .table-row:hover { background: rgba(255,255,255,0.025); }
        .table-row:last-child { border-bottom: none; }

        .pulse-dot {
          width: 7px; height: 7px; border-radius: 50%;
          display: inline-block;
          animation: pulse-anim 2s infinite;
        }
        @keyframes pulse-anim {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50% { opacity: 0.7; box-shadow: 0 0 6px 3px currentColor; }
        }

        .section-title {
          font-size: 13px;
          font-weight: 500;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 6px;
          font-size: 12px; font-weight: 500;
          font-family: 'IBM Plex Mono', monospace;
        }

        .endpoint-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: #555;
        }
      `}</style>

      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} alertCount={alertCount} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Header />

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
          {activeNav === "dashboard" && (
            <>
              <StatCards summaryData={summaryData} animatedCards={animatedCards} />
              <TrafficChart trafficData={trafficData} summaryData={summaryData} recentLogs={recentLogs} />
              <ApiTable apiData={apiData} />
            </>
          )}

          {activeNav === "api" && <ApiRegistration />}

          {activeNav === "logs" && <MonitoringLogs logs={recentLogs} />}
        </div>
      </div>
    </div>
  );
}
