import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import AtlasManagerSidebar from "../components/AtlasManagerSidebar";

function buildDocs(docs) {
  return docs.map((doc, i) => ({
    id: i,
    title: doc.title,
    doi: doc.doi,
    chunks: doc.chunks,
    date: doc.ingested_at
      ? new Date(doc.ingested_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Unknown",
  }));
}

function KnowledgeGraph({ keywords }) {
  const width = 420;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;

  const top = keywords.slice(0, 20);
  const maxFreq = top[0]?.freq || 1;
  const minFreq = top[top.length - 1]?.freq || 1;

  const normalize = (freq) =>
    minFreq === maxFreq
      ? 0.5
      : (freq - minFreq) / (maxFreq - minFreq);

  const hub = { id: "hub", label: "Parkinson's\nMetabolomics", x: cx, y: cy, r: 28, freq: maxFreq };

  const inner = top.slice(0, 7);
  const outer = top.slice(7, 20);

  const innerRadius = 100;
  const outerRadius = 160;

  const innerNodes = inner.map((kw, i) => {
    const angle = (2 * Math.PI * i) / inner.length - Math.PI / 2;
    return {
      id: kw.word,
      label: kw.word,
      x: cx + innerRadius * Math.cos(angle),
      y: cy + innerRadius * Math.sin(angle),
      r: 6 + normalize(kw.freq) * 10,
      freq: kw.freq,
      ring: "inner",
    };
  });

  const outerNodes = outer.map((kw, i) => {
    const angle = (2 * Math.PI * i) / outer.length - Math.PI / 2;
    return {
      id: kw.word,
      label: kw.word,
      x: cx + outerRadius * Math.cos(angle),
      y: cy + outerRadius * Math.sin(angle),
      r: 4 + normalize(kw.freq) * 7,
      freq: kw.freq,
      ring: "outer",
    };
  });

  const allNodes = [...innerNodes, ...outerNodes];

  const edges = [];
  innerNodes.forEach((n) => edges.push({ x1: hub.x, y1: hub.y, x2: n.x, y2: n.y, strong: true }));
  outerNodes.forEach((n) => {
    const nearest = innerNodes.reduce((best, inn) => {
      const d = Math.hypot(inn.x - n.x, inn.y - n.y);
      return d < best.d ? { node: inn, d } : best;
    }, { node: innerNodes[0], d: Infinity });
    edges.push({ x1: nearest.node.x, y1: nearest.node.y, x2: n.x, y2: n.y, strong: false });
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1}
          x2={e.x2} y2={e.y2}
          stroke={e.strong ? "#2e4a3e" : "#1e2d28"}
          strokeWidth={e.strong ? 1.5 : 0.8}
        />
      ))}

      <circle cx={hub.x} cy={hub.y} r={hub.r} fill="#1a2e24" stroke="#3a6b4a" strokeWidth={1.5} />
      <text x={hub.x} y={hub.y - 5} textAnchor="middle" fontSize="6.5" fill="#7a9d52" fontWeight="600">
        Parkinson's
      </text>
      <text x={hub.x} y={hub.y + 6} textAnchor="middle" fontSize="6.5" fill="#7a9d52" fontWeight="600">
        Metabolomics
      </text>

      {innerNodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r} fill="#1a2e24" stroke="#4b8a5a" strokeWidth={1} />
          <text
            x={n.x}
            y={n.y > cy ? n.y + n.r + 9 : n.y - n.r - 3}
            textAnchor="middle"
            fontSize="6"
            fill="#7e9e8a"
          >
            {n.label}
          </text>
        </g>
      ))}

      {outerNodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r} fill="#151e1a" stroke="#2e4a3e" strokeWidth={0.8} />
          <text
            x={n.x}
            y={n.y > cy ? n.y + n.r + 8 : n.y - n.r - 3}
            textAnchor="middle"
            fontSize="5.5"
            fill="#4b6a58"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function buildStats(data) {
  return [
    {
      label: "Papers indexed",
      value: data.total_papers.toString(),
      sub: `${data.full_text_count} with full text`,
    },
    {
      label: "Total chunks",
      value: data.total_chunks.toLocaleString(),
      sub: `Avg ${data.avg_chunks_per_paper} per document`,
    },
    {
      label: "Embedding model",
      value: "S-PubMedBert",
      sub: "MS-MARCO · 768-dim",
    },
    {
      label: "Database",
      value: "PostgreSQL",
      sub: "pgvector extension",
    },
  ];
}

const RAG_PARAMS = [
  {
    label: "Initial top-k retrieval",
    value: "20",
    desc: "Chunks retrieved per query",
  },
  {
    label: "Top-k after re-ranking",
    value: "10",
    desc: "Final chunks passed to LLM",
  },
  {
    label: "Chat AI context window",
    value: "12,288",
    desc: "Tokens",
  },
  {
    label: "3-D Atlas context window",
    value: "4,096",
    desc: "Tokens",
  },
  { label: "Re-ranker", value: "FlashRank", desc: "Cross-encoder re-ranking" },
  { label: "Temperature", value: "0.0", desc: "Deterministic output" },
];

