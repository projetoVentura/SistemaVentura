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
    setSelectedDate(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const equipeList = formData.equipe
      ? formData.equipe.split(',').map((n) => n.trim()).filter((n) => n)
      : [];

    if (editingEvento) {
      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === editingEvento.id
            ? { ...ev, ...formData, equipe: equipeList }
            : ev
        )
      );
    } else {
      const newEvento = {
        id: Math.max(0, ...eventos.map((e) => e.id)) + 1,
        ...formData,
        equipe: equipeList,
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
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    handleOpenModal();
  };

  const clientOptions = mockClientes
    .filter((c) => c.status === 'ativo')
    .map((c) => ({ value: c.nome, label: c.nome }));

  const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const eventosDoMes = eventos.filter((e) => {
    const [y, m] = e.data.split('-').map(Number);
    return y === year && m === month + 1;
  }).sort((a, b) => a.data.localeCompare(b.data));

  return (
    <Layout title="Calendário de Eventos">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold text-text-primary min-w-[180px] text-center">
            {meses[month]} {year}
          </h3>
          <Button variant="secondary" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-accent text-bg-main'
                  : 'bg-bg-card text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent text-bg-main'
                  : 'bg-bg-card text-text-secondary hover:bg-bg-elevated'
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
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="py-3 text-center text-sm font-medium text-text-secondary"
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
                  className={`min-h-[100px] border-b border-r border-border p-2 ${
                    day ? 'cursor-pointer hover:bg-bg-elevated' : 'bg-bg-main'
                  } ${isToday(day) ? 'bg-accent-light' : ''}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day && (
                    <>
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                          isToday(day)
                            ? 'bg-accent text-bg-main font-semibold'
                            : 'text-text-primary'
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
                              setViewingEvento(evento);
                              setIsViewModalOpen(true);
                            }}
                            className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate font-medium ${
                              evento.status === 'confirmado'
                                ? 'bg-success-950 text-success-400 border border-success-700'
                                : evento.status === 'pendente'
                                ? 'bg-warning-950 text-warning-400 border border-warning-700'
                                : 'bg-danger-950 text-danger-400 border border-danger-700'
                            }`}
                          >
                            {evento.titulo}
                          </button>
                        ))}
                        {dayEventos.length > 2 && (
                          <p className="text-xs text-text-muted pl-1">
                            +{dayEventos.length - 2} mais
                          </p>
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
        <div className="space-y-3">
          {eventosDoMes.length === 0 && (
            <div className="text-center py-12 bg-bg-card rounded-xl border border-border">
              <CalendarIcon className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">Nenhum evento neste mês.</p>
            </div>
          )}
          {eventosDoMes.map((evento) => (
            <div
              key={evento.id}
              className="bg-bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-text-primary">{evento.titulo}</h3>
                    <Badge variant={statusConfig[evento.status].color}>
                      {statusConfig[evento.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{evento.descricao}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-text-muted" />
                      <span>{formatDate(evento.data)}</span>
                      {evento.dataFim && <span> até {formatDate(evento.dataFim)}</span>}
                    </div>
                    {evento.horarioInicio && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-text-muted" />
                        <span>
                          {evento.horarioInicio} - {evento.horarioFim}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      <span>{evento.local}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-text-muted" />
                      <span>{evento.cliente}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => {
                      setViewingEvento(evento);
                      setIsViewModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(evento)}
                    className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(evento.id)}
                    className="p-2 rounded-lg hover:bg-danger-950 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-danger-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvento ? 'Editar Evento' : 'Novo Evento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título do Evento"
            name="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ex: Casamento Silva & Oliveira"
            required
            error={errors.titulo}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Cliente"
              name="cliente"
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              options={clientOptions}
              required
              error={errors.cliente}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Data do Evento"
              name="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              error={errors.data}
            />
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
            placeholder="Endereço do evento"
            required
            error={errors.local}
          />
          <Textarea
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Detalhes do evento..."
          />
          <Input
            label="Equipe (separado por vírgula)"
            name="equipe"
            value={formData.equipe}
            onChange={(e) => setFormData({ ...formData, equipe: e.target.value })}
            placeholder="João Silva, Maria Santos, Pedro Costa"
          />

          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Materiais do Evento
            </h4>
            {formData.materiais.map((material, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={material.nome}
                  onChange={(e) => {
                    const newMateriais = [...formData.materiais];
                    newMateriais[index].nome = e.target.value;
                    setFormData({ ...formData, materiais: newMateriais });
                  }}
                  placeholder="Nome do equipamento"
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="number"
                  value={material.quantidade}
                  onChange={(e) => {
                    const newMateriais = [...formData.materiais];
                    newMateriais[index].quantidade = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, materiais: newMateriais });
                  }}
                  placeholder="Qtd"
                  className="w-20 px-3 py-2 border border-border rounded-lg text-sm bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newMateriais = formData.materiais.filter((_, i) => i !== index);
                    setFormData({ ...formData, materiais: newMateriais });
                  }}
                  className="p-2 rounded-lg hover:bg-danger-950 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-danger-400" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setFormData({
                  ...formData,
                  materiais: [...formData.materiais, { nome: '', quantidade: 1 }],
                })
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Material
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingEvento ? 'Salvar Alterações' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingEvento(null);
        }}
        title="Detalhes do Evento"
        size="lg"
      >
        {viewingEvento && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                {viewingEvento.titulo}
              </h3>
              <Badge variant={statusConfig[viewingEvento.status].color}>
                {statusConfig[viewingEvento.status].label}
              </Badge>
            </div>

            {viewingEvento.descricao && (
              <p className="text-sm text-text-secondary">{viewingEvento.descricao}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted mb-1 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  Data
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(viewingEvento.data)}
                  {viewingEvento.dataFim && (
                    <span> até {formatDate(viewingEvento.dataFim)}</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Horário
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {viewingEvento.horarioInicio} - {viewingEvento.horarioFim}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Local
                </p>
                <p className="text-sm font-medium text-text-primary">{viewingEvento.local}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Cliente
                </p>
                <p className="text-sm font-medium text-text-primary">{viewingEvento.cliente}</p>
              </div>
            </div>

            {viewingEvento.equipe && viewingEvento.equipe.length > 0 && (
              <div>
                <p className="text-sm text-text-muted mb-2">Equipe</p>
                <div className="flex flex-wrap gap-2">
                  {viewingEvento.equipe.map((membro, index) => (
                    <Badge key={index} variant="info">
                      {membro}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {viewingEvento.materiais && viewingEvento.materiais.length > 0 && (
              <div>
                <p className="text-sm text-text-muted mb-2">Materiais</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-main">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-text-secondary">
                          Equipamento
                        </th>
                        <th className="text-center px-4 py-2 font-medium text-text-secondary">
                          Quantidade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingEvento.materiais.map((item, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="px-4 py-2 text-text-primary">{item.nome}</td>
                          <td className="px-4 py-2 text-center text-text-primary">{item.quantidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

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
