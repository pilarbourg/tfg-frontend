const AtlasManagerSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="title-container-sidebar">
          <span className="title-top-sidebar">Parkinson's</span>
          <span className="title-bottom-sidebar">METABOLIC ATLAS</span>
        </div>
        <section>
          <p className="intro-text">
            <em>Atlas Manager</em> — restricted access portal for knowledge
            base administration and system monitoring.
          </p>
        </section>
        <nav className="service-list">
          <h3>Manager Tools</h3>
          <div className="service-item">
            <strong>Knowledge Base</strong>
            <p>View, upload, and remove indexed research documents.</p>
          </div>
          <div className="service-item">
            <strong>System Statistics</strong>
            <p>
              Monitor document count, chunk distribution, and embedding
              status.
            </p>
          </div>
          <div className="service-item">
            <strong>Query Logs</strong>
            <p>Review recent queries and their retrieved source documents.</p>
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
        </div>
      </div>
    </aside>
  );
};

export default AtlasManagerSidebar;