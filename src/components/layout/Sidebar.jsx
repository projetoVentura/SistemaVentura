import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  DollarSign,
  UserCheck,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    label: 'CRM',
    icon: Users,
    children: [
      { label: 'Clientes', path: '/crm/clientes' },
      { label: 'Orçamentos', path: '/crm/orcamentos' },
      { label: 'Fechamentos', path: '/crm/fechamentos' },
    ],
  },
  {
    label: 'Calendário',
    icon: Calendar,
    path: '/calendario',
  },
  {
    label: 'Aluguel',
    icon: Package,
    path: '/aluguel',
  },
  {
    label: 'Financeiro',
    icon: DollarSign,
    path: '/financeiro',
  },
  {
    label: 'Equipe',
    icon: UserCheck,
    path: '/equipe',
  },
  {
    label: 'Extras',
    icon: MessageCircle,
    path: '/extras',
  },
];

export function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState({});
  const location = useLocation();

  const toggleMenu = (label) => {
    setExpandedMenu((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/crm/clientes' || path === '/crm/orcamentos' || path === '/crm/fechamentos') {
      return location.pathname.startsWith('/crm');
    }
    return location.pathname === path;
  };

  return (
    <aside className="sidebar-fixed">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00ff88] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-xl">VL</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">VENTURA</h1>
            <p className="text-[#888888] text-xs leading-tight">Luz e Efeitos</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-list">
          {menuItems.map((item) => (
            <div key={item.path || item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {expandedMenu[item.label] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenu[item.label] && (
                    <ul className="ml-4 mt-2">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-all text-sm ${
                              isActivePath(child.path)
                                ? 'border-l-2 border-[#00ff88] text-white bg-[#1a1a1a] pl-[10px]'
                                : ''
                            }`}
                          >
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                   to={item.path}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1a1a1a] transition-all text-sm ${
                    isActivePath(item.path)
                      ? 'border-l-2 border-[#00ff88] text-white bg-[#1a1a1a] pl-[10px]'
                      : ''
                  }`}
                 >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
          <div className="mb-2">
            <p className="text-[#888888] text-xs">Conectado como</p>
          </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black text-sm font-bold">A</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Administrador</p>
            </div>
          </div>
          <button
            className="flex items-center gap-1 text-[#888888] hover:text-red-400 transition-colors text-xs"
          >
            <LogOut />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
