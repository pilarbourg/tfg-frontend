const AboutSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="title-container-sidebar">
          <span className="title-top-sidebar">Parkinson's</span>
          <span className="title-bottom-sidebar">METABOLIC ATLAS</span>
        </div>
        <section>
          <p className="intro-text">
            A technical and scientific guide to the Atlas: clinical
            context, tools, and <em>underlying architecture</em>.
          </p>
        </section>
        <nav className="service-list">
          <h3>On this page</h3>
          <div className="service-item">
            <strong>Parkinson's Disease</strong>
            <p>
              Clinical background, metabolomic significance, and the research
              gap this project addresses.
            </p>
          </div>
          <div className="service-item">
            <strong>How to use the Atlas</strong>
            <p>
              Step-by-step guides for the Brain Explorer, Conversational Search, and
              Knowledge Base.
            </p>
          </div>
          <div className="service-item">
            <strong>System architecture</strong>
            <p>
              Technical overview of the RAG pipeline, embedding model,
              re-ranker, and 3D visualiser.
            </p>
          </div>
        </nav>
        <div className="footer-info">
          <p className="project-title">Parkinson's Metabolic Atlas</p>
          <p className="author-name">
            <strong>Author:</strong> Pilar Bourg
          </p>
          <p className="academic-context">
            Trabajo Fin de Grado
            <br />
            Universidad CEU San Pablo | 2026
          </p>
          <div className="links">
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noreferrer"
            >
              View Source Code
            </a>
          </div>
        </div>
        <div className="data-sources">
          <p className="section-header">Data Sources</p>
          <p className="citation">
            <em>3D Model:</em> NIH 3D Print Exchange (2023). Brain Model
            (Version 1.01).
            <a
              href="https://3d.nih.gov/entries/3DPX-021161"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              3DPX-021161
            </a>
            .
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AboutSidebar;