import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Textarea, Select } from '../../components/ui';
import { Plus, Edit, Trash2, Eye, ArrowRight } from 'lucide-react';
import { orcamentos as mockOrcamentos, clientes as mockClientes } from '../../data/mockData';

const statusConfig = {
  rascunho: { label: 'Rascunho', color: 'default', order: 0 },
  pendente: { label: 'Pendente', color: 'warning', order: 1 },
  aprovado: { label: 'Aprovado', color: 'success', order: 2 },
  recusado: { label: 'Recusado', color: 'danger', order: 3 },
};

const emptyForm = {
  clienteId: '',
  titulo: '',
  descricao: '',
  valor: '',
  status: 'rascunho',
  dataValidade: '',
  itens: [],
};

export function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState(mockOrcamentos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOrcamento, setEditingOrcamento] = useState(null);
  const [viewingOrcamento, setViewingOrcamento] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');

  const filteredOrcamentos =
    filterStatus === 'todos'
      ? orcamentos
      : orcamentos.filter((o) => o.status === filterStatus);

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
    if (!formData.clienteId) newErrors.clienteId = 'Selecione um cliente';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (orcamento = null) => {
    if (orcamento) {
      setEditingOrcamento(orcamento);
      setFormData({
        clienteId: orcamento.clienteId.toString(),
        titulo: orcamento.titulo,
        descricao: orcamento.descricao || '',
        valor: orcamento.valor.toString(),
        status: orcamento.status,
        dataValidade: orcamento.dataValidade || '',
        itens: orcamento.itens || [],
      });
    } else {
      setEditingOrcamento(null);
      setFormData(emptyForm);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrcamento(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cliente = mockClientes.find((c) => c.id === parseInt(formData.clienteId));

    if (editingOrcamento) {
      setOrcamentos((prev) =>
        prev.map((o) =>
          o.id === editingOrcamento.id
            ? {
                ...o,
                clienteId: parseInt(formData.clienteId),
                clienteNome: cliente?.nome || o.clienteNome,
                titulo: formData.titulo,
                descricao: formData.descricao,
                valor: parseFloat(formData.valor),
                status: formData.status,
                dataValidade: formData.dataValidade,
                itens: formData.itens,
              }
            : o
        )
      );
    } else {
      const newOrcamento = {
        id: Math.max(...orcamentos.map((o) => o.id)) + 1,
        clienteId: parseInt(formData.clienteId),
        clienteNome: cliente?.nome || '',
        titulo: formData.titulo,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        status: formData.status,
        dataCriacao: new Date().toISOString().split('T')[0],
        dataValidade: formData.dataValidade,
        itens: formData.itens,
      };
      setOrcamentos((prev) => [...prev, newOrcamento]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setOrcamentos((prev) => prev.filter((o) => o.id !== id));
    setConfirmDelete(null);
  };

  const handleChangeStatus = (id, newStatus) => {
    setOrcamentos((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const clientOptions = mockClientes
    .filter((c) => c.status === 'ativo')
    .map((c) => ({ value: c.id.toString(), label: c.nome }));

  const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const pipelineStatuses = ['rascunho', 'pendente', 'aprovado', 'recusado'];

  return (
    <Layout title="Orçamentos">
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
          {pipelineStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {filterStatus === 'todos' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pipelineStatuses.map((status) => {
            const statusOrcamentos = orcamentos.filter((o) => o.status === status);
            return (
              <div key={status} className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-700">
                    {statusConfig[status].label}
                  </h3>
                  <Badge variant={statusConfig[status].color}>
                    {statusOrcamentos.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {statusOrcamentos.map((orcamento) => (
                    <div
                      key={orcamento.id}
                      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-sm text-gray-900 mb-1">
                        {orcamento.titulo}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">{orcamento.clienteNome}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-600">
                          {formatCurrency(orcamento.valor)}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setViewingOrcamento(orcamento);
                              setIsViewModalOpen(true);
                            }}
                            className="p-1 rounded hover:bg-gray-100"
                            title="Visualizar"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(orcamento)}
                            className="p-1 rounded hover:bg-gray-100"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(orcamento.id)}
                            className="p-1 rounded hover:bg-danger-50"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-danger-500" />
                          </button>
                        </div>
                      </div>
                      {status !== 'recusado' && status !== 'aprovado' && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <select
                            value={orcamento.status}
                            onChange={(e) => handleChangeStatus(orcamento.id, e.target.value)}
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            {pipelineStatuses.map((s) => (
                              <option key={s} value={s}>
                                → {statusConfig[s].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrcamentos.map((orcamento) => (
            <div
              key={orcamento.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{orcamento.titulo}</h3>
                  <Badge variant={statusConfig[orcamento.status].color}>
                    {statusConfig[orcamento.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{orcamento.clienteNome}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary-600">
                    {formatCurrency(orcamento.valor)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Válido até {formatDate(orcamento.dataValidade)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setViewingOrcamento(orcamento);
                      setIsViewModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(orcamento)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(orcamento.id)}
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
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOrcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Cliente"
              name="clienteId"
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              options={clientOptions}
              required
              error={errors.clienteId}
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
              label="Data de Validade"
              name="dataValidade"
              type="date"
              value={formData.dataValidade}
              onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
              required
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
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva o orçamento..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingOrcamento ? 'Salvar Alterações' : 'Criar Orçamento'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingOrcamento(null);
        }}
        title="Detalhes do Orçamento"
        size="lg"
      >
        {viewingOrcamento && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {viewingOrcamento.titulo}
              </h3>
              <Badge variant={statusConfig[viewingOrcamento.status].color}>
                {statusConfig[viewingOrcamento.status].label}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Cliente</p>
                <p className="font-medium">{viewingOrcamento.clienteNome}</p>
              </div>
              <div>
                <p className="text-gray-500">Valor</p>
                <p className="font-medium text-primary-600">
                  {formatCurrency(viewingOrcamento.valor)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Data de Criação</p>
                <p className="font-medium">{formatDate(viewingOrcamento.dataCriacao)}</p>
              </div>
              <div>
                <p className="text-gray-500">Validade</p>
                <p className="font-medium">{formatDate(viewingOrcamento.dataValidade)}</p>
              </div>
            </div>
            {viewingOrcamento.descricao && (
              <div>
                <p className="text-gray-500 text-sm mb-1">Descrição</p>
                <p className="text-sm text-gray-700">{viewingOrcamento.descricao}</p>
              </div>
            )}
            {viewingOrcamento.itens && viewingOrcamento.itens.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm mb-2">Itens</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-gray-600">Equipamento</th>
                        <th className="text-center px-4 py-2 font-medium text-gray-600">Qtd</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingOrcamento.itens.map((item, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-4 py-2">{item.nome}</td>
                          <td className="px-4 py-2 text-center">{item.quantidade}</td>
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
        title="Excluir Orçamento"
        message="Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita."
      />
    </Layout>
  );
}
