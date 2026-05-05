import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Select, Textarea } from '../../components/ui';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { transacoes as mockTransacoes } from '../../data/mockData';

const categoriaEntradaConfig = {
  evento: { label: 'Evento', color: 'success' },
  contrato: { label: 'Contrato', color: 'info' },
  outro: { label: 'Outro', color: 'default' },
};

const categoriaSaidaConfig = {
  manutencao: { label: 'Manutenção', color: 'danger' },
  transporte: { label: 'Transporte', color: 'warning' },
  equipe: { label: 'Equipe', color: 'info' },
  compra: { label: 'Compra', color: 'purple' },
  infraestrutura: { label: 'Infraestrutura', color: 'default' },
  consumivel: { label: 'Consumível', color: 'warning' },
  imposto: { label: 'Imposto', color: 'danger' },
  outro: { label: 'Outro', color: 'default' },
};

const formaPagamentoConfig = {
  transferencia: { label: 'Transferência', color: 'info' },
  boleto: { label: 'Boleto', color: 'purple' },
  pix: { label: 'PIX', color: 'success' },
  dinheiro: { label: 'Dinheiro', color: 'warning' },
  cartao: { label: 'Cartão', color: 'default' },
};

const statusConfig = {
  confirmado: { label: 'Confirmado', color: 'success' },
  pendente: { label: 'Pendente', color: 'warning' },
  cancelado: { label: 'Cancelado', color: 'danger' },
};

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const emptyForm = {
  tipo: 'entrada',
  descricao: '',
  valor: '',
  categoria: '',
  cliente: '',
  fornecedor: '',
  data: '',
  formaPagamento: '',
  status: 'confirmado',
  observacoes: '',
};

