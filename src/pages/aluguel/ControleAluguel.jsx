import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Select, Textarea } from '../../components/ui';
import {
  Package,
  ArrowUpCircle,
  CheckCircle,
  ArrowRightLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { equipamentos as mockEquipamentos, alugueis as mockAlugueis, clientes as mockClientes } from '../../data/mockData';

const categoriaConfig = {
  iluminacao: { label: 'Iluminação', color: 'purple', icon: '💡' },
  som: { label: 'Som', color: 'info', icon: '🔊' },
  efeitos: { label: 'Efeitos', color: 'warning', icon: '✨' },
};

const statusEquipamentoConfig = {
  disponivel: { label: 'Disponível', color: 'success' },
  alugado: { label: 'Alugado', color: 'warning' },
  manutencao: { label: 'Manutenção', color: 'danger' },
};

const statusAluguelConfig = {
  reservado: { label: 'Reservado', color: 'info' },
  alugado: { label: 'Alugado', color: 'warning' },
  devolvido: { label: 'Devolvido', color: 'success' },
  atrasado: { label: 'Atrasado', color: 'danger' },
};

const emptyEquipForm = {
  nome: '',
  categoria: '',
  quantidadeTotal: '',
  valorUnitario: '',
  localizacao: '',
  observacoes: '',
};

const emptyAluguelForm = {
  equipamentoId: '',
  quantidade: '',
  cliente: '',
  evento: '',
  dataSaida: '',
  dataRetorno: '',
  status: 'reservado',
  observacoes: '',
};

export function ControleAluguel() {
  const [activeTab, setActiveTab] = useState('equipamentos');
  const [equipamentos, setEquipamentos] = useState(mockEquipamentos);
  const [alugueis, setAlugueis] = useState(mockAlugueis);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Equipment modal
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);
  const [equipForm, setEquipForm] = useState(emptyEquipForm);
  const [equipErrors, setEquipErrors] = useState({});

  // Rental modal
  const [isAluguelModalOpen, setIsAluguelModalOpen] = useState(false);
  const [editingAluguel, setEditingAluguel] = useState(null);
  const [aluguelForm, setAluguelForm] = useState(emptyAluguelForm);
  const [aluguelErrors, setAluguelErrors] = useState({});

  // Confirm dialog
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  // Stats
  const totalEquipamentos = equipamentos.reduce((acc, e) => acc + e.quantidadeTotal, 0);
  const totalDisponivel = equipamentos.reduce((acc, e) => acc + e.quantidadeDisponivel, 0);
  const totalAlugado = totalEquipamentos - totalDisponivel;
  const alugueisAtivos = alugueis.filter((a) => a.status === 'alugado' || a.status === 'reservado');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  // Equipment filtering
  const filteredEquipamentos = equipamentos.filter((e) => {
    const matchesSearch = e.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'todas' || e.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  // Rental filtering
  const filteredAlugueis = alugueis.filter((a) => {
    const matchesSearch =
      a.equipamentoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.evento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Equipment validation
  const validateEquipForm = () => {
    const errors = {};
    if (!equipForm.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!equipForm.categoria) errors.categoria = 'Categoria é obrigatória';
    if (!equipForm.quantidadeTotal) errors.quantidadeTotal = 'Quantidade é obrigatória';
    if (!equipForm.valorUnitario) errors.valorUnitario = 'Valor é obrigatório';
    setEquipErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Rental validation
  const validateAluguelForm = () => {
    const errors = {};
    if (!aluguelForm.equipamentoId) errors.equipamentoId = 'Selecione um equipamento';
    if (!aluguelForm.quantidade) errors.quantidade = 'Quantidade é obrigatória';
    if (!aluguelForm.cliente.trim()) errors.cliente = 'Cliente é obrigatório';
    if (!aluguelForm.dataSaida) errors.dataSaida = 'Data de saída é obrigatória';
    if (!aluguelForm.dataRetorno) errors.dataRetorno = 'Data de retorno é obrigatória';
    setAluguelErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Equipment handlers
  const handleOpenEquipModal = (equip = null) => {
    if (equip) {
      setEditingEquip(equip);
      setEquipForm({
        nome: equip.nome,
        categoria: equip.categoria,
        quantidadeTotal: equip.quantidadeTotal.toString(),
        valorUnitario: equip.valorUnitario.toString(),
        localizacao: equip.localizacao || '',
        observacoes: equip.observacoes || '',
      });
    } else {
      setEditingEquip(null);
      setEquipForm(emptyEquipForm);
    }
    setEquipErrors({});
    setIsEquipModalOpen(true);
  };

  const handleEquipSubmit = (e) => {
    e.preventDefault();
    if (!validateEquipForm()) return;

    const qtdTotal = parseInt(equipForm.quantidadeTotal);
    if (editingEquip) {
      const diff = qtdTotal - editingEquip.quantidadeTotal;
      setEquipamentos((prev) =>
        prev.map((e) =>
          e.id === editingEquip.id
            ? {
                ...e,
                ...equipForm,
                quantidadeTotal: qtdTotal,
                valorUnitario: parseFloat(equipForm.valorUnitario),
                quantidadeDisponivel: Math.max(0, e.quantidadeDisponivel + diff),
              }
            : e
        )
      );
    } else {
      const newEquip = {
        id: Math.max(0, ...equipamentos.map((e) => e.id)) + 1,
        nome: equipForm.nome,
        categoria: equipForm.categoria,
        quantidadeTotal: qtdTotal,
        quantidadeDisponivel: qtdTotal,
        valorUnitario: parseFloat(equipForm.valorUnitario),
        localizacao: equipForm.localizacao,
        observacoes: equipForm.observacoes,
      };
      setEquipamentos((prev) => [...prev, newEquip]);
    }
    setIsEquipModalOpen(false);
    setEditingEquip(null);
    setEquipForm(emptyEquipForm);
  };

  const handleDeleteEquip = (id) => {
    setEquipamentos((prev) => prev.filter((e) => e.id !== id));
    setConfirmDelete(null);
    setDeleteType('');
  };

  // Rental handlers
  const handleOpenAluguelModal = (aluguel = null) => {
    if (aluguel) {
      setEditingAluguel(aluguel);
      setAluguelForm({
        equipamentoId: aluguel.equipamentoId.toString(),
        quantidade: aluguel.quantidade.toString(),
        cliente: aluguel.cliente,
        evento: aluguel.evento || '',
        dataSaida: aluguel.dataSaida,
        dataRetorno: aluguel.dataRetorno,
        status: aluguel.status,
        observacoes: aluguel.observacoes || '',
      });
    } else {
      setEditingAluguel(null);
      setAluguelForm(emptyAluguelForm);
    }
    setAluguelErrors({});
    setIsAluguelModalOpen(true);
  };

  const handleAluguelSubmit = (e) => {
    e.preventDefault();
    if (!validateAluguelForm()) return;

    const equip = equipamentos.find((e) => e.id === parseInt(aluguelForm.equipamentoId));
    const quantidade = parseInt(aluguelForm.quantidade);

    if (aluguelForm.status === 'alugado' || aluguelForm.status === 'reservado') {
      if (!editingAluguel && equip && quantidade > equip.quantidadeDisponivel) {
        alert(`Estoque insuficiente. Disponível: ${equip.quantidadeDisponivel}`);
        return;
      }
    }

    if (editingAluguel) {
      setAlugueis((prev) =>
        prev.map((a) =>
          a.id === editingAluguel.id
            ? {
                  ...a,
                  ...aluguelForm,
                  equipamentoNome: equip?.nome || a.equipamentoNome,
                  quantidade: quantidade,
                  valorUnitario: parseFloat(aluguelForm.valorUnitario || '0'),
                }
            : a
        )
      );

      // Update availability
      if (aluguelForm.status === 'devolvido' && editingAluguel.status !== 'devolvido') {
        setEquipamentos((prev) =>
          prev.map((e) =>
            e.id === parseInt(aluguelForm.equipamentoId)
              ? { ...e, quantidadeDisponivel: Math.min(e.quantidadeTotal, e.quantidadeDisponivel + quantidade) }
              : e
          )
        );
      } else if (aluguelForm.status !== 'devolvido' && editingAluguel.status === 'devolvido') {
        setEquipamentos((prev) =>
          prev.map((e) =>
            e.id === parseInt(aluguelForm.equipamentoId)
              ? { ...e, quantidadeDisponivel: Math.max(0, e.quantidadeDisponivel - quantidade) }
              : e
          )
        );
      }
    } else {
      const newAluguel = {
        id: Math.max(0, ...alugueis.map((a) => a.id)) + 1,
        equipamentoId: parseInt(aluguelForm.equipamentoId),
        equipamentoNome: equip?.nome || '',
        quantidade: quantidade,
        cliente: aluguelForm.cliente,
        evento: aluguelForm.evento,
        dataSaida: aluguelForm.dataSaida,
        dataRetorno: aluguelForm.dataRetorno,
        status: aluguelForm.status,
        observacoes: aluguelForm.observacoes,
      };
      setAlugueis((prev) => [...prev, newAluguel]);

      // Decrease availability
      if (aluguelForm.status === 'alugado' || aluguelForm.status === 'reservado') {
        setEquipamentos((prev) =>
          prev.map((e) =>
            e.id === parseInt(aluguelForm.equipamentoId)
              ? { ...e, quantidadeDisponivel: Math.max(0, e.quantidadeDisponivel - quantidade) }
              : e
          )
        );
      }
    }
    setIsAluguelModalOpen(false);
    setEditingAluguel(null);
    setAluguelForm(emptyAluguelForm);
  };

  const handleDeleteAluguel = (id) => {
    const aluguel = alugueis.find((a) => a.id === id);
    if (aluguel && (aluguel.status === 'alugado' || aluguel.status === 'reservado')) {
      setEquipamentos((prev) =>
        prev.map((e) =>
          e.id === aluguel.equipamentoId
            ? { ...e, quantidadeDisponivel: Math.min(e.quantidadeTotal, e.quantidadeDisponivel + aluguel.quantidade) }
            : e
        )
      );
    }
    setAlugueis((prev) => prev.filter((a) => a.id !== id));
    setConfirmDelete(null);
    setDeleteType('');
  };

  const handleStatusChange = (id, newStatus) => {
    const aluguel = alugueis.find((a) => a.id === id);
    if (!aluguel) return;

    setAlugueis((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));

    if (newStatus === 'devolvido' && aluguel.status !== 'devolvido') {
      setEquipamentos((prev) =>
        prev.map((e) =>
          e.id === aluguel.equipamentoId
            ? { ...e, quantidadeDisponivel: Math.min(e.quantidadeTotal, e.quantidadeDisponivel + aluguel.quantidade) }
            : e
        )
      );
    } else if (newStatus !== 'devolvido' && aluguel.status === 'devolvido') {
      setEquipamentos((prev) =>
        prev.map((e) =>
          e.id === aluguel.equipamentoId
            ? { ...e, quantidadeDisponivel: Math.max(0, e.quantidadeDisponivel - aluguel.quantidade) }
            : e
        )
      );
    }
  };

  const equipOptions = equipamentos.map((e) => ({
    value: e.id.toString(),
    label: `${e.nome} (${e.quantidadeDisponivel} disponíveis)`,
  }));

  const clientOptions = mockClientes
    .filter((c) => c.status === 'ativo')
    .map((c) => ({ value: c.nome, label: c.nome }));

  const categoriaOptions = Object.entries(categoriaConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const statusAluguelOptions = Object.entries(statusAluguelConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const getEquipStatus = (equip) => {
    if (equip.quantidadeDisponivel === 0) return 'alugado';
    if (equip.quantidadeDisponivel < equip.quantidadeTotal * 0.3) return 'alugado';
    return 'disponivel';
  };

  return (
    <Layout>
      <div className="px-[30px] py-[30px]">
        {/* Cabeçalho próprio */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Controle de Aluguel</h1>
          <p className="text-sm text-[#888888]">Gerencie equipamentos e aluguéis</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#00ff88]/10 rounded-lg">
                <Package className="w-5 h-5 text-[#00ff88]" />
              </div>
              <span className="text-sm text-[#888888]">Total em Estoque</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalEquipamentos}</p>
          </div>
          <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#00ff88]/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#00ff88]" />
              </div>
              <span className="text-sm text-[#888888]">Disponíveis</span>
            </div>
            <p className="text-2xl font-bold text-[#00ff88]">{totalDisponivel}</p>
          </div>
          <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-900/30 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm text-[#888888]">Alugados/Reservados</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{totalAlugado}</p>
          </div>
          <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#00ff88]/10 rounded-lg">
                <ArrowRightLeft className="w-5 h-5 text-[#00ff88]" />
              </div>
              <span className="text-sm text-[#888888]">Aluguéis Ativos</span>
            </div>
            <p className="text-2xl font-bold text-[#00ff88]">{alugueisAtivos.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 border-b border-[#222222]">
            <button
              onClick={() => setActiveTab('equipamentos')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'equipamentos'
                  ? 'border-[#00ff88] text-[#00ff88]'
                  : 'border-transparent text-[#666666] hover:text-[#888888]'
              }`}
            >
              Equipamentos
            </button>
            <button
              onClick={() => setActiveTab('alugueis')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'alugueis'
                  ? 'border-[#00ff88] text-[#00ff88]'
                  : 'border-transparent text-[#666666] hover:text-[#888888]'
              }`}
            >
              Aluguéis
            </button>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => activeTab === 'equipamentos' ? handleOpenEquipModal() : handleOpenAluguelModal()}>
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'equipamentos' ? 'Novo Equipamento' : 'Novo Aluguel'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {activeTab === 'equipamentos' && (
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
            >
              <option value="todas">Todas Categorias</option>
              {Object.entries(categoriaConfig).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          )}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
          >
            <option value="todos">Todos</option>
            {activeTab === 'equipamentos' ? (
              <>
                <option value="disponivel">Disponível</option>
                <option value="alugado">Alugado</option>
                <option value="manutencao">Manutenção</option>
              </>
            ) : (
              <>
                <option value="reservado">Reservado</option>
                <option value="alugado">Alugado</option>
                <option value="devolvido">Devolvido</option>
                <option value="atrasado">Atrasado</option>
              </>
            )}
          </select>
        </div>

        {/* Content */}
        {activeTab === 'equipamentos' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredEquipamentos.map((equip) => {
              const status = getEquipStatus(equip);
              const percentDisponivel = (equip.quantidadeDisponivel / equip.quantidadeTotal) * 100;
              return (
                <div
                  key={equip.id}
                  className="bg-[#111111] rounded-xl border border-[#222222] p-5 hover:border-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{equip.nome}</h3>
                      <Badge variant={categoriaConfig[equip.categoria]?.color || 'default'}>
                        {categoriaConfig[equip.categoria]?.label || equip.categoria}
                      </Badge>
                    </div>
                    <Badge variant={statusEquipamentoConfig[status].color}>
                      {statusEquipamentoConfig[status].label}
                    </Badge>
                  </div>

                  {/* Availability bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[#666666] mb-1">
                      <span>Disponível: {equip.quantidadeDisponivel}/{equip.quantidadeTotal}</span>
                      <span>{Math.round(percentDisponivel)}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentDisponivel > 50
                            ? 'bg-[#00ff88]'
                            : percentDisponivel > 20
                            ? 'bg-yellow-400'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${percentDisponivel}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-[#888888] mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#666666] flex-shrink-0" />
                      <span className="truncate">{equip.localizacao || 'Não definido'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#666666] flex-shrink-0" />
                      <span>{formatCurrency(equip.valorUnitario)}/dia</span>
                    </div>
                  </div>

                  {equip.observacoes && (
                    <p className="text-xs text-[#666666] mb-3 line-clamp-2">{equip.observacoes}</p>
                  )}

                  <div className="flex gap-1 pt-3 border-t border-[#222222]">
                    <button
                      onClick={() => handleOpenEquipModal(equip)}
                      className="flex-1 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm text-[#888888] group"
                    >
                      <Edit className="w-4 h-4 inline mr-1 text-white group-hover:text-[#00ff88] transition-colors" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setConfirmDelete(equip.id);
                        setDeleteType('equip');
                      }}
                      className="flex-1 p-2 rounded-lg hover:bg-red-900/20 transition-colors text-sm text-red-400 group"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1 text-white group-hover:text-[#00ff88] transition-colors" />
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlugueis.length === 0 && (
              <div className="text-center py-12 bg-[#111111] rounded-xl border border-[#222222]">
                <ArrowUpCircle className="w-12 h-12 text-[#666666] mx-auto mb-3" />
                <p className="text-[#888888]">Nenhum aluguel encontrado.</p>
              </div>
            )}
            {filteredAlugueis.map((aluguel) => (
              <div
                key={aluguel.id}
                className="bg-[#111111] rounded-xl border border-[#222222] p-4 hover:border-[#00ff88] hover:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{aluguel.equipamentoNome}</h3>
                      <Badge variant={statusAluguelConfig[aluguel.status].color}>
                        {statusAluguelConfig[aluguel.status].label}
                      </Badge>
                      <span className="text-sm text-[#888888]">x{aluguel.quantidade}</span>
                    </div>
                    <p className="text-sm text-[#888888]">{aluguel.cliente}</p>
                    {aluguel.evento && (
                      <p className="text-xs text-[#666666] mt-0.5">
                        <Package className="w-3 h-3 inline mr-1" />
                        {aluguel.evento}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <p className="text-xs text-[#666666]">Saída</p>
                      <p className="font-medium text-white">{formatDate(aluguel.dataSaida)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666666]">Retorno</p>
                      <p className="font-medium text-white">{formatDate(aluguel.dataRetorno)}</p>
                    </div>
                    <select
                      value={aluguel.status}
                      onChange={(e) => handleStatusChange(aluguel.id, e.target.value)}
                      className="px-2 py-1 border border-[#222222] rounded text-xs bg-[#0a0a0a] text-white focus:outline-none focus:ring-1 focus:ring-[#00ff88]"
                    >
                      {Object.entries(statusAluguelConfig).map(([value, config]) => (
                        <option key={value} value={value}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenAluguelModal(aluguel)}
                        className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors group"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-white group-hover:text-[#00ff88] transition-colors" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete(aluguel.id);
                          setDeleteType('aluguel');
                        }}
                        className="p-2 rounded-lg hover:bg-red-900/20 transition-colors group"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-white group-hover:text-[#00ff88] transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
                {aluguel.observacoes && (
                  <p className="text-xs text-[#666666] mt-2 pt-2 border-t border-[#222222]">
                    {aluguel.observacoes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Equipment Modal */}
        <Modal
          isOpen={isEquipModalOpen}
          onClose={() => {
            setIsEquipModalOpen(false);
            setEditingEquip(null);
            setEquipForm(emptyEquipForm);
            setEquipErrors({});
          }}
          title={editingEquip ? 'Editar Equipamento' : 'Novo Equipamento'}
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Nome do Equipamento"
              name="nome"
              value={equipForm.nome}
              onChange={(e) => setEquipForm({ ...equipForm, nome: e.target.value })}
              placeholder="Ex: Moving Head 230W"
              required
              error={equipErrors.nome}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Categoria"
                name="categoria"
                value={equipForm.categoria}
                onChange={(e) => setEquipForm({ ...equipForm, categoria: e.target.value })}
                options={categoriaOptions}
                required
                error={equipErrors.categoria}
              />
              <Input
                label="Quantidade Total"
                name="quantidadeTotal"
                type="number"
                value={equipForm.quantidadeTotal}
                onChange={(e) => setEquipForm({ ...equipForm, quantidadeTotal: e.target.value })}
                placeholder="0"
                required
                error={equipErrors.quantidadeTotal}
              />
              <Input
                label="Valor Unitário/Dia (R$)"
                name="valorUnitario"
                type="number"
                value={equipForm.valorUnitario}
                onChange={(e) => setEquipForm({ ...equipForm, valorUnitario: e.target.value })}
                placeholder="0.00"
                required
                error={equipErrors.valorUnitario}
              />
            </div>
            <Input
              label="Localização"
              name="localizacao"
              value={equipForm.localizacao}
              onChange={(e) => setEquipForm({ ...equipForm, localizacao: e.target.value })}
              placeholder="Ex: Galpão A - Prateleira 3"
            />
            <Textarea
              label="Observações"
              name="observacoes"
              value={equipForm.observacoes}
              onChange={(e) => setEquipForm({ ...equipForm, observacoes: e.target.value })}
              placeholder="Informações adicionais..."
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setIsEquipModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleEquipSubmit}>
                {editingEquip ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Rental Modal */}
        <Modal
          isOpen={isAluguelModalOpen}
          onClose={() => {
            setIsAluguelModalOpen(false);
            setEditingAluguel(null);
            setAluguelForm(emptyAluguelForm);
            setAluguelErrors({});
          }}
          title={editingAluguel ? 'Editar Aluguel' : 'Novo Aluguel'}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Equipamento"
                name="equipamentoId"
                value={aluguelForm.equipamentoId}
                onChange={(e) => setAluguelForm({ ...aluguelForm, equipamentoId: e.target.value })}
                options={equipOptions}
                required
                error={aluguelErrors.equipamentoId}
              />
              <Input
                label="Quantidade"
                name="quantidade"
                type="number"
                value={aluguelForm.quantidade}
                onChange={(e) => setAluguelForm({ ...aluguelForm, quantidade: e.target.value })}
                placeholder="0"
                required
                error={aluguelErrors.quantidade}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Cliente"
                name="cliente"
                value={aluguelForm.cliente}
                onChange={(e) => setAluguelForm({ ...aluguelForm, cliente: e.target.value })}
                options={clientOptions}
                required
                error={aluguelErrors.cliente}
              />
              <Input
                label="Evento (opcional)"
                name="evento"
                value={aluguelForm.evento}
                onChange={(e) => setAluguelForm({ ...aluguelForm, evento: e.target.value })}
                placeholder="Nome do evento"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Data de Saída"
                name="dataSaida"
                type="date"
                value={aluguelForm.dataSaida}
                onChange={(e) => setAluguelForm({ ...aluguelForm, dataSaida: e.target.value })}
                required
                error={aluguelErrors.dataSaida}
              />
              <Input
                label="Data de Retorno"
                name="dataRetorno"
                type="date"
                value={aluguelForm.dataRetorno}
                onChange={(e) => setAluguelForm({ ...aluguelForm, dataRetorno: e.target.value })}
                required
                error={aluguelErrors.dataRetorno}
              />
              <Select
                label="Status"
                name="status"
                value={aluguelForm.status}
                onChange={(e) => setAluguelForm({ ...aluguelForm, status: e.target.value })}
                options={statusAluguelOptions}
              />
            </div>
            <Textarea
              label="Observações"
              name="observacoes"
              value={aluguelForm.observacoes}
              onChange={(e) => setAluguelForm({ ...aluguelForm, observacoes: e.target.value })}
              placeholder="Informações adicionais..."
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setIsAluguelModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleAluguelSubmit}>
                {editingAluguel ? 'Salvar Alterações' : 'Registrar Aluguel'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={!!confirmDelete}
          onClose={() => {
            setConfirmDelete(null);
            setDeleteType('');
          }}
          onConfirm={() => {
            if (deleteType === 'equip') handleDeleteEquip(confirmDelete);
            else if (deleteType === 'aluguel') handleDeleteAluguel(confirmDelete);
          }}
          title={deleteType === 'equip' ? 'Excluir Equipamento' : 'Excluir Aluguel'}
          message={
            deleteType === 'equip'
              ? 'Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.'
              : 'Tem certeza que deseja excluir este registro de aluguel? Esta ação não pode ser desfeita.'
          }
        />
      </div>
    </Layout>
  );
}
