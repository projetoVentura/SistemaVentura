import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Select, Textarea } from '../../components/ui';
import { Plus, Edit, Trash2, FileText, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { orcamentos as mockOrcamentos } from '../../data/mockData';

const statusConfig = {
  rascunho: { label: 'Rascunho', color: 'default' },
  pendente: { label: 'Pendente', color: 'warning' },
  aprovado: { label: 'Aprovado', color: 'success' },
  recusado: { label: 'Recusado', color: 'danger' },
};

const pipelineStatuses = ['rascunho', 'pendente', 'aprovado', 'recusado'];

const emptyForm = {
  clienteId: '',
  titulo: '',
  valor: '',
  dataValidade: '',
  status: 'rascunho',
  descricao: '',
  itens: [],
};

export function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState(mockOrcamentos);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrcamento, setEditingOrcamento] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingOrcamento, setViewingOrcamento] = useState(null);

  const filteredOrcamentos =
    filterStatus === 'todos'
      ? orcamentos
      : orcamentos.filter((o) => o.status === filterStatus);

  const totalGeral = orcamentos.reduce((acc, o) => acc + o.valor, 0);
  const totalAprovado = orcamentos
    .filter((o) => o.status === 'aprovado')
    .reduce((acc, o) => acc + o.valor, 0);
  const totalPendente = orcamentos
    .filter((o) => o.status === 'pendente')
    .reduce((acc, o) => acc + o.valor, 0);

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    } catch (e) {
      return `R$ ${value}`;
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch (e) {
      return dateStr;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clienteId) newErrors.clienteId = 'Cliente é obrigatório';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    if (!formData.dataValidade) newErrors.dataValidade = 'Data de validade é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (orcamento = null) => {
    if (orcamento) {
      setEditingOrcamento(orcamento);
      setFormData({
        clienteId: orcamento.clienteId?.toString() || '',
        titulo: orcamento.titulo,
        valor: orcamento.valor.toString(),
        dataValidade: orcamento.dataValidade,
        status: orcamento.status,
        descricao: orcamento.descricao || '',
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

    if (editingOrcamento) {
      setOrcamentos((prev) =>
        prev.map((o) =>
          o.id === editingOrcamento.id ? { ...o, ...formData, valor: parseFloat(formData.valor) } : o
        )
      );
    } else {
      const newOrcamento = {
        id: Math.max(0, ...orcamentos.map((o) => o.id)) + 1,
        ...formData,
        valor: parseFloat(formData.valor),
        clienteId: formData.clienteId ? parseInt(formData.clienteId) : null,
      };
      setOrcamentos((prev) => [...prev, newOrcamento]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setOrcamentos((prev) => prev.filter((o) => o.id !== id));
    setConfirmDelete(null);
  };

  const handleViewDetails = (orcamento) => {
    setViewingOrcamento(orcamento);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingOrcamento(null);
  };

  const clienteOptions = [
    { value: '1', label: 'Ana Paula Ferreira' },
    { value: '2', label: 'Carlos Eduardo Santos' },
    { value: '3', label: 'Mariana Costa' },
  ];

  const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <Layout title="Orçamentos">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 border-b border-[#222222]">
          <button
            onClick={() => setFilterStatus('todos')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filterStatus === 'todos'
                ? 'text-[#00ff88] border-[#00ff88]'
                : 'text-[#888888] border-transparent hover:text-white'
            }`}
          >
            Todos
          </button>
          {pipelineStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filterStatus === status
                  ? 'text-[#00ff88] border-[#00ff88]'
                  : 'text-[#888888] border-transparent hover:text-white'
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] rounded-xl border border-[#222222] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <FileText className="w-5 h-5 text-[#00ff88]" />
            </div>
            <span className="text-sm text-[#888888]">Total Geral</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{formatCurrency(totalGeral)}</p>
        </div>
        <div className="bg-[#111111] rounded-xl border border-[#222222] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-[#888888]">Aprovado</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">{formatCurrency(totalAprovado)}</p>
        </div>
        <div className="bg-[#111111] rounded-xl border border-[#222222] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm text-[#888888]">Pendente</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPendente)}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Pipeline View */}
      {filterStatus === 'todos' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pipelineStatuses.map((status) => {
            const statusOrcamentos = orcamentos.filter((o) => o.status === status);
            return (
              <div key={status} className="bg-[#111111] rounded-xl p-4 border border-[#222222]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-white">
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
                      className="bg-[#1a1a1a] p-3 rounded-lg hover:border-[#00ff88] border border-transparent transition-all cursor-pointer"
                      onClick={() => handleViewDetails(orcamento)}
                    >
                      <p className="font-medium text-sm text-white mb-1">{orcamento.titulo}</p>
                      <p className="text-xs text-[#888888] mb-2">{orcamento.clienteNome}</p>
                      <p className="text-sm font-bold text-[#00ff88]">{formatCurrency(orcamento.valor)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrcamentos.map((orcamento) => (
            <div
              key={orcamento.id}
              className="bg-[#111111] rounded-xl border border-[#222222] p-5 hover:border-[#00ff88] transition-all relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{orcamento.titulo}</h3>
                  <p className="text-sm text-[#888888]">{orcamento.clienteNome}</p>
                </div>
                <Badge variant={statusConfig[orcamento.status].color}>
                  {statusConfig[orcamento.status].label}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-[#888888] mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#666666] flex-shrink-0" />
                  <span className="font-bold text-[#00ff88]">{formatCurrency(orcamento.valor)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#666666] flex-shrink-0" />
                  <span>Validade: {formatDate(orcamento.dataValidade)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
                <button
                  onClick={() => handleViewDetails(orcamento)}
                  className="text-sm text-[#00ff88] hover:underline"
                >
                  Ver detalhes
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(orcamento)}
                    className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-[#888888] hover:text-[#00ff88] transition-colors" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(orcamento.id)}
                    className="p-1.5 rounded-lg hover:bg-red-900/20 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-[#888888] hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredOrcamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#888888]">Nenhum orçamento encontrado.</p>
        </div>
      )}

      {/* Modal de Orçamento */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOrcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Cliente"
              name="clienteId"
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              options={clienteOptions}
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
              error={errors.dataValidade}
            />
          </div>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
          />
          <Textarea
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Informações adicionais sobre o orçamento..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {editingOrcamento ? 'Salvar Alterações' : 'Criar Orçamento'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Visualização */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Detalhes do Orçamento"
        size="lg"
      >
        {viewingOrcamento && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {viewingOrcamento.titulo}
              </h3>
              <Badge variant={statusConfig[viewingOrcamento.status].color}>
                {statusConfig[viewingOrcamento.status].label}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#666666]">Cliente</p>
                <p className="font-medium text-white">{viewingOrcamento.clienteNome}</p>
              </div>
              <div>
                <p className="text-[#666666]">Valor</p>
                <p className="font-medium text-[#00ff88]">
                  {formatCurrency(viewingOrcamento.valor)}
                </p>
              </div>
              <div>
                <p className="text-[#666666]">Validade</p>
                <p className="text-white">{formatDate(viewingOrcamento.dataValidade)}</p>
              </div>
              <div>
                <p className="text-[#666666]">Status</p>
                <p className="font-medium text-white">
                  {statusConfig[viewingOrcamento.status].label}
                </p>
              </div>
            </div>
            {viewingOrcamento.descricao && (
              <div>
                <p className="text-[#666666] text-sm mb-1">Descrição</p>
                <p className="text-sm text-[#888888]">{viewingOrcamento.descricao}</p>
              </div>
            )}
            {viewingOrcamento.itens && viewingOrcamento.itens.length > 0 && (
              <div>
                <p className="text-[#666666] text-sm mb-2">Itens</p>
                <div className="border border-[#222222] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-[#888888]">Equipamento</th>
                        <th className="text-center px-4 py-2 font-medium text-[#888888]">Qtd</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingOrcamento.itens.map((item, index) => (
                        <tr key={index} className="border-t border-[#222222]">
                          <td className="px-4 py-2 text-white">{item.nome}</td>
                          <td className="px-4 py-2 text-center text-white">{item.quantidade}</td>
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

      {/* Confirm Dialog */}
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