export function Financeiro() {
  const [transacoes, setTransacoes] = useState(mockTransacoes);
  const [viewMode, setViewMode] = useState('transacoes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterMes, setFilterMes] = useState(new Date().getMonth());
  const [filterAno, setFilterAno] = useState(new Date().getFullYear());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Confirm
  const [confirmDelete, setConfirmDelete] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  // Computed values
  const entradas = transacoes.filter((t) => t.tipo === 'entrada' && t.status !== 'cancelado');
  const saidas = transacoes.filter((t) => t.tipo === 'saida' && t.status !== 'cancelado');
  const totalEntradas = entradas.reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = saidas.reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalEntradas - totalSaidas;
  const entradasPendentes = transacoes.filter(
    (t) => t.tipo === 'entrada' && t.status === 'pendente'
  ).reduce((acc, t) => acc + t.valor, 0);

  // Filtered transacoes by month/year and other filters
  const filteredTransacoes = transacoes.filter((t) => {
    const [y, m] = t.data.split('-').map(Number);
    const matchesMonth = m === filterMes + 1 && y === filterAno;
    const matchesSearch =
      t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.cliente && t.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.fornecedor && t.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = filterTipo === 'todos' || t.tipo === filterTipo;
    const matchesStatus = filterStatus === 'todos' || t.status === filterStatus;
    const allCategorias = { ...categoriaEntradaConfig, ...categoriaSaidaConfig };
    const matchesCategoria = filterCategoria === 'todas' || t.categoria === filterCategoria;
    return matchesMonth && matchesSearch && matchesTipo && matchesStatus && matchesCategoria;
  });

  // Monthly report
  const mesTransacoes = transacoes.filter((t) => {
    const [y, m] = t.data.split('-').map(Number);
    return m === filterMes + 1 && y === filterAno && t.status !== 'cancelado';
  });

  const mesEntradas = mesTransacoes.filter((t) => t.tipo === 'entrada');
  const mesSaidas = mesTransacoes.filter((t) => t.tipo === 'saida');
  const mesTotalEntradas = mesEntradas.reduce((acc, t) => acc + t.valor, 0);
  const mesTotalSaidas = mesSaidas.reduce((acc, t) => acc + t.valor, 0);

  const categoriasUsadas = [...new Set(mesTransacoes.map((t) => t.categoria))];

  const getMesResumo = (month, year) => {
    const transacoesMes = transacoes.filter((t) => {
      const [y, m] = t.data.split('-').map(Number);
      return m === month + 1 && y === year && t.status !== 'cancelado';
    });
    const entradas = transacoesMes.filter((t) => t.tipo === 'entrada');
    const saidas = transacoesMes.filter((t) => t.tipo === 'saida');
    return {
      entradas: entradas.reduce((acc, t) => acc + t.valor, 0),
      saidas: saidas.reduce((acc, t) => acc + t.valor, 0),
      count: transacoesMes.length,
    };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.data) newErrors.data = 'Data é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (transacao = null) => {
    if (transacao) {
      setEditingTransacao(transacao);
      setFormData({
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        valor: transacao.valor.toString(),
        categoria: transacao.categoria,
        cliente: transacao.cliente || '',
        fornecedor: transacao.fornecedor || '',
        data: transacao.data,
        formaPagamento: transacao.formaPagamento || '',
        status: transacao.status,
        observacoes: transacao.observacoes || '',
      });
    } else {
      setEditingTransacao(null);
      setFormData(emptyForm);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransacao(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      valor: parseFloat(formData.valor),
      cliente: formData.tipo === 'entrada' ? formData.cliente : undefined,
      fornecedor: formData.tipo === 'saida' ? formData.fornecedor : undefined,
    };

    if (editingTransacao) {
      setTransacoes((prev) =>
        prev.map((t) => (t.id === editingTransacao.id ? { ...t, ...payload } : t))
      );
    } else {
      const newTransacao = {
        id: Math.max(0, ...transacoes.map((t) => t.id)) + 1,
        ...payload,
      };
      setTransacoes((prev) => [...prev, newTransacao]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
    setConfirmDelete(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setTransacoes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const getCategoriaConfig = (categoria, tipo) => {
    const config = tipo === 'entrada' ? categoriaEntradaConfig[categoria] : categoriaSaidaConfig[categoria];
    return config || { label: categoria, color: 'default' };
  };

  const categoriaOptions = formData.tipo === 'entrada'
    ? Object.entries(categoriaEntradaConfig).map(([value, config]) => ({
        value,
        label: config.label,
      }))
    : Object.entries(categoriaSaidaConfig).map(([value, config]) => ({
        value,
        label: config.label,
      }));

  const formaPagamentoOptions = Object.entries(formaPagamentoConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const prevMonth = () => {
    if (filterMes === 0) {
      setFilterMes(11);
      setFilterAno((y) => y - 1);
    } else {
      setFilterMes((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (filterMes === 11) {
      setFilterMes(0);
      setFilterAno((y) => y + 1);
    } else {
      setFilterMes((m) => m + 1);
    }
  };

  return (
    <Layout title="Financeiro">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success-950 rounded-lg">
              <ArrowUpCircle className="w-5 h-5 text-success-400" />
            </div>
            <span className="text-sm text-text-secondary">Total Entradas</span>
          </div>
          <p className="text-2xl font-bold text-success-400">{formatCurrency(totalEntradas)}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-danger-950 rounded-lg">
              <ArrowDownCircle className="w-5 h-5 text-danger-400" />
            </div>
            <span className="text-sm text-text-secondary">Total Saídas</span>
          </div>
          <p className="text-2xl font-bold text-danger-400">{formatCurrency(totalSaidas)}</p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${saldo >= 0 ? 'bg-accent-light' : 'bg-danger-950'}`}>
              <DollarSign className={`w-5 h-5 ${saldo >= 0 ? 'text-accent' : 'text-danger-400'}`} />
            </div>
            <span className="text-sm text-text-secondary">Saldo</span>
          </div>
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-accent' : 'text-danger-400'}`}>
            {formatCurrency(saldo)}
          </p>
        </div>
        <div className="bg-bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning-950 rounded-lg">
              <TrendingUp className="w-5 h-5 text-warning-400" />
            </div>
            <span className="text-sm text-text-secondary">A Receber</span>
          </div>
          <p className="text-2xl font-bold text-warning-400">{formatCurrency(entradasPendentes)}</p>
        </div>
      </div>

      {/* Month Navigation + View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold text-text-primary min-w-[160px] text-center">
            {meses[filterMes]} {filterAno}
          </h3>
          <Button variant="secondary" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('transacoes')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'transacoes'
                  ? 'bg-accent text-bg-main'
                  : 'bg-bg-card text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <FileText className="w-4 h-4" />
              Transações
            </button>
            <button
              onClick={() => setViewMode('relatorio')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'relatorio'
                  ? 'bg-accent text-bg-main'
                  : 'bg-bg-card text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Relatório
            </button>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por descrição, cliente ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-bg-main text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          />
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="todos">Todos Tipos</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
        </select>
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="todas">Todas Categorias</option>
          {Object.entries({ ...categoriaEntradaConfig, ...categoriaSaidaConfig }).map(
            ([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            )
          )}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="todos">Todos Status</option>
          {Object.entries(statusConfig).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transações View */}
      {viewMode === 'transacoes' ? (
        <div className="space-y-3">
          {filteredTransacoes.length === 0 && (
            <div className="text-center py-12 bg-[#111111] rounded-lg border border-[#222222]">
              <DollarSign className="w-12 h-12 text-[#888888] mx-auto mb-3" />
              <p className="text-[#888888]">Nenhuma transação encontrada para este mês.</p>
            </div>
          )}
          {filteredTransacoes.map((t) => (
            <div
              key={t.id}
              className="bg-[#111111] rounded-lg border border-[#222222] p-4 hover:border-[#00ff88] transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-md flex-shrink-0 ${
                      t.tipo === 'entrada'
                        ? 'bg-[#004430]'
                        : 'bg-[#450a0a]'
                    }`}
                  >
                    {t.tipo === 'entrada' ? (
                      <ArrowUpCircle className="w-5 h-5 text-[#00ff88]" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-[#ef4444]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white truncate">{t.descricao}</h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.tipo === 'entrada'
                            ? 'bg-[#004430] text-[#00ff88] border border-[#00ff88]/30'
                            : 'bg-[#450a0a] text-[#ef4444] border border-[#ef4444]/30'
                        }`}
                      >
                        {t.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-[#888888]">
                      <span>{formatDate(t.data)}</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                          getCategoriaConfig(t.categoria, t.tipo).color === 'success'
                            ? 'bg-[#004430] text-[#00ff88] border-[#00ff88]/30'
                            : getCategoriaConfig(t.categoria, t.tipo).color === 'warning'
                            ? 'bg-[#443807] text-[#facc15] border-[#facc15]/30'
                            : getCategoriaConfig(t.categoria, t.tipo).color === 'danger'
                            ? 'bg-[#450a0a] text-[#ef4444] border-[#ef4444]/30'
                            : 'bg-[#1a1a1a] text-[#888888] border-[#222222]'
                        }`}
                      >
                        {getCategoriaConfig(t.categoria, t.tipo).label}
                      </span>
                      {t.cliente && <span>• {t.cliente}</span>}
                      {t.fornecedor && <span>• {t.fornecedor}</span>}
                      {t.formaPagamento && (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                            formaPagamentoConfig[t.formaPagamento]?.color === 'info'
                              ? 'bg-[#004430] text-[#00ff88] border-[#00ff88]/30'
                              : formaPagamentoConfig[t.formaPagamento]?.color === 'purple'
                              ? 'bg-[#1a1a1a] text-[#00ff88] border-[#00ff88]/30'
                              : 'bg-[#1a1a1a] text-[#888888] border-[#222222]'
                          }`}
                        >
                          {formaPagamentoConfig[t.formaPagamento]?.label || t.formaPagamento}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className={`text-lg font-bold ${
                      t.tipo === 'entrada' ? 'text-[#00ff88]' : 'text-[#ef4444]'
                    }`}
                  >
                    {t.tipo === 'entrada' ? '+' : '-'} {formatCurrency(t.valor)}
                  </p>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="px-2 py-1 border border-[#222222] rounded text-xs bg-[#111111] text-white focus:outline-none focus:ring-1 focus:ring-[#00ff88]"
                  >
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <option key={value} value={value}>
                        → {config.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors group"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-white group-hover:text-[#00ff88] transition-colors" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(t.id)}
                      className="p-2 rounded-lg hover:bg-[#450a0a] transition-colors group"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4 text-white group-hover:text-[#00ff88] transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
                      <ArrowDownCircle className="w-5 h-5 text-danger-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary truncate">{t.descricao}</h3>
                      <Badge variant={t.tipo === 'entrada' ? 'success' : 'danger'}>
                        {t.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
                      <span>{formatDate(t.data)}</span>
                      <Badge variant={getCategoriaConfig(t.categoria, t.tipo).color}>
                        {getCategoriaConfig(t.categoria, t.tipo).label}
                      </Badge>
                      {t.cliente && <span>• {t.cliente}</span>}
                      {t.fornecedor && <span>• {t.fornecedor}</span>}
                      {t.formaPagamento && (
                        <Badge variant={formaPagamentoConfig[t.formaPagamento]?.color || 'default'}>
                          {formaPagamentoConfig[t.formaPagamento]?.label || t.formaPagamento}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className={`text-lg font-bold ${
                      t.tipo === 'entrada' ? 'text-success-400' : 'text-danger-400'
                    }`}
                  >
                    {t.tipo === 'entrada' ? '+' : '-'} {formatCurrency(t.valor)}
                  </p>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="px-2 py-1 border border-border rounded text-xs bg-bg-main text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <option key={value} value={value}>
                        → {config.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(t.id)}
                      className="p-2 rounded-lg hover:bg-danger-950 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4 text-danger-400" />
                    </button>
                  </div>
                </div>
              </div>
              {t.observacoes && (
                <p className="text-xs text-text-muted mt-2 pt-2 border-t border-border ml-10">
                  {t.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Relatório View */
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-success-950 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-success-400" />
                </div>
                <span className="text-sm text-text-secondary">Entradas do Mês</span>
              </div>
              <p className="text-2xl font-bold text-success-400">{formatCurrency(mesTotalEntradas)}</p>
              <p className="text-xs text-text-muted mt-1">{mesEntradas.length} transações</p>
            </div>
            <div className="bg-bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-danger-950 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-danger-400" />
                </div>
                <span className="text-sm text-text-secondary">Saídas do Mês</span>
              </div>
              <p className="text-2xl font-bold text-danger-400">{formatCurrency(mesTotalSaidas)}</p>
              <p className="text-xs text-text-muted mt-1">{mesSaidas.length} transações</p>
            </div>
            <div className="bg-bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${mesTotalEntradas - mesTotalSaidas >= 0 ? 'bg-accent-light' : 'bg-danger-950'}`}>
                  <DollarSign className={`w-5 h-5 ${mesTotalEntradas - mesTotalSaidas >= 0 ? 'text-accent' : 'text-danger-400'}`} />
                </div>
                <span className="text-sm text-text-secondary">Resultado</span>
              </div>
              <p className={`text-2xl font-bold ${mesTotalEntradas - mesTotalSaidas >= 0 ? 'text-accent' : 'text-danger-400'}`}>
                {formatCurrency(mesTotalEntradas - mesTotalSaidas)}
              </p>
              <p className="text-xs text-text-muted mt-1">{mesTransacoes.length} transações</p>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-success-400" />
                Entradas por Categoria
              </h3>
              <div className="space-y-3">
                {[...new Set(mesEntradas.map((t) => t.categoria))].map((cat) => {
                  const catTransacoes = mesEntradas.filter((t) => t.categoria === cat);
                  const total = catTransacoes.reduce((acc, t) => acc + t.valor, 0);
                  const config = categoriaEntradaConfig[cat] || { label: cat, color: 'default' };
                  const percent = mesTotalEntradas > 0 ? (total / mesTotalEntradas) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <Badge variant={config.color}>{config.label}</Badge>
                        <span className="font-medium text-text-primary">{formatCurrency(total)}</span>
                      </div>
                      <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-1">{catTransacoes.length} transações</p>
                    </div>
                  );
                })}
                {mesEntradas.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-4">Nenhuma entrada neste mês</p>
                )}
              </div>
            </div>

            <div className="bg-bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-danger-400" />
                Saídas por Categoria
              </h3>
              <div className="space-y-3">
                {[...new Set(mesSaidas.map((t) => t.categoria))].map((cat) => {
                  const catTransacoes = mesSaidas.filter((t) => t.categoria === cat);
                  const total = catTransacoes.reduce((acc, t) => acc + t.valor, 0);
                  const config = categoriaSaidaConfig[cat] || { label: cat, color: 'default' };
                  const percent = mesTotalSaidas > 0 ? (total / mesTotalSaidas) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <Badge variant={config.color}>{config.label}</Badge>
                        <span className="font-medium text-text-primary">{formatCurrency(total)}</span>
                      </div>
                      <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-danger-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-1">{catTransacoes.length} transações</p>
                    </div>
                  );
                })}
                {mesSaidas.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-4">Nenhuma saída neste mês</p>
                )}
              </div>
            </div>
          </div>

          {/* Last 6 Months Overview */}
          <div className="bg-bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Últimos 6 Meses
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-text-secondary">Mês</th>
                    <th className="text-right py-2 px-3 font-medium text-success-400">Entradas</th>
                    <th className="text-right py-2 px-3 font-medium text-danger-400">Saídas</th>
                    <th className="text-right py-2 px-3 font-medium text-text-secondary">Saldo</th>
                    <th className="text-center py-2 px-3 font-medium text-text-secondary">Nº Transações</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const date = new Date(filterAno, filterMes - i, 1);
                    const month = date.getMonth();
                    const year = date.getFullYear();
                    const resumo = getMesResumo(month, year);
                    const saldo = resumo.entradas - resumo.saidas;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-border ${
                          i === 0 ? 'bg-bg-elevated' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-medium text-text-primary">
                          {meses[month]} {year}
                        </td>
                        <td className="py-2.5 px-3 text-right text-success-400">
                          {formatCurrency(resumo.entradas)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-danger-400">
                          {formatCurrency(resumo.saidas)}
                        </td>
                        <td className={`py-2.5 px-3 text-right font-semibold ${saldo >= 0 ? 'text-accent' : 'text-danger-400'}`}>
                          {formatCurrency(saldo)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-text-secondary">{resumo.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransacao ? 'Editar Transação' : 'Nova Transação'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value, categoria: '' })
              }
              options={[
                { value: 'entrada', label: 'Entrada' },
                { value: 'saida', label: 'Saída' },
              ]}
            />
            <Input
              label="Valor (R$)"
              name="valor"
              type="number"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0.00"
              required
              error={errors.valor}
            />
          </div>
          <Input
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Ex: Pagamento evento gala"
            required
            error={errors.descricao}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoria"
              name="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              options={categoriaOptions}
              required
              error={errors.categoria}
            />
            <Input
              label="Data"
              name="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              error={errors.data}
            />
          </div>
          {formData.tipo === 'entrada' ? (
            <Input
              label="Cliente"
              name="cliente"
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              placeholder="Nome do cliente"
            />
          ) : (
            <Input
              label="Fornecedor"
              name="fornecedor"
              value={formData.fornecedor}
              onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              placeholder="Nome do fornecedor"
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Forma de Pagamento"
              name="formaPagamento"
              value={formData.formaPagamento}
              onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
              options={formaPagamentoOptions}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
            />
          </div>
          <Textarea
            label="Observações"
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Informações adicionais..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingTransacao ? 'Salvar Alterações' : 'Registrar Transação'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
      />
    </Layout>
  );
}
