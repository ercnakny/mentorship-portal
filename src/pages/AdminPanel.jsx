import { useState, useEffect } from 'react';
import { addClientToFirestore, getPendingUsers, approveUser, rejectUser } from '../firebase/client';
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
  ChevronUp,
  TrendingUp,
  AlertCircle
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [activeTab, setActiveTab] = useState('requests');
  const [expandedUser, setExpandedUser] = useState(null);
  const [clientFilter, setClientFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  
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
  ]);

  const [requests, setRequests] = useState([
    { id: 1, userId: 'user1', userName: 'Ahmet Yılmaz', userEmail: 'ahmet@ornek.com', section: 'urun', type: 'completion', message: 'Ürün bölümünü tamamladım', status: 'pending', createdAt: '2026-04-21' },
  ]);

  // Kayıt istekleri (Firebase'den)
  const [registrationRequests, setRegistrationRequests] = useState([]);

  // Kayıt isteklerini getir
  useEffect(() => {
    const loadPendingUsers = async () => {
      const pending = await getPendingUsers();
      setRegistrationRequests(pending);
    };
    if (activeTab === 'requests') {
      loadPendingUsers();
    }
  }, [activeTab]);

  // Kayıt isteğini onayla
  const handleApproveRegistration = async (user) => {
    const result = await approveUser(user.email, {
      name: user.name,
      industry: user.industry || '',
      hasContentSupport: user.hasContentSupport ?? true,
      startDate: user.startDate || new Date().toISOString().split('T')[0]
    });
    if (result.success) {
      setRegistrationRequests(registrationRequests.filter(r => r.email !== user.email));
      setRequests([...requests, {
        id: Date.now(),
        userId: user.email,
        userName: user.name,
        userEmail: user.email,
        section: 'kayit',
        type: 'registration',
        message: 'Kayıt onaylandı',
        status: 'approved',
        createdAt: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  // Kayıt isteğini reddet
  const handleRejectRegistration = async (email) => {
    await rejectUser(email);
    setRegistrationRequests(registrationRequests.filter(r => r.email !== email));
  };

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
      overallProgress: Math.round((client.completedSteps.length / 30) * 100)
    };
  };

  const [addStatus, setAddStatus] = useState(null);

  const handleAddUser = async () => {
    if (newUser.email && newUser.email.includes('@') && newUser.name) {
      setAddStatus('loading');
      const result = await addClientToFirestore(newUser);
      
      if (result.success) {
        setAllowedEmails([...allowedEmails, { 
          ...newUser,
          role: 'user', 
          status: 'active' 
        }]);
        setNewUser({
          email: '',
          name: '',
          industry: '',
          hasContentSupport: true,
          startDate: new Date().toISOString().split('T')[0]
        });
        setAddStatus('success');
        setTimeout(() => setAddStatus(null), 3000);
      } else {
        setAddStatus('error');
        setTimeout(() => setAddStatus(null), 4000);
      }
    }
  };

  const handleDeleteUser = (email) => {
    setAllowedEmails(allowedEmails.filter(u => u.email !== email));
  };

  const handleApproveRequest = (requestId) => {
    setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
  };

  const handleRejectRequest = (requestId) => {
    setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  // Styles
  const pageStyle = { padding: isMobile ? '16px' : '32px', maxWidth: '1400px', margin: '0 auto', paddingBottom: isMobile ? '100px' : '32px' };
  const cardStyle = { backgroundColor: '#1a2234', borderRadius: '16px', border: '1px solid #2d3a4f', padding: isMobile ? '16px' : '24px' };

  const getTabStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
    border: isActive ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid #2d3a4f',
    backgroundColor: isActive ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
    color: isActive ? '#38bdf8' : '#9ca3af',
    cursor: 'pointer'
  });

  const inputStyle = {
    width: '100%',
    height: isMobile ? '44px' : '48px',
    backgroundColor: '#151c2c',
    border: '2px solid #2d3a4f',
    borderRadius: '12px',
    padding: '0 16px',
    fontSize: '16px',
    color: 'white',
    outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <div style={pageStyle}>
      <motion.div style={{ marginBottom: '32px' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <button 
          onClick={() => onNavigate('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Dashboard</span>
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Admin Panel</h1>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>Danışanlarınızı ve talepleri yönetin</p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('requests')} style={getTabStyle(activeTab === 'requests')}>
          <Clock style={{ width: '16px', height: '16px' }} />
          <span>Talepler</span>
          {pendingCount > 0 && (
            <span style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontSize: '12px', fontWeight: 600, padding: '2px 10px', borderRadius: '8px' }}>{pendingCount}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('users')} style={getTabStyle(activeTab === 'users')}>
          <Users style={{ width: '16px', height: '16px' }} />
          <span>Danışanlar</span>
        </button>
        <button onClick={() => setActiveTab('tracking')} style={getTabStyle(activeTab === 'tracking')}>
          <TrendingUp style={{ width: '16px', height: '16px' }} />
          <span>Süreç Takibi</span>
          {stuckClients.length > 0 && (
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '12px', fontWeight: 600, padding: '2px 10px', borderRadius: '8px' }}>{stuckClients.length}</span>
          )}
        </button>
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Kayıt İstekleri */}
          {registrationRequests.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                Yeni Kayıt Talepleri
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {registrationRequests.map((req) => (
                  <div key={req.id} style={{ ...cardStyle, border: '1px solid rgba(14, 165, 233, 0.3)', backgroundColor: 'rgba(14, 165, 233, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8' }}>
                            Yeni Kayıt
                          </span>
                          <span style={{ color: '#6b7280', fontSize: '14px' }}>{req.createdAt?.split('T')[0]}</span>
                        </div>
                        <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '4px' }}>{req.name}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>{req.email}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApproveRegistration(req)} style={{ padding: '10px 16px', backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }} title="Onayla">
                          <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                          Onayla
                        </button>
                        <button onClick={() => handleRejectRegistration(req.email)} style={{ padding: '10px 16px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }} title="Reddet">
                          <XCircle style={{ width: '16px', height: '16px' }} />
                          Reddet
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mevcut Talepler */}
          {requests.length === 0 && registrationRequests.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}>
              <p style={{ color: '#6b7280' }}>Henüz talep yok</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {requests.map((request) => (
                <div key={request.id} style={{ ...cardStyle, border: request.status === 'pending' ? '1px solid rgba(251, 191, 36, 0.3)' : request.status === 'approved' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: request.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' : request.status === 'approved' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: request.status === 'pending' ? '#fbbf24' : request.status === 'approved' ? '#34d399' : '#f87171' }}>
                          {request.status === 'pending' ? 'Bekliyor' : request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>{request.createdAt}</span>
                      </div>
                      <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '4px' }}>{request.userName}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>{request.userEmail}</p>
                      <p style={{ color: '#e5e7eb', fontSize: '14px' }}>
                        <span style={{ color: '#38bdf8', textTransform: 'capitalize' }}>{request.section}</span> bölümü için talep
                        {request.message && `: "${request.message}"`}
                      </p>
                    </div>
                    {request.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApproveRequest(request.id)} style={{ padding: '10px', backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399', borderRadius: '12px', border: 'none', cursor: 'pointer' }} title="Onayla">
                          <CheckCircle2 style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button onClick={() => handleRejectRequest(request.id)} style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '12px', border: 'none', cursor: 'pointer' }} title="Reddet">
                          <XCircle style={{ width: '20px', height: '20px' }} />
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ ...cardStyle, marginBottom: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
              Yeni Danışan Ekle
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', display: 'block' }}>Ad Soyad *</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} placeholder="Örn: Mehmet Demir" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', display: 'block' }}>E-posta *</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="ornek@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building style={{ width: '16px', height: '16px' }} />
                  Sektör
                </label>
                <input type="text" value={newUser.industry} onChange={(e) => setNewUser({...newUser, industry: e.target.value})} placeholder="Örn: Psikoloji, Fitness" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  Süreç Başlangıç Tarihi
                </label>
                <input 
                  type="date" 
                  value={newUser.startDate} 
                  onChange={(e) => setNewUser({...newUser, startDate: e.target.value})} 
                  style={{ ...inputStyle, colorScheme: 'dark' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', display: 'block' }}>İçerik Desteği</label>
                <div style={{ display: 'flex', gap: '8px', height: '48px' }}>
                  <button 
                    type="button"
                    onClick={() => setNewUser({...newUser, hasContentSupport: true})}
                    style={{ 
                      flex: 1, 
                      height: '100%', 
                      borderRadius: '12px', 
                      border: newUser.hasContentSupport ? '2px solid #0ea5e9' : '2px solid #2d3a4f', 
                      backgroundColor: newUser.hasContentSupport ? 'rgba(14, 165, 233, 0.2)' : '#151c2c', 
                      color: newUser.hasContentSupport ? '#38bdf8' : '#6b7280', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Destekli
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewUser({...newUser, hasContentSupport: false})}
                    style={{ 
                      flex: 1, 
                      height: '100%', 
                      borderRadius: '12px', 
                      border: !newUser.hasContentSupport ? '2px solid #0ea5e9' : '2px solid #2d3a4f', 
                      backgroundColor: !newUser.hasContentSupport ? 'rgba(14, 165, 233, 0.2)' : '#151c2c', 
                      color: !newUser.hasContentSupport ? '#38bdf8' : '#6b7280', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Desteksiz
                  </button>
                </div>
              </div>
            </div>

            <button onClick={handleAddUser} disabled={!newUser.email || !newUser.name || addStatus === 'loading'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, opacity: (!newUser.email || !newUser.name || addStatus === 'loading') ? 0.5 : 1, cursor: (!newUser.email || !newUser.name || addStatus === 'loading') ? 'not-allowed' : 'pointer', backgroundColor: '#0ea5e9', color: 'white', border: 'none' }}>
              <Plus style={{ width: '16px', height: '16px' }} />
              Danışan Ekle
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {allowedEmails.map((u, index) => (
              <div key={index} style={{ ...cardStyle, cursor: 'default' }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{u.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ color: 'white', fontWeight: 600 }}>{u.name}</h3>
                        {u.role === 'admin' && <span style={{ padding: '2px 8px', backgroundColor: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontSize: '12px', borderRadius: '6px' }}>Admin</span>}
                        <span style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '6px', backgroundColor: u.status === 'active' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: u.status === 'active' ? '#34d399' : '#fbbf24' }}>
                          {u.status === 'active' ? 'Aktif' : 'Bekliyor'}
                        </span>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>{u.email}</p>
                    </div>
                  </div>
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(u.email)} style={{ padding: '8px', color: '#f87171', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))', gap: isMobile ? '8px' : '16px', marginBottom: '24px' }}>
            <div style={cardStyle}>
              <p style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px', marginBottom: '4px' }}>Toplam</p>
              <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: 'white' }}>{clients.length}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px', marginBottom: '4px' }}>Aktif</p>
              <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: '#34d399' }}>{clients.filter(c => c.status === 'active').length}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px', marginBottom: '4px' }}>Takılan</p>
              <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: '#f87171' }}>{stuckClients.length}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px', marginBottom: '4px' }}>Bekleyen</p>
              <p style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: '#fbbf24' }}>{clients.filter(c => c.status === 'pending').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            <button onClick={() => setClientFilter('all')} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, border: clientFilter === 'all' ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid #2d3a4f', backgroundColor: clientFilter === 'all' ? 'rgba(14, 165, 233, 0.2)' : 'transparent', color: clientFilter === 'all' ? '#38bdf8' : '#9ca3af', cursor: 'pointer' }}>
              Tümü ({clients.length})
            </button>
            <button onClick={() => setClientFilter('active')} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, border: clientFilter === 'active' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #2d3a4f', backgroundColor: clientFilter === 'active' ? 'rgba(52, 211, 153, 0.2)' : 'transparent', color: clientFilter === 'active' ? '#34d399' : '#9ca3af', cursor: 'pointer' }}>
              Aktif ({clients.filter(c => c.status === 'active').length})
            </button>
            <button onClick={() => setClientFilter('stuck')} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, border: clientFilter === 'stuck' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #2d3a4f', backgroundColor: clientFilter === 'stuck' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', color: clientFilter === 'stuck' ? '#f87171' : '#9ca3af', cursor: 'pointer' }}>
              Takılan ({stuckClients.length})
            </button>
            <button onClick={() => setClientFilter('pending')} style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, border: clientFilter === 'pending' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid #2d3a4f', backgroundColor: clientFilter === 'pending' ? 'rgba(251, 191, 36, 0.2)' : 'transparent', color: clientFilter === 'pending' ? '#fbbf24' : '#9ca3af', cursor: 'pointer' }}>
              Bekleyen ({clients.filter(c => c.status === 'pending').length})
            </button>
          </div>

          {/* Client List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredClients.map((client) => {
              const progress = getSectionProgress(client);
              const currentSection = MENTORSHIP_SECTIONS.find(s => s.id === client.currentSection);
              const isExpanded = selectedClient === client.id;
              
              return (
                <div key={client.id} style={{ ...cardStyle }}>
                  {/* Client Summary Row */}
                  <div 
                    style={{ 
                      padding: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'default'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: `linear-gradient(to bottom right, ${currentSection?.color.split(' ')[1] || '#6b7280'}, ${currentSection?.color.split(' ')[3] || '#6b7280'})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ color: 'white', fontWeight: 600 }}>{client.name}</h3>
                          {client.stuckDays > 3 && (
                            <span style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              fontSize: '12px',
                              borderRadius: '6px'
                            }}>
                              <AlertCircle style={{ width: '12px', height: '12px' }} />
                              {client.stuckDays} gün takılı
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>{client.industry} • {client.currentSection} bölümü • Adım {client.currentStep}</p>
                      </div>
                    </div>
                    
                    {/* Progress Ring */}
                    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                      <svg style={{ width: '48px', height: '48px', transform: 'rotate(-90deg)' }}>
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" style={{ color: '#2d3a4f' }} />
                        <circle 
                          cx="24" cy="24" r="20" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          fill="none" 
                          style={{ 
                            color: client.stuckDays > 3 ? '#ef4444' : '#0ea5e9',
                            strokeDasharray: `${progress.overallProgress * 1.26} 126`,
                            strokeLinecap: 'round'
                          }} 
                        />
                      </svg>
                      <span style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'white'
                      }}>%{progress.overallProgress}</span>
                    </div>
                  </div>

                  {/* Expanded Details - Always visible when selected */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #2d3a4f' }}>
                      <div style={{ padding: '16px', backgroundColor: 'rgba(26, 34, 52, 0.3)' }}>
                        {/* Timeline Progress */}
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>Süreç Durumu</p>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {progress.timeline.map((section, idx) => {
                              const isCompleted = idx < progress.currentSectionIdx;
                              const isCurrent = idx === progress.currentSectionIdx;
                              
                              return (
                                <div key={section.id} style={{ 
                                  flex: 1, 
                                  height: '32px', 
                                  borderRadius: '8px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  fontSize: '12px', 
                                  fontWeight: 500,
                                  backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#0ea5e9' : '#2d3a4f',
                                  color: isCompleted || isCurrent ? 'white' : '#6b7280',
                                  overflow: 'hidden'
                                }} title={`${section.name}: ${section.dayStart}-${section.dayEnd}. gün`}>
                                  {isCompleted && <CheckCircle2 style={{ width: '16px', height: '16px' }} />}
                                  {isCurrent && <span style={{ padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{section.name}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Current Section Detail */}
                        <div style={{ backgroundColor: '#151c2c', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <p style={{ color: '#6b7280', fontSize: '12px' }}>Şu An</p>
                              <p style={{ color: 'white', fontWeight: 600, textTransform: 'capitalize' }}>{client.currentSection} Bölümü • Adım {client.currentStep}/{client.totalSteps}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#6b7280', fontSize: '12px' }}>Kalan</p>
                              <p style={{ color: 'white', fontWeight: 600 }}>{90 - Math.round((new Date() - new Date(client.startDate)) / (1000 * 60 * 60 * 24))} gün</p>
                            </div>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              background: `linear-gradient(to right, ${currentSection?.color.includes('blue') ? '#3b82f6' : currentSection?.color.includes('purple') ? '#a855f7' : currentSection?.color.includes('amber') ? '#f59e0b' : currentSection?.color.includes('emerald') ? '#10b981' : '#f43f5e'}, ${currentSection?.color.includes('blue') ? '#2563eb' : currentSection?.color.includes('purple') ? '#9333ea' : currentSection?.color.includes('amber') ? '#d97706' : currentSection?.color.includes('emerald') ? '#059669' : '#e11d48'})`, 
                              borderRadius: '4px', 
                              width: `${(client.currentStep / client.totalSteps) * 100}%` 
                            }} />
                          </div>
                        </div>

                        {/* Client Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                          <div style={{ backgroundColor: '#151c2c', borderRadius: '8px', padding: '12px' }}>
                            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Başlangıç</p>
                            <p style={{ color: 'white', fontSize: '14px' }}>{client.startDate}</p>
                          </div>
                          <div style={{ backgroundColor: '#151c2c', borderRadius: '8px', padding: '12px' }}>
                            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Bitiş</p>
                            <p style={{ color: 'white', fontSize: '14px' }}>{progress.timeline.endDate}</p>
                          </div>
                          <div style={{ backgroundColor: '#151c2c', borderRadius: '8px', padding: '12px' }}>
                            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Son Aktivite</p>
                            <p style={{ color: 'white', fontSize: '14px' }}>{client.lastActivity || '-'}</p>
                          </div>
                          <div style={{ backgroundColor: '#151c2c', borderRadius: '8px', padding: '12px' }}>
                            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>İçerik Desteği</p>
                            <p style={{ color: client.hasContentSupport ? '#34d399' : '#9ca3af', fontSize: '14px' }}>{client.hasContentSupport ? 'Destekli' : 'Desteksiz'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredClients.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}>
              <Users style={{ width: '48px', height: '48px', color: '#6b7280', margin: '0 auto 8px' }} />
              <p style={{ color: '#6b7280' }}>Bu filtreye uygun danışan yok</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;
