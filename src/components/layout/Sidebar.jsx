import { NavLink } from 'react-router-dom';
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

  const toggleMenu = (label) => {
    setExpandedMenu((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-64 bg-[#111111] text-white h-screen fixed left-0 top-0 flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-[#333333]">
        <h1 className="text-xl font-bold text-white">Ventura Gestão</h1>
        <p className="text-xs text-gray-400 mt-1">Luz e Efeitos</p>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white hover:bg-[#222222] hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0 text-white" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {expandedMenu[item.label] ? (
                      <ChevronDown className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </button>
                  {expandedMenu[item.label] && (
                    <ul className="ml-9 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                          className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? 'bg-[#00ff88] text-black font-medium border border-[#00ff88]'
                                    : 'text-white hover:text-white hover:bg-[#222222]'
                                }`
                              }
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
                  className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-[#00ff88] text-black font-medium border border-[#00ff88]'
                          : 'text-white hover:bg-[#222222] hover:text-white'
                      }`
                    }
                 >
                  <item.icon className="w-5 h-5 flex-shrink-0 text-white" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

          <div className="p-4 border-t border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00ff88] flex items-center justify-center text-sm font-bold text-black">
            VL
          </div>
          <div>
            <p className="text-sm font-medium text-white">Ventura Luz</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
