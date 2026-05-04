import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui';
import { Users, FileText, CheckCircle, DollarSign, Calendar, Package } from 'lucide-react';
import { clientes, orcamentos, fechamentos } from '../data/mockData';

export function Dashboard() {
  const totalClientes = clientes.filter((c) => c.status === 'ativo').length;
  const orcamentosPendentes = orcamentos.filter((o) => o.status === 'pendente').length;
  const totalFechado = fechamentos.reduce((acc, f) => acc + f.valor, 0);
  const orcamentosAprovados = orcamentos.filter((o) => o.status === 'aprovado').length;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const stats = [
    {
      label: 'Clientes Ativos',
      value: totalClientes,
      icon: Users,
      color: 'primary',
    },
    {
      label: 'Orçamentos Pendentes',
      value: orcamentosPendentes,
      icon: FileText,
      color: 'warning',
    },
    {
      label: 'Total Fechado',
      value: formatCurrency(totalFechado),
      icon: DollarSign,
      color: 'success',
    },
    {
      label: 'Orçamentos Aprovados',
      value: orcamentosAprovados,
      icon: CheckCircle,
      color: 'info',
    },
  ];

  const colorClasses = {
    primary: 'bg-accent-light text-accent',
    warning: 'bg-warning-950 text-warning-400',
    success: 'bg-success-950 text-success-400',
    info: 'bg-accent-light text-accent',
  };

  const proximosEventos = [
    { data: '2024-08-20', titulo: 'Gala Beneficente', cliente: 'Ana Paula Ferreira' },
    { data: '2024-09-05', titulo: 'Casamento Silva', cliente: 'Carlos Eduardo Santos' },
    { data: '2024-09-15', titulo: 'Congresso Empresarial', cliente: 'Mariana Costa' },
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-text-secondary">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-text-primary mb-4">Orçamentos Recentes</h3>
          <div className="space-y-3">
            {orcamentos.slice(0, 5).map((orcamento) => (
              <div
                key={orcamento.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">{orcamento.titulo}</p>
                  <p className="text-xs text-text-secondary">{orcamento.clienteNome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">
                    {formatCurrency(orcamento.valor)}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      orcamento.status === 'aprovado'
                        ? 'bg-success-950 text-success-400 border border-success-700'
                        : orcamento.status === 'pendente'
                        ? 'bg-warning-950 text-warning-400 border border-warning-700'
                        : orcamento.status === 'recusado'
                        ? 'bg-danger-950 text-danger-400 border border-danger-700'
                        : 'bg-bg-elevated text-text-secondary border border-border'
                    }`}
                  >
                    {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-text-primary mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            {proximosEventos.map((evento, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="p-2 bg-accent-light rounded-lg">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{evento.titulo}</p>
                  <p className="text-xs text-text-secondary">{evento.cliente}</p>
                </div>
                <span className="text-sm text-text-secondary">{formatDate(evento.data)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-5">
          <h3 className="font-semibold text-text-primary mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Novo Cliente', icon: Users, href: '/crm/clientes' },
              { label: 'Novo Orçamento', icon: FileText, href: '/crm/orcamentos' },
              { label: 'Novo Fechamento', icon: CheckCircle, href: '/crm/fechamentos' },
              { label: 'Ver Calendário', icon: Calendar, href: '/calendario' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-accent hover:bg-bg-elevated transition-colors"
              >
                <item.icon className="w-6 h-6 text-accent" />
                <span className="text-sm font-medium text-text-primary">{item.label}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
