import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import AboutSidebar from "../components/AboutSidebar";
import brain1 from "../assets/brain_1.png";
import brain2 from "../assets/brain_2.png";
import brain3 from "../assets/brain_3.png";
import brain4 from "../assets/brain_4.png";
import brain5 from "../assets/brain_5.png";
import brain6 from "../assets/brain_6.png";
import brain7 from "../assets/brain_7.png";

const BRAIN_FRAMES = [brain1, brain2, brain3, brain4, brain5, brain6, brain7];

const FEATURES = [
  {
    number: "01",
    title: "Brain Explorer",
    description:
      "Navigate to the Brain Explorer to interact with the 3D neuroanatomical model. Select one or more metabolites from the panel on the right — the corresponding brain regions will illuminate in distinct colours. Press Generate explanation to receive an AI-generated summary of the selected metabolites and their role in Parkinson's Disease pathology.",
    steps: [
      "Select one or more metabolites from the right-hand panel",
      "Observe the highlighted regions on the 3D brain model",
      "Click Generate explanation to query the RAG pipeline",
      "Rotate and explore the brain model by clicking and dragging",
    ],
  },
  {
    number: "02",
    title: "Conversational Search",
    description:
      "The Conversational Search is an assistant grounded exclusively in the indexed academic literature. Every factual claim is cited with the originating paper title and DOI. Use it to explore complex metabolic pathways, compare findings across studies, or investigate specific biomarkers.",
    steps: [
      "Type a research question into the input field",
      "The system retrieves the most relevant source passages",
      "A FlashRank cross-encoder re-ranks results for precision",
      "Review the cited sources listed beneath each response",
    ],
  },
  {
    number: "03",
    title: "Knowledge Base",
    description:
      "The Knowledge Base section allows you to explore the indexed research literature directly. Browse the full list of papers currently available in the vector database, filtered and organised by topic. This section reflects the scope of the RAG pipeline's underlying knowledge.",
    steps: [
      "Browse the list of indexed papers",
      "Click a paper title to open the original source via DOI",
      "Use this section to verify the coverage of the knowledge base",
    ],
  },
];

function BrainFlipbook() {
  const [frame, setFrame] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = sectionHeight - viewportHeight;
      if (scrollableDistance <= 0) return;
      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);
      const frameIndex = Math.min(
        Math.floor(progress * BRAIN_FRAMES.length),
        BRAIN_FRAMES.length - 1
      );
      setFrame(frameIndex);
    };

    const scrollContainer = document.querySelector("main");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div ref={sectionRef} style={styles.flipbookSection}>
      <div style={styles.flipbookSticky}>
        <div style={styles.flipbookFrame}>
          <img
            src={BRAIN_FRAMES[frame]}
            alt={`Brain visualisation frame ${frame + 1}`}
            style={styles.flipbookImg}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div style={{ ...styles.flipbookPlaceholder, display: "none" }}>
            <div style={styles.placeholderNumber}>
              {String(frame + 1).padStart(2, "0")}
            </div>
            <div style={styles.placeholderLabel}>brain · frame {frame + 1}</div>
            <div style={styles.placeholderSub}>{BRAIN_FRAMES[frame]}</div>
          </div>
          <div style={styles.frameCounter}>
            {String(frame + 1).padStart(2, "0")} /{" "}
            {String(BRAIN_FRAMES.length).padStart(2, "0")}
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((frame + 1) / BRAIN_FRAMES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div style={styles.flipbookScrollContent}>
        <div style={styles.flipbookTextBlock}>
          <div style={styles.howEyebrow}>Neuroanatomy</div>
          <h2 style={styles.howTitle}>The brain in Parkinson's Disease</h2>
          <p style={styles.heroParagraph}>
            The pathological hallmark of Parkinson's Disease is the selective
            degeneration of dopaminergic neurons within the{" "}
            <span style={styles.highlight}>substantia nigra pars compacta</span>,
            a small but critical region in the midbrain whose projections
            extend throughout the basal ganglia via the nigrostriatal pathway.
          </p>
        </div>
        <div style={styles.flipbookTextBlock}>
          <p style={styles.heroParagraph}>
            As these neurons degenerate, dopamine levels in the{" "}
            <span style={styles.highlight}>striatum</span> — comprising the
            caudate nucleus and putamen — fall precipitously. The striatum
            serves as the primary input nucleus of the basal ganglia, and its
            dopamine deficit disrupts the delicate balance between the direct
            and indirect motor pathways, resulting in the characteristic motor
            symptoms of PD.
          </p>
        </div>
        <div style={styles.flipbookTextBlock}>
          <p style={styles.heroParagraph}>
            Beyond the basal ganglia, PD pathology spreads through the brain
            in a staged pattern described by the{" "}
            <span style={styles.highlight}>Braak staging model</span>. Early
            involvement of the olfactory bulb and brainstem accounts for
            prodromal non-motor symptoms such as hyposmia and REM sleep
            behaviour disorder, which can precede motor onset by a decade or
            more.
          </p>
        </div>
        <div style={styles.flipbookTextBlock}>
          <p style={styles.heroParagraph}>
            The metabolomic consequences of this neurodegeneration are
            distributed across multiple cortical and subcortical regions.
            The{" "}
            <span style={styles.highlight}>Parkinson's Metabolic Atlas</span>{" "}
            maps these biochemical alterations onto a standardised brain
            template, allowing researchers to explore the spatial relationship
            between metabolic dysfunction and neuroanatomy in a single,
            unified interface.
          </p>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <>
      <div className="grain-overlay" />
      <Header />
      <div className="atlas-container">
        <AboutSidebar />
        <main style={styles.main}>
          <div style={styles.content}>
            <section style={styles.heroSection}>
              <div style={styles.heroEyebrow}>Neurodegenerative disorder</div>
              <h1 style={styles.heroTitle}>Parkinson's Disease</h1>
              <div style={styles.heroBody}>
                <p style={styles.heroParagraph}>
                  Parkinson's Disease (PD) is the second most prevalent
                  neurodegenerative disorder in the world, affecting over 10
                  million individuals globally. It is characterised by the
                  progressive degeneration of dopaminergic neurons within the{" "}
                  <span style={styles.highlight}>
                    substantia nigra pars compacta
                  </span>
                  , leading to a profound deficit in the nigrostriatal pathway
                  and the onset of the disorder's hallmark motor symptoms:
                  bradykinesia, rigidity, and tremor.
                </p>
                <p style={styles.heroParagraph}>
                  In recent years, the research focus surrounding PD has
                  expanded beyond its neurological origins toward a{" "}
                  <span style={styles.highlight}>
                    systemic metabolic interpretation
                  </span>
                  . Metabolomics, the large-scale study of small molecules
                  produced by cellular processes, has emerged as a powerful lens
                  through which to investigate the biochemical underpinnings of
                  the disease.
                </p>
                <p style={styles.heroParagraph}>
                  Despite the growing volume of metabolomics research, this data
                  remains largely fragmented across unstructured academic
                  literature. The{" "}
                  <span style={styles.highlight}>
                    Parkinson's Metabolic Atlas
                  </span>{" "}
                  addresses this gap by combining a Retrieval-Augmented
                  Generation pipeline with an interactive 3D neuroanatomical
                  visualiser.
                </p>
              </div>
            </section>

            <div style={styles.divider} />

            <BrainFlipbook />

            <div style={styles.divider} />

            <section style={styles.howSection}>
              <div style={styles.howEyebrow}>User guide</div>
              <h2 style={styles.howTitle}>How to use the Atlas</h2>
              <p style={styles.howSubtitle}>
                The Atlas provides three complementary tools for exploring PD
                metabolomics research. Each is designed to address a distinct
                mode of scientific inquiry.
              </p>
              <div style={styles.featureList}>
                {FEATURES.map((feature) => (
                  <div key={feature.number} style={styles.featureRow}>
                    <div style={styles.featureNumber}>{feature.number}</div>
                    <div style={styles.featureBody}>
                      <div style={styles.featureTitle}>{feature.title}</div>
                      <p style={styles.featureDescription}>
                        {feature.description}
                      </p>
                      <div style={styles.stepList}>
                        {feature.steps.map((step, i) => (
                          <div key={i} style={styles.stepItem}>
                            <div style={styles.stepBullet} />
                            <span style={styles.stepText}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
    width: "100%",
    height: "100%",
    color: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
  },
  content: {
    padding: "7rem 3.5rem 4rem",
    maxWidth: "1020px",
  },
  heroSection: { marginBottom: "3rem" },
  heroEyebrow: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#4b595d",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  heroTitle: {
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "#c8d0d4",
    letterSpacing: "-0.02em",
    margin: "0 0 2rem 0",
    lineHeight: 1.1,
  },
  heroBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  heroParagraph: {
    fontSize: "0.9rem",
    lineHeight: 1.75,
    color: "#7e7b7b",
    margin: 0,
  },
  highlight: { color: "#7a9d52", fontStyle: "italic" },
  biomarkerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "2rem",
  },
  biomarkerCard: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
  },
  biomarkerDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    marginBottom: "0.5rem",
  },
  biomarkerLabel: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#4b595d",
    marginBottom: "0.6rem",
    fontWeight: 600,
  },
  biomarkerItems: { display: "flex", flexWrap: "wrap", gap: "6px" },
  biomarkerPill: {
    fontSize: "0.7rem",
    padding: "2px 8px",
    borderRadius: "20px",
    border: "1px solid",
    background: "transparent",
  },
  divider: { height: "1px", background: "#2a2d3a", margin: "3rem 0" },
  flipbookSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2.5rem",
    alignItems: "start",
    minHeight: `${BRAIN_FRAMES.length * 200}px`,
  },
  flipbookSticky: {
    position: "sticky",
    top: "7rem",
  },
  flipbookFrame: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    overflow: "hidden",
    aspectRatio: "3 / 4",
    width: "550px",
    height: "550px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  flipbookImg: {
    width: "550px",
    height: "550px",
    objectFit: "cover",
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
  },
  flipbookPlaceholder: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    background: "#13151d",
    gap: "6px",
  },
  placeholderNumber: {
    fontSize: "3.5rem",
    fontWeight: 700,
    color: "#2a2d3a",
    fontFamily: "'DM Mono', monospace",
    lineHeight: 1,
  },
  placeholderLabel: {
    fontSize: "0.65rem",
    color: "#3d5a5e",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  placeholderSub: {
    fontSize: "0.58rem",
    color: "#2a2d3a",
    textAlign: "center",
    lineHeight: 1.5,
    padding: "0 1.5rem",
    fontFamily: "'DM Mono', monospace",
  },
  frameCounter: {
    position: "absolute",
    top: "10px",
    right: "12px",
    fontSize: "0.6rem",
    color: "#4b595d",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.1em",
    zIndex: 2,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "#22252f",
    zIndex: 2,
  },
  progressFill: {
    height: "100%",
    background: "#7a9d52",
    transition: "width 0.12s ease",
  },
  flipbookCaption: {
    fontSize: "0.7rem",
    color: "#4b595d",
    lineHeight: 1.6,
    marginTop: "0.75rem",
    fontStyle: "italic",
  },
  flipbookScrollContent: {
    display: "flex",
    flexDirection: "column",
    gap: "3.5rem",
    paddingTop: "0.5rem",
  },
  flipbookTextBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  brainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "1.5rem",
  },
  brainCard: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  brainImgWrapper: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    overflow: "hidden",
    aspectRatio: "4 / 3",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brainImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
  },
  brainPlaceholder: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    background: "#13151d",
    gap: "6px",
  },
  brainCaption: {
    fontSize: "0.68rem",
    color: "#4b595d",
    lineHeight: 1.5,
    fontStyle: "italic",
  },

  howSection: { marginBottom: "1rem" },
  howEyebrow: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#4b595d",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  howTitle: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#c8d0d4",
    letterSpacing: "-0.02em",
    margin: "0 0 0.75rem 0",
  },
  howSubtitle: {
    fontSize: "0.85rem",
    color: "#7e7b7b",
    lineHeight: 1.7,
    margin: "0 0 2.5rem 0",
  },
  featureList: { display: "flex", flexDirection: "column", gap: "2rem" },
  featureRow: { display: "flex", gap: "1.5rem", alignItems: "flex-start" },
  featureNumber: {
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#3d5a5e",
    letterSpacing: "0.1em",
    paddingTop: "0.15rem",
    flexShrink: 0,
    width: "24px",
    fontFamily: "'DM Mono', monospace",
  },
  featureBody: {
    flex: 1,
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    padding: "1.25rem",
  },
  featureTitle: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#7a9d52",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "0.6rem",
  },
  featureDescription: {
    fontSize: "0.82rem",
    color: "#7e7b7b",
    lineHeight: 1.7,
    margin: "0 0 1rem 0",
  },
  stepList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    borderTop: "1px solid #22252f",
    paddingTop: "0.75rem",
  },
  stepItem: { display: "flex", alignItems: "flex-start", gap: "8px" },
  stepBullet: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#3d5a5e",
    flexShrink: 0,
    marginTop: "6px",
  },
  stepText: { fontSize: "0.78rem", color: "#4b595d", lineHeight: 1.5 },

  techSection: { marginBottom: "10rem" },
  techGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "1.5rem",
    paddingBottom: "5rem",
  },
  techCard: {
    background: "#1a1d28",
    border: "1px solid #2a2d3a",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
  },
  techCardLabel: {
    fontSize: "0.62rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#4b595d",
    marginBottom: "0.3rem",
    fontWeight: 600,
  },
  techCardValue: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#c8d0d4",
    marginBottom: "0.5rem",
  },
  techCardDesc: { fontSize: "0.75rem", color: "#7e7b7b", lineHeight: 1.6 },
};

export default About;
