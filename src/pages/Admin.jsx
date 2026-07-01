import { useEffect, useState } from "react";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

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
  const width = 360;
  const height = 390;
  const cx = width / 2;
  const cy = height / 2;

  const top = keywords.slice(0, 20);
  const maxFreq = top[0]?.freq || 1;
  const minFreq = top[top.length - 1]?.freq || 1;

  const normalize = (freq) =>
    minFreq === maxFreq
      ? 0.5
      : (freq - minFreq) / (maxFreq - minFreq);

  const hub = { id: "hub", label: "Parkinson's\nMetabolomics", x: cx, y: cy, r: 36, freq: maxFreq };

  const inner = top.slice(0, 7);
  const outer = top.slice(7, 20);

  const innerRadius = 105;
  const outerRadius = 165;

  const innerNodes = inner.map((kw, i) => {
    const angle = (2 * Math.PI * i) / inner.length - Math.PI / 2;
    return {
      id: kw.word,
      label: kw.word,
      x: cx + innerRadius * Math.cos(angle),
      y: cy + innerRadius * Math.sin(angle),
      r: 10 + normalize(kw.freq) * 12,
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
      r: 6 + normalize(kw.freq) * 7,
      freq: kw.freq,
      ring: "outer",
    };
  });

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
      <text x={hub.x} y={hub.y - 4} textAnchor="middle" fontSize="9" fill="#8CC0EB" fontWeight="600">
        Parkinson's
      </text>
      <text x={hub.x} y={hub.y + 8} textAnchor="middle" fontSize="8" fill="#8CC0EB" fontWeight="600">
        Metabolomics
      </text>

      {innerNodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r} fill="#1a2e24" stroke="#4b8a5a" strokeWidth={1} />
          <text
            x={n.x}
            y={n.y > cy ? n.y + n.r + 10 : n.y - n.r - 4}
            textAnchor="middle"
            fontSize="7"
            fill="#8CC0EB"
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
            y={n.y > cy ? n.y + n.r + 9 : n.y - n.r - 4}
            textAnchor="middle"
            fontSize="6"
            fill="#8CC0EB"
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
    </div>
  );
}

function Admin() {
  const [stats, setStats] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch((e) => setError(e.message));

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/keywords`)
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
        <AdminSidebar />
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
                <SectionLabel>Knowledge base - Recent downloads</SectionLabel>
                <div style={styles.panel} className="kb">
                  <div style={styles.docList}>
                    {stats?.recent_docs ? (
                      buildDocs(stats.recent_docs).map((doc) => (
                        <DocItem key={doc.id} doc={doc} />
                      ))
                    ) : (
                      <div style={{ color: "#BFDDF0", fontSize: "0.75rem" }}>
                        Loading...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel>Most common keywords</SectionLabel>
                <div style={styles.panel}>
                  {keywords ? (
                    <KnowledgeGraph keywords={keywords} />
                  ) : (
                    <div
                      style={{
                        color: "#BFDDF0",
                        fontSize: "0.75rem",
                        padding: "1rem",
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>
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
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#4D6C86",
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
    color: "#BFDDF0",
    marginTop: "0.25rem",
  },
  sectionLabel: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#4D6C86",
    fontWeight: 600,
    borderBottom: "1px solid #2a2d3a",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  panel: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    padding: "1.25rem",
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
    maxHeight: "850px",
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
    color: "#8CC0EB",
    marginBottom: "2px",
  },
  docTitleLink: {
    fontSize: "0.9rem",
    color: "#8CC0EB",
    marginBottom: "2px",
    textDecoration: "none",
    lineHeight: "1.4",
    display: "block",
  },
  docMeta: {
    fontSize: "0.85rem",
    color: "#4D6C86",
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
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#4D6C86",
    marginBottom: "4px",
  },
  paramValue: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#7a9d52",
  },
  paramDesc: {
    fontSize: "0.85rem",
    color: "#BFDDF0",
    marginTop: "2px",
  }
};

export default Admin;
