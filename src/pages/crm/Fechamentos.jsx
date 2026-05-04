import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Select, Textarea } from '../../components/ui';
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { fechamentos as mockFechamentos } from '../../data/mockData';

const pagamentoConfig = {
  transferencia: { label: 'Transferência', color: 'info' },
  boleto: { label: 'Boleto', color: 'purple' },
  pix: { label: 'PIX', color: 'success' },
  dinheiro: { label: 'Dinheiro', color: 'warning' },
  cartao: { label: 'Cartão', color: 'default' },
};

const statusPagamentoConfig = {
  pago: { label: 'Pago', color: 'success' },
  pendente: { label: 'Pendente', color: 'warning' },
  parcelado: { label: 'Parcelado', color: 'info' },
  atrasado: { label: 'Atrasado', color: 'danger' },
};

const emptyForm = {
  orcamentoId: '',
  clienteNome: '',
  titulo: '',
  valor: '',
  dataFechamento: '',
  dataEvento: '',
  formaPagamento: '',
  statusPagamento: 'pendente',
  observacoes: '',
};

export function Fechamentos() {
  const [fechamentos, setFechamentos] = useState(mockFechamentos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFechamento, setEditingFechamento] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');

  const filteredFechamentos =
    filterStatus === 'todos'
      ? fechamentos
      : fechamentos.filter((f) => f.statusPagamento === filterStatus);

  const totalGeral = fechamentos.reduce((acc, f) => acc + f.valor, 0);
  const totalPago = fechamentos
    .filter((f) => f.statusPagamento === 'pago')
    .reduce((acc, f) => acc + f.valor, 0);
  const totalPendente = fechamentos
    .filter((f) => f.statusPagamento !== 'pago')
    .reduce((acc, f) => acc + f.valor, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clienteNome.trim()) newErrors.clienteNome = 'Nome do cliente é obrigatório';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    if (!formData.dataFechamento) newErrors.dataFechamento = 'Data de fechamento é obrigatória';
    if (!formData.formaPagamento) newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (fechamento = null) => {
    if (fechamento) {
      setEditingFechamento(fechamento);
      setFormData({
        orcamentoId: fechamento.orcamentoId?.toString() || '',
        clienteNome: fechamento.clienteNome,
        titulo: fechamento.titulo,
        valor: fechamento.valor.toString(),
        dataFechamento: fechamento.dataFechamento,
        dataEvento: fechamento.dataEvento || '',
        formaPagamento: fechamento.formaPagamento,
        statusPagamento: fechamento.statusPagamento,
        observacoes: fechamento.observacoes || '',
      });
    } else {
      setEditingFechamento(null);
      setFormData(emptyForm);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFechamento(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingFechamento) {
      setFechamentos((prev) =>
        prev.map((f) =>
          f.id === editingFechamento.id ? { ...f, ...formData, valor: parseFloat(formData.valor) } : f
        )
      );
    } else {
      const newFechamento = {
        id: Math.max(0, ...fechamentos.map((f) => f.id)) + 1,
        ...formData,
        valor: parseFloat(formData.valor),
        orcamentoId: formData.orcamentoId ? parseInt(formData.orcamentoId) : null,
      };
      setFechamentos((prev) => [...prev, newFechamento]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setFechamentos((prev) => prev.filter((f) => f.id !== id));
    setConfirmDelete(null);
  };

  const formaPagamentoOptions = Object.entries(pagamentoConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const statusPagamentoOptions = Object.entries(statusPagamentoConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <Layout title="Fechamentos">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">Total Geral</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGeral)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <span className="text-sm text-gray-500">Recebido</span>
          </div>
          <p className="text-2xl font-bold text-success-600">{formatCurrency(totalPago)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-warning-600" />
            </div>
            <span className="text-sm text-gray-500">Pendente</span>
          </div>
          <p className="text-2xl font-bold text-warning-600">{formatCurrency(totalPendente)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('todos')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'todos'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          {Object.entries(statusPagamentoConfig).map(([value, config]) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Fechamento
        </Button>
      </div>

      <div className="space-y-3">
        {filteredFechamentos.map((fechamento) => (
          <div
            key={fechamento.id}
            className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{fechamento.titulo}</h3>
                <Badge variant={statusPagamentoConfig[fechamento.statusPagamento].color}>
                  {statusPagamentoConfig[fechamento.statusPagamento].label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{fechamento.clienteNome}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Fechamento: {formatDate(fechamento.dataFechamento)}</span>
              </div>
              {fechamento.dataEvento && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Evento: {formatDate(fechamento.dataEvento)}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Badge variant={pagamentoConfig[fechamento.formaPagamento]?.color || 'default'}>
                  {pagamentoConfig[fechamento.formaPagamento]?.label || fechamento.formaPagamento}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary-600">
                  {formatCurrency(fechamento.valor)}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenModal(fechamento)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setConfirmDelete(fechamento.id)}
                  className="p-2 rounded-lg hover:bg-danger-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4 text-danger-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFechamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum fechamento encontrado.</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFechamento ? 'Editar Fechamento' : 'Novo Fechamento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cliente"
              name="clienteNome"
              value={formData.clienteNome}
              onChange={(e) => setFormData({ ...formData, clienteNome: e.target.value })}
              placeholder="Nome do cliente"
              required
              error={errors.clienteNome}
            />
            <Input
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Iluminação para casamento"
              required
              error={errors.titulo}
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
            <Input
              label="Data de Fechamento"
              name="dataFechamento"
              type="date"
              value={formData.dataFechamento}
              onChange={(e) => setFormData({ ...formData, dataFechamento: e.target.value })}
              required
              error={errors.dataFechamento}
            />
            <Input
              label="Data do Evento"
              name="dataEvento"
              type="date"
              value={formData.dataEvento}
              onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
            />
            <Select
              label="Forma de Pagamento"
              name="formaPagamento"
              value={formData.formaPagamento}
              onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
              options={formaPagamentoOptions}
              required
              error={errors.formaPagamento}
            />
            <Select
              label="Status do Pagamento"
              name="statusPagamento"
              value={formData.statusPagamento}
              onChange={(e) => setFormData({ ...formData, statusPagamento: e.target.value })}
              options={statusPagamentoOptions}
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
              {editingFechamento ? 'Salvar Alterações' : 'Registrar Fechamento'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Excluir Fechamento"
        message="Tem certeza que deseja excluir este fechamento? Esta ação não pode ser desfeita."
      />
    </Layout>
  );
}
