import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Calendar,
  ChevronRight,
  User
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

  // Sadece ilk bölüm aktif (diğerleri kilitli)
  const firstSection = SECTIONS[0];
  const currentSection = firstSection;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Merhaba, {user.name.split(' ')[0]}
              </h1>
              <p className="text-xl text-gray-400">Mentörlük sürecinizi yönetin</p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-dark-200 px-5 py-4 rounded-2xl border border-dark-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.role === 'admin' ? 'Admin' : 'Danışan'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Süreç Takvimi Kartı */}
        <motion.div 
          className="bg-dark-200 rounded-3xl p-8 mb-8 border border-dark-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Süreç Takvimi</h2>
            <span className="text-gray-500 text-sm ml-auto">{endMonth}'da bitiş</span>
          </div>
          
          {/* İstatistikler */}
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

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-5 bg-dark-300 rounded-full overflow-hidden">
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
                  ? `${progressPercent - 100}% geç - ${Math.abs(daysRemaining)} gün fazla` 
                  : `${100 - progressPercent}% kaldı`}
              </span>
              <span className="text-sm text-gray-500">{progressPercent}% tamamlandı</span>
            </div>
          </div>
        </motion.div>

        {/* Aktif Bölüm */}
        <motion.div 
          className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-3xl p-8 mb-8 border border-primary-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-400 text-sm font-medium mb-2">Şu An Burada Olmalısın</p>
              <h3 className="text-3xl font-bold text-white mb-1">{currentSection.title}</h3>
              <p className="text-gray-400">{currentSection.subtitle}</p>
            </div>
            <button 
              onClick={() => onNavigate('section', currentSection)}
              className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
            >
              Bölüme Git
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Tamamlanan Bölüm */}
        {user.completedSections.length > 0 && (
          <motion.div 
            className="bg-dark-200 rounded-3xl p-8 border border-dark-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Tamamlanan Bölümler</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {user.completedSections.map(sectionId => {
                const section = SECTIONS.find(s => s.id === sectionId);
                return section ? (
                  <span key={sectionId} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl font-medium">
                    {section.title}
                  </span>
                ) : null;
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;