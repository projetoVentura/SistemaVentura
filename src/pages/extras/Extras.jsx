import { useState, useRef, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button, Input, Modal, Badge, ConfirmDialog, Select, Textarea } from '../../components/ui';
import {
  MessageCircle,
  Upload,
  Filter,
  Send,
  Phone,
  Search,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Copy,
  Clock,
  User,
  Tag,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Edit,
} from 'lucide-react';
import { conversasWhatsApp, templatesWhatsApp, clientes, orcamentos, equipamentos } from '../../data/mockData';

const emptyClienteForm = {
  nome: '',
  email: '',
  telefone: '',
  empresa: '',
};

export function Extras() {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const messagesEndRef = useRef(null);

  // WhatsApp state
  const [conversas, setConversas] = useState(conversasWhatsApp);
  const [selectedConversa, setSelectedConversa] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  // CSV Import state
  const [importType, setImportType] = useState('clientes');
  const [importData, setImportData] = useState(null);
  const [importColumns, setImportColumns] = useState([]);
  const [importStep, setImportStep] = useState('upload');
  const [importSuccess, setImportSuccess] = useState(false);

  // Advanced Filters state
  const [filterCliente, setFilterCliente] = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');
  const [filterValorMin, setFilterValorMin] = useState('');
  const [filterValorMax, setFilterValorMax] = useState('');
  const [filterOrcamentoStatus, setFilterOrcamentoStatus] = useState('');
  const [filterEquipCategoria, setFilterEquipCategoria] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilterResults, setActiveFilterResults] = useState(null);

  // New client from WhatsApp
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState(emptyClienteForm);

  // Format helpers
  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatMessageTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // WhatsApp handlers
  const handleSelectConversa = (conversa) => {
    setSelectedConversa(conversa.id === selectedConversa?.id ? null : conversa);
    if (conversa.naoLidas > 0) {
      setConversas((prev) =>
        prev.map((c) => (c.id === conversa.id ? { ...c, naoLidas: 0 } : c))
      );
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversa) return;

    const newMsg = {
      id: Date.now(),
      de: 'sistema',
      texto: messageInput,
      data: new Date().toISOString(),
    };

    setConversas((prev) =>
      prev.map((c) =>
        c.id === selectedConversa.id
          ? {
              ...c,
              mensagens: [...c.mensagens, newMsg],
              ultimaMensagem: messageInput,
              dataUltimaMensagem: new Date().toISOString(),
            }
          : c
      )
    );

    setSelectedConversa((prev) => ({
      ...prev,
      mensagens: [...prev.mensagens, newMsg],
      ultimaMensagem: messageInput,
    }));

    setMessageInput('');
  };

  const handleTemplateClick = (template) => {
    setMessageInput(template.texto);
    setShowTemplates(false);
  };

  const handleSendWhatsApp = () => {
    if (!selectedConversa) return;
    const phone = selectedConversa.telefone.replace(/\D/g, '');
    const text = encodeURIComponent(messageInput);
    window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
  };

  const handleOpenNewClient = () => {
    if (selectedConversa) {
      setNewClientForm({
        nome: selectedConversa.contato,
        email: '',
        telefone: selectedConversa.telefone,
        empresa: '',
      });
    }
    setIsNewClientModalOpen(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversa?.mensagens?.length]);

  // CSV Import handlers
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter((l) => l.trim());
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      });

      setImportColumns(headers);
      setImportData(data);
      setImportStep('preview');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setImportStep('success');
    setImportSuccess(true);
  };

  const resetImport = () => {
    setImportData(null);
    setImportColumns([]);
    setImportStep('upload');
    setImportSuccess(false);
  };

  const generateSampleCSV = () => {
    let csv = '';
    if (importType === 'clientes') {
      csv = 'nome,email,telefone,empresa\n';
      csv += '"Novo Cliente","novo@email.com","(11) 90000-0000","Empresa Exemplo"\n';
      csv += '"Outro Cliente","outro@email.com","(21) 90000-0000","Outra Empresa"\n';
    } else if (importType === 'equipamentos') {
      csv = 'nome,categoria,quantidadeTotal,valorUnitario,localizacao\n';
      csv += '"Moving Head 230W","iluminacao",10,150.00,"Galpão A"\n';
      csv += '"Caixa de Som 15","som",5,120.00,"Galpão C"\n';
    } else {
      csv = 'titulo,descricao,valor,status,dataValidade\n';
      csv += '"Orçamento Teste","Descrição do serviço",5000.00,"pendente","2026-12-31"\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelo_${importType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Advanced Filters handlers
  const runAdvancedFilters = () => {
    let filteredClientes = [...clientes];
    let filteredOrcamentos = [...orcamentos];
    let filteredEquipamentos = [...equipamentos];

    if (filterCliente) {
      const lower = filterCliente.toLowerCase();
      filteredClientes = filteredClientes.filter(
        (c) =>
          c.nome.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower) ||
          c.empresa.toLowerCase().includes(lower)
      );
      filteredOrcamentos = filteredOrcamentos.filter((o) =>
        o.clienteNome.toLowerCase().includes(lower)
      );
    }

    if (filterDataInicio) {
      filteredOrcamentos = filteredOrcamentos.filter((o) => o.dataCriacao >= filterDataInicio);
    }
    if (filterDataFim) {
      filteredOrcamentos = filteredOrcamentos.filter((o) => o.dataCriacao <= filterDataFim);
    }

    if (filterValorMin) {
      const min = parseFloat(filterValorMin);
      filteredOrcamentos = filteredOrcamentos.filter((o) => o.valor >= min);
      filteredEquipamentos = filteredEquipamentos.filter((e) => e.valorUnitario >= min);
    }
    if (filterValorMax) {
      const max = parseFloat(filterValorMax);
      filteredOrcamentos = filteredOrcamentos.filter((o) => o.valor <= max);
      filteredEquipamentos = filteredEquipamentos.filter((e) => e.valorUnitario <= max);
    }

    if (filterOrcamentoStatus) {
      filteredOrcamentos = filteredOrcamentos.filter((o) => o.status === filterOrcamentoStatus);
    }

    if (filterEquipCategoria) {
      filteredEquipamentos = filteredEquipamentos.filter((e) => e.categoria === filterEquipCategoria);
    }

    setActiveFilterResults({
      clientes: filteredClientes,
      orcamentos: filteredOrcamentos,
      equipamentos: filteredEquipamentos,
    });
  };

  const clearFilters = () => {
    setFilterCliente('');
    setFilterDataInicio('');
    setFilterDataFim('');
    setFilterValorMin('');
    setFilterValorMax('');
    setFilterOrcamentoStatus('');
    setFilterEquipCategoria('');
    setActiveFilterResults(null);
  };

  const sortedConversas = [...conversas].sort(
    (a, b) => new Date(b.dataUltimaMensagem) - new Date(a.dataUltimaMensagem)
  );

  const totalNaoLidas = conversas.reduce((acc, c) => acc + c.naoLidas, 0);

  return (
    <Layout title="Extras">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'whatsapp'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
          {totalNaoLidas > 0 && (
            <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {totalNaoLidas}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('importar')}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'importar'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Importar Planilha
        </button>
        <button
          onClick={() => setActiveTab('filtros')}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'filtros'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros Avançados
        </button>
      </div>

      {/* WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="flex gap-0 h-[calc(100vh-280px)] min-h-[500px] bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Conversation List */}
          <div className={`w-full ${selectedConversa ? 'hidden md:block md:w-80' : 'w-full'} border-r border-gray-200 flex flex-col`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Conversas</h3>
                <Button size="sm" onClick={handleOpenNewClient}>
                  <Plus className="w-4 h-4 mr-1" />
                  Novo Contato
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {sortedConversas.map((conversa) => (
                <button
                  key={conversa.id}
                  onClick={() => handleSelectConversa(conversa)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedConversa?.id === conversa.id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {conversa.contato.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {conversa.contato}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatDate(conversa.dataUltimaMensagem)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conversa.ultimaMensagem}
                      </p>
                    </div>
                    {conversa.naoLidas > 0 && (
                      <span className="bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {conversa.naoLidas}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversa ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="md:hidden p-1 rounded hover:bg-gray-200"
                    onClick={() => setSelectedConversa(null)}
                  >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
                    {selectedConversa.contato.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{selectedConversa.contato}</p>
                    <p className="text-xs text-gray-500">{selectedConversa.telefone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="success" onClick={handleSendWhatsApp}>
                    <Phone className="w-4 h-4 mr-1" />
                    Abrir WhatsApp
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
                {selectedConversa.mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.de === 'sistema' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.de === 'sistema'
                          ? 'bg-green-600 text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.texto}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.de === 'sistema' ? 'text-green-100' : 'text-gray-400'
                        } text-right`}
                      >
                        {formatMessageTime(msg.data)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {/* Templates */}
                {showTemplates && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Modelos de Mensagem</p>
                    <div className="space-y-2">
                      {templatesWhatsApp.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateClick(template)}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <p className="text-xs font-medium text-gray-700">{template.nome}</p>
                          <p className="text-xs text-gray-400 truncate">{template.texto}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                    title="Modelos de mensagem"
                  >
                    <Tag className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Selecione uma conversa para começar</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'importar' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary-600" />
              Importar Dados
            </h3>

            {/* Import Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Importação
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'clientes', label: 'Clientes', icon: User },
                  { value: 'equipamentos', label: 'Equipamentos', icon: Tag },
                  { value: 'orcamentos', label: 'Orçamentos', icon: FileSpreadsheet },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setImportType(type.value);
                      resetImport();
                    }}
                    className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      importType === type.value
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {importStep === 'upload' && (
              <>
                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Clique ou arraste o arquivo CSV
                  </p>
                  <p className="text-xs text-gray-400">Apenas arquivos .csv são aceitos</p>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Download Template */}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">Não tem um arquivo?</p>
                  <button
                    onClick={generateSampleCSV}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Baixar modelo CSV
                  </button>
                </div>
              </>
            )}

            {importStep === 'preview' && importData && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>{importData.length}</strong> registros encontrados
                  </p>
                  <button
                    onClick={resetImport}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Trocar arquivo
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {importColumns.map((col) => (
                          <th
                            key={col}
                            className="text-left px-4 py-2 font-medium text-gray-600 border-b"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importData.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          {importColumns.map((col) => (
                            <td key={col} className="px-4 py-2 text-gray-700">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {importData.length > 5 && (
                  <p className="text-xs text-gray-400 text-center mb-4">
                    Mostrando 5 de {importData.length} registros
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={resetImport}>
                    Cancelar
                  </Button>
                  <Button onClick={handleImport}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar {importData.length} Registros
                  </Button>
                </div>
              </>
            )}

            {importStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Importação Concluída!</h4>
                <p className="text-sm text-gray-500 mb-6">
                  {importData?.length} registros foram importados com sucesso.
                </p>
                <Button onClick={resetImport}>Importar Novamente</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Filters Tab */}
      {activeTab === 'filtros' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary-600" />
                Filtros Avançados
              </h3>
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-6 space-y-4">
                {/* Basic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Buscar por Cliente"
                    name="filterCliente"
                    value={filterCliente}
                    onChange={(e) => setFilterCliente(e.target.value)}
                    placeholder="Nome, e-mail ou empresa..."
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Data Início"
                      name="filterDataInicio"
                      type="date"
                      value={filterDataInicio}
                      onChange={(e) => setFilterDataInicio(e.target.value)}
                    />
                    <Input
                      label="Data Fim"
                      name="filterDataFim"
                      type="date"
                      value={filterDataFim}
                      onChange={(e) => setFilterDataFim(e.target.value)}
                    />
                  </div>
                </div>

                {/* Advanced */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Valor Mínimo (R$)"
                    name="filterValorMin"
                    type="number"
                    value={filterValorMin}
                    onChange={(e) => setFilterValorMin(e.target.value)}
                    placeholder="0.00"
                  />
                  <Input
                    label="Valor Máximo (R$)"
                    name="filterValorMax"
                    type="number"
                    value={filterValorMax}
                    onChange={(e) => setFilterValorMax(e.target.value)}
                    placeholder="0.00"
                  />
                  <Select
                    label="Status Orçamento"
                    name="filterOrcamentoStatus"
                    value={filterOrcamentoStatus}
                    onChange={(e) => setFilterOrcamentoStatus(e.target.value)}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'rascunho', label: 'Rascunho' },
                      { value: 'pendente', label: 'Pendente' },
                      { value: 'aprovado', label: 'Aprovado' },
                      { value: 'recusado', label: 'Recusado' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Categoria Equipamento"
                    name="filterEquipCategoria"
                    value={filterEquipCategoria}
                    onChange={(e) => setFilterEquipCategoria(e.target.value)}
                    options={[
                      { value: '', label: 'Todas' },
                      { value: 'iluminacao', label: 'Iluminação' },
                      { value: 'som', label: 'Som' },
                      { value: 'efeitos', label: 'Efeitos' },
                    ]}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="secondary" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                  <Button onClick={runAdvancedFilters}>
                    <Filter className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {activeFilterResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Resultados</h3>
                <Badge variant="info">
                  {activeFilterResults.clientes.length} clientes,{' '}
                  {activeFilterResults.orcamentos.length} orçamentos,{' '}
                  {activeFilterResults.equipamentos.length} equipamentos
                </Badge>
              </div>

              {/* Clientes */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  Clientes ({activeFilterResults.clientes.length})
                </h4>
                {activeFilterResults.clientes.length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhum cliente encontrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Nome</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Empresa</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">E-mail</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Telefone</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeFilterResults.clientes.map((c) => (
                          <tr key={c.id} className="border-t border-gray-100">
                            <td className="px-4 py-2 font-medium">{c.nome}</td>
                            <td className="px-4 py-2 text-gray-500">{c.empresa || '-'}</td>
                            <td className="px-4 py-2 text-gray-500">{c.email}</td>
                            <td className="px-4 py-2 text-gray-500">{c.telefone}</td>
                            <td className="px-4 py-2">
                              <Badge variant={c.status === 'ativo' ? 'success' : 'default'}>
                                {c.status === 'ativo' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Orçamentos */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-primary-600" />
                  Orçamentos ({activeFilterResults.orcamentos.length})
                </h4>
                {activeFilterResults.orcamentos.length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhum orçamento encontrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Título</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Cliente</th>
                          <th className="text-right px-4 py-2 font-medium text-gray-600">Valor</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeFilterResults.orcamentos.map((o) => (
                          <tr key={o.id} className="border-t border-gray-100">
                            <td className="px-4 py-2 font-medium">{o.titulo}</td>
                            <td className="px-4 py-2 text-gray-500">{o.clienteNome}</td>
                            <td className="px-4 py-2 text-right font-medium">
                              {formatCurrency(o.valor)}
                            </td>
                            <td className="px-4 py-2">
                              <Badge
                                variant={
                                  o.status === 'aprovado'
                                    ? 'success'
                                    : o.status === 'pendente'
                                    ? 'warning'
                                    : o.status === 'recusado'
                                    ? 'danger'
                                    : 'default'
                                }
                              >
                                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-gray-500">{formatDate(o.dataCriacao)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Equipamentos */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary-600" />
                  Equipamentos ({activeFilterResults.equipamentos.length})
                </h4>
                {activeFilterResults.equipamentos.length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhum equipamento encontrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Nome</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Categoria</th>
                          <th className="text-center px-4 py-2 font-medium text-gray-600">Total</th>
                          <th className="text-center px-4 py-2 font-medium text-gray-600">Disponível</th>
                          <th className="text-right px-4 py-2 font-medium text-gray-600">Valor/Dia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeFilterResults.equipamentos.map((e) => (
                          <tr key={e.id} className="border-t border-gray-100">
                            <td className="px-4 py-2 font-medium">{e.nome}</td>
                            <td className="px-4 py-2 text-gray-500">{e.categoria}</td>
                            <td className="px-4 py-2 text-center">{e.quantidadeTotal}</td>
                            <td className="px-4 py-2 text-center">
                              <span
                                className={`font-medium ${
                                  e.quantidadeDisponivel === 0
                                    ? 'text-danger-600'
                                    : e.quantidadeDisponivel < e.quantidadeTotal * 0.3
                                    ? 'text-warning-600'
                                    : 'text-success-600'
                                }`}
                              >
                                {e.quantidadeDisponivel}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">{formatCurrency(e.valorUnitario)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Client Modal */}
      <Modal
        isOpen={isNewClientModalOpen}
        onClose={() => {
          setIsNewClientModalOpen(false);
          setNewClientForm(emptyClienteForm);
        }}
        title="Novo Contato"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            name="nome"
            value={newClientForm.nome}
            onChange={(e) => setNewClientForm({ ...newClientForm, nome: e.target.value })}
            placeholder="Nome do contato"
          />
          <Input
            label="Telefone"
            name="telefone"
            value={newClientForm.telefone}
            onChange={(e) => setNewClientForm({ ...newClientForm, telefone: e.target.value })}
            placeholder="(00) 00000-0000"
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={newClientForm.email}
            onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
            placeholder="email@exemplo.com"
          />
          <Input
            label="Empresa"
            name="empresa"
            value={newClientForm.empresa}
            onChange={(e) => setNewClientForm({ ...newClientForm, empresa: e.target.value })}
            placeholder="Nome da empresa"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsNewClientModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsNewClientModalOpen(false)}>
              Salvar Contato
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
