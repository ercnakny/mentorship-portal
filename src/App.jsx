import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import SectionPage from './pages/SectionPage';
import StepPage from './pages/StepPage';
import LoginPage from './pages/LoginPage';
import { SECTIONS } from './data/mentorshipSections';

// Demo modu - gerçek Firebase entegrasyonu öncesi test için
const DEMO_USER = {
  name: 'Ercan Akınay',
  email: 'akinay516@gmail.com',
  role: 'admin',
  startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün önce
  completedSections: ['teknik'],
  completedSteps: {
    'teknik': ['teknik-1', 'teknik-2', 'teknik-3', 'teknik-4', 'teknik-5', 'teknik-6', 'teknik-7'],
    'urun': [],
    'icerik': [],
    'site': [],
    'reklam': []
  },
  requestedSections: []
};

function App() {
  const [user, setUser] = useState(DEMO_USER); // Demo için
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard | section | step
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  const navigateTo = (view, section = null, step = null) => {
    setCurrentView(view);
    setSelectedSection(section);
    setSelectedStep(step);
  };

  // Demo giriş kontrolü
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-300 to-dark-200">
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard 
              user={user} 
              onNavigate={navigateTo} 
            />
          </motion.div>
        )}

        {currentView === 'section' && selectedSection && (
          <motion.div
            key={`section-${selectedSection.id}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SectionPage 
              section={selectedSection} 
              user={user}
              onNavigate={navigateTo}
              onStepComplete={(stepId) => {
                // Demo: adım tamamlandı
                console.log('Step completed:', stepId);
              }}
            />
          </motion.div>
        )}

        {currentView === 'step' && selectedSection && selectedStep && (
          <motion.div
            key={`step-${selectedStep.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StepPage 
              section={selectedSection}
              step={selectedStep}
              user={user}
              onNavigate={navigateTo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;