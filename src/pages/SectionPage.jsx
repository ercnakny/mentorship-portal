import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2,
  Lock
} from 'lucide-react';

const SectionPage = ({ section, user, onNavigate }) => {
  const [completedSteps, setCompletedSteps] = useState(user.completedSteps?.[section.id] || []);
  
  const handleStepClick = (step, index) => {
    if (index === 0) {
      onNavigate('step', section, step);
      return;
    }
    
    const prevStep = section.steps[index - 1];
    if (prevStep && completedSteps.includes(prevStep.id)) {
      onNavigate('step', section, step);
    }
  };

  const getStepStatus = (stepId, index) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (index === 0) return 'active';
    const prevStep = section.steps[index - 1];
    if (prevStep && completedSteps.includes(prevStep.id)) return 'unlocked';
    return 'locked';
  };

  const completedCount = completedSteps.length;
  const totalCount = section.steps.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Circle button styles
  const getCircleStyle = (status) => {
    const base = {
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    };

    switch (status) {
      case 'completed':
        return {
          ...base,
          background: 'linear-gradient(to bottom right, #10b981, #059669)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
        };
      case 'active':
        return {
          ...base,
          background: 'linear-gradient(to bottom right, #0ea5e9, #0284c7)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
        };
      case 'unlocked':
        return {
          ...base,
          backgroundColor: '#1a2234',
          color: 'white',
          border: '4px solid rgba(14, 165, 233, 0.5)'
        };
      case 'locked':
      default:
        return {
          ...base,
          backgroundColor: '#151c2c',
          color: '#6b7280',
          border: '4px solid #2d3a4f',
          cursor: 'not-allowed'
        };
    }
  };

  // Page styles
  const pageStyle = { padding: '24px', maxWidth: '100%' };
  const cardStyle = { backgroundColor: '#1a2234', borderRadius: '16px', border: '1px solid #2d3a4f', padding: '24px' };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <motion.div 
        style={{ marginBottom: '32px' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('sections')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#9ca3af',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '16px',
            padding: 0,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Bölümlere Dön</span>
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{section.title}</h1>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>{section.subtitle}</p>
          </div>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#1a2234',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid #2d3a4f',
            alignSelf: 'flex-start'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>{section.duration} gün süre</span>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div 
        style={{ ...cardStyle, marginBottom: '32px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: '#9ca3af', fontSize: '16px' }}>İlerleme</span>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>{completedCount}/{totalCount} adım</span>
        </div>
        <div style={{ height: '10px', backgroundColor: '#151c2c', borderRadius: '9999px', overflow: 'hidden' }}>
          <motion.div 
            style={{
              height: '100%',
              background: 'linear-gradient(to right, #0ea5e9, #38bdf8)',
              borderRadius: '9999px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Circle Grid - Responsive */}
      <motion.div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '24px',
          justifyItems: 'center'
        }}
        className="grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {section.steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const isClickable = status !== 'locked';
          
          return (
            <motion.div
              key={step.id}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Circle */}
              <motion.button
                onClick={() => isClickable && handleStepClick(step, index)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                style={getCircleStyle(status)}
              >
                {status === 'completed' ? (
                  <CheckCircle2 style={{ width: '36px', height: '36px' }} />
                ) : status === 'locked' ? (
                  <Lock style={{ width: '28px', height: '28px' }} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.button>
              
              {/* Label */}
              <p style={{
                marginTop: '16px',
                fontSize: '15px',
                fontWeight: 500,
                color: status === 'completed' ? '#34d399' : 
                       status === 'active' ? '#38bdf8' : 
                       status === 'unlocked' ? '#e5e7eb' : '#6b7280'
              }}>
                {index + 1}. Adım
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hint */}
      <motion.p 
        style={{ textAlign: 'center', color: '#6b7280', fontSize: '15px', marginTop: '40px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Bir adıma tıklayarak detayları görüntüleyebilirsiniz
      </motion.p>
    </div>
  );
};

export default SectionPage;
