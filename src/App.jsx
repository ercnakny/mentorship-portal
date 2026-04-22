import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SectionsOverview from './pages/SectionsOverview';
import SectionPage from './pages/SectionPage';
import StepPage from './pages/StepPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar';
import { onAuthChange, getUserFromWhitelist, getUserProgress } from './firebase/client';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  // Firebase auth state dinle
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setAuthLoading(false);
      
      if (!firebaseUser) {
        setUser(null);
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      // Firestore'dan whitelist kontrolü ve kullanıcı bilgilerini al
      const whitelistUser = await getUserFromWhitelist(firebaseUser.email);
      
      if (!whitelistUser) {
        setUser(null);
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      // Kullanıcı whitelist'te var, Firestore'dan progress'i al
      const progress = await getUserProgress(firebaseUser.uid);
      
      const userData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: whitelistUser.role || 'user', // Firestore'dan gelen role
        startDate: progress?.startDate || whitelistUser.startDate || new Date().toISOString(),
        completedSections: progress?.completedSections || [],
        completedSteps: progress?.completedSteps || {},
        requestedSections: progress?.requestedSections || []
      };
      
      setUser(userData);
      setIsAllowed(true);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const navigateTo = (view, section = null, step = null) => {
    setCurrentView(view);
    setSelectedSection(section);
    setSelectedStep(step);
  };

  // Auth loading ekranı
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500 mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-400 text-sm">Yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  // Giriş yapılmamış veya whitelist'te yok
  if (!user || !isAllowed) {
    return (
      <LoginPage 
        onLogin={(userData) => {
          setUser(userData);
          setIsAllowed(true);
        }}
        onError={(err) => console.error('Login error:', err)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-dark-500">
      <Sidebar user={user} currentView={currentView} onNavigate={navigateTo} />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard user={user} onNavigate={navigateTo} />
            </motion.div>
          )}

          {currentView === 'sections' && (
            <motion.div
              key="sections"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SectionsOverview user={user} onNavigate={navigateTo} />
            </motion.div>
          )}

          {currentView === 'section' && selectedSection && (
            <motion.div
              key={`section-${selectedSection.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
            >
              <StepPage section={selectedSection} step={selectedStep} user={user} onNavigate={navigateTo} onUserUpdate={setUser} />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AdminPanel user={user} onNavigate={navigateTo} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
