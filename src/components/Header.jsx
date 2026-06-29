import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="floating-header">
      <div className="header-left">
        <div className="title-container">
          <span className="title-top">Parkinson's</span>
          <span className="title-bottom">METABOLIC ATLAS</span>
        </div>
      </div>

      <div className="header-right">
        <Link to="/">
          <button
            className={`neumorphic-btn ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            <span>Overview</span>
          </button>
        </Link>

        <Link to="/BrainExplorer">
          <button
            className={`neumorphic-btn ${
              location.pathname === "/BrainExplorer" ? "active" : ""
            }`}
          >
            <span>Neural Atlas</span>
          </button>
        </Link>

        <Link to="/ChatAI">
          <button
            className={`neumorphic-btn ${
              location.pathname === "/ChatAI" ? "active" : ""
            }`}
          >
            <span>Knowledge Base</span>
          </button>
        </Link>

        <Link to="/LiteratureReview">
          <button
            className={`neumorphic-btn ${
              location.pathname === "/LiteratureReview" ? "active" : ""
            }`}
          >
            <span>Literature Review</span>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