const STATUS_ITEMS = [
  { label: "FastAPI backend — online (port 8000)", ok: true },
  { label: "PostgreSQL + pgvector — connected", ok: true },
  { label: "Ollama (Llama3) — running locally", ok: true },
];

function StatCard({ label, value, sub, small }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div
        style={{ ...styles.statValue, ...(small ? styles.statValueSmall : {}) }}
      >
        {value}
      </div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

function SectionLabel({ children, style }) {
  return <p style={{ ...styles.sectionLabel, ...style }}>{children}</p>;
}

function DocItem({ doc }) {
  return (
    <div style={styles.docItem}>
      <div style={styles.docInfo}>
        {doc.doi ? (
          <a
            href={`https://doi.org/${doc.doi}`}
            target="_blank"
            rel="noreferrer"
            style={styles.docTitleLink}
          >
            {doc.title}
          </a>
        ) : (
          <div style={styles.docTitle}>{doc.title}</div>
        )}
        <div style={styles.docMeta}>
          {doc.doi && <span style={styles.docdoi}>{doc.doi} · </span>}
          {doc.chunks} chunks · {doc.date}
        </div>
      </div>
      <div style={styles.docActions}>
        <button style={styles.deleteBtn}>delete</button>
      </div>
    </div>
  );
}

function LogItem({ log }) {
  return (
    <div style={styles.logItem}>
      <div style={styles.logQuery}>"{log.query}"</div>
      <div style={styles.logMeta}>
        <span>{log.time}</span>
        <span style={styles.logSrc}>{log.sources} sources retrieved</span>
      </div>
    </div>
  );
}

function ParamItem({ label, value, desc }) {
  return (
    <div style={styles.paramItem}>
      <div style={styles.paramLabel}>{label}</div>
      <div style={styles.paramValue}>{value}</div>
      <div style={styles.paramDesc}>{desc}</div>
    </div>
  );
}

function StatusItem({ label, ok }) {
  return (
    <div style={styles.statusRow}>
      <div
        style={{ ...styles.statusDot, ...(ok ? {} : styles.statusDotWarn) }}
      />
      <div style={styles.statusText}>{label}</div>
    </div>
  );
}

function AtlasManager() {
  const [stats, setStats] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch((e) => setError(e.message));

    fetch("http://localhost:8000/api/dashboard/keywords")
      .then((r) => r.json())
      .then((data) => setKeywords(data.keywords))
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

  return (
    <>
      <div className="grain-overlay" />
      <Header />
      <div className="atlas-container">
        <AtlasManagerSidebar />
        <main style={styles.main}>
          <div style={styles.content}>
            <SectionLabel>System overview</SectionLabel>
            <div style={styles.statsGrid}>
              {stats
                ? buildStats(stats).map((s) => (
                    <StatCard key={s.label} {...s} />
                  ))
                : [
                    { label: "Papers indexed" },
                    { label: "Total chunks" },
                    { label: "Embedding model" },
                    { label: "Database" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{ ...styles.statCard, opacity: 0.4 }}
                    >
                      <div style={styles.statLabel}>{s.label}</div>
                      <div
                        style={{
                          ...styles.statValue,
                          background: "#2a2d3a",
                          borderRadius: 4,
                          height: "1.6rem",
                          width: "60%",
                        }}
                      />
                    </div>
                  ))}
            </div>

            <div style={styles.grid2}>
              <div>
                <SectionLabel>Knowledge base</SectionLabel>
                <div style={styles.panel} className="kb">
                  <div style={styles.uploadArea}>
                    <div style={styles.uploadIcon}>↑</div>
                    <div style={styles.uploadText}>
                      <span style={styles.uploadHighlight}>
                        Click to upload
                      </span>{" "}
                      or drag PDF here
                    </div>
                    <div style={styles.uploadText}>
                      Processed via Docling ETL pipeline
                    </div>
                  </div>
                  <button style={styles.indexBtn}>Index document</button>
                  <div style={styles.divider} />
                  <div style={styles.docList}>
                    {stats?.recent_docs ? (
                      buildDocs(stats.recent_docs).map((doc) => (
                        <DocItem key={doc.id} doc={doc} />
                      ))
                    ) : (
                      <div style={{ color: "#3d5a5e", fontSize: "0.75rem" }}>
                        Loading...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel>Knowledge graph</SectionLabel>
                <div style={styles.panel}>
                  {keywords ? (
                    <KnowledgeGraph keywords={keywords} />
                  ) : (
                    <div
                      style={{
                        color: "#3d5a5e",
                        fontSize: "0.75rem",
                        padding: "1rem",
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>

                <SectionLabel style={{ marginTop: "1.5rem" }}>
                  RAG configuration
                </SectionLabel>
                <div style={styles.panel}>
                  <div style={styles.paramsGrid}>
                    {RAG_PARAMS.map((p) => (
                      <ParamItem key={p.label} {...p} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <SectionLabel>System status</SectionLabel>
            <div style={{ ...styles.panel, marginBottom: "2rem" }}>
              <div style={styles.statusGrid}>
                {[0, 1, 2].map((col) => (
                  <div key={col}>
                    {STATUS_ITEMS.filter((_, i) => i % 3 === col).map(
                      (item) => (
                        <StatusItem key={item.label} {...item} />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  main: {
    background: "#13151d",
    overflowY: "auto",
    height: "100vh",
  },
  content: {
    padding: "7rem 2.5rem 2.5rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "2rem",
  },
  statCard: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
  },
  statLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#4b595d",
    marginBottom: "0.4rem",
  },
  statValue: {
    fontSize: "1.6rem",
    fontWeight: 600,
    color: "#c8d0d4",
  },
  statValueSmall: {
    fontSize: "1rem",
    paddingTop: "0.4rem",
  },
  statSub: {
    fontSize: "0.7rem",
    color: "#3d5a5e",
    marginTop: "0.25rem",
  },
  sectionLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#4b595d",
    fontWeight: 600,
    borderBottom: "1px solid #2a2d3a",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  panel: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    padding: "1.25rem",
  },
  uploadArea: {
    border: "1px dashed #2e3545",
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "center",
    marginBottom: "1rem",
    cursor: "pointer",
  },
  uploadIcon: {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
    color: "#4b595d",
  },
  uploadText: {
    fontSize: "0.8rem",
    color: "#4b595d",
    marginTop: "4px",
  },
  uploadHighlight: {
    color: "#7a9d52",
  },
  indexBtn: {
    background: "rgba(122, 157, 82, 0.15)",
    color: "#7a9d52",
    border: "1px solid rgba(122, 157, 82, 0.3)",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
    letterSpacing: "0.05em",
    width: "100%",
  },
  divider: {
    height: "1px",
    background: "#22252f",
    margin: "1rem 0",
  },
  docList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    maxHeight: "690px",
  },
  docItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#13151d",
    border: "1px solid #22252f",
    borderRadius: "6px",
    padding: "10px 12px",
    maxWidth: "600px",
  },
  docInfo: {
    flex: 1,
    minWidth: 0,
  },
  docTitle: {
    fontSize: "0.78rem",
    color: "#b0bec5",
    marginBottom: "2px",
  },
  docTitleLink: {
    fontSize: "0.78rem",
    color: "#b0bec5",
    marginBottom: "2px",
    textDecoration: "underline",
    lineHeight: "1.4",
    display: "block",
  },
  docMeta: {
    fontSize: "0.65rem",
    color: "#3d5a5e",
  },
  docActions: {
    display: "flex",
    gap: "6px",
    flexShrink: 0,
    marginLeft: "8px",
    alignItems: "center",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.6rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    padding: "2px 7px",
    borderRadius: "20px",
  },
  badgeOk: {
    background: "rgba(122,157,82,0.15)",
    color: "#7a9d52",
  },
  badgeWarn: {
    background: "rgba(255,170,0,0.12)",
    color: "#c8940a",
  },
  deleteBtn: {
    background: "rgba(255,70,42,0.08)",
    color: "#7a3a2a",
    border: "none",
    cursor: "pointer",
    fontSize: "0.7rem",
    padding: "4px 8px",
    borderRadius: "4px",
    letterSpacing: "0.04em",
  },
  logList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    maxHeight: "260px",
    overflowY: "auto",
  },
  logItem: {
    background: "#13151d",
    border: "1px solid #22252f",
    borderRadius: "6px",
    padding: "10px 12px",
  },
  logQuery: {
    fontSize: "0.78rem",
    color: "#8fa8b0",
    fontFamily: "'DM Mono', monospace",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logMeta: {
    fontSize: "0.65rem",
    color: "#3d5a5e",
    display: "flex",
    gap: "1rem",
  },
  logSrc: {
    color: "#4b6a70",
  },
  paramsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  paramItem: {
    background: "#13151d",
    border: "1px solid #22252f",
    borderRadius: "6px",
    padding: "10px 12px",
  },
  paramLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#4b595d",
    marginBottom: "4px",
  },
  paramValue: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#7a9d52",
  },
  paramDesc: {
    fontSize: "0.65rem",
    color: "#3d5a5e",
    marginTop: "2px",
  },
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#79c522",
    boxShadow: "0 0 6px #79c522",
    flexShrink: 0,
  },
  statusDotWarn: {
    background: "#c8940a",
    boxShadow: "0 0 6px #c8940a",
  },
  statusText: {
    fontSize: "0.78rem",
    color: "#7e7b7b",
  },
};

export default AtlasManager;
