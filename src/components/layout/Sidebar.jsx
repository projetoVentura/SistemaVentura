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
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-[200px] bg-[#111111] text-white h-screen fixed left-0 top-0 flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-[#222222]">
        <div className="w-10 h-10 rounded-lg bg-[#00ff88] flex items-center justify-center text-sm font-bold text-black mb-3">
          VL
        </div>
        <h1 className="text-sm font-bold text-white uppercase tracking-wider">Ventura</h1>
        <p className="text-xs text-[#888888] mt-0.5">Luz e Efeitos</p>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white hover:bg-[#1a1a1a] hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0 text-[#888888]" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {expandedMenu[item.label] ? (
                      <ChevronDown className="w-4 h-4 text-[#888888]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#888888]" />
                    )}
                  </button>
                  {expandedMenu[item.label] && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                              isActivePath(child.path)
                                ? 'bg-[#1a1a1a] text-[#00ff88] font-medium border-l-3 border-l-[#00ff88] pl-2'
                                : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                   to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                    isActivePath(item.path)
                      ? 'bg-[#1a1a1a] text-white font-medium border-l-3 border-l-[#00ff88]'
                      : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                 >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActivePath(item.path) ? 'text-[#00ff88]' : 'text-[#888888]'}`} />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#222222]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-sm font-bold text-white">
            VL
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Ventura Luz</p>
            <p className="text-xs text-[#888888]">Administrador</p>
          </div>
        </div>
        <button className="w-full px-3 py-2 text-xs text-[#888888] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors text-left">
          Sair
        </button>
      </div>
    </aside>
  );
}
