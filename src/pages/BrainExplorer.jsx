import { Link } from "react-router-dom";
import Header from "../components/Header";
import ExplorerSidebar from "../components/ExplorerSidebar";
import BrainViewer from "../components/BrainViewer";
import MetaboliteSelector from "../components/MetaboliteSelector";
import { useState, useEffect, useRef } from "react";
import { METABOLITE_REGIONS } from "../data/metaboliteRegions";

const TAG_COLOURS = [
  "#ff4444",
  "#ffaa00",
  "#00c896",
  "#64a0ff",
  "#c864ff",
  "#ff8250",
];

function BrainExplorer() {
  const [activeRegions, setActiveRegions] = useState([]);
  const [regionColours, setRegionColours] = useState({});
  const [selectedMetabolites, setSelectedMetabolites] = useState([]);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleMetaboliteChange = (metabolites) => {
    setSelectedMetabolites(metabolites);

    if (metabolites.length === 0) {
      setActiveRegions([]);
      setRegionColours({});
      setDescription(null);
      return;
    }

    const colourMap = {};
    metabolites.forEach((metabolite, i) => {
      const colour = TAG_COLOURS[i % TAG_COLOURS.length];
      const regions = METABOLITE_REGIONS[metabolite] ?? [];
      regions.forEach((region) => {
        colourMap[region] = colour;
      });
    });
    setActiveRegions(Object.keys(colourMap));
    setRegionColours(colourMap);
  };

  useEffect(() => {
    if (selectedMetabolites.length === 0) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const input = `In 2-3 sentences, briefly describe the role of ${selectedMetabolites.join(
          ", "
        )} in Parkinson's disease and which brain regions are affected. Always use complete sentences and correct grammar and punctuation.`;

        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        });

        const data = await response.json();
        setDescription(data.response ?? data.answer ?? data.result ?? null);
      } catch (e) {
        setDescription(null);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [selectedMetabolites]);

  return (
    <>
      <div className="fab-container">
        <div className="fab-label">
          <span className="fab-label-text" style={{ color: "#ffffff" }}>
            How to use
          </span>
          <span className="fab-arrow" style={{ color: "#ffffff" }}>
            →
          </span>
        </div>
        <Link to="/About" title="About this Project" className="fab-button">
          ?
        </Link>
      </div>
      <div className="grain-overlay" />
      <Header />
      <div className="atlas-container-brain-explorer">
        <ExplorerSidebar />
        <main className="explorer-viewer-pane">
          <div className="metabolite-description">
            {selectedMetabolites.length === 0 ? (
              <span className="description-placeholder">
                Select a metabolite(s) to view an AI-generated explanation of its effect in the brain.
              </span>
            ) : loading ? (
              <span className="description-loading">
                <span className="description-spinner" />
              </span>
            ) : description ? (
              <p className="description-text">
                {highlightMetabolites(
                  description,
                  selectedMetabolites,
                  regionColours
                )}
              </p>
            ) : null}
          </div>

          <div style={{ height: "100%", width: "80%" }}>
            <BrainViewer
              activeRegions={activeRegions}
              regionColours={regionColours}
              onRegionClick={(name) => console.log(name)}
            />
          </div>
        </main>

        <aside className="metabolites-list" style={{ overflowY: "auto" }}>
          <MetaboliteSelector onSelectionChange={handleMetaboliteChange} />
        </aside>
      </div>
    </>
  );
}

function highlightMetabolites(text, metabolites, regionColours) {
  if (!text || !metabolites.length) return text;

  const TAG_COLOURS = [
    "#ff4444",
    "#ffaa00",
    "#00c896",
    "#64a0ff",
    "#c864ff",
    "#ff8250",
  ];

  const sorted = [...metabolites].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `(${sorted
      .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "gi"
  );

  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const idx = metabolites.findIndex(
      (m) => m.toLowerCase() === part.toLowerCase()
    );
    if (idx !== -1) {
      const colour = TAG_COLOURS[idx % TAG_COLOURS.length];
      return (
        <span key={i} style={{ color: colour, fontWeight: 600 }}>
          {part}
        </span>
      );
    }
    return part;
  });
}

export default BrainExplorer;
