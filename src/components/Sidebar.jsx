import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings,
  LogOut,
  Target
} from 'lucide-react';
import { SECTIONS } from '../data/mentorshipSections';

const Sidebar = ({ user, currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sections', label: 'Bölümler', icon: FolderOpen },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-dark-200 border-r border-dark-100 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-dark-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">AKINAY</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => item.id === 'sections' 
                    ? onNavigate('section', SECTIONS[0]) 
                    : item.id === 'dashboard' 
                      ? onNavigate('dashboard') 
                      : null
                  }
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-dark-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-dark-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{user.name}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-100 transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          <span>Çıkış</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;