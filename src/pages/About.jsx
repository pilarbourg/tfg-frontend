import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function About() {
  return (
    <>
      <div className="fab-container">
        <div className="fab-label">
          <span className="fab-label-text">How to use</span>
          <span className="fab-arrow">→</span>
        </div>
        <Link to="/About" title="About this Project" className="fab-button">
          ?
        </Link>
      </div>

      <div className="grain-overlay" />

      <Header />

      <div className="atlas-container">
        <Sidebar />

        <main className="viewer-pane">

        </main>
      </div>
    </>
  );
}

export default About;
