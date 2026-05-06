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
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  {
    label: 'CRM',
    icon: Users,
    children: [
      { label: 'Clientes', path: '/crm/clientes' },
      { label: 'Orçamentos', path: '/crm/orcamentos' },
      { label: 'Fechamentos', path: '/crm/fechamentos' },
    ],
  },
  { label: 'Calendário', icon: Calendar, path: '/calendario' },
  { label: 'Aluguel', icon: Package, path: '/aluguel' },
  { label: 'Financeiro', icon: DollarSign, path: '/financeiro' },
  { label: 'Equipe', icon: UserCheck, path: '/equipe' },
  { label: 'Extras', icon: MessageCircle, path: '/extras' },
];

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  color: '#888888',
  fontSize: '14px',
  textDecoration: 'none',
  transition: 'all 0.15s',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  justifyContent: 'flex-start',
};

const itemActiveStyle = {
  ...itemStyle,
  color: '#ffffff',
  backgroundColor: '#1a1a1a',
  borderLeft: '3px solid #00ff88',
  paddingLeft: '9px',
};

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

  const isParentActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => location.pathname.startsWith(child.path));
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '220px',
      backgroundColor: '#111111',
      borderRight: '1px solid #222222',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #222222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: '#00ff88',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '18px' }}>VL</span>
          </div>
          <div>
            <h1 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px', lineHeight: 1.2 }}>VENTURA</h1>
            <p style={{ color: '#888888', fontSize: '11px', lineHeight: 1.2 }}>Luz e Efeitos</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {menuItems.map((item) => (
            <div key={item.path || item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    style={isParentActive(item) ? { ...itemActiveStyle, justifyContent: 'space-between' } : { ...itemStyle, justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                      <span>{item.label}</span>
                    </div>
                    {expandedMenu[item.label]
                      ? <ChevronDown style={{ width: '14px', height: '14px' }} />
                      : <ChevronRight style={{ width: '14px', height: '14px' }} />
                    }
                  </button>
                  {expandedMenu[item.label] && (
                    <div style={{ marginLeft: '16px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          style={isActivePath(child.path) ? itemActiveStyle : itemStyle}
                        >
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  style={isActivePath(item.path) ? itemActiveStyle : itemStyle}
                >
                  <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #222222' }}>
        <p style={{ color: '#888888', fontSize: '11px', marginBottom: '8px' }}>Conectado como</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', backgroundColor: '#00ff88',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#000000', fontSize: '13px', fontWeight: 'bold' }}>A</span>
            </div>
            <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>Administrador</p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            color: '#888888', fontSize: '11px', background: 'none',
            border: 'none', cursor: 'pointer',
          }}>
            <LogOut style={{ width: '14px', height: '14px' }} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
