import { Link, useLocation } from "react-router-dom";
import logo from "../assets/brain-svgrepo-com.svg";

const Header = () => {
  const location = useLocation();

  return (
    <header className="floating-header">
      <div className="header-left">
        <img src={logo} alt="Atlas Logo" className="header-logo" />
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
            <img src="src/assets/home-alt-svgrepo-com.svg" alt="icon" width="22" />
            <span>Home</span>
          </button>
        </Link>

        <Link to="/BrainExplorer">
          <button
            className={`neumorphic-btn ${
              location.pathname === "/BrainExplorer" ? "active" : ""
            }`}
          >
            <img src="src/assets/search-svgrepo-com-2.svg" alt="icon" width="22" />
            <span>Brain Explorer</span>
          </button>
        </Link>

        <Link to="/ChatAI">
          <button
            className={`neumorphic-btn ${
              location.pathname === "/ChatAI" ? "active" : ""
            }`}
          >
            <img src="src/assets/chat-conversation-svgrepo-com.svg" alt="icon" width="22" />
            <span>Chat AI</span>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
