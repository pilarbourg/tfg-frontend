import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ChatAI from "./pages/ChatAI";
import BrainExplorer from "./pages/BrainExplorer";
import KnowledgeBase from "./pages/KnowledgeBase";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/ChatAI" element={<ChatAI />} />
        <Route path="/BrainExplorer" element={<BrainExplorer />} />
        <Route path="/KnowledgeBase" element={<KnowledgeBase />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;