import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, ConfirmDialog, Select, Textarea } from '../../components/ui';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
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

  const entradas = transacoes.filter((t) => t.tipo === 'entrada' && t.status !== 'cancelado');
  const saidas = transacoes.filter((t) => t.tipo === 'saida' && t.status !== 'cancelado');
  const totalEntradas = entradas.reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = saidas.reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalEntradas - totalSaidas;
  const entradasPendentes = transacoes.filter(
    (t) => t.tipo === 'entrada' && t.status === 'pendente'
  ).reduce((acc, t) => acc + t.valor, 0);

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
    <Layout>
      <div style={{ padding: '32px' }}>
        {/* Cabeçalho próprio */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Financeiro
          </h1>
          <p style={{ color: '#888888', fontSize: '14px', marginTop: '4px' }}>
            Controle de entradas, saídas e relatórios financeiros
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00ff88] transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-[#00ff88]/10 rounded-md">
                <ArrowUpCircle className="w-5 h-5 text-[#00ff88]" />
              </div>
            </div>
            <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-1">Total Entradas</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalEntradas)}</p>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00ff88] transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-[#450a0a]/50 rounded-md">
                <ArrowDownCircle className="w-5 h-5 text-[#ef4444]" />
              </div>
            </div>
            <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-1">Total Saídas</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalSaidas)}</p>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00ff88] transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-md ${saldo >= 0 ? 'bg-[#00ff88]/10' : 'bg-[#450a0a]/50'}`}>
                <DollarSign className={`w-5 h-5 ${saldo >= 0 ? 'text-[#00ff88]' : 'text-[#ef4444]'}`} />
              </div>
            </div>
            <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-1">Saldo</p>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-[#00ff88]' : 'text-[#ef4444]'}`}>
              {formatCurrency(saldo)}
            </p>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00ff88] transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-[#443807]/50 rounded-md">
                <TrendingUp className="w-5 h-5 text-[#facc15]" />
              </div>
            </div>
            <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-1">A Receber</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(entradasPendentes)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTipo('todos')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filterTipo === 'todos'
                  ? 'text-[#00ff88] border-[#00ff88]'
                  : 'text-[#888888] border-transparent hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterTipo('entrada')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filterTipo === 'entrada'
                  ? 'text-[#00ff88] border-[#00ff88]'
                  : 'text-[#888888] border-transparent hover:text-white'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilterTipo('saida')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filterTipo === 'saida'
                  ? 'text-[#00ff88] border-[#00ff88]'
                  : 'text-[#888888] border-transparent hover:text-white'
              }`}
            >
              Saídas
            </button>
          </div>
        </div>

        {/* View Mode & Action */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex border border-[#222222] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('transacoes')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'transacoes'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-[#111111] text-[#888888] hover:bg-[#1a1a1a]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Transações
            </button>
            <button
              onClick={() => setViewMode('relatorio')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'relatorio'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-[#111111] text-[#888888] hover:bg-[#1a1a1a]'
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

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input
              type="text"
              placeholder="Buscar por descrição, cliente ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#222222] rounded-lg text-sm bg-[#111111] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-[#00ff88]"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
          >
            <option value="todos">Todos Tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </select>
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
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
            className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
          >
            <option value="todos">Todos Status</option>
            {Object.entries(statusConfig).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transactions View */}
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
                              : getCategoriaConfig(t.categoria, t.tipo).color === 'info'
                              ? 'bg-[#004430] text-[#00ff88] border-[#00ff88]/30'
                              : getCategoriaConfig(t.categoria, t.tipo).color === 'purple'
                              ? 'bg-[#1a1a1a] text-[#00ff88] border-[#00ff88]/30'
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
                {t.observacoes && (
                  <p className="text-xs text-[#888888] mt-2 pt-2 border-t border-[#222222]">
                    {t.observacoes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Report View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#004430] rounded-md">
                    <TrendingUp className="w-5 h-5 text-[#00ff88]" />
                  </div>
                  <span className="text-sm text-[#888888]">Entradas do Mês</span>
                </div>
                <p className="text-2xl font-bold text-[#00ff88]">{formatCurrency(totalEntradas)}</p>
                <p className="text-xs text-[#888888] mt-1">{filteredTransacoes.filter(t => t.tipo === 'entrada').length} transações</p>
              </div>
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#450a0a] rounded-md">
                    <TrendingDown className="w-5 h-5 text-[#ef4444]" />
                  </div>
                  <span className="text-sm text-[#888888]">Saídas do Mês</span>
                </div>
                <p className="text-2xl font-bold text-[#ef4444]">{formatCurrency(totalSaidas)}</p>
                <p className="text-xs text-[#888888] mt-1">{filteredTransacoes.filter(t => t.tipo === 'saida').length} transações</p>
              </div>
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-md ${totalEntradas - totalSaidas >= 0 ? 'bg-[#00ff88]/10' : 'bg-[#450a0a]/50'}`}>
                    <DollarSign className={`w-5 h-5 ${totalEntradas - totalSaidas >= 0 ? 'text-[#00ff88]' : 'text-[#ef4444]'}`} />
                  </div>
                  <span className="text-sm text-[#888888]">Resultado</span>
                </div>
                <p className={`text-2xl font-bold ${totalEntradas - totalSaidas >= 0 ? 'text-[#00ff88]' : 'text-[#ef4444]'}`}>
                  {formatCurrency(totalEntradas - totalSaidas)}
                </p>
                <p className="text-xs text-[#888888] mt-1">{filteredTransacoes.length} transações</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <ArrowUpCircle className="w-5 h-5 text-[#00ff88]" />
                  Entradas por Categoria
                </h3>
                <div className="space-y-3">
                  {['evento', 'contrato', 'outro'].map((cat) => {
                    const catTransacoes = filteredTransacoes.filter((t) => t.tipo === 'entrada' && t.categoria === cat);
                    if (catTransacoes.length === 0) return null;
                    const total = catTransacoes.reduce((acc, t) => acc + t.valor, 0);
                    const config = categoriaEntradaConfig[cat] || { label: cat, color: 'default' };
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            config.color === 'success'
                              ? 'bg-[#004430] text-[#00ff88] border border-[#00ff88]/30'
                              : config.color === 'info'
                              ? 'bg-[#004430] text-[#00ff88] border border-[#00ff88]/30'
                              : 'bg-[#1a1a1a] text-[#888888] border border-[#222222]'
                          }`}>
                            {config.label}
                          </span>
                          <span className="font-medium text-white">{formatCurrency(total)}</span>
                        </div>
                        <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              config.color === 'success' ? 'bg-[#00ff88]' : 'bg-[#888888]'
                            }`}
                            style={{ width: `${(total / totalEntradas) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#888888] mt-1">{catTransacoes.length} transações</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#111111] border border-[#222222] rounded-lg p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <ArrowDownCircle className="w-5 h-5 text-[#ef4444]" />
                  Saídas por Categoria
                </h3>
                <div className="space-y-3">
                  {['manutencao', 'transporte', 'equipe', 'compra', 'outro'].map((cat) => {
                    const catTransacoes = filteredTransacoes.filter((t) => t.tipo === 'saida' && t.categoria === cat);
                    if (catTransacoes.length === 0) return null;
                    const total = catTransacoes.reduce((acc, t) => acc + t.valor, 0);
                    const config = categoriaSaidaConfig[cat] || { label: cat, color: 'default' };
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                            config.color === 'danger'
                              ? 'bg-[#450a0a] text-[#ef4444] border border-[#ef4444]/30'
                              : config.color === 'warning'
                              ? 'bg-[#443807] text-[#facc15] border border-[#facc15]/30'
                              : 'bg-[#1a1a1a] text-[#888888] border border-[#222222]'
                          }`}>
                            {config.label}
                          </span>
                          <span className="font-medium text-white">{formatCurrency(total)}</span>
                        </div>
                        <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              config.color === 'danger' ? 'bg-[#ef4444]' : 'bg-[#888888]'
                            }`}
                            style={{ width: `${(total / totalSaidas) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#888888] mt-1">{catTransacoes.length} transações</p>
                      </div>
                    );
                  })}
                </div>
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
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value, categoria: '' })}
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
                options={formData.tipo === 'entrada'
                  ? Object.entries(categoriaEntradaConfig).map(([value, config]) => ({
                      value,
                      label: config.label,
                    }))
                  : Object.entries(categoriaSaidaConfig).map(([value, config]) => ({
                      value,
                      label: config.label,
                    }))
                }
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
                options={Object.entries(formaPagamentoConfig).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={Object.entries(statusConfig).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
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
      </div>
    </Layout>
  );
}
