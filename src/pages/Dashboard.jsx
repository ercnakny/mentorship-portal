import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Calendar,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import { SECTIONS, getTotalDuration } from '../data/mentorshipSections';

const Dashboard = ({ user, onNavigate }) => {
  const startDate = new Date(user.startDate);
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const totalDuration = getTotalDuration();
  const daysRemaining = Math.max(0, totalDuration - daysPassed);
  const progressPercent = Math.round((daysPassed / totalDuration) * 100);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDuration);
  const endMonth = endDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  const firstSection = SECTIONS[0];

  // Stats
  const completedCount = user.completedSections.length;
  const lockedCount = SECTIONS.length - completedCount - 1;
  const activeCount = 1;

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      {/* Welcome Header */}
      <motion.div 
        className="bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 border border-primary-500/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-4xl font-bold text-white capitalize">
          {user.name.split(' ')[0]}'ın Mentörlük Sayfası
        </h1>
      </motion.div>

      {/* Stats Cards - Responsive Grid */}
      <motion.div 
        className="grid grid-cols-3 gap-3 md:gap-6 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-dark-200 rounded-xl md:rounded-2xl p-4 md:p-6 border border-dark-100">
          <div className="flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
            <p className="text-2xl md:text-3xl font-bold text-white">{completedCount}</p>
            <p className="text-gray-500 text-xs md:text-sm">Tamamlanan</p>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl md:rounded-2xl p-4 md:p-6 border border-dark-100">
          <div className="flex flex-col items-center text-center gap-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
            <p className="text-2xl md:text-3xl font-bold text-white">{activeCount}</p>
            <p className="text-gray-500 text-xs md:text-sm">Açık</p>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl md:rounded-2xl p-4 md:p-6 border border-dark-100">
          <div className="flex flex-col items-center text-center gap-3">
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            <p className="text-2xl md:text-3xl font-bold text-white">{lockedCount}</p>
            <p className="text-gray-500 text-xs md:text-sm">Kilitli</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline Card */}
      <motion.div 
        className="bg-dark-200 rounded-2xl p-5 md:p-8 mb-6 border border-dark-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">Süreç Takvimi</h2>
          <span className="text-gray-500 text-sm ml-auto hidden md:inline">{endMonth}'da bitiş</span>
        </div>

        {/* Date Stats - Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-dark-300/50 rounded-xl p-3 text-center">
            <p className="text-gray-500 text-xs font-medium mb-1">Başlangıç</p>
            <p className="text-white font-semibold text-sm">{startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="bg-dark-300/50 rounded-xl p-3 text-center">
            <p className="text-gray-500 text-xs font-medium mb-1">Geçen</p>
            <p className="text-primary-400 font-bold text-2xl">{daysPassed}</p>
          </div>
          <div className="bg-dark-300/50 rounded-xl p-3 text-center">
            <p className="text-gray-500 text-xs font-medium mb-1">Kalan</p>
            <p className="text-amber-400 font-bold text-2xl">{daysRemaining}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2.5 bg-dark-300 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                progressPercent > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${progressPercent > 100 ? 'text-red-400' : 'text-gray-400'}`}>
              {progressPercent > 100 ? `${progressPercent - 100}% geç` : `${100 - progressPercent}% kaldı`}
            </span>
            <span className="text-xs text-gray-500">{progressPercent}%</span>
          </div>
        </div>

        {/* Mobile end date */}
        <p className="text-gray-500 text-sm mt-3 md:hidden">{endMonth}'da bitiş</p>
      </motion.div>

      {/* Current Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-2xl p-5 md:p-8 border border-primary-500/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-primary-400 text-sm font-medium mb-1">Şu An Burada Olmalısın</p>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{firstSection.title}</h3>
            <p className="text-gray-400 text-sm">{firstSection.subtitle}</p>
          </div>
          <button 
            onClick={() => onNavigate('section', firstSection)}
            className="btn-primary w-full md:w-auto justify-center"
          >
            Bölüme Git
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;