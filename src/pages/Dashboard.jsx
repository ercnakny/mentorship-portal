import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
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
    <div className="p-8">
      {/* Welcome Header */}
      <motion.div 
        className="bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent rounded-3xl p-8 mb-8 border border-primary-500/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          {user.name.split(' ')[0]}'in Mentorluk Sayfası
        </h1>
        <p className="text-xl text-gray-400">Mentörlük sürecinizi yönetin</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-dark-200 rounded-2xl p-6 border border-dark-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tamamlanan</p>
              <p className="text-3xl font-bold text-white">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-2xl p-6 border border-dark-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Açık</p>
              <p className="text-3xl font-bold text-white">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-2xl p-6 border border-dark-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-500/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Kilitli</p>
              <p className="text-3xl font-bold text-white">{lockedCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Card */}
      <motion.div 
        className="bg-dark-200 rounded-3xl p-8 mb-8 border border-dark-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-semibold text-white">Süreç Takvimi</h2>
          <span className="text-gray-500 text-sm ml-auto">{endMonth}'da bitiş</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-300/50 rounded-2xl p-5 text-center">
            <p className="text-gray-400 text-sm mb-2">Başlangıç</p>
            <p className="text-white font-semibold">{startDate.toLocaleDateString('tr-TR')}</p>
          </div>
          <div className="bg-dark-300/50 rounded-2xl p-5 text-center">
            <p className="text-gray-400 text-sm mb-2">Geçen Gün</p>
            <p className="text-primary-400 font-bold text-3xl">{daysPassed}</p>
          </div>
          <div className="bg-dark-300/50 rounded-2xl p-5 text-center">
            <p className="text-gray-400 text-sm mb-2">Kalan Gün</p>
            <p className="text-amber-400 font-bold text-3xl">{daysRemaining}</p>
          </div>
        </div>

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
          <div className="flex justify-between mt-3">
            <span className={`text-sm font-medium ${progressPercent > 100 ? 'text-red-400' : 'text-gray-400'}`}>
              {progressPercent > 100 
                ? `${progressPercent - 100}% geç` 
                : `${100 - progressPercent}% kaldı`}
            </span>
            <span className="text-sm text-gray-500">{progressPercent}% tamamlandı</span>
          </div>
        </div>

        {progressPercent < 50 && (
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Takvimin önündesin! Harika gidiyorsun!</span>
          </div>
        )}
      </motion.div>

      {/* Current Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-3xl p-8 border border-primary-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-primary-400 text-sm font-medium mb-2">Şu An Burada Olmalısın</p>
            <h3 className="text-3xl font-bold text-white mb-1">{firstSection.title}</h3>
            <p className="text-gray-400">{firstSection.subtitle}</p>
          </div>
          <button 
            onClick={() => onNavigate('section', firstSection)}
            className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
          >
            Bölüme Git
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;