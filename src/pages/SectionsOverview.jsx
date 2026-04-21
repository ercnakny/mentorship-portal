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

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>
        
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Bölümler</h1>
        <p className="text-gray-400">Mentörlük sürecindeki tüm bölümler</p>
      </motion.div>

      {/* Section List */}
      <motion.div 
        className="space-y-3"
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
              className={`
                w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-200 text-left
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
              {/* Icon Circle */}
              <div className={`
                w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0
                ${status === 'completed' 
                  ? 'bg-emerald-500/20'
                  : status === 'active'
                    ? 'bg-primary-500/20'
                    : 'bg-dark-100'
                }
              `}>
                <Icon className={`w-6 h-6 md:w-7 md:h-7 ${
                  status === 'completed' 
                    ? 'text-emerald-400' 
                    : status === 'active'
                      ? 'text-primary-400'
                      : 'text-gray-500'
                }`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-base md:text-lg ${status === 'locked' ? 'text-gray-500' : 'text-white'}`}>
                    {index + 1}. {section.title}
                  </h3>
                  {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {status === 'locked' && <Lock className="w-4 h-4 text-gray-500" />}
                </div>
                <p className="text-gray-500 text-sm">{section.subtitle}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-gray-500 text-xs">{section.steps.length} adım</span>
                  <span className="text-gray-500 text-xs">•</span>
                  <span className="text-gray-500 text-xs">{section.duration} gün</span>
                </div>
              </div>
              
              {/* Arrow */}
              {isClickable && (
                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                  status === 'completed' ? 'text-emerald-400' : 'text-gray-500'
                }`} />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SectionsOverview;