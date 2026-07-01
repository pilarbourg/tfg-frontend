import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ChatAI from "./pages/ChatAI";
import BrainExplorer from "./pages/BrainExplorer";
import KnowledgeBase from "./pages/KnowledgeBase";
import Admin from "./pages/Admin";
import AdminLogin from "./components/AdminLogin";
import LiteratureReview from "./pages/LiteratureReview";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.15,
  ease: "easeInOut",
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{
          position: "absolute",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#13151d",
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/ChatAI" element={<ChatAI />} />
          <Route path="/BrainExplorer" element={<BrainExplorer />} />
          <Route path="/KnowledgeBase" element={<KnowledgeBase />} />
          <Route path="/LiteratureReview" element={<LiteratureReview />} />
          <Route
            path="/Admin"
            element={
              <AdminLogin>
                <Admin />
              </AdminLogin>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
