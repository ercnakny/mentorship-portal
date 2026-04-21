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
  Search
} from 'lucide-react';

const AdminPanel = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [newEmail, setNewEmail] = useState('');

  // Demo data - gerçek uygulamada Firebase'den çekilecek
  const [allowedEmails, setAllowedEmails] = useState([
    { email: 'akinay516@gmail.com', name: 'Ercan Akınay', role: 'admin', status: 'active' },
    { email: 'danisan1@ornek.com', name: 'Ahmet Yılmaz', role: 'user', status: 'pending' },
    { email: 'danisan2@ornek.com', name: 'Ayşe Kaya', role: 'user', status: 'active' },
  ]);

  const [requests, setRequests] = useState([
    { id: 1, userId: 'user1', userName: 'Ahmet Yılmaz', userEmail: 'danisan1@ornek.com', section: 'urun', type: 'completion', message: 'Ürün bölümünü tamamladım', status: 'pending', createdAt: '2026-04-21' },
    { id: 2, userId: 'user2', userName: 'Ayşe Kaya', userEmail: 'danisan2@ornek.com', section: 'icerik', type: 'skip_request', message: 'İçerik bölümünü atlamak istiyorum', status: 'pending', createdAt: '2026-04-20' },
  ]);

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes('@')) {
      setAllowedEmails([...allowedEmails, { 
        email: newEmail, 
        name: 'Yeni Kullanıcı', 
        role: 'user', 
        status: 'pending' 
      }]);
      setNewEmail('');
    }
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
          <span>Dashboard</span>
        </button>
        
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">Danışanlarınızı ve talepleri yönetin</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
            ${activeTab === 'requests' 
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
              : 'bg-dark-200 text-gray-400 border border-dark-100 hover:border-primary-500/30'
            }
          `}
        >
          <Clock className="w-4 h-4" />
          Talepler
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
            ${activeTab === 'users' 
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
              : 'bg-dark-200 text-gray-400 border border-dark-100 hover:border-primary-500/30'
            }
          `}
        >
          <Users className="w-4 h-4" />
          Danışanlar
        </button>
      </div>

      {/* Content */}
      {activeTab === 'requests' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {requests.length === 0 ? (
            <div className="bg-dark-200 rounded-2xl p-8 border border-dark-100 text-center">
              <p className="text-gray-500">Henüz talep yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div 
                  key={request.id}
                  className={`
                    bg-dark-200 rounded-2xl p-5 border 
                    ${request.status === 'pending' ? 'border-amber-500/30' : 
                      request.status === 'approved' ? 'border-emerald-500/30' : 'border-red-500/30'}
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`
                          px-2 py-1 rounded-lg text-xs font-medium
                          ${request.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            request.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                        `}>
                          {request.status === 'pending' ? 'Bekliyor' : 
                           request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
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
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                          title="Onayla"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                          title="Reddet"
                        >
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Add New User */}
          <div className="bg-dark-200 rounded-2xl p-5 border border-dark-100 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-400" />
              Yeni Danışan Ekle
            </h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input 
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="E-posta adresi..."
                  className="w-full bg-dark-100 border border-dark-100 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <button 
                onClick={handleAddEmail}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Ekle
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {allowedEmails.map((user, index) => (
              <div 
                key={index}
                className="bg-dark-200 rounded-2xl p-4 border border-dark-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{user.name}</h3>
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-lg">Admin</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className={`
                  px-3 py-1 rounded-lg text-xs font-medium
                  ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
                `}>
                  {user.status === 'active' ? 'Aktif' : 'Bekliyor'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;