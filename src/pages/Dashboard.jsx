import { Layout } from '../components/layout/Layout';
import { Users, FileText, CheckCircle, DollarSign, Calendar } from 'lucide-react';

// Dados diretos no arquivo para garantir que sempre renderize
const clientesData = [
  { id: 1, nome: 'Ana Paula Ferreira', status: 'ativo' },
  { id: 2, nome: 'Carlos Eduardo Santos', status: 'ativo' },
  { id: 3, nome: 'Mariana Costa', status: 'ativo' },
];

const orcamentosData = [
  { id: 1, titulo: 'Evento de Gala', clienteNome: 'Ana Paula Ferreira', valor: 15000, status: 'pendente' },
  { id: 2, titulo: 'Casamento Silva', clienteNome: 'Carlos Eduardo Santos', valor: 8500, status: 'aprovado' },
  { id: 3, titulo: 'Congresso Empresarial', clienteNome: 'Mariana Costa', valor: 22000, status: 'pendente' },
];

const fechamentosData = [
  { id: 1, valor: 15000 },
  { id: 2, valor: 8500 },
  { id: 3, valor: 22000 },
];

export function Dashboard() {
  const totalClientes = clientesData.filter((c) => c.status === 'ativo').length;
  const orcamentosPendentes = orcamentosData.filter((o) => o.status === 'pendente').length;
  const totalFechado = fechamentosData.reduce((acc, f) => acc + (f.valor || 0), 0);
  const orcamentosAprovados = orcamentosData.filter((o) => o.status === 'aprovado').length;

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    } catch (e) {
      return `R$ ${value}`;
    }
  };

  const stats = [
    { label: 'Clientes Ativos', value: totalClientes, icon: Users },
    { label: 'Orçamentos Pendentes', value: orcamentosPendentes, icon: FileText },
    { label: 'Total Fechado', value: formatCurrency(totalFechado), icon: DollarSign },
    { label: 'Orçamentos Aprovados', value: orcamentosAprovados, icon: CheckCircle },
  ];

  const proximosEventos = [
    { data: '2024-08-20', titulo: 'Gala Beneficente', cliente: 'Ana Paula Ferreira' },
    { data: '2024-09-05', titulo: 'Casamento Silva', cliente: 'Carlos Eduardo Santos' },
    { data: '2024-09-15', titulo: 'Congresso Empresarial', cliente: 'Mariana Costa' },
  ];

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch (e) {
      return dateStr;
    }
  };

   return (
    <Layout title="Dashboard">
      <div className="w-[95%] mx-auto">
        {/* BLOCK 1: KPIs - Horizontal line with 4 cards */}
        <div className="grid grid-cols-4 gap-5 mb-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00ff88] transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-[#00ff88]" />
                <p className="text-xs text-[#888888] uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* BLOCK 2: Two columns - Orçamentos Recentes and Próximos Eventos */}
        <div className="grid grid-cols-2 gap-5 mb-5 clear-both">
          {/* Left Column: Orçamentos Recentes */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Orçamentos Recentes</h3>
            <div className="divide-y divide-[#222222]">
              {orcamentosData.slice(0, 5).map((orcamento) => (
                <div
                  key={orcamento.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div>
                    <p className="text-sm text-white">{orcamento.titulo}</p>
                    <p className="text-xs text-[#888888]">{orcamento.clienteNome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#00ff88]">{formatCurrency(orcamento.valor)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      orcamento.status === 'aprovado'
                        ? 'bg-[#00ff88]/10 text-[#00ff88]'
                        : 'bg-[#443807] text-[#facc15]'
                    }`}>
                      {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Próximos Eventos */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Próximos Eventos</h3>
            <div className="divide-y divide-[#222222]">
              {proximosEventos.map((evento, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2.5"
                >
                  <div>
                    <p className="text-sm text-white">{evento.titulo}</p>
                    <p className="text-xs text-[#888888]">{evento.cliente}</p>
                  </div>
                  <span className="text-xs text-[#666666]">{formatDate(evento.data)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCK 3: Acesso Rápido - Horizontal line at the bottom */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Acesso Rápido</h3>
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Novo Cliente', icon: Users, href: '/crm/clientes' },
              { label: 'Novo Orçamento', icon: FileText, href: '/crm/orcamentos' },
              { label: 'Novo Fechamento', icon: CheckCircle, href: '/crm/fechamentos' },
              { label: 'Ver Calendário', icon: Calendar, href: '/calendario' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222222] hover:border-[#00ff88] border border-transparent transition-all"
              >
                <item.icon className="w-5 h-5 text-[#00ff88]" />
                <span className="text-xs text-white text-center">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
