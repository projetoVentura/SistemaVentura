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
      {/* SEÇÃO 1: KPIs (4 cards em linha, menor altura) */}
      <div className="kpi-section">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="kpi-card-compact"
          >
            <div className="kpi-icon-compact">
              <stat.icon className="w-5 h-5 text-[#00ff88]" />
            </div>
            <p className="kpi-label-compact">{stat.label}</p>
            <p className="kpi-value-compact">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* SEÇÃO 2: Conteúdo Principal (2 colunas iguais: 1fr 1fr) */}
      <div className="main-content-grid">
        {/* Coluna Esquerda: Orçamentos Recentes */}
        <div className="content-card">
          <h3 className="content-card-title">Orçamentos Recentes</h3>
          <div className="content-list">
            {orcamentosData.slice(0, 5).map((orcamento) => (
              <div
                key={orcamento.id}
                className="content-list-item"
              >
                <div>
                  <p className="content-item-title">{orcamento.titulo}</p>
                  <p className="content-item-subtitle">{orcamento.clienteNome}</p>
                </div>
                <div className="text-right">
                  <p className="content-item-value">{formatCurrency(orcamento.valor)}</p>
                  <span className={`status-badge ${orcamento.status}`}>
                    {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Próximos Eventos */}
        <div className="content-card">
          <h3 className="content-card-title">Próximos Eventos</h3>
          <div className="content-list">
            {proximosEventos.map((evento, index) => (
              <div
                key={index}
                className="event-list-item"
              >
                <div className="flex-1">
                  <p className="content-item-title">{evento.titulo}</p>
                  <p className="content-item-subtitle">{evento.cliente}</p>
                </div>
                <span className="event-date">{formatDate(evento.data)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: Acesso Rápido (margin-top: 30px) */}
      <div className="quick-access-section">
        <div className="content-card">
          <h3 className="content-card-title">Acesso Rápido</h3>
          <div className="quick-access-grid">
            {[
              { label: 'Novo Cliente', icon: Users, href: '/crm/clientes' },
              { label: 'Novo Orçamento', icon: FileText, href: '/crm/orcamentos' },
              { label: 'Novo Fechamento', icon: CheckCircle, href: '/crm/fechamentos' },
              { label: 'Ver Calendário', icon: Calendar, href: '/calendario' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="quick-access-card"
              >
                <item.icon className="w-6 h-6 text-[#00ff88]" />
                <span className="quick-access-label">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
