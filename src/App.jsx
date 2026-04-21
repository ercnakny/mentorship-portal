import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import SectionPage from './pages/SectionPage';
import StepPage from './pages/StepPage';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';

// Demo modu
const DEMO_USER = {
  name: 'Ercan Akınay',
  email: 'akinay516@gmail.com',
  role: 'admin',
  startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  completedSections: [],
  completedSteps: {
    'teknik': [],
    'urun': [],
    'icerik': [],
    'site': [],
    'reklam': []
  },
  requestedSections: []
};

function App() {
  const [user, setUser] = useState(DEMO_USER);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  const navigateTo = (view, section = null, step = null) => {
    setCurrentView(view);
    setSelectedSection(section);
    setSelectedStep(step);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="flex min-h-screen bg-dark-500">
      <Sidebar user={user} currentView={currentView} onNavigate={(view, section, step) => navigateTo(view, section, step)} />
      
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full"
            >
              <Dashboard user={user} onNavigate={navigateTo} />
            </motion.div>
          )}

          {currentView === 'section' && selectedSection && (
            <motion.div
              key={`section-${selectedSection.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-full"
            >
              <SectionPage section={selectedSection} user={user} onNavigate={navigateTo} />
            </motion.div>
          )}

          {currentView === 'step' && selectedSection && selectedStep && (
            <motion.div
              key={`step-${selectedStep.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-full"
            >
              <StepPage section={selectedSection} step={selectedStep} user={user} onNavigate={navigateTo} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;