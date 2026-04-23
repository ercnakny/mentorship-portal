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
import { onAuthChange, getUserFromWhitelist, getUserProgress, getRedirectResultAuth, addGoogleUserToPending } from './firebase/client';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Firebase auth state - sadece tek bir kez çalışır
  useEffect(() => {
    let isProcessed = false;

    const processUser = async (firebaseUser) => {
      // Eğer zaten işlendiyse, tekrar çalışma
      if (isProcessed) return;
      isProcessed = true;

      if (!firebaseUser) {
        setAuthLoading(false);
        setUser(null);
        setIsAllowed(false);
        return;
      }

      try {
        const whitelistUser = await getUserFromWhitelist(firebaseUser.email);

        if (!whitelistUser) {
          // Yeni kullanıcı - pendingUsers'a ekle
          await addGoogleUserToPending(firebaseUser);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Kullanici',
            email: firebaseUser.email,
            pending: true
          });
          setPendingApproval(true);
          setIsAllowed(false);
        } else {
          // Mevcut kullanıcı
          const progress = await getUserProgress(firebaseUser.uid);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: whitelistUser.role || 'user',
            startDate: progress?.startDate || whitelistUser.startDate || new Date().toISOString(),
            completedSections: progress?.completedSections || [],
            completedSteps: progress?.completedSteps || {},
            requestedSections: progress?.requestedSections || []
          });
          setIsAllowed(true);
        }
      } catch (error) {
        console.error('Auth process error:', error);
        setUser(null);
        setIsAllowed(false);
      }

      setAuthLoading(false);
    };

    // Önce redirect sonucunu kontrol et
    getRedirectResultAuth().then(redirectUser => {
      processUser(redirectUser);
    }).catch(() => {
      // Redirect hatası - normal auth'a geç
    });

    // Sonra normal auth state dinle
    const unsubscribe = onAuthChange(firebaseUser => {
      processUser(firebaseUser);
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
        pendingApproval={pendingApproval}
        onLogin={(userData) => {
          setUser(userData);
          setIsAllowed(true);
          setPendingApproval(false);
        }}
        onError={(err) => console.error('Login error:', err)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0f1a' }}>
      <Sidebar user={user} currentView={currentView} onNavigate={navigateTo} />

      <main style={{ flex: 1, minHeight: '100vh', overflowY: 'auto', marginLeft: isMobile ? 0 : '256px', paddingBottom: isMobile ? '80px' : 0 }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px', boxSizing: 'border-box' }}>
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
        </div>
      </main>
    </div>
  );
}

export default App;
