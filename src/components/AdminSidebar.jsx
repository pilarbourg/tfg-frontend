const AdminSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="title-container-sidebar">
          <span className="title-top-sidebar">Parkinson's</span>
          <span className="title-bottom-sidebar">METABOLIC ATLAS</span>
        </div>
        <section>
          <p className="intro-text">
            Restricted access portal for knowledge
            base administration.
          </p>
        </section>
        <nav className="service-list">
          <h3>Manager Tools</h3>
          <div className="service-item">
            <strong>Knowledge Base</strong>
            <p>View indexed research documents.</p>
          </div>
          <div className="service-item">
            <strong>System Statistics</strong>
            <p>
              Monitor document count, chunk distribution, and embedding
              status.
            </p>
          </div>
          <div className="service-item">
            <strong>Keywords</strong>
            <p>Review most common keywords.</p>
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

export default AdminSidebar;