import { Link } from "react-router-dom";

const NAV_LINKS = [
  { path: "/", label: "Overview" },
  { path: "/BrainExplorer", label: "Neural Atlas" },
  { path: "/LiteratureReview", label: "Literature Search" },
  { path: "/ChatAI", label: "Knowledge Base" },
];

const C = {
  bg: "#0e1018",
  border: "#1a2235",
  text: "#c8d6e8",
  muted: "#4a5a72",
  accent: "#526963",
};

export default function Footer() {
  return (
    <footer style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      padding: "48px 60px 32px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 48,
        marginBottom: 40,
      }}>

        <div>
          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C.text,
            }}>
              Parkinson's
            </span>
            <span style={{
              display: "block",
              fontSize: 10,
              fontWeight: 400,
              color: C.muted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 2,
            }}>
              Metabolic Atlas
            </span>
          </div>
          <p style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.7,
            maxWidth: 340,
            margin: "0 0 20px",
          }}>
            A Retrieval-Augmented Generation pipeline for Parkinson's Disease
            metabolomics research, combining a curated PubMed corpus with an
            interactive 3D neuroanatomical visualizer.
          </p>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 11,
            color: C.muted,
            fontFamily: "'DM Mono', monospace",
          }}>
            <span>Author · Pilar Rosario Bourg</span>
            <span>Supervisors · Alberto Gil de la Fuente · Constantino García Martínez</span>
            <span>Trabajo Fin de Grado · Universidad CEU San Pablo · 2026</span>
          </div>
        </div>

        <div>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: C.accent,
            fontFamily: "'DM Mono', monospace",
            display: "block",
            marginBottom: 16,
          }}>
            Navigation
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  fontSize: 12,
                  color: C.muted,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: C.accent,
            fontFamily: "'DM Mono', monospace",
            display: "block",
            marginBottom: 16,
          }}>
            Data Sources
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { href: "https://pubmed.ncbi.nlm.nih.gov", label: "PubMed / PMC" },
              { href: "https://3d.nih.gov/entries/3DPX-021161", label: "NIH 3D Brain Model · 3DPX-021161" },
              { href: "https://unpaywall.org", label: "Unpaywall API" },
              { href: "https://eutils.ncbi.nlm.nih.gov", label: "NCBI Entrez API" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 12,
                  color: C.muted,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: `1px solid ${C.border}`,
        paddingTop: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: 11,
          color: C.muted,
          fontFamily: "'DM Mono', monospace",
        }}>
          © 2026 Pilar Rosario Bourg · Universidad CEU San Pablo
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color: C.muted,
              textDecoration: "none",
              fontFamily: "'DM Mono', monospace",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >
            Source Code
          </a>
        </div>
      </div>
    </footer>
  );
}