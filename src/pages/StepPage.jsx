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
    user.completedSteps[section.id]?.includes(step.id) || false
  );
  
  // Mevcut adımın index'i
  const currentIndex = section.steps.findIndex(s => s.id === step.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < section.steps.length - 1;
  
  const prevStep = hasPrev ? section.steps[currentIndex - 1] : null;
  const nextStep = hasNext ? section.steps[currentIndex + 1] : null;

  const handleComplete = () => {
    setIsCompleted(true);
    // Gerçek uygulamada Firebase'e kaydedilecek
  };

  const handleNext = () => {
    if (nextStep) {
      onNavigate('step', section, nextStep);
    } else {
      // Bölüm tamamlandı, bölüm sayfasına dön
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => onNavigate('section', section)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {section.title}
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

        {/* İçerik */}
        <motion.div 
          className="bg-dark-200 rounded-3xl p-6 md:p-8 border border-dark-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: step.content }}
          />
          
          {/* Loom Embed Alanı (Gelecek için) */}
          <div className="mt-8 p-6 bg-dark-300/50 rounded-2xl border border-dashed border-dark-100">
            <p className="text-gray-400 text-sm mb-2">Loom Video Ekle</p>
            <input 
              type="text" 
              placeholder="Loom linki yapıştırın..."
              className="w-full bg-dark-300 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Notion Embed Alanı (Gelecek için) */}
          <div className="mt-4 p-6 bg-dark-300/50 rounded-2xl border border-dashed border-dark-100">
            <p className="text-gray-400 text-sm mb-2">Notion Database Embed</p>
            <input 
              type="text" 
              placeholder="Notion linki yapıştırın..."
              className="w-full bg-dark-300 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </motion.div>

        {/* İlerleme Göstergesi */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
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
                        : user.completedSteps[section.id]?.includes(s.id)
                          ? 'bg-emerald-500'
                          : 'bg-primary-500/50'
                    : 'bg-dark-300'
                  }
                `}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigasyon Butonları */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={handlePrev}
            disabled={!hasPrev && currentIndex === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
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
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Tamamla
              </button>
            )}
            
            {(hasNext || currentIndex < section.steps.length - 1) && (
              <button 
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                {isCompleted ? 'Sonraki' : 'Geç'}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StepPage;