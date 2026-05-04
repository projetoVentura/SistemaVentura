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
    primary: 'bg-primary-100 text-primary-600',
    warning: 'bg-warning-100 text-warning-600',
    success: 'bg-success-100 text-success-600',
    info: 'bg-primary-100 text-primary-600',
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
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Orçamentos Recentes</h3>
          <div className="space-y-3">
            {orcamentos.slice(0, 5).map((orcamento) => (
              <div
                key={orcamento.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{orcamento.titulo}</p>
                  <p className="text-xs text-gray-500">{orcamento.clienteNome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(orcamento.valor)}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      orcamento.status === 'aprovado'
                        ? 'bg-success-100 text-success-700'
                        : orcamento.status === 'pendente'
                        ? 'bg-warning-100 text-warning-700'
                        : orcamento.status === 'recusado'
                        ? 'bg-danger-100 text-danger-700'
                        : 'bg-gray-100 text-gray-700'
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
          <h3 className="font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            {proximosEventos.map((evento, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{evento.titulo}</p>
                  <p className="text-xs text-gray-500">{evento.cliente}</p>
                </div>
                <span className="text-sm text-gray-500">{formatDate(evento.data)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
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
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <item.icon className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
