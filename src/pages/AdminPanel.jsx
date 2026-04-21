import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronUp,
  TrendingUp,
  Eye,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const MENTORSHIP_SECTIONS = [
  { id: 'teknik', name: 'Teknik', duration: 2, color: 'from-blue-500 to-blue-600' },
  { id: 'urun', name: 'Ürün', duration: 14, color: 'from-purple-500 to-purple-600' },
  { id: 'icerik', name: 'İçerik', duration: 7, color: 'from-amber-500 to-amber-600' },
  { id: 'site', name: 'Site', duration: 3, color: 'from-emerald-500 to-emerald-600' },
  { id: 'reklam', name: 'Reklam', duration: 3, color: 'from-rose-500 to-rose-600' },
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

// Demo data with client progress
const DEMO_CLIENTS = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@ornek.com',
    industry: 'Psikoloji',
    startDate: '2026-04-10',
    hasContentSupport: true,
    status: 'active',
    currentSection: 'urun',
    currentStep: 4,
    totalSteps: 6,
    completedSteps: ['teknik-1', 'teknik-2', 'urun-1', 'urun-2', 'urun-3'],
    lastActivity: '2026-04-21',
    stuckDays: 2
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    email: 'ayse@ornek.com',
    industry: 'Fitness',
    startDate: '2026-04-15',
    hasContentSupport: false,
    status: 'active',
    currentSection: 'icerik',
    currentStep: 2,
    totalSteps: 4,
    completedSteps: ['teknik-1', 'teknik-2', 'urun-1'],
    lastActivity: '2026-04-20',
    stuckDays: 0
  },
  {
    id: 3,
    name: 'Mehmet Demir',
    email: 'mehmet@ornek.com',
    industry: 'Diyetisyen',
    startDate: '2026-04-01',
    hasContentSupport: true,
    status: 'active',
    currentSection: 'site',
    currentStep: 1,
    totalSteps: 3,
    completedSteps: ['teknik-1', 'teknik-2', 'urun-1', 'urun-2', 'urun-3', 'urun-4', 'urun-5', 'urun-6', 'urun-7', 'urun-8', 'urun-9', 'urun-10', 'urun-11', 'urun-12', 'urun-13', 'urun-14', 'icerik-1', 'icerik-2', 'icerik-3', 'icerik-4', 'icerik-5', 'icerik-6', 'icerik-7'],
    lastActivity: '2026-04-19',
    stuckDays: 5
  },
  {
    id: 4,
    name: 'Zeynep Ak',
    email: 'zeynep@ornek.com',
    industry: 'Yoga',
    startDate: '2026-04-18',
    hasContentSupport: true,
    status: 'pending',
    currentSection: 'teknik',
    currentStep: 1,
    totalSteps: 2,
    completedSteps: [],
    lastActivity: null,
    stuckDays: 0
  },
];

const AdminPanel = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [expandedUser, setExpandedUser] = useState(null);
  const [trackingView, setTrackingView] = useState('grid'); // 'grid' or 'list'
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientFilter, setClientFilter] = useState('all'); // 'all', 'active', 'stuck', 'pending'
  
  // New user form state
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    industry: '',
    hasContentSupport: true,
    startDate: new Date().toISOString().split('T')[0]
  });

  // Demo data
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
  ]);

  const [requests, setRequests] = useState([
    { id: 1, userId: 'user1', userName: 'Ahmet Yılmaz', userEmail: 'ahmet@ornek.com', section: 'urun', type: 'completion', message: 'Ürün bölümünü tamamladım', status: 'pending', createdAt: '2026-04-21' },
  ]);

  const clients = DEMO_CLIENTS;

  const filteredClients = clients.filter(c => {
    if (clientFilter === 'active') return c.status === 'active';
    if (clientFilter === 'stuck') return c.stuckDays > 3;
    if (clientFilter === 'pending') return c.status === 'pending';
    return true;
  });

  const stuckClients = clients.filter(c => c.stuckDays > 3);

  const getSectionProgress = (client) => {
    const timeline = calculateTimeline(client.startDate);
    const currentSectionIdx = MENTORSHIP_SECTIONS.findIndex(s => s.id === client.currentSection);
    return {
      timeline,
      currentSectionIdx,
      overallProgress: Math.round((client.completedSteps.length / 30) * 100) // Assuming ~30 total steps
    };
  };

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
      {/* Header */}
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

      {/* Tabs */}
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
        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'tracking' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100 hover:border-primary-500/30'}`}
        >
          <TrendingUp className="w-4 h-4" />
          Süreç Takibi
          {stuckClients.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stuckClients.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
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

      {activeTab === 'tracking' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark-200 rounded-xl p-4 border border-dark-100">
              <p className="text-gray-400 text-sm mb-1">Toplam Danışan</p>
              <p className="text-2xl font-bold text-white">{clients.length}</p>
            </div>
            <div className="bg-dark-200 rounded-xl p-4 border border-dark-100">
              <p className="text-gray-400 text-sm mb-1">Aktif</p>
              <p className="text-2xl font-bold text-emerald-400">{clients.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="bg-dark-200 rounded-xl p-4 border border-dark-100">
              <p className="text-gray-400 text-sm mb-1">Takılan</p>
              <p className="text-2xl font-bold text-red-400">{stuckClients.length}</p>
            </div>
            <div className="bg-dark-200 rounded-xl p-4 border border-dark-100">
              <p className="text-gray-400 text-sm mb-1">Bekleyen</p>
              <p className="text-2xl font-bold text-amber-400">{clients.filter(c => c.status === 'pending').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setClientFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${clientFilter === 'all' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100'}`}
            >
              Tümü ({clients.length})
            </button>
            <button
              onClick={() => setClientFilter('active')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${clientFilter === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100'}`}
            >
              Aktif ({clients.filter(c => c.status === 'active').length})
            </button>
            <button
              onClick={() => setClientFilter('stuck')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${clientFilter === 'stuck' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100'}`}
            >
              Takılan ({stuckClients.length})
            </button>
            <button
              onClick={() => setClientFilter('pending')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${clientFilter === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-dark-200 text-gray-400 border border-dark-100'}`}
            >
              Bekleyen ({clients.filter(c => c.status === 'pending').length})
            </button>
          </div>

          {/* Client List */}
          <div className="space-y-3">
            {filteredClients.map((client) => {
              const progress = getSectionProgress(client);
              const currentSection = MENTORSHIP_SECTIONS.find(s => s.id === client.currentSection);
              const isExpanded = selectedClient === client.id;
              
              return (
                <div key={client.id} className="bg-dark-200 rounded-2xl border border-dark-100 overflow-hidden">
                  {/* Client Summary Row */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-100/50 transition-colors"
                    onClick={() => setSelectedClient(isExpanded ? null : client.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentSection?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                        <span className="text-white font-bold">{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white font-semibold">{client.name}</h3>
                          {client.stuckDays > 3 && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-lg">
                              <AlertCircle className="w-3 h-3" />
                              {client.stuckDays} gün takılı
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">{client.industry} • {client.currentSection} bölümü • Adım {client.currentStep}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Progress Ring */}
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-dark-100" />
                          <circle 
                            cx="24" cy="24" r="20" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="none" 
                            className={client.stuckDays > 3 ? 'text-red-500' : 'text-primary-500'}
                            strokeDasharray={`${progress.overallProgress * 1.26} 126`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          %{progress.overallProgress}
                        </span>
                      </div>
                      
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-dark-100 overflow-hidden"
                      >
                        <div className="p-4 bg-dark-100/50">
                          {/* Timeline Progress */}
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-3">Süreç Durumu</p>
                            <div className="flex gap-1">
                              {progress.timeline.map((section, idx) => {
                                const isCompleted = idx < progress.currentSectionIdx;
                                const isCurrent = idx === progress.currentSectionIdx;
                                const isPending = idx > progress.currentSectionIdx;
                                
                                return (
                                  <div 
                                    key={section.id}
                                    className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                                      isCompleted ? 'bg-emerald-500 text-white' :
                                      isCurrent ? `bg-gradient-to-r ${section.color} text-white` :
                                      'bg-dark-200 text-gray-500'
                                    }`}
                                    title={`${section.name}: ${section.dayStart}-${section.dayEnd}. gün`}
                                  >
                                    {isCurrent && <span className="truncate px-1">{section.name}</span>}
                                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Current Section Detail */}
                          <div className="bg-dark-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-gray-400 text-xs">Şu An</p>
                                <p className="text-white font-semibold capitalize">{client.currentSection} Bölümü • Adım {client.currentStep}/{client.totalSteps}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-xs">Kalan</p>
                                <p className="text-white font-semibold">{90 - Math.round((new Date() - new Date(client.startDate)) / (1000 * 60 * 60 * 24))} gün</p>
                              </div>
                            </div>
                            <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${currentSection?.color || 'from-primary-500 to-primary-600'} rounded-full`}
                                style={{ width: `${(client.currentStep / client.totalSteps) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Client Info */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            <div className="bg-dark-200 rounded-lg p-3">
                              <p className="text-gray-500 text-xs mb-1">Başlangıç</p>
                              <p className="text-white text-sm">{client.startDate}</p>
                            </div>
                            <div className="bg-dark-200 rounded-lg p-3">
                              <p className="text-gray-500 text-xs mb-1">Bitiş</p>
                              <p className="text-white text-sm">{progress.timeline.endDate}</p>
                            </div>
                            <div className="bg-dark-200 rounded-lg p-3">
                              <p className="text-gray-500 text-xs mb-1">Son Aktivite</p>
                              <p className="text-white text-sm">{client.lastActivity || '-'}</p>
                            </div>
                            <div className="bg-dark-200 rounded-lg p-3">
                              <p className="text-gray-500 text-xs mb-1">İçerik Desteği</p>
                              <p className={`text-sm ${client.hasContentSupport ? 'text-emerald-400' : 'text-gray-400'}`}>
                                {client.hasContentSupport ? 'Destekli' : 'Desteksiz'}
                              </p>
                            </div>
                          </div>

                          {/* Action */}
                          <button className="w-full btn-primary">
                            <Eye className="w-4 h-4" />
                            Danışanı Görüntüle
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {filteredClients.length === 0 && (
            <div className="bg-dark-200 rounded-2xl p-8 border border-dark-100 text-center">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500">Bu filtreye uygun danışan yok</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;