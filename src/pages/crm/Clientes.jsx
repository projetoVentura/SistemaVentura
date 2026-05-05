import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, ConfirmDialog, Textarea } from '../../components/ui';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Users } from 'lucide-react';
import { clientes as mockClientes } from '../../data/mockData';

const emptyForm = {
  nome: '',
  empresa: '',
  email: '',
  telefone: '',
  endereco: '',
  observacoes: '',
  status: 'ativo',
};

export function Clientes() {
  const [clientes, setClientes] = useState(mockClientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClientes = clientes.length;
  const clientesAtivos = clientes.filter((c) => c.status === 'ativo').length;
  const novosEsteMes = clientes.filter((c) => {
    const data = new Date(c.dataCadastro);
    const agora = new Date();
    return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
  }).length;
  const clientesInativos = clientes.filter((c) => c.status === 'inativo').length;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        nome: cliente.nome,
        empresa: cliente.empresa || '',
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco || '',
        observacoes: cliente.observacoes || '',
        status: cliente.status,
      });
    } else {
      setEditingCliente(null);
      setFormData(emptyForm);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCliente) {
      setClientes((prev) =>
        prev.map((c) => (c.id === editingCliente.id ? { ...c, ...formData } : c))
      );
    } else {
      const newCliente = {
        id: Math.max(...clientes.map((c) => c.id)) + 1,
        ...formData,
        dataCadastro: new Date().toISOString().split('T')[0],
      };
      setClientes((prev) => [...prev, newCliente]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className="px-[30px] py-[30px]">
        {/* Cabeçalho próprio */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Clientes</h1>
          <p className="text-sm text-[#888888]">Gerencie seus clientes e leads</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#00ff88]" />
              <p className="text-xs text-[#888888] uppercase tracking-wider">Total de Clientes</p>
            </div>
            <p className="text-xl font-bold text-white">{totalClientes}</p>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#00ff88]" />
              <p className="text-xs text-[#888888] uppercase tracking-wider">Clientes Ativos</p>
            </div>
            <p className="text-xl font-bold text-white">{clientesAtivos}</p>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#00ff88]" />
              <p className="text-xs text-[#888888] uppercase tracking-wider">Novos este Mês</p>
            </div>
            <p className="text-xl font-bold text-white">{novosEsteMes}</p>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#666666]" />
              <p className="text-xs text-[#888888] uppercase tracking-wider">Clientes Inativos</p>
            </div>
            <p className="text-xl font-bold text-[#888888]">{clientesInativos}</p>
          </div>
        </div>

        {/* Ações e Busca */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <Button onClick={() => handleOpenModal()} className="bg-[#00ff88] hover:bg-[#00cc70] text-black flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#222222] rounded-lg text-sm bg-[#111111] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-[#00ff88]"
            />
          </div>
        </div>

        {/* Grade de Clientes */}
        <div className="grid grid-cols-3 gap-5">
          {filteredClientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-[#111111] rounded-xl border border-[#222222] p-5 hover:border-[#00ff88] transition-all relative min-h-[200px]"
            >
              {/* Status no canto superior direito */}
              <div className="absolute top-5 right-5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cliente.status === 'ativo'
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30'
                    : 'bg-[#222222] text-[#888888] border border-[#333333]'
                }`}>
                  {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="mb-3 pr-20">
                <h3 className="font-semibold text-white">{cliente.nome}</h3>
                {cliente.empresa && (
                  <p className="text-sm text-[#888888]">{cliente.empresa}</p>
                )}
              </div>

              <div className="space-y-2 text-sm text-[#888888] mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#666666] flex-shrink-0" />
                  <span className="truncate text-white">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#666666] flex-shrink-0" />
                  <span className="text-white">{cliente.telefone}</span>
                </div>
                {cliente.endereco && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#666666] flex-shrink-0" />
                    <span className="truncate text-[#888888]">{cliente.endereco}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
                <span className="text-xs text-[#666666]">
                  Cadastro: {formatDate(cliente.dataCadastro)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(cliente)}
                    className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-[#888888] hover:text-[#00ff88] transition-colors" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(cliente.id)}
                    className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-[#888888] hover:text-[#00ff88] transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888]">Nenhum cliente encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal de Cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome completo"
              required
              error={errors.nome}
            />
            <Input
              label="Empresa"
              name="empresa"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              placeholder="Nome da empresa (opcional)"
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
              required
              error={errors.email}
            />
            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
              required
              error={errors.telefone}
            />
          </div>
          <Input
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            placeholder="Endereço completo (opcional)"
          />
          <Textarea
            label="Observações"
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Informações adicionais sobre o cliente"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit}>{editingCliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
      />
    </Layout>
  );
}
