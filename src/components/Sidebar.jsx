const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="title-container-sidebar">
          <span className="title-top-sidebar">Parkinson's</span>
          <span className="title-bottom-sidebar">METABOLIC ATLAS</span>
        </div>

        <section>
          <p className="intro-text">
            An immersive, data-driven journey into the{" "}
            <em>neuro-metabolic mechanisms</em> of Parkinson's disease.
          </p>
        </section>

        <nav className="service-list">
          <h3>Core Services</h3>
          <div className="service-item">
            <strong>Brain Explorer</strong>
            <p>
              Interactive visualization of metabolic pathways within the brain.
            </p>
          </div>
          <div className="service-item">
            <strong>Codex AI</strong>
            <p>
              Research-backed insights parsed from <em>PubMed</em> and{" "}
              <em>PubChem</em>.
            </p>
          </div>
          <div className="service-item">
            <strong>Knowledge Base</strong>
            <p>Rapidly explore and filter the latest clinical research.</p>
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

export default Sidebar;
