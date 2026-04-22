import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings,
  LogOut,
  Target,
  Shield
} from 'lucide-react';
import { logOut } from '../firebase/client';

const Sidebar = ({ user, currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sections', label: 'Bölümler', icon: FolderOpen },
    { id: 'admin', label: 'Admin Panel', icon: Shield, adminOnly: true },
  ];

  const isActive = (itemId) => {
    if (itemId === 'dashboard') return currentView === 'dashboard';
    if (itemId === 'sections') return ['sections', 'section', 'step'].includes(currentView);
    if (itemId === 'admin') return currentView === 'admin';
    return false;
  };

  const isAdmin = user.role === 'admin';

  // Menu button style
  const getMenuItemStyle = (isActiveItem) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s',
    border: isActiveItem ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
    backgroundColor: isActiveItem ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
    color: isActiveItem ? '#38bdf8' : '#9ca3af',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  });

  return (
    <>
      {/* Desktop Sidebar - shown on md+ screens */}
      <aside className="hidden md:flex w-64 bg-dark-200 border-r border-dark-100 flex-col h-screen fixed left-0 top-0 z-50">
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #2d3a4f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(to bottom right, #0ea5e9, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>AKINAY</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', margin: 0, padding: 0 }}>
            {menuItems
              .filter(item => !item.adminOnly || isAdmin)
              .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.id);
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'sections') {
                        onNavigate('sections');
                      } else if (item.id === 'dashboard') {
                        onNavigate('dashboard');
                      } else if (item.id === 'admin') {
                        onNavigate('admin');
                      }
                    }}
                    style={getMenuItemStyle(active)}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = '#151c2c';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9ca3af';
                      }
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px' }} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div style={{ padding: '16px', borderTop: '1px solid #2d3a4f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(to bottom right, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ color: '#6b7280', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#151c2c';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span>Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - hidden on md+ screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-dark-100 z-50" style={{ padding: '12px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {menuItems
            .filter(item => !item.adminOnly || isAdmin)
            .map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'sections') {
                    onNavigate('sections');
                  } else if (item.id === 'dashboard') {
                    onNavigate('dashboard');
                  } else if (item.id === 'admin') {
                    onNavigate('admin');
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: active ? '#38bdf8' : '#9ca3af',
                  transition: 'all 0.2s'
                }}
              >
                <Icon style={{ width: '24px', height: '24px' }} />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
