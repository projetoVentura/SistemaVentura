import { Bell, Search } from 'lucide-react';

export function Header({ title }) {
  const subtitles = {
    'Dashboard': 'Visão geral do sistema',
    'Clientes': 'Gerenciamento de clientes',
    'Orçamentos': 'Gerenciamento de orçamentos',
    'Fechamentos': 'Controle de fechamentos',
    'Calendário': 'Agenda de eventos',
    'Controle de Aluguel': 'Gestão de equipamentos',
    'Financeiro': 'Controle financeiro',
    'Equipe': 'Gestão de equipe',
    'Extras': 'Ferramentas adicionais',
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-[#222222] px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-[#888888] mt-0.5">{subtitles[title] || ''}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-9 pr-4 py-2 bg-[#111111] border border-[#222222] rounded-lg text-sm text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-[#00ff88] w-64"
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors">
            <Bell className="w-5 h-5 text-[#888888]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00ff88] rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
