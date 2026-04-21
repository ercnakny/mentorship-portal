import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Users,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Calendar,
  Building,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MENTORSHIP_SECTIONS = [
  { id: 'teknik', name: 'Teknik', duration: 2 },
  { id: 'urun', name: 'Ürün', duration: 14 },
  { id: 'icerik', name: 'İçerik', duration: 7 },
  { id: 'site', name: 'Site', duration: 3 },
  { id: 'reklam', name: 'Reklam', duration: 3 },
];

const calculateTimeline = (startDate) => {
  const start = new Date(startDate);
  const timeline = [];
  let currentDate = new Date(start);
  
  MENTORSHIP_SECTIONS.forEach((section, idx) => {
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + section.duration - 1);
    
    const dayStart = idx === 0 ? 1 : timeline[idx - 1].dayEnd + 1;
    const dayEnd = idx === 0 ? section.duration : timeline[idx - 1].dayEnd + section.duration;
    
    timeline.push({
      ...section,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dayStart,
      dayEnd
    });
    
    currentDate = new Date(endDate);
    currentDate.setDate(currentDate.getDate() + 1);
  });
  
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + 89);
  
  return { timeline, totalDays: 90, endDate: endDate.toISOString().split('T')[0] };
};

const AdminPanel = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [expandedUser, setExpandedUser] = useState(null);
  
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    industry: '',
    hasContentSupport: true,
    startDate: new Date().toISOString().split('T')[0]
  });

  const [allowedEmails, setAllowedEmails] = useState([
    { 
      email: 'akinay516@gmail.com', 
      name: 'Ercan Akınay', 
      role: 'admin', 
      status: 'active',
      industry: 'Online Mentörlük',
      hasContentSupport: true,
      startDate: '2026-04-01'
    },
    { 
      email: 'danisan1@ornek.com', 
      name: 'Ahmet Yılmaz', 
      role: 'user', 
      status: 'active',
      industry: 'Psikoloji',
      hasContentSupport: true,
      startDate: '2026-04-15'
    },
  ]);

  const [requests, setRequests] = useState([
    { id: 1, userId: 'user1', userName: 'Ahmet Yılmaz', userEmail: 'danisan1@ornek.com', section: 'urun', type: 'completion', message: 'Ürün bölümünü tamamladım', status: 'pending', createdAt: '2026-04-21' },
  ]);

  const handleAddUser = () => {
    if (newUser.email && newUser.email.includes('@') && newUser.name) {
      setAllowedEmails([...allowedEmails, { 
        ...newUser,
        role: 'user', 
        status: 'pending' 
      }]);
      setNewUser({
        email: '',
        name: '',
        industry: '',
        hasContentSupport: true,
        startDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleDeleteUser = (email) => {
    setAllowedEmails(allowedEmails.filter(u => u.email !== email));
  };

  const handleApproveRequest = (requestId) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'approved' } : r
    ));
  };

  const handleRejectRequest = (requestId) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' } : r
    ));
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 md:p-8">
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">Danışanlarınızı ve talepleri yönetin</p>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'requests' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100 hover:border-primary-500/30'}`}
        >
          <Clock className="w-4 h-4" />
          Talepler
          {pendingCount > 0 && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100 hover:border-primary-500/30'}`}
        >
          <Users className="w-4 h-4" />
          Danışanlar
        </button>
      </div>

      {activeTab === 'requests' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {requests.length === 0 ? (
            <div className="bg-dark-200 rounded-2xl p-8 border border-dark-100 text-center">
              <p className="text-gray-500">Henüz talep yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className={`bg-dark-200 rounded-2xl p-5 border ${request.status === 'pending' ? 'border-amber-500/30' : request.status === 'approved' ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${request.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : request.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {request.status === 'pending' ? 'Bekliyor' : request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                        </span>
                        <span className="text-gray-500 text-sm">{request.createdAt}</span>
                      </div>
                      <h3 className="text-white font-semibold mb-1">{request.userName}</h3>
                      <p className="text-gray-400 text-sm mb-2">{request.userEmail}</p>
                      <p className="text-gray-300 text-sm">
                        <span className="text-primary-400 capitalize">{request.section}</span> bölümü için talep
                        {request.message && `: "${request.message}"`}
                      </p>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveRequest(request.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors" title="Onayla">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleRejectRequest(request.id)} className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors" title="Reddet">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-dark-200 rounded-2xl p-5 border border-dark-100 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-400" />
              Yeni Danışan Ekle
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Ad Soyad *</label>
                <input 
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Örn: Mehmet Demir"
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">E-posta *</label>
                <input 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="ornek@email.com"
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  Sektör
                </label>
                <input 
                  type="text"
                  value={newUser.industry}
                  onChange={(e) => setNewUser({...newUser, industry: e.target.value})}
                  placeholder="Örn: Psikoloji, Fitness, Diyetisyen"
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  İçerik Desteği
                </label>
                <select 
                  value={newUser.hasContentSupport ? 'destekli' : 'desteksiz'}
                  onChange={(e) => setNewUser({...newUser, hasContentSupport: e.target.value === 'destekli'})}
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="destekli">İçerik Destekli</option>
                  <option value="desteksiz">Desteksiz</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Başlangıç Tarihi
                </label>
                <input 
                  type="date"
                  value={newUser.startDate}
                  onChange={(e) => setNewUser({...newUser, startDate: e.target.value})}
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {newUser.startDate && (
              <div className="bg-dark-100 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">
                  90 Günlük Süreç (Tahmini Bitiş: {calculateTimeline(newUser.startDate).endDate})
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {calculateTimeline(newUser.startDate).timeline.map((section) => (
                    <div key={section.id} className="bg-dark-200 rounded-lg p-2 text-center">
                      <p className="text-primary-400 text-xs font-medium">{section.name}</p>
                      <p className="text-gray-500 text-xs">{section.duration} gün</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddUser}
              disabled={!newUser.email || !newUser.name}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Danışan Ekle
            </button>
          </div>

          <div className="space-y-4">
            {allowedEmails.map((u, index) => {
              const timeline = u.startDate ? calculateTimeline(u.startDate) : null;
              return (
                <div key={index} className="bg-dark-200 rounded-2xl border border-dark-100 overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-white font-bold">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{u.name}</h3>
                          {u.role === 'admin' && <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-lg">Admin</span>}
                          <span className={`px-2 py-0.5 text-xs rounded-lg ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {u.status === 'active' ? 'Aktif' : 'Bekliyor'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u.email)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setExpandedUser(expandedUser === index ? null : index)} className="p-2 text-gray-400 hover:text-white hover:bg-dark-100 rounded-lg transition-colors">
                        {expandedUser === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {expandedUser === index && (
                    <div className="px-4 pb-4 border-t border-dark-100 pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1">Sektör</p>
                          <p className="text-white text-sm">{u.industry || '-'}</p>
                        </div>
                        <div className="bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1">İçerik Desteği</p>
                          <p className={`text-sm ${u.hasContentSupport ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {u.hasContentSupport ? 'Destekli' : 'Desteksiz'}
                          </p>
                        </div>
                        <div className="bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1">Başlangıç</p>
                          <p className="text-white text-sm">{u.startDate || '-'}</p>
                        </div>
                        <div className="bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 text-xs mb-1">Bitiş (90 Gün)</p>
                          <p className="text-white text-sm">{timeline ? timeline.endDate : '-'}</p>
                        </div>
                      </div>

                      {timeline && (
                        <div className="bg-dark-100 rounded-xl p-4">
                          <p className="text-gray-400 text-sm mb-3">Süreç Takvimi</p>
                          <div className="space-y-2">
                            {timeline.timeline.map((section, idx) => (
                              <div key={section.id} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-medium">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-white text-sm font-medium">{section.name}</p>
                                    <p className="text-gray-500 text-xs">{section.dayStart}-{section.dayEnd}. gün</p>
                                  </div>
                                  <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 rounded-full" style={{ width: Math.round((section.duration / 90) * 100) + '%' }} />
                                  </div>
                                  <p className="text-gray-500 text-xs mt-0.5">{section.startDate} - {section.endDate} ({section.duration} gün)</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;