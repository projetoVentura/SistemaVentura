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

  const isParentActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => isActivePath(child.path));
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-[#111111] border-r border-[#222222] flex flex-col z-50 overflow-hidden">
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
            <div key={item.path || item.label} className="sidebar-item-container">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`sidebar-parent-item ${
                      isParentActive(item) ? 'sidebar-item-active' : ''
                    }`}
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
                    <ul className="sidebar-children">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={`sidebar-child-item ${
                              isActivePath(child.path)
                                ? 'sidebar-child-active'
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
                  className={`sidebar-item ${
                    isActivePath(item.path)
                      ? 'sidebar-item-active'
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
