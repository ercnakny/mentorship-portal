import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Play
} from 'lucide-react';

const StepPage = ({ section, step, user, onNavigate }) => {
  const [isCompleted, setIsCompleted] = useState(
    user.completedSteps?.[section.id]?.includes(step.id) || false
  );
  
  const currentIndex = section.steps.findIndex(s => s.id === step.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < section.steps.length - 1;
  const prevStep = hasPrev ? section.steps[currentIndex - 1] : null;
  const nextStep = hasNext ? section.steps[currentIndex + 1] : null;

  const isAdmin = user.role === 'admin';

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleNext = () => {
    if (nextStep) {
      onNavigate('step', section, nextStep);
    } else {
      onNavigate('section', section);
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      onNavigate('step', section, prevStep);
    } else {
      onNavigate('section', section);
    }
  };

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('section', section)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{section.title}</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
            ${isCompleted 
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-primary-500/20 text-primary-400'
            }
          `}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : currentIndex + 1}
          </div>
          <div>
            <p className="text-gray-400 text-sm">{section.title} • Adım {currentIndex + 1}/{section.steps.length}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h1>
          </div>
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div 
        className="bg-dark-200 rounded-2xl p-6 md:p-8 border border-dark-100 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Step Description */}
        <p className="text-gray-400 mb-6">{step.description}</p>
        
        {/* Video Placeholder - Üstte */}
        <div className="bg-dark-300/50 rounded-xl p-4 mb-6 border border-dark-100">
          <p className="text-gray-400 text-sm mb-2">Eğitim Videosu</p>
          <div className="aspect-video bg-dark-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Video yakında eklenecek</p>
            </div>
          </div>
        </div>

        {/* Yapilacaklar - Altta */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Yapılacaklar</h3>
          <div 
            className="prose prose-invert prose-sm max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: step.content || '<p>Bu adım için içerik yakında eklenecek.</p>' }}
          />
        </div>

        {/* Admin Only: Loom & Notion Embed */}
        {isAdmin && (
          <div className="space-y-4 pt-4 border-t border-dark-100">
            <div className="p-4 bg-dark-300/50 rounded-xl border border-dashed border-dark-100">
              <p className="text-gray-400 text-sm mb-2">Loom Video Embed</p>
              <input 
                type="text" 
                placeholder="Loom video linki..."
                className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
            <div className="p-4 bg-dark-300/50 rounded-xl border border-dashed border-dark-100">
              <p className="text-gray-400 text-sm mb-2">Notion Database Embed</p>
              <input 
                type="text" 
                placeholder="Notion page linki..."
                className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Progress Indicators */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-1">
          {section.steps.map((s, i) => (
            <div 
              key={s.id}
              className={`
                h-1.5 flex-1 rounded-full transition-all duration-300
                ${i <= currentIndex 
                  ? s.id === step.id && isCompleted
                    ? 'bg-emerald-500'
                    : s.id === step.id
                      ? 'bg-primary-500'
                      : user.completedSteps?.[section.id]?.includes(s.id)
                        ? 'bg-emerald-500'
                        : 'bg-primary-500/50'
                  : 'bg-dark-300'
                }
              `}
            />
          ))}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        className="flex items-center justify-between gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button 
          onClick={handlePrev}
          disabled={!hasPrev && currentIndex === 0}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 text-sm
            ${hasPrev || currentIndex > 0
              ? 'bg-dark-200 hover:bg-dark-100 text-white border border-dark-100'
              : 'bg-dark-300 text-gray-500 cursor-not-allowed border border-dark-300'
            }
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Önceki
        </button>

        <div className="flex items-center gap-3">
          {!isCompleted && (
            <button 
              onClick={handleComplete}
              className="btn-primary text-sm py-3"
            >
              <CheckCircle2 className="w-4 h-4" />
              Tamamla
            </button>
          )}
          
          <button 
            onClick={handleNext}
            className="btn-primary text-sm py-3"
          >
            {isCompleted ? (hasNext ? 'Sonraki' : 'Bitir') : 'Geç'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StepPage;