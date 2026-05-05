import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Textarea, Select } from '../../components/ui';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Package,
  Eye,
  List,
  LayoutGrid,
} from 'lucide-react';
import { eventos as mockEventos, clientes as mockClientes } from '../../data/mockData';

const statusConfig = {
  confirmado: { label: 'Confirmado', color: 'success' },
  pendente: { label: 'Pendente', color: 'warning' },
  cancelado: { label: 'Cancelado', color: 'danger' },
};

const emptyForm = {
  titulo: '',
  descricao: '',
  cliente: '',
  data: '',
  horarioInicio: '',
  horarioFim: '',
  local: '',
  status: 'pendente',
  materiais: [],
  equipe: '',
};

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function Calendario() {
  const [eventos, setEventos] = useState(mockEventos);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [viewingEvento, setViewingEvento] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getEventosForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter((e) => {
      if (e.dataFim) {
        return dateStr >= e.data && dateStr <= e.dataFim;
      }
      return e.data === dateStr;
    });
  };

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.cliente.trim()) newErrors.cliente = 'Cliente é obrigatório';
    if (!formData.data) newErrors.data = 'Data é obrigatória';
    if (!formData.local.trim()) newErrors.local = 'Local é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (evento = null) => {
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        titulo: evento.titulo,
        descricao: evento.descricao || '',
        cliente: evento.cliente,
        data: evento.data,
        horarioInicio: evento.horarioInicio || '',
        horarioFim: evento.horarioFim || '',
        local: evento.local,
        status: evento.status,
        materiais: evento.materiais || [],
        equipe: evento.equipe ? evento.equipe.join(', ') : '',
      });
    } else {
      setEditingEvento(null);
      setFormData({
        ...emptyForm,
        data: selectedDate || '',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvento(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleViewEvento = (evento) => {
    setViewingEvento(evento);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingEvento(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingEvento) {
      setEventos((prev) =>
        prev.map((e) => (e.id === editingEvento.id ? { ...e, ...formData } : e))
      );
    } else {
      const newEvento = {
        id: Math.max(...eventos.map((e) => e.id)) + 1,
        ...formData,
        materiais: formData.materiais || [],
      };
      setEventos((prev) => [...prev, newEvento]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setEventos((prev) => prev.filter((e) => e.id !== id));
    setConfirmDelete(null);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    handleOpenModal();
  };

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const eventosDoMes = eventos.filter((e) => {
    const [y, m] = e.data.split('-').map(Number);
    return y === year && m === month + 1;
  }).sort((a, b) => a.data.localeCompare(b.data));

  return (
    <Layout>
      <div className="px-[30px] py-[30px]">
        {/* Cabeçalho próprio */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Calendário</h1>
          <p className="text-sm text-[#888888]">Gerencie seus eventos e compromissos</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold text-white min-w-[180px] text-center">
              {meses[month]} {year}
            </h3>
            <Button variant="secondary" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-[#222222] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-[#111111] text-[#888888] hover:bg-[#1a1a1a]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-[#111111] text-[#888888] hover:bg-[#1a1a1a]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="bg-[#111111] rounded-xl border border-[#222222] overflow-hidden">
            <div className="grid grid-cols-7 border-b border-[#222222]">
              {diasSemana.map((dia) => (
                <div
                  key={dia}
                  className="py-3 text-center text-sm font-medium text-[#888888]"
                >
                  {dia}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayEventos = day ? getEventosForDay(day) : [];
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border-b border-r border-[#222222] p-2 ${
                      day ? 'cursor-pointer hover:bg-[#1a1a1a]' : 'bg-[#0a0a0a]'
                    } ${isToday(day) ? 'bg-[#00ff88]/10' : ''}`}
                    onClick={() => day && handleDayClick(day)}
                  >
                    {day && (
                      <>
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                            isToday(day)
                              ? 'bg-[#00ff88] text-black font-semibold'
                              : 'text-white'
                          }`}
                        >
                          {day}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayEventos.slice(0, 2).map((evento) => (
                            <button
                              key={evento.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEvento(evento);
                              }}
                              className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate font-medium ${
                                evento.status === 'confirmado'
                                  ? 'bg-[#004430] text-[#00ff88] border border-[#00ff88]/30'
                                  : evento.status === 'pendente'
                                  ? 'bg-[#443807] text-[#facc15] border border-[#facc15]/30'
                                  : 'bg-[#450a0a] text-[#ef4444] border border-[#ef4444]/30'
                              }`}
                            >
                              {evento.titulo}
                            </button>
                          ))}
                          {dayEventos.length > 2 && (
                            <p className="text-xs text-[#666666] pl-1">+{dayEventos.length - 2}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#111111] rounded-xl border border-[#222222] overflow-hidden">
            <div className="divide-y divide-[#222222]">
              {eventosDoMes.map((evento) => (
                <div
                  key={evento.id}
                  className="p-4 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{evento.titulo}</h3>
                        <Badge variant={statusConfig[evento.status].color}>
                          {statusConfig[evento.status].label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-[#888888]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {formatDate(evento.data)}
                        </span>
                        {evento.horarioInicio && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {evento.horarioInicio} - {evento.horarioFim}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {evento.local}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {evento.cliente}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewEvento(evento)}
                        className="p-1.5 rounded-lg hover:bg-[#222222] transition-colors"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4 text-[#888888] hover:text-[#00ff88] transition-colors" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(evento)}
                        className="p-1.5 rounded-lg hover:bg-[#222222] transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-[#888888] hover:text-[#00ff88] transition-colors" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(evento.id)}
                        className="p-1.5 rounded-lg hover:bg-[#222222] transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-[#888888] hover:text-[#00ff88] transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {eventosDoMes.length === 0 && (
                <div className="p-8 text-center text-[#888888]">
                  Nenhum evento encontrado para este mês.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Detalhes do Evento"
        size="lg"
      >
        {viewingEvento && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{viewingEvento.titulo}</h3>
              <Badge variant={statusConfig[viewingEvento.status].color} className="mt-1">
                {statusConfig[viewingEvento.status].label}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-[#888888]">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-white">{formatDate(viewingEvento.data)}</span>
              </div>
              {viewingEvento.horarioInicio && (
                <div className="flex items-center gap-2 text-[#888888]">
                  <Clock className="w-4 h-4" />
                  <span className="text-white">{viewingEvento.horarioInicio} - {viewingEvento.horarioFim}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#888888]">
                <MapPin className="w-4 h-4" />
                <span className="text-white">{viewingEvento.local}</span>
              </div>
              <div className="flex items-center gap-2 text-[#888888]">
                <User className="w-4 h-4" />
                <span className="text-white">{viewingEvento.cliente}</span>
              </div>
            </div>
            {viewingEvento.descricao && (
              <div>
                <p className="text-sm text-[#888888] mb-1">Descrição</p>
                <p className="text-sm text-white">{viewingEvento.descricao}</p>
              </div>
            )}
            {viewingEvento.materiais && viewingEvento.materiais.length > 0 && (
              <div>
                <p className="text-sm text-[#888888] mb-1">Materiais</p>
                <div className="flex flex-wrap gap-2">
                  {viewingEvento.materiais.map((material, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#222222] rounded text-xs text-white">
                      <Package className="w-3 h-3 inline mr-1" />
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={handleCloseViewModal}>
                Fechar
              </Button>
              <Button onClick={() => {
                handleCloseViewModal();
                handleOpenModal(viewingEvento);
              }}>
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvento ? 'Editar Evento' : 'Novo Evento'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Nome do evento"
            required
            error={errors.titulo}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Data"
              name="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              error={errors.data}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'pendente', label: 'Pendente' },
                { value: 'confirmado', label: 'Confirmado' },
                { value: 'cancelado', label: 'Cancelado' },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Horário Início"
              name="horarioInicio"
              type="time"
              value={formData.horarioInicio}
              onChange={(e) => setFormData({ ...formData, horarioInicio: e.target.value })}
            />
            <Input
              label="Horário Fim"
              name="horarioFim"
              type="time"
              value={formData.horarioFim}
              onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })}
            />
          </div>
          <Input
            label="Local"
            name="local"
            value={formData.local}
            onChange={(e) => setFormData({ ...formData, local: e.target.value })}
            placeholder="Local do evento"
            required
            error={errors.local}
          />
          <Select
            label="Cliente"
            name="cliente"
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            options={[
              { value: '', label: 'Selecione...' },
              ...mockClientes.map((c) => ({ value: c.nome, label: c.nome })),
            ]}
            required
            error={errors.cliente}
          />
          <Textarea
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Informações adicionais..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit}>{editingEvento ? 'Salvar Alterações' : 'Cadastrar Evento'}</Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Excluir Evento"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
      />
    </Layout>
  );
}
