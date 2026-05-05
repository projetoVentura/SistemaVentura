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
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-[220px] bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">VL</span>
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-sm leading-tight">VENTURA</h1>
            <p className="text-gray-500 text-xs leading-tight">Luz e Efeitos</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 pb-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.path || item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0 text-gray-400" />
                      <span>{item.label}</span>
                    </div>
                    {expandedMenu[item.label] ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedMenu[item.label] && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActivePath(child.path)
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                 >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActivePath(item.path) ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Conectado como</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <p className="text-gray-900 text-sm font-bold leading-tight">Administrador</p>
            </div>
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
