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
    {
      label: 'Clientes Ativos',
      value: totalClientes,
      icon: Users,
    },
    {
      label: 'Orçamentos Pendentes',
      value: orcamentosPendentes,
      icon: FileText,
    },
    {
      label: 'Total Fechado',
      value: formatCurrency(totalFechado),
      icon: DollarSign,
    },
    {
      label: 'Orçamentos Aprovados',
      value: orcamentosAprovados,
      icon: CheckCircle,
    },
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
      <div className="p-[40px]">
        {/* Cards de Métricas - Grid 4 Colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a1a] border border-[#222222] rounded-[12px] p-[20px] hover:border-[#00ff88]/50 transition-all duration-300"
            >
              <div className="mb-3">
                <div className="p-2 rounded-lg bg-[#00ff88]/10 inline-block">
                  <stat.icon className="w-5 h-5 text-[#00ff88]" />
                </div>
              </div>
              <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Seções de Conteúdo - 2 Colunas Iguais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mb-6">
          {/* Orçamentos Recentes */}
          <div className="bg-[#1a1a1a] border border-[#222222] rounded-[12px] p-[20px]">
            <h3 className="font-semibold text-white mb-4">Orçamentos Recentes</h3>
            <div className="space-y-0">
              {orcamentosData.slice(0, 5).map((orcamento, index) => (
                <div
                  key={orcamento.id}
                  className={`flex items-center justify-between py-3 ${index < orcamentosData.slice(0, 5).length - 1 ? 'border-b border-[#222222]' : ''}`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{orcamento.titulo}</p>
                    <p className="text-xs text-[#888888]">{orcamento.clienteNome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#00ff88]">
                      {formatCurrency(orcamento.valor)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        orcamento.status === 'aprovado'
                          ? 'bg-[#004430] text-[#00ff88] border border-[#00ff88]/30'
                          : orcamento.status === 'pendente'
                          ? 'bg-[#443807] text-[#facc15] border border-[#facc15]/30'
                          : orcamento.status === 'recusado'
                          ? 'bg-[#450a0a] text-[#ef4444] border border-[#ef4444]/30'
                          : 'bg-[#1a1a1a] text-[#888888] border border-[#222222]'
                      }`}
                    >
                      {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="bg-[#1a1a1a] border border-[#222222] rounded-[12px] p-[20px]">
            <h3 className="font-semibold text-white mb-4">Próximos Eventos</h3>
            <div className="space-y-0">
              {proximosEventos.map((evento, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 py-3 ${index < proximosEventos.length - 1 ? 'border-b border-[#222222]' : ''}`}
                >
                  <div className="p-2 bg-[#00ff88]/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#00ff88]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{evento.titulo}</p>
                    <p className="text-xs text-[#888888]">{evento.cliente}</p>
                  </div>
                  <span className="text-sm text-[#888888]">{formatDate(evento.data)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acesso Rápido - Cards Menores */}
        <div className="mt-6">
          <div className="bg-[#1a1a1a] border border-[#222222] rounded-[12px] p-[20px]">
            <h3 className="font-semibold text-white mb-4">Acesso Rápido</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Novo Cliente', icon: Users, href: '/crm/clientes' },
                { label: 'Novo Orçamento', icon: FileText, href: '/crm/orcamentos' },
                { label: 'Novo Fechamento', icon: CheckCircle, href: '/crm/fechamentos' },
                { label: 'Ver Calendário', icon: Calendar, href: '/calendario' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-[#222222] hover:border-[#00ff88] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="p-2 bg-[#00ff88]/10 rounded-lg">
                    <item.icon className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <span className="text-sm font-medium text-white text-center">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
