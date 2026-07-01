import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const C = {
  surface: "#181a23",
  border: "#1a2235",
  accent: "#4af0c4",
  accent2: "#4a8ff0",
  dim: "#334155",
  text: "#c8d6e8",
  muted: "#4a5a72",
  warn: "#f0a84a",
  pink: "#f2aeb1",
};

const getPaperUrl = (source_url) => {
  if (!source_url) return "#";
  if (source_url.startsWith("10.1186") && !source_url.includes("article/")) {
    return `https://molecularneurodegeneration.biomedcentral.com/articles/${source_url}`;
  }
  return `https://doi.org/${source_url}`;
};

function PaperCarousel({ papers = [], isInitialLoad = false }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [papers]);

  if (!papers || papers.length === 0) return null;

  const prev = () => setActive((a) => (a - 1 + papers.length) % papers.length);
  const next = () => setActive((a) => (a + 1) % papers.length);

  const getVisible = () => {
    const result = [];
    const range = papers.length >= 3 ? 1 : 0; 
    
    for (let i = -range; i <= range; i++) {
      const idx = (active + i + papers.length) % papers.length;
      if (!result.some(item => item.paper.source_url === papers[idx].source_url)) {
        result.push({ paper: papers[idx], offset: i });
      }
    }
    return result;
  };

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
          {isInitialLoad ? "Featured Papers" : "Top Matches Found"}
        </span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 11, color: C.muted, fontFamily: "'DM Mono', monospace" }}>
          {active + 1} / {papers.length}
        </span>
      </div>

      <div style={{ position: "relative", height: 200, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {getVisible().map(({ paper, offset }) => (
          <a
            key={paper.source_url}
            href={getPaperUrl(paper.source_url)}
            target="_blank"
            rel="noreferrer"
            style={{
              position: "absolute",
              width: offset === 0 ? 480 : 340,
              transform: `translateX(${offset * 420}px) scale(${offset === 0 ? 1 : 0.85})`,
              opacity: offset === 0 ? 1 : 0.4,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              textDecoration: "none",
              zIndex: offset === 0 ? 2 : 1,
              pointerEvents: offset === 0 ? "auto" : "none",
            }}
          >
            <div style={{
              background: C.surface,
              border: `1px solid ${offset === 0 ? C.accent : C.border}`,
              borderRadius: 12,
              padding: "20px 24px",
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: offset === 0 ? `0 0 30px rgba(74, 240, 196, 0.08)` : "none",
              transition: "border-color 0.4s",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, background: `rgba(74, 240, 196, 0.1)`, color: C.accent, padding: "2px 8px", borderRadius: 4, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
                    {paper.source_url || "DOI"}
                  </span>
                  <span style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>
                    {"PMID " + paper.pmid || "PMID"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {paper.title}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
        <button onClick={prev} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>←</button>
        <div style={{ display: "flex", gap: 6 }}>
          {papers.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, border: "none", background: i === active ? C.accent : C.border, cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
            />
          ))}
        </div>
        <button onClick={next} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>→</button>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function ResultCard({ result, index }) {
  return (
    <a href={getPaperUrl(result.source_url)} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
      <div
        style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 24px", display: "flex", gap: 20, alignItems: "flex-start", cursor: "pointer", transition: "border-color 0.2s", position: "relative", overflow: "hidden" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: C.accent, borderRadius: "10px 0 0 10px", opacity: 0.5 }} />
        <div style={{ minWidth: 28, height: 28, borderRadius: 6, background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.accent, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
            {result.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, color: C.accent2, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
              {result.source_url}
            </span>
          </div>
        </div>
        <span style={{ fontSize: 16, color: C.muted, flexShrink: 0, marginTop: 2 }}>↗</span>
      </div>
    </a>
  );
}

function EmptyState({ query }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
      <span style={{ fontSize: 32 }}>∅</span>
      <span style={{ color: C.muted, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em" }}>
        NO RESULTS FOR "{query.toUpperCase()}"
      </span>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 16 }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <span style={{ color: C.muted, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em" }}>
        SEARCHING CORPUS
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default function LiteratureReview() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [carouselPapers, setCarouselPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search?query=parkinson&limit=10`);
        const data = await res.json();
        setCarouselPapers(data.results || []);
      } catch (e) {
        console.error("Failed to seed initial carousel data:", e);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search?query=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      setResults(data.results || []);
      setCarouselPapers(data.results || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <div className="fab-container">
        <Link to="/About" title="About this Project" className="fab-button">?</Link>
      </div>

      <div className="grain-overlay" />
      <Header />

      <div className="atlas-container" style={{ height: "auto", minHeight: "100vh" }}>
        <Sidebar />

        <main className="viewer-pane base-pane" style={{ background: "#13151d" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, fontFamily: "'Syne', sans-serif", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>
                Search the Knowledge Base
              </h1>
              <p style={{ color: C.muted, fontSize: 13, fontFamily: "'DM Mono', monospace", lineHeight: 1.6, margin: 0 }}>
                Search for metabolites, pathways, or biomarkers across all indexed publications. Returns the most relevant paper for each unique source.
              </p>
            </div>

            <PaperCarousel papers={carouselPapers} isInitialLoad={!searched} />

            <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. dopamine, alpha-synuclein, oxidative stress..."
                style={{ flex: 1, padding: "14px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = C.accent)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                style={{ padding: "14px 28px", borderRadius: 8, border: "none", background: loading || !query.trim() ? C.border : C.accent, color: loading || !query.trim() ? C.muted : "#13151d", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", cursor: loading || !query.trim() ? "not-allowed" : "pointer", transition: "background 0.2s", whiteSpace: "nowrap" }}
              >
                SEARCH
              </button>
            </div>

            {loading && <LoadingPulse />}

            {!loading && searched && (
              <div>
                <SectionTitle>
                  {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                </SectionTitle>
                {results.length === 0 ? (
                  <EmptyState query={query} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {results.map((result, i) => (
                      <ResultCard key={result.source_url} result={result} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!searched && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SectionTitle>Suggested searches</SectionTitle>
                {[
                  "dopamine",
                  "alpha-synuclein",
                  "oxidative stress",
                  "mitochondrial dysfunction",
                  "gut microbiome",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 20px", color: C.muted, fontSize: 13, fontFamily: "'DM Mono', monospace", cursor: "pointer", textAlign: "left", transition: "border-color 0.2s, color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                  >
                    {term} →
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}