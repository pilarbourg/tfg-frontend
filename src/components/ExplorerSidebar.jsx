const ExplorerSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="title-container-sidebar">
          <span className="title-top-sidebar">Parkinson's</span>
          <span className="title-bottom-sidebar">METABOLIC ATLAS</span>
        </div>

        <section>
          <p className="intro-text">
            Explore how <em>metabolites</em> map to specific brain regions
            implicated in Parkinson's disease.
          </p>
        </section>

        <nav className="service-list">
          <h3>How to Use</h3>

          <div className="service-item">
            <strong>1. Select Metabolites</strong>
            <p>
              Browse the metabolite list on the right. Click any metabolite to
              add it as a tag.
            </p>
          </div>

          <div className="service-item">
            <strong>2. Read the Heatmap</strong>
            <p>
              Brain regions associated with your selected metabolites light up
              instantly. Each metabolite has its own colour.
            </p>
          </div>

          <div className="service-item">
            <strong>3. Explore the Brain</strong>
            <p>
              Drag to rotate · Scroll to zoom · Hover a region to see its name.
            </p>
          </div>

          <div className="service-item">
            <strong>4. Clear Selection</strong>
            <p>
              Remove individual metabolites using the × on each tag, or use
              "Clear all" to reset.
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

export default ExplorerSidebar;
