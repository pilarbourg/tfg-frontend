const ChatSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="title-container-sidebar">
          <span className="title-top-sidebar">Parkinson's</span>
          <span className="title-bottom-sidebar">METABOLIC ATLAS</span>
        </div>

        <section>
          <p className="intro-text">
            Ask questions about <em>metabolites</em>, brain regions, and
            Parkinson's disease, grounded in peer-reviewed research.
          </p>
        </section>

        <nav className="service-list">
          <h3>How to Use</h3>

          <div className="service-item">
            <strong>1. Ask a Question</strong>
            <p>
              Type any question about Parkinson's metabolomics, biomarkers, or
              brain regions into the chat input.
            </p>
          </div>

          <div className="service-item">
            <strong>2. Get Research-Backed Answers</strong>
            <p>
              Responses are generated using Retrieval-Augmented Generation (RAG)
              — the AI retrieves the most relevant passages before answering.
            </p>
          </div>

          <div className="service-item">
            <strong>3. Review Sources</strong>
            <p>
              Each answer cites the PubMed papers it drew from so you can
              verify and explore further.
            </p>
          </div>

          <div className="service-item">
            <strong>4. Scope & Limitations</strong>
            <p>
              This AI is trained exclusively on <em>PubMed research papers</em>.
              It will not answer questions outside this domain.
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
            <em>Literature:</em> PubMed / PubMed Central. Indexed via NCBI
            Entrez API. Embeddings generated with{" "}
            <em>S-PubMedBert-MS-MARCO</em>.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;