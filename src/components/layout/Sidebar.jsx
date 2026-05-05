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
    <aside className="w-[220px] bg-[#111111] border-r border-[#222222] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[#222222]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00ff88] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-[#0a0a0a] font-bold text-xl">VL</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">VENTURA</h1>
            <p className="text-[#888888] text-xs leading-tight">Luz e Efeitos</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.path || item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-[#888888] hover:bg-[#1a1a1a] hover:text-white transition-colors"
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
              </>
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
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-[#222222]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#0a0a0a] text-sm font-bold">U</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">Usuário Ventura</p>
            <p className="text-[#888888] text-xs leading-tight">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
