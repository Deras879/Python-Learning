import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import LearningPath from './pages/LearningPath';
import Lesson from './pages/Lesson';
import { ProgressProvider } from './contexts/ProgressContext';

function App() {
  return (
    <ProgressProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <motion.div 
              className="h-full"
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