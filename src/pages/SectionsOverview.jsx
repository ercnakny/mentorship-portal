import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2,
  Lock,
  ChevronRight,
  Wrench,
  Package,
  FileText,
  Globe,
  Megaphone
} from 'lucide-react';
import { SECTIONS } from '../data/mentorshipSections';

const iconMap = {
  'Wrench': Wrench,
  'Package': Package,
  'FileText': FileText,
  'Globe': Globe,
  'Megaphone': Megaphone,
};

const SectionsOverview = ({ user, onNavigate }) => {
  const completedSections = user.completedSections || [];
  
  const getSectionStatus = (sectionId, index) => {
    if (completedSections.includes(sectionId)) return 'completed';
    if (index === 0) return 'active';
    const prevSection = SECTIONS[index - 1];
    if (prevSection && completedSections.includes(prevSection.id)) return 'unlocked';
    return 'locked';
  };

  // Styles
  const pageStyle = { padding: '24px', maxWidth: '100%' };
  const cardStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    borderRadius: '16px',
    transition: 'all 0.2s',
    textAlign: 'left',
    border: '1px solid'
  };

  const getCardStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          ...cardStyle,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          cursor: 'pointer'
        };
      case 'active':
        return {
          ...cardStyle,
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderColor: 'rgba(14, 165, 233, 0.5)',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)'
        };
      case 'unlocked':
        return {
          ...cardStyle,
          backgroundColor: '#1a2234',
          borderColor: '#2d3a4f',
          cursor: 'pointer'
        };
      case 'locked':
      default:
        return {
          ...cardStyle,
          backgroundColor: 'rgba(21, 28, 44, 0.5)',
          borderColor: '#2d3a4f',
          opacity: 0.6,
          cursor: 'not-allowed'
        };
    }
  };

  const getIconBgStyle = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: 'rgba(16, 185, 129, 0.2)' };
      case 'active':
        return { backgroundColor: 'rgba(14, 165, 233, 0.2)' };
      default:
        return { backgroundColor: '#1e293b' };
    }
  };

  const getIconColor = (status) => {
    switch (status) {
      case 'completed':
        return '#34d399';
      case 'active':
        return '#38bdf8';
      default:
        return '#6b7280';
    }
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <motion.div 
        style={{ marginBottom: '32px' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#9ca3af',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '24px',
            padding: 0,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Geri Dön</span>
        </button>
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
          Bölümler
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '18px' }}>
          Mentörlük sürecindeki tüm bölümler
        </p>
      </motion.div>

      {/* Section List - Responsive Grid */}
      <motion.div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}
        className="grid-cols-1 lg:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {SECTIONS.map((section, index) => {
          const status = getSectionStatus(section.id, index);
          const isClickable = status !== 'locked';
          const Icon = iconMap[section.icon] || Wrench;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => isClickable && onNavigate('section', section)}
              disabled={!isClickable}
              whileHover={isClickable ? { x: 4 } : {}}
              style={getCardStyle(status)}
            >
              {/* Icon Circle */}
              <div style={{
                ...getIconBgStyle(status),
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon style={{ width: '28px', height: '28px', color: getIconColor(status) }} />
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontWeight: 600, 
                    fontSize: '18px', 
                    color: status === 'locked' ? '#6b7280' : 'white'
                  }}>
                    {index + 1}. {section.title}
                  </h3>
                  {status === 'completed' && <CheckCircle2 style={{ width: '24px', height: '24px', color: '#34d399' }} />}
                  {status === 'locked' && <Lock style={{ width: '20px', height: '20px', color: '#6b7280' }} />}
                </div>
                <p style={{ color: '#6b7280', fontSize: '15px' }}>{section.subtitle}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{section.steps.length} adım</span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>•</span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{section.duration} gün</span>
                </div>
              </div>
              
              {/* Arrow */}
              {isClickable && (
                <ChevronRight style={{ 
                  width: '24px', 
                  height: '24px', 
                  flexShrink: 0,
                  color: status === 'completed' ? '#34d399' : '#6b7280'
                }} />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SectionsOverview;
