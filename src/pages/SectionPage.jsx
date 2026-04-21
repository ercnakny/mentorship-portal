import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2,
  Lock
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
      <div className="max-w-5xl mx-auto">
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
          className="bg-dark-200 rounded-3xl p-6 mb-12 border border-dark-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">İlerleme</span>
            <span className="text-white font-semibold">{completedCount}/{totalCount} adım tamamlandı</span>
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

        {/* ÇEMBER NAVİGASYONU - Sadece Daireler */}
        <motion.div 
          className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-8"
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
                className="relative flex flex-col items-center flex-shrink-0"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Bağlantı Çizgisi */}
                {index < section.steps.length - 1 && (
                  <div className={`
                    absolute top-1/2 left-full w-6 md:w-8 h-1 -translate-y-1/2
                    ${status === 'completed' ? 'bg-primary-500' : 'bg-dark-300'}
                  `} />
                )}
                
                {/* Çember */}
                <motion.button
                  onClick={() => isClickable && handleStepClick(step, index)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.15 } : {}}
                  whileTap={isClickable ? { scale: 0.9 } : {}}
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
                
                {/* Alt Etiket */}
                <p className={`
                  mt-3 text-xs md:text-sm font-medium text-center
                  ${status === 'locked' ? 'text-gray-500' : 'text-gray-300'}
                `}>
                  {index + 1}. Adım
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Alt Açıklama */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500 text-sm">
            Bir adıma tıklayarak detayları görüntüleyebilirsiniz
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionPage;