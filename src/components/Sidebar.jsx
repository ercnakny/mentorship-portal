import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  LogOut,
  Target,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { logOut } from '../firebase/client';

const Sidebar = ({ user, currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sections', label: 'Bölümler', icon: FolderOpen },
    { id: 'admin', label: 'Admin', icon: Shield, adminOnly: true },
  ];

  const isActive = (itemId) => {
    if (itemId === 'dashboard') return currentView === 'dashboard';
    if (itemId === 'sections') return ['sections', 'section', 'step'].includes(currentView);
    if (itemId === 'admin') return currentView === 'admin';
    return false;
  };

  const isAdmin = user.role === 'admin';

  const handleNavigate = (id) => {
    if (id === 'sections') {
      onNavigate('sections');
    } else if (id === 'dashboard') {
      onNavigate('dashboard');
    } else if (id === 'admin') {
      onNavigate('admin');
    }
    setMobileMenuOpen(false);
  };

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '256px',
        backgroundColor: '#1a2234',
        borderRight: '1px solid #2d3a4f',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50
      }}>
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
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>MENT X</span>
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
                    onClick={() => handleNavigate(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: active ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
                      backgroundColor: active ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                      color: active ? '#38bdf8' : '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500
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
              <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')}</p>
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
              fontSize: '14px'
            }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span>Çıkış</span>
          </button>
        </div>
      </aside>
    );
  }

  // Mobile: Sadece Bottom Navigation (header yok)
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: '#1a2234',
      borderTop: '1px solid #2d3a4f',
      padding: '8px 0',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {menuItems
          .filter(item => !item.adminOnly || isAdmin)
          .map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
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
                color: active ? '#38bdf8' : '#9ca3af'
              }}
            >
              <Icon style={{ width: '24px', height: '24px' }} />
              <span style={{ fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
