import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Introduction from "./pages/Introduction";
import LearningPath from "./pages/LearningPath";
import Lesson from "./pages/Lesson";
import { ProgressProvider } from "./contexts/ProgressContext";

// Componente para manejar el scroll al cambiar de ruta
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll hacia arriba cuando cambie la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ProgressProvider>
      <Router>
        <ScrollToTop />
        <div className="flex min-h-screen bg-gray-50">
          <div className="sticky top-0 h-screen flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto min-h-screen">
            <motion.div
              className="min-h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/introduction" element={<Introduction />} />
                <Route path="/learning-path" element={<LearningPath />} />
                <Route path="/lesson/:lessonId" element={<Lesson />} />
              </Routes>
            </motion.div>
          </main>
        </div>
      </Router>
    </ProgressProvider>
  );
}

export default App;
