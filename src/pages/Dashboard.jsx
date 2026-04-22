import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Calendar,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import { SECTIONS, getTotalDuration } from '../data/mentorshipSections';

const Dashboard = ({ user, onNavigate }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startDate = new Date(user.startDate);
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const totalDuration = getTotalDuration();
  const daysRemaining = Math.max(0, totalDuration - daysPassed);
  const progressPercent = Math.round((daysPassed / totalDuration) * 100);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDuration);
  const endMonth = endDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  const firstSection = SECTIONS[0];

  // Stats
  const completedCount = user.completedSections.length;
  const lockedCount = SECTIONS.length - completedCount - 1;
  const activeCount = 1;

  // Styles
  const cardStyle = { backgroundColor: '#1a2234', borderRadius: '16px', border: '1px solid #2d3a4f', padding: isMobile ? '16px' : '24px' };
  const statCardStyle = { ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: isMobile ? '8px' : '16px' };
  const titleStyle = { fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: 'white' };
  const subtitleStyle = { color: '#9ca3af', fontSize: isMobile ? '14px' : '18px' };
  const statNumberStyle = { fontSize: isMobile ? '24px' : '40px', fontWeight: 'bold', color: 'white' };
  const statLabelStyle = { color: '#6b7280', fontSize: isMobile ? '11px' : '14px' };
  const sectionTitleStyle = { fontSize: '20px', fontWeight: '600', color: 'white' };

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <motion.div 
        style={{
          background: 'linear-gradient(to right, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.1), transparent)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(14, 165, 233, 0.2)'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={titleStyle}>
          {user.name.split(' ')[0].charAt(0).toUpperCase() + user.name.split(' ')[0].slice(1)}'ın Mentörlük Sayfası
        </h1>
      </motion.div>

      {/* Stats Cards - Responsive Grid */}
      <motion.div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', 
          gap: isMobile ? '8px' : '24px', 
          marginBottom: '32px' 
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Completed */}
        <div style={statCardStyle}>
          <CheckCircle2 style={{ width: '32px', height: '32px', color: '#34d399' }} />
          <p style={statNumberStyle}>{completedCount}</p>
          <p style={statLabelStyle}>Tamamlanan</p>
        </div>

        {/* Active */}
        <div style={statCardStyle}>
          <Zap style={{ width: '32px', height: '32px', color: '#fbbf24' }} />
          <p style={statNumberStyle}>{activeCount}</p>
          <p style={statLabelStyle}>Açık</p>
        </div>

        {/* Locked */}
        <div style={statCardStyle}>
          <Lock style={{ width: '32px', height: '32px', color: '#6b7280' }} />
          <p style={statNumberStyle}>{lockedCount}</p>
          <p style={statLabelStyle}>Kilitli</p>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '24px', marginBottom: '32px' }}>
        {/* Timeline Card */}
        <motion.div 
          style={{ ...cardStyle }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Calendar style={{ width: '24px', height: '24px', color: '#38bdf8' }} />
            <h2 style={sectionTitleStyle}>Süreç Takvimi</h2>
            <span style={{ color: '#6b7280', fontSize: '16px', marginLeft: 'auto' }}>{endMonth}'da bitiş</span>
          </div>

          {/* Date Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'rgba(21, 28, 44, 0.5)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Başlangıç</p>
              <p style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
                {startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div style={{ backgroundColor: 'rgba(21, 28, 44, 0.5)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Geçen</p>
              <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '32px' }}>{daysPassed}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(21, 28, 44, 0.5)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Kalan</p>
              <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '32px' }}>{daysRemaining}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ position: 'relative' }}>
            <div style={{ height: '12px', backgroundColor: '#151c2c', borderRadius: '9999px', overflow: 'hidden' }}>
              <motion.div 
                style={{
                  height: '100%',
                  borderRadius: '9999px',
                  background: progressPercent > 100 
                    ? '#ef4444' 
                    : 'linear-gradient(to right, #0ea5e9, #38bdf8)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <span style={{ 
                fontSize: '14px', 
                color: progressPercent > 100 ? '#f87171' : '#9ca3af' 
              }}>
                {progressPercent > 100 ? `${progressPercent - 100}% geç` : `${100 - progressPercent}% kaldı`}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>{progressPercent}%</span>
            </div>
          </div>
        </motion.div>

        {/* Current Section */}
        <motion.div 
          style={{
            background: 'linear-gradient(to right, rgba(14, 165, 233, 0.1), transparent)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p style={{ color: '#38bdf8', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>Şu An Burada Olmalısın</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{firstSection.title}</h3>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>{firstSection.subtitle}</p>
          </div>
          <button 
            onClick={() => onNavigate('section', firstSection)}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
          >
            Bölüme Git
            <ChevronRight style={{ width: '24px', height: '24px' }} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
