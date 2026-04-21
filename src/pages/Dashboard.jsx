import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Calendar, 
  Clock, 
  TrendingUp,
  ChevronRight,
  User,
  Zap
} from 'lucide-react';
import { SECTIONS, getTotalDuration } from '../data/mentorshipSections';

const Dashboard = ({ user, onNavigate }) => {
  // Hesaplamalar
  const startDate = new Date(user.startDate);
  const today = new Date();
  const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const totalDuration = getTotalDuration();
  const daysRemaining = Math.max(0, totalDuration - daysPassed);
  const progressPercent = Math.round((daysPassed / totalDuration) * 100);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDuration);
  const endMonth = endDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // Bölüm istatistikleri
  const stats = SECTIONS.map(section => {
    const completedSteps = user.completedSteps[section.id]?.length || 0;
    const totalSteps = section.steps.length;
    const isCompleted = completedSteps === totalSteps;
    const isLocked = !user.completedSections.includes(section.id) && 
                     SECTIONS.findIndex(s => s.id === section.id) > 0 &&
                     !user.completedSections.includes(SECTIONS[SECTIONS.findIndex(s => s.id === section.id) - 1]?.id);
    
    return {
      ...section,
      completedSteps,
      totalSteps,
      isCompleted,
      isLocked,
      progress: Math.round((completedSteps / totalSteps) * 100)
    };
  });

  const completedCount = stats.filter(s => s.isCompleted).length;
  const activeCount = stats.filter(s => !s.isCompleted && !s.isLocked).length;
  const lockedCount = stats.filter(s => s.isLocked).length;

  // Mevcut bölüm
  const currentSectionIndex = stats.findIndex(s => !s.isCompleted && !s.isLocked);
  const currentSection = currentSectionIndex >= 0 ? stats[currentSectionIndex] : null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div 
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {user.name.split(' ')[0]}'in Mentorluk Sayfası
            </h1>
            <p className="text-gray-400">Mentörlük sürecinizi takip edin</p>
          </div>
          <div className="flex items-center gap-3 bg-dark-200 px-4 py-3 rounded-2xl border border-dark-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.role === 'admin' ? 'Admin' : 'Danışan'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* İstatistikler */}
      <motion.div 
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          label="Tamamlanan"
          value={completedCount}
          total={stats.length}
          color="emerald"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6 text-amber-400" />}
          label="Aktif"
          value={activeCount}
          total={stats.length}
          color="amber"
        />
        <StatCard 
          icon={<Lock className="w-6 h-6 text-gray-400" />}
          label="Kilitli"
          value={lockedCount}
          total={stats.length}
          color="gray"
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-blue-400" />}
          label="Gün Geçti"
          value={daysPassed}
          suffix={`/${totalDuration} gün`}
          color="blue"
        />
      </motion.div>

      {/* Süreç Takvimi */}
      <motion.div 
        className="max-w-6xl mx-auto bg-dark-200 rounded-3xl p-6 mb-8 border border-dark-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Süreç Takvimi</h2>
          </div>
          <span className="text-gray-400 text-sm">{endMonth}'da bitiş</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-300/50 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Başlangıç</p>
            <p className="text-white font-medium">{startDate.toLocaleDateString('tr-TR')}</p>
          </div>
          <div className="bg-dark-300/50 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Geçen Gün</p>
            <p className="text-primary-400 font-bold text-2xl">{daysPassed}</p>
          </div>
          <div className="bg-dark-300/50 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Kalan Gün</p>
            <p className="text-amber-400 font-bold text-2xl">{daysRemaining}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-4 bg-dark-300 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                progressPercent > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={progressPercent > 100 ? 'text-red-400' : 'text-gray-400'}>
              {progressPercent > 100 ? `${progressPercent - 100}% geç (. ${Math.abs(daysRemaining)} gün geç)` : `${100 - progressPercent}% kaldı`}
            </span>
            <span className="text-gray-500">{progressPercent}% tamamlandı</span>
          </div>
        </div>
      </motion.div>

      {/* Mevcut Konum */}
      {currentSection && (
        <motion.div 
          className="max-w-6xl mx-auto bg-gradient-to-r from-primary-500/20 to-transparent rounded-3xl p-6 mb-8 border border-primary-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-400 text-sm mb-1">Şu An Burada Olmalısın</p>
              <h3 className="text-2xl font-bold text-white">{currentSection.title}</h3>
              <p className="text-gray-400">{currentSection.subtitle}</p>
            </div>
            <button 
              onClick={() => onNavigate('section', currentSection)}
              className="btn-primary flex items-center gap-2"
            >
              Bölüme Git
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Bölüm Kartları */}
      <motion.div 
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {stats.map((section, index) => (
          <SectionCard 
            key={section.id}
            section={section}
            onClick={() => !section.isLocked && onNavigate('section', section)}
            delay={index * 0.1}
          />
        ))}
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value, total, suffix = '', color }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20',
    gray: 'bg-gray-500/10 border-gray-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20'
  };

  return (
    <motion.div 
      className={`${colorMap[color]} border rounded-2xl p-4`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {value}
        {total && <span className="text-gray-500 text-lg">/{total}</span>}
        {suffix && <span className="text-gray-400 text-sm ml-1">{suffix}</span>}
      </p>
    </motion.div>
  );
};

const SectionCard = ({ section, onClick, delay }) => {
  const isClickable = !section.isLocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={isClickable ? { scale: 1.02 } : {}}
      onClick={isClickable ? onClick : undefined}
      className={`
        relative overflow-hidden rounded-2xl p-5 border cursor-pointer
        ${section.isCompleted 
          ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' 
          : section.isLocked
            ? 'bg-dark-300/50 border-dark-100 cursor-not-allowed opacity-60'
            : 'bg-dark-200 border-dark-100 hover:border-primary-500/50'
        }
      `}
    >
      {section.isLocked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}
      
      {section.isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-1">{section.title}</h3>
      <p className="text-gray-400 text-sm mb-3">{section.subtitle}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          {section.completedSteps}/{section.totalSteps} adım
        </span>
        <span className="text-gray-400 text-sm">
          {section.duration} gün
        </span>
      </div>

      {/* Mini Progress */}
      <div className="mt-3 h-1.5 bg-dark-300 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${section.progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export default Dashboard;