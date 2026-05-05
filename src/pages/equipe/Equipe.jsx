import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Select, Textarea } from '../../components/ui';
import {
  Users,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  DollarSign,
  Clock,
  Briefcase,
} from 'lucide-react';
import { equipe as mockEquipe, escalas as mockEscalas } from '../../data/mockData';

const funcoes = [
  'Técnico de Iluminação',
  'Técnico de Som',
  'Técnico de Efeitos',
  'Assistente Técnico',
  'Motorista/Carregador',
  'Estagiário',
  'Produtor',
  'Outro',
];

const especialidadesOptions = [
  { value: 'iluminacao', label: 'Iluminação' },
  { value: 'som', label: 'Som' },
  { value: 'efeitos', label: 'Efeitos' },
  { value: 'transporte', label: 'Transporte' },
];

const statusConfig = {
  ativo: { label: 'Ativo', color: 'success' },
  inativo: { label: 'Inativo', color: 'default' },
};

const tipoEscalaConfig = {
  evento: { label: 'Evento', color: 'info' },
  montagem: { label: 'Montagem', color: 'warning' },
  manutencao: { label: 'Manutenção', color: 'danger' },
  folga: { label: 'Folga', color: 'default' },
};

const statusEscalaConfig = {
  confirmado: { label: 'Confirmado', color: 'success' },
  pendente: { label: 'Pendente', color: 'warning' },
  cancelado: { label: 'Cancelado', color: 'danger' },
};

const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const emptyMembroForm = {
  nome: '',
  funcao: '',
  telefone: '',
  email: '',
  cpf: '',
  dataAdmissao: '',
  status: 'ativo',
  valorDiaria: '',
  especialidades: [],
  observacoes: '',
};

const emptyEscalaForm = {
  membroId: '',
  data: '',
  horarioInicio: '',
  horarioFim: '',
  tipo: 'evento',
  evento: '',
  status: 'confirmado',
};

export function Equipe() {
  const [activeTab, setActiveTab] = useState('membros');
  const [membros, setMembros] = useState(mockEquipe);
  const [escalas, setEscalas] = useState(mockEscalas);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterFuncao, setFilterFuncao] = useState('todas');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMembro, setSelectedMembro] = useState(null);

  // Membro modal
  const [isMembroModalOpen, setIsMembroModalOpen] = useState(false);
  const [editingMembro, setEditingMembro] = useState(null);
  const [membroForm, setMembroForm] = useState(emptyMembroForm);
  const [membroErrors, setMembroErrors] = useState({});

  // Escala modal
  const [isEscalaModalOpen, setIsEscalaModalOpen] = useState(false);
  const [editingEscala, setEditingEscala] = useState(null);
  const [escalaForm, setEscalaForm] = useState(emptyEscalaForm);
  const [escalaErrors, setEscalaErrors] = useState({});

  // Confirm
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEscalasForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return escalas.filter((e) => e.data === dateStr);
  };

  const getEscalasForMonth = () => {
    return escalas.filter((e) => {
      const [y, m] = e.data.split('-').map(Number);
      return y === year && m === month + 1;
    });
  };

  // Filtered membros
  const filteredMembros = membros.filter((m) => {
    const matchesSearch =
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || m.status === filterStatus;
    const matchesFuncao = filterFuncao === 'todas' || m.funcao === filterFuncao;
    return matchesSearch && matchesStatus && matchesFuncao;
  });

  // Filtered escalas
  const filteredEscalas = escalas.filter((e) => {
    const [y, m] = e.data.split('-').map(Number);
    const matchesMonth = m === month + 1 && y === year;
    const matchesMembro = !selectedMembro || e.membroId === selectedMembro;
    const matchesSearch = e.membroNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.evento && e.evento.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMonth && matchesMembro && matchesSearch;
  }).sort((a, b) => a.data.localeCompare(b.data));

  // Stats
  const membrosAtivos = membros.filter((m) => m.status === 'ativo').length;
  const escalasMes = getEscalasForMonth();
  const eventosMes = new Set(escalasMes.filter((e) => e.tipo === 'evento').map((e) => e.evento)).size;

  // Membro validation
  const validateMembroForm = () => {
    const errors = {};
    if (!membroForm.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!membroForm.funcao) errors.funcao = 'Função é obrigatória';
    if (!membroForm.telefone.trim()) errors.telefone = 'Telefone é obrigatório';
    if (!membroForm.valorDiaria) errors.valorDiaria = 'Valor da diária é obrigatório';
    setMembroErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Escala validation
  const validateEscalaForm = () => {
    const errors = {};
    if (!escalaForm.membroId) errors.membroId = 'Selecione um membro';
    if (!escalaForm.data) errors.data = 'Data é obrigatória';
    if (!escalaForm.horarioInicio) errors.horarioInicio = 'Horário de início é obrigatório';
    if (!escalaForm.horarioFim) errors.horarioFim = 'Horário de fim é obrigatório';
    setEscalaErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Membro handlers
  const handleOpenMembroModal = (membro = null) => {
    if (membro) {
      setEditingMembro(membro);
      setMembroForm({
        nome: membro.nome,
        funcao: membro.funcao,
        telefone: membro.telefone,
        email: membro.email || '',
        cpf: membro.cpf || '',
        dataAdmissao: membro.dataAdmissao || '',
        status: membro.status,
        valorDiaria: membro.valorDiaria.toString(),
        especialidades: membro.especialidades || [],
        observacoes: membro.observacoes || '',
      });
    } else {
      setEditingMembro(null);
      setMembroForm(emptyMembroForm);
    }
    setMembroErrors({});
    setIsMembroModalOpen(true);
  };

  const handleMembroSubmit = (e) => {
    e.preventDefault();
    if (!validateMembroForm()) return;

    if (editingMembro) {
      setMembros((prev) =>
        prev.map((m) =>
          m.id === editingMembro.id
            ? {
                ...m,
                ...membroForm,
                valorDiaria: parseFloat(membroForm.valorDiaria),
              }
            : m
        )
      );
    } else {
      const newMembro = {
        id: Math.max(0, ...membros.map((m) => m.id)) + 1,
        ...membroForm,
        valorDiaria: parseFloat(membroForm.valorDiaria),
      };
      setMembros((prev) => [...prev, newMembro]);
    }
    setIsMembroModalOpen(false);
    setEditingMembro(null);
    setMembroForm(emptyMembroForm);
  };

  const handleDeleteMembro = (id) => {
    setMembros((prev) => prev.filter((m) => m.id !== id));
    setConfirmDelete(null);
    setDeleteType('');
  };

  // Escala handlers
  const handleOpenEscalaModal = (escala = null) => {
    if (escala) {
      setEditingEscala(escala);
      setEscalaForm({
        membroId: escala.membroId.toString(),
        data: escala.data,
        horarioInicio: escala.horarioInicio,
        horarioFim: escala.horarioFim,
        tipo: escala.tipo,
        evento: escala.evento || '',
        status: escala.status,
      });
    } else {
      setEditingEscala(null);
      setEscalaForm(emptyEscalaForm);
    }
    setEscalaErrors({});
    setIsEscalaModalOpen(true);
  };

  const handleEscalaSubmit = (e) => {
    e.preventDefault();
    if (!validateEscalaForm()) return;

    const membro = membros.find((m) => m.id === parseInt(escalaForm.membroId));

    if (editingEscala) {
      setEscalas((prev) =>
        prev.map((es) =>
          es.id === editingEscala.id
            ? {
                ...es,
                ...escalaForm,
                membroId: parseInt(escalaForm.membroId),
                membroNome: membro?.nome || es.membroNome,
              }
            : es
        )
      );
    } else {
      const newEscala = {
        id: Math.max(0, ...escalas.map((es) => es.id)) + 1,
        ...escalaForm,
        membroId: parseInt(escalaForm.membroId),
        membroNome: membro?.nome || '',
      };
      setEscalas((prev) => [...prev, newEscala]);
    }
    setIsEscalaModalOpen(false);
    setEditingEscala(null);
    setEscalaForm(emptyEscalaForm);
  };

  const handleDeleteEscala = (id) => {
    setEscalas((prev) => prev.filter((es) => es.id !== id));
    setConfirmDelete(null);
    setDeleteType('');
  };

  const handleStatusEscalaChange = (id, newStatus) => {
    setEscalas((prev) =>
      prev.map((es) => (es.id === id ? { ...es, status: newStatus } : es))
    );
  };

  // Weekly calendar data
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const membroOptions = membros
    .filter((m) => m.status === 'ativo')
    .map((m) => ({ value: m.id.toString(), label: m.nome }));

  const funcoesUnicas = [...new Set(membros.map((m) => m.funcao))];

  return (
    <Layout>
      <div className="px-[30px] py-[30px]">
        {/* Cabeçalho próprio */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Equipe</h1>
          <p className="text-sm text-[#888888]">Gerencie membros e escalas</p>
        </div>

        {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#00ff88]" />
            </div>
            <span className="text-sm text-[#888888]">Membros Ativos</span>
          </div>
          <p className="text-2xl font-bold text-white">{membrosAtivos}</p>
        </div>
        <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <Calendar className="w-5 h-5 text-[#00ff88]" />
            </div>
            <span className="text-sm text-[#888888]">Escalas no Mês</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{escalasMes.length}</p>
        </div>
        <div className="bg-[#111111] rounded-xl border border-[#222222] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-[#00ff88]" />
            </div>
            <span className="text-sm text-[#888888]">Eventos no Mês</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{eventosMes}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('membros')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'membros'
                ? 'text-[#00ff88] border-[#00ff88]'
                : 'text-[#888888] border-transparent hover:text-white'
            }`}
          >
            Membros
          </button>
          <button
            onClick={() => setActiveTab('escalas')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'escalas'
                ? 'text-[#00ff88] border-[#00ff88]'
                : 'text-[#888888] border-transparent hover:text-white'
            }`}
          >
            Escalas
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <Button onClick={() => activeTab === 'membros' ? handleOpenMembroModal() : handleOpenEscalaModal()}>
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === 'membros' ? 'Novo Membro' : 'Nova Escala'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {activeTab === 'membros' ? (
          <>
            <select
              value={filterFuncao}
              onChange={(e) => setFilterFuncao(e.target.value)}
              className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
            >
              <option value="todas">Todas Funções</option>
              {funcoesUnicas.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
            >
              <option value="todos">Todos Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[140px] text-center text-white">
                {meses[month]} {year}
              </span>
              <Button variant="secondary" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <select
              value={selectedMembro || ''}
              onChange={(e) => setSelectedMembro(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border border-[#222222] rounded-lg text-sm bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
            >
              <option value="">Todos os Membros</option>
              {membros.filter((m) => m.status === 'ativo').map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Content */}
      {activeTab === 'membros' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembros.map((membro) => (
            <div
              key={membro.id}
              className={`bg-[#111111] rounded-xl border p-5 hover:shadow-md transition-shadow ${
                membro.status === 'inativo' ? 'border-[#222222] opacity-75' : 'border-[#222222]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    membro.status === 'ativo' ? 'bg-accent text-bg-main' : 'bg-[#1a1a1a] text-[#666666]'
                  }`}>
                    {membro.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{membro.nome}</h3>
                    <p className="text-sm text-[#888888]">{membro.funcao}</p>
                  </div>
                </div>
                <Badge variant={statusConfig[membro.status].color}>
                  {statusConfig[membro.status].label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-[#888888] mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#666666] flex-shrink-0" />
                  <span>{membro.telefone}</span>
                </div>
                {membro.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#666666] flex-shrink-0" />
                    <span className="truncate">{membro.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#666666] flex-shrink-0" />
                  <span>{formatCurrency(membro.valorDiaria)}/dia</span>
                </div>
              </div>

              {membro.especialidades && membro.especialidades.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {membro.especialidades.map((esp) => {
                    const config = especialidadesOptions.find((o) => o.value === esp);
                    return config ? (
                      <Badge key={esp} variant="info">{config.label}</Badge>
                    ) : null;
                  })}
                </div>
              )}

              <div className="flex gap-1 pt-3 border-t border-[#222222]">
                <button
                  onClick={() => handleOpenMembroModal(membro)}
                  className="flex-1 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm text-[#888888]"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(membro.id);
                    setDeleteType('membro');
                  }}
                  className="flex-1 p-2 rounded-lg hover:bg-red-900/20 transition-colors text-sm text-red-400"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Calendar View */}
          <div className="bg-[#111111] rounded-xl border border-[#222222] overflow-hidden mb-6">
            <div className="grid grid-cols-7 border-b border-[#222222]">
              {diasSemana.map((dia) => (
                <div key={dia} className="py-3 text-center text-sm font-medium text-[#888888]">
                  {dia}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayEscalas = day ? getEscalasForDay(day) : [];
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] border-b border-r border-[#222222] p-1.5 ${
                      day ? 'hover:bg-[#1a1a1a] cursor-pointer' : 'bg-[#0a0a0a]'
                    }`}
                    onClick={() => day && handleOpenEscalaModal()}
                  >
                    {day && (
                      <>
                        <span className="text-sm text-white font-medium">{day}</span>
                        <div className="mt-1 space-y-0.5">
                          {dayEscalas.slice(0, 2).map((escala) => (
                            <div
                              key={escala.id}
                              className={`px-1 py-0.5 rounded text-xs truncate ${
                                escala.status === 'confirmado'
                                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-success-700'
                                  : escala.status === 'pendente'
                                  ? 'bg-yellow-900/30 text-yellow-400 border border-warning-700'
                                  : 'bg-red-900/20 text-red-400 border border-danger-700'
                              }`}
                            >
                              {escala.membroNome.split(' ')[0]}
                            </div>
                          ))}
                          {dayEscalas.length > 2 && (
                            <p className="text-xs text-[#666666] pl-1">+{dayEscalas.length - 2}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule List */}
          <div className="space-y-3">
            {filteredEscalas.length === 0 && (
              <div className="text-center py-12 bg-[#111111] rounded-xl border border-[#222222]">
                <Calendar className="w-12 h-12 text-[#666666] mx-auto mb-3" />
                <p className="text-[#888888]">Nenhuma escala neste mês.</p>
              </div>
            )}
            {filteredEscalas.map((escala) => {
              const membro = membros.find((m) => m.id === escala.membroId);
              return (
                <div
                  key={escala.id}
                  className="bg-[#111111] rounded-xl border border-[#222222] p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold ${
                        membro?.status === 'inativo' ? 'bg-[#1a1a1a] text-[#666666]' : 'bg-accent text-bg-main'
                      }`}>
                        {escala.membroNome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{escala.membroNome}</h3>
                          <Badge variant={statusEscalaConfig[escala.status].color}>
                            {statusEscalaConfig[escala.status].label}
                          </Badge>
                          <Badge variant={tipoEscalaConfig[escala.tipo].color}>
                            {tipoEscalaConfig[escala.tipo].label}
                          </Badge>
                        </div>
                        {escala.evento && (
                          <p className="text-sm text-[#888888]">{escala.evento}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm text-[#888888] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(escala.data)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {escala.horarioInicio} - {escala.horarioFim}
                          </span>
                          {membro && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              {formatCurrency(membro.valorDiaria)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={escala.status}
                        onChange={(e) => handleStatusEscalaChange(escala.id, e.target.value)}
                        className="px-2 py-1 border border-[#222222] rounded text-xs bg-[#0a0a0a] text-white focus:outline-none focus:ring-1 focus:ring-[#00ff88]"
                      >
                        {Object.entries(statusEscalaConfig).map(([value, config]) => (
                          <option key={value} value={value}>
                            → {config.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleOpenEscalaModal(escala)}
                        className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-[#888888]" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete(escala.id);
                          setDeleteType('escala');
                        }}
                        className="p-2 rounded-lg hover:bg-red-900/20 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Membro Modal */}
      <Modal
        isOpen={isMembroModalOpen}
        onClose={() => {
          setIsMembroModalOpen(false);
          setEditingMembro(null);
          setMembroForm(emptyMembroForm);
          setMembroErrors({});
        }}
        title={editingMembro ? 'Editar Membro' : 'Novo Membro'}
        size="lg"
      >
        <form onSubmit={handleMembroSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            name="nome"
            value={membroForm.nome}
            onChange={(e) => setMembroForm({ ...membroForm, nome: e.target.value })}
            placeholder="Nome do membro"
            required
            error={membroErrors.nome}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Função"
              name="funcao"
              value={membroForm.funcao}
              onChange={(e) => setMembroForm({ ...membroForm, funcao: e.target.value })}
              options={funcoes.map((f) => ({ value: f, label: f }))}
              required
              error={membroErrors.funcao}
            />
            <Input
              label="Valor da Diária (R$)"
              name="valorDiaria"
              type="number"
              value={membroForm.valorDiaria}
              onChange={(e) => setMembroForm({ ...membroForm, valorDiaria: e.target.value })}
              placeholder="0.00"
              required
              error={membroErrors.valorDiaria}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              name="telefone"
              value={membroForm.telefone}
              onChange={(e) => setMembroForm({ ...membroForm, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
              required
              error={membroErrors.telefone}
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={membroForm.email}
              onChange={(e) => setMembroForm({ ...membroForm, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CPF"
              name="cpf"
              value={membroForm.cpf}
              onChange={(e) => setMembroForm({ ...membroForm, cpf: e.target.value })}
              placeholder="000.000.000-00"
            />
            <Input
              label="Data de Admissão"
              name="dataAdmissao"
              type="date"
              value={membroForm.dataAdmissao}
              onChange={(e) => setMembroForm({ ...membroForm, dataAdmissao: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Especialidades
            </label>
            <div className="flex flex-wrap gap-2">
              {especialidadesOptions.map((option) => {
                const isSelected = membroForm.especialidades.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const newEspecialidades = isSelected
                        ? membroForm.especialidades.filter((e) => e !== option.value)
                        : [...membroForm.especialidades, option.value];
                      setMembroForm({ ...membroForm, especialidades: newEspecialidades });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      isSelected
                        ? 'bg-accent text-bg-main border-accent'
                        : 'bg-[#0a0a0a] text-[#888888] border-[#222222] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea
            label="Observações"
            name="observacoes"
            value={membroForm.observacoes}
            onChange={(e) => setMembroForm({ ...membroForm, observacoes: e.target.value })}
            placeholder="Informações adicionais..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsMembroModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingMembro ? 'Salvar Alterações' : 'Cadastrar Membro'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Escala Modal */}
      <Modal
        isOpen={isEscalaModalOpen}
        onClose={() => {
          setIsEscalaModalOpen(false);
          setEditingEscala(null);
          setEscalaForm(emptyEscalaForm);
          setEscalaErrors({});
        }}
        title={editingEscala ? 'Editar Escala' : 'Nova Escala'}
        size="md"
      >
        <form onSubmit={handleEscalaSubmit} className="space-y-4">
          <Select
            label="Membro"
            name="membroId"
            value={escalaForm.membroId}
            onChange={(e) => setEscalaForm({ ...escalaForm, membroId: e.target.value })}
            options={membroOptions}
            required
            error={escalaErrors.membroId}
          />
          <Input
            label="Data"
            name="data"
            type="date"
            value={escalaForm.data}
            onChange={(e) => setEscalaForm({ ...escalaForm, data: e.target.value })}
            required
            error={escalaErrors.data}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Horário Início"
              name="horarioInicio"
              type="time"
              value={escalaForm.horarioInicio}
              onChange={(e) => setEscalaForm({ ...escalaForm, horarioInicio: e.target.value })}
              required
              error={escalaErrors.horarioInicio}
            />
            <Input
              label="Horário Fim"
              name="horarioFim"
              type="time"
              value={escalaForm.horarioFim}
              onChange={(e) => setEscalaForm({ ...escalaForm, horarioFim: e.target.value })}
              required
              error={escalaErrors.horarioFim}
            />
          </div>
          <Select
            label="Tipo"
            name="tipo"
            value={escalaForm.tipo}
            onChange={(e) => setEscalaForm({ ...escalaForm, tipo: e.target.value })}
            options={[
              { value: 'evento', label: 'Evento' },
              { value: 'montagem', label: 'Montagem' },
              { value: 'manutencao', label: 'Manutenção' },
              { value: 'folga', label: 'Folga' },
            ]}
          />
          <Input
            label="Evento (opcional)"
            name="evento"
            value={escalaForm.evento}
            onChange={(e) => setEscalaForm({ ...escalaForm, evento: e.target.value })}
            placeholder="Nome do evento"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsEscalaModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingEscala ? 'Salvar Alterações' : 'Criar Escala'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => {
          setConfirmDelete(null);
          setDeleteType('');
        }}
        onConfirm={() => {
          if (deleteType === 'membro') handleDeleteMembro(confirmDelete);
          else if (deleteType === 'escala') handleDeleteEscala(confirmDelete);
        }}
        title={deleteType === 'membro' ? 'Excluir Membro' : 'Excluir Escala'}
        message={
          deleteType === 'membro'
            ? 'Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.'
            : 'Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita.'
        }
       />
      </div>
    </Layout>
  );
}
