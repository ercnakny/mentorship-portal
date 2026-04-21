import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Circle,
  Lock,
  Play
} from 'lucide-react';

const SectionPage = ({ section, user, onNavigate, onStepComplete }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  
  // Kullanıcının tamamladığı adımlar
  const completedSteps = user.completedSteps[section.id] || [];
  
  // Bölüm kilitli mi kontrol et
  const sectionIndex = ['teknik', 'urun', 'icerik', 'site', 'reklam'].indexOf(section.id);
  const isLocked = sectionIndex > 0 && !user.completedSections.includes(section.id);

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="bg-dark-200 rounded-3xl p-8 text-center max-w-md border border-dark-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Bölüm Kilitli</h2>
          <p className="text-gray-400 mb-6">Bu bölüme erişmek için önceki bölümü tamamlamalısın.</p>
          <button onClick={() => onNavigate('dashboard')} className="btn-primary">
            Dashboard'a Dön
          </button>
        </motion.div>
      </div>
    );
  }

  const handleStepClick = (step, index) => {
    // Kilitli adıma tıklandı mı kontrol et
    const stepIndex = section.steps.findIndex(s => s.id === step.id);
    const prevStep = stepIndex > 0 ? section.steps[stepIndex - 1] : null;
    
    if (prevStep && !completedSteps.includes(prevStep.id)) {
      // Önceki adım tamamlanmamış
      return;
    }
    
    setSelectedStep(step);
    onNavigate('step', section, step);
  };

  const getStepStatus = (stepId, index) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (index === 0) return 'active';
    const prevStep = section.steps[index - 1];
    if (prevStep && completedSteps.includes(prevStep.id)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div 
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{section.title}</h1>
            <p className="text-gray-400">{section.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Süre</p>
            <p className="text-white font-medium">{section.duration} gün</p>
          </div>
        </div>
      </motion.div>

      {/* Çember Navigasyonu */}
      <motion.div 
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-dark-200 rounded-3xl p-6 md:p-8 border border-dark-100 overflow-x-auto">
          <div className="flex items-center justify-start gap-4 md:gap-6 min-w-max md:min-w-0">
            {section.steps.map((step, index) => {
              const status = getStepStatus(step.id, index);
              const isClickable = status !== 'locked';
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Bağlantı Çizgisi */}
                  {index < section.steps.length - 1 && (
                    <div className={`
                      absolute top-1/2 left-full w-8 md:w-12 h-0.5
                      ${status === 'completed' ? 'bg-primary-500' : 'bg-dark-300'}
                    `} />
                  )}
                  
                  {/* Çember */}
                  <motion.button
                    onClick={() => handleStepClick(step, index)}
                    disabled={!isClickable}
                    whileHover={isClickable ? { scale: 1.1 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                    className={`
                      relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                      font-bold text-lg md:text-xl transition-all duration-300
                      ${status === 'completed' 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : status === 'active'
                          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-500/20'
                          : status === 'unlocked'
                            ? 'bg-dark-300 text-white hover:bg-dark-200 border-2 border-primary-500/50'
                            : 'bg-dark-300 text-gray-500 cursor-not-allowed border-2 border-dark-100'
                      }
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : status === 'locked' ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.button>
                  
                  {/* Step Numarası */}
                  <p className={`
                    absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap
                    ${status === 'locked' ? 'text-gray-500' : 'text-gray-300'}
                  `}>
                    {index + 1}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Adım Kartları */}
      <motion.div 
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {section.steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const isClickable = status !== 'locked';
          
          return (
            <motion.div
              key={step.id}
              whileHover={isClickable ? { y: -4 } : {}}
              onClick={() => handleStepClick(step, index)}
              className={`
                relative overflow-hidden rounded-2xl p-5 border cursor-pointer transition-all duration-300
                ${status === 'completed' 
                  ? 'bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20'
                  : status === 'active'
                    ? 'bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/30 shadow-lg shadow-primary-500/10'
                    : status === 'unlocked'
                      ? 'bg-dark-200 border-dark-100 hover:border-primary-500/30'
                      : 'bg-dark-300/50 border-dark-100 cursor-not-allowed opacity-60'
                }
              `}
            >
              {status === 'completed' && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              
              {status === 'active' && (
                <div className="absolute top-3 right-3">
                  <Play className="w-5 h-5 text-primary-400" />
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                  ${status === 'completed' 
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : status === 'active'
                      ? 'bg-primary-500/20 text-primary-400'
                      : status === 'unlocked'
                        ? 'bg-dark-100 text-gray-400'
                        : 'bg-dark-100 text-gray-500'
                  }
                `}>
                  {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </div>
              
              {status !== 'locked' && (
                <div className="mt-4 flex items-center justify-end">
                  <span className="text-primary-400 text-sm flex items-center gap-1">
                    {status === 'completed' ? 'Tamamlandı' : 'Başla'}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SectionPage;