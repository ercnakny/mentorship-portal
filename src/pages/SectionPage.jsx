import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2,
  Play
} from 'lucide-react';

const SectionPage = ({ section, user, onNavigate }) => {
  const completedSteps = user.completedSteps[section.id] || [];
  
  const handleStepClick = (step, index) => {
    onNavigate('step', section, step);
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
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{section.title}</h1>
              <p className="text-xl text-gray-400">{section.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Süre</p>
              <p className="text-white font-semibold text-lg">{section.duration} gün</p>
            </div>
          </div>
        </motion.div>

        {/* İlerleme */}
        <motion.div 
          className="bg-dark-200 rounded-3xl p-6 mb-8 border border-dark-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">İlerleme</span>
            <span className="text-white font-semibold">{completedCount}/{totalCount} adım</span>
          </div>
          <div className="h-3 bg-dark-300 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Adım Kartları - Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                whileHover={isClickable ? { y: -4, scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
                onClick={() => isClickable && handleStepClick(step, index)}
                className={`
                  relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 cursor-pointer
                  ${status === 'completed' 
                    ? 'bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30'
                    : status === 'active'
                      ? 'bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/50 shadow-lg shadow-primary-500/10'
                      : status === 'unlocked'
                        ? 'bg-dark-200 border-dark-100 hover:border-primary-500/50'
                        : 'bg-dark-300/50 border-dark-100 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Numaralandırılmış Çember */}
                  <div className={`
                    relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0
                    ${status === 'completed' 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : status === 'active'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : status === 'unlocked'
                          ? 'bg-dark-100 text-white border-2 border-primary-500/50'
                          : 'bg-dark-100 text-gray-500 border-2 border-dark-100'
                    }
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                    
                    {/* Aktif Badge */}
                    {status === 'active' && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                  
                  {/* İkon */}
                  {isClickable && (
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 ${status === 'completed' ? 'text-emerald-400' : 'text-gray-500'}`} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default SectionPage;