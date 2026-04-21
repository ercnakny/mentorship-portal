import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { SECTIONS } from '../data/mentorshipSections';

const SectionPage = ({ section, user, onNavigate }) => {
  const completedSteps = user.completedSteps[section.id] || [];
  
  const handleStepClick = (step, index) => {
    if (index === 0 || completedSteps.includes(section.steps[index - 1]?.id)) {
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

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">{section.title}</h1>
            <p className="text-gray-400 text-sm md:text-base">{section.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 bg-dark-200 px-4 py-2 rounded-xl border border-dark-100">
            <span className="text-gray-400 text-sm">Süre:</span>
            <span className="text-white font-semibold">{section.duration} gün</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
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
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Step List - Card Style */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {section.steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const isClickable = status !== 'locked';
          
          return (
            <motion.button
              key={step.id}
              onClick={() => handleStepClick(step, index)}
              disabled={!isClickable}
              whileHover={isClickable ? { x: 4 } : {}}
              className={`
                w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left
                ${status === 'completed' 
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : status === 'active'
                    ? 'bg-primary-500/10 border-primary-500/50 shadow-lg shadow-primary-500/10'
                    : status === 'unlocked'
                      ? 'bg-dark-200 border-dark-100 hover:border-primary-500/50'
                      : 'bg-dark-300/50 border-dark-100 opacity-60 cursor-not-allowed'
                }
              `}
            >
              {/* Step Number Circle */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0
                ${status === 'completed' 
                  ? 'bg-emerald-500 text-white'
                  : status === 'active'
                    ? 'bg-primary-500 text-white'
                    : status === 'unlocked'
                      ? 'bg-dark-100 text-white'
                      : 'bg-dark-100 text-gray-500'
                }
              `}>
                {status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : status === 'locked' ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold mb-0.5 ${status === 'locked' ? 'text-gray-500' : 'text-white'}`}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm truncate">{step.description}</p>
              </div>
              
              {/* Arrow */}
              {isClickable && (
                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${status === 'completed' ? 'text-emerald-400' : 'text-gray-500'}`} />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SectionPage;