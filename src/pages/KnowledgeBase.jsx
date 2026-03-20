import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const C = {
  surface: "#181a23",
  border: "#1a2235",
  accent: "#4af0c4",
  accent2: "#4a8ff0",
  dim: "#334155",
  text: "#c8d6e8",
  muted: "#4a5a72",
  warn: "#f0a84a",
};

const BAR_COLOURS = [
  "#4af0c4",
  "#4a8ff0",
  "#f0a84a",
  "#f04a7a",
  "#a84af0",
  "#4af04a",
  "#f0c44a",
  "#4af0f0",
];

function StatCard({ label, value, sub, accent = C.accent }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: accent,
          borderRadius: "10px 0 0 10px",
        }}
      />
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: C.muted,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: C.text,
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1,
        }}
      >
        {value?.toLocaleString() ?? "—"}
      </span>
      {sub && (
        <span
          style={{
            fontSize: 12,
            color: C.muted,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: C.accent,
          fontFamily: "'DM Mono', monospace",
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "8px 12px",
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: C.text,
      }}
    >
      <div style={{ color: C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ color: C.accent }}>
        {payload[0].value?.toLocaleString()}
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: `2px solid ${C.border}`,
          borderTop: `2px solid ${C.accent}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <span
        style={{
          color: C.muted,
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
        }}
      >
        QUERYING DATABASE
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function CoverageDonut({ full, total }) {
  const pct = total > 0 ? Math.round((full / total) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - pct / 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r="36"
            fill="none"
            stroke={C.border}
            strokeWidth="8"
          />
          <circle
            cx="45"
            cy="45"
            r="36"
            fill="none"
            stroke={C.accent}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 18,
            fontWeight: 700,
            color: C.text,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {pct}%
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.accent,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: C.text,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {full} full text
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.border,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: C.muted,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {total - full} abstract only
          </span>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeBase() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error)
    return (
      <div
        style={{
          padding: 40,
          color: "#f04a4a",
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
        }}
      >
        Failed to load dashboard: {error}
      </div>
    );

  if (!stats) return <LoadingPulse />;

  return (
    <div>
      <div className="fab-container">
        <div className="fab-label">
          <span className="fab-label-text">How to use</span>
          <span className="fab-arrow">→</span>
        </div>
        <Link to="/About" title="About this Project" className="fab-button">
          ?
        </Link>
      </div>

      <div className="grain-overlay" />

      <Header />

      <div className="atlas-container">
        <Sidebar />

        <main className="viewer-pane base-pane">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginBottom: 40,
            }}
          >
            <StatCard
              label="Total Papers"
              value={stats.total_papers}
              sub="unique publications"
              accent={C.accent}
            />
            <StatCard
              label="Total Chunks"
              value={stats.total_chunks}
              sub="indexed text segments"
              accent={C.accent2}
            />
            <StatCard
              label="Full Text"
              value={stats.full_text_count}
              sub="papers with full content"
              accent="#4af04a"
            />
            <StatCard
              label="Avg Chunks"
              value={stats.avg_chunks_per_paper}
              sub="per full-text paper"
              accent={C.warn}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: 24,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 24,
                width: 1000,
              }}
            >
              <SectionTitle>Full Text Coverage</SectionTitle>
              <CoverageDonut
                full={stats.full_text_count}
                total={stats.total_papers}
              />
              <p
                style={{
                  color: C.muted,
                  fontSize: 12,
                  marginTop: 16,
                  lineHeight: 1.6,
                }}
              >
                Full text provides richer semantic context for RAG retrieval.
                Abstract-only papers still contribute metadata and key claims.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
