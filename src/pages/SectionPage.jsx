import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2,
  Lock
} from 'lucide-react';

const SectionPage = ({ section, user, onNavigate }) => {
  // Local state for demo - in production this will come from Firebase
  const [completedSteps, setCompletedSteps] = useState(user.completedSteps?.[section.id] || []);
  
  const handleStepClick = (step, index) => {
    // First step is always accessible
    if (index === 0) {
      onNavigate('step', section, step);
      return;
    }
    
    // Check if previous step is completed
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

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('sections')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bölümlere Dön</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">{section.title}</h1>
            <p className="text-gray-400 text-sm">{section.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 bg-dark-200 px-4 py-2 rounded-xl border border-dark-100">
            <span className="text-gray-400 text-sm">{section.duration} gün süre</span>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div 
        className="bg-dark-200 rounded-2xl p-4 mb-8 border border-dark-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">İlerleme</span>
          <span className="text-white font-medium text-sm">{completedCount}/{totalCount} adım</span>
        </div>
        <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Circle Grid - 3 per row mobile */}
      <motion.div 
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center"
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
              className="flex flex-col items-center"
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
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 shadow-lg
                  ${status === 'completed' 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/40'
                    : status === 'active'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/40 ring-4 ring-primary-500/30'
                      : status === 'unlocked'
                        ? 'bg-dark-200 text-white border-4 border-primary-500/50 hover:border-primary-500'
                        : 'bg-dark-300 text-gray-500 cursor-not-allowed border-4 border-dark-100'
                  }
                `}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                ) : status === 'locked' ? (
                  <Lock className="w-6 h-6 md:w-7 md:h-7" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.button>
              
              {/* Label */}
              <p className={`
                mt-3 text-xs md:text-sm font-medium
                ${status === 'completed' ? 'text-emerald-400' : status === 'active' ? 'text-primary-400' : status === 'unlocked' ? 'text-gray-300' : 'text-gray-500'}
              `}>
                {index + 1}. Adım
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hint */}
      <motion.p 
        className="text-center text-gray-500 text-sm mt-8"
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