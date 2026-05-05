import { LayoutDashboard, Users, GitBranch, Calendar, Upload, Plug } from 'lucide-react';

const tabs = [
  { id: 'painel', label: 'Painel', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'calendario', label: 'Calendário', icon: Calendar },
  { id: 'importar', label: 'Importar', icon: Upload },
  { id: 'integracoes', label: 'Integrações', icon: Plug },
];

export function CRMTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-[#222222] mb-6">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
                isActive
                  ? 'border-[#00ff88] text-white font-bold'
                  : 'border-transparent text-[#888888] hover:text-[#00ff88]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
