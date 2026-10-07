import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  Phone,
  Key,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Plus,
  Search,
  Share2,
  Sparkles,
  Shield,
  CreditCard,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
  FileCode,
  ExternalLink,
  Download,
} from 'lucide-react';
import {
  MemberItem,
  MemberPlan,
  MemberStatus,
  PLAN_DETAILS,
  cleanPhone,
  formatPhone,
  generateMatricula,
} from '../utils/membersManager';

interface AdminMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberItem[];
  onSaveMember: (member: MemberItem) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  storeOrdersEnabled?: boolean;
  onToggleStoreOrders?: (enabled: boolean) => void;
}

export const AdminMembersModal: React.FC<AdminMembersModalProps> = ({
  isOpen,
  onClose,
  members,
  onSaveMember,
  onDeleteMember,
  storeOrdersEnabled = true,
  onToggleStoreOrders,
}) => {
  // Autenticação com a senha padrão da área restrita
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Estados de busca e edição
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos do formulário (para adicionar ou editar)
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPlan, setFormPlan] = useState<MemberPlan>('ouro');
  const [formPaymentDate, setFormPaymentDate] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('');
  const [formStatus, setFormStatus] = useState<MemberStatus>('active');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloadingCode, setIsDownloadingCode] = useState(false);

  const handleCopyStandaloneHtml = async () => {
    try {
      const res = await fetch('/standalone.html');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      showNotification('✅ Código completo copiado! Pronto para colar nas Notas ou no Netlify.');
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      window.open('/standalone.html', '_blank');
      showNotification('Abrindo código em nova aba para você copiar.');
    }
  };

  const handleDownloadStandaloneHtml = async () => {
    try {
      setIsDownloadingCode(true);
      const res = await fetch('/standalone.html');
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('✅ Arquivo index.html baixado! Só arrastar para o Netlify.');
    } catch {
      alert('Erro ao baixar o arquivo.');
    } finally {
      setIsDownloadingCode(false);
    }
  };

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '22232425') {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenAdd = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    
    // Calcula vencimento para daqui a 30 dias por padrão
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const validUntilDefault = futureDate.toLocaleDateString('pt-BR');

    setEditingId(null);
    setFormName('');
    setFormPhone('');
    setFormPassword('123');
    setFormPlan('ouro');
    setFormPaymentDate(today);
    setFormValidUntil(validUntilDefault);
    setFormStatus('active');
    setFormError(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (m: MemberItem) => {
    setIsAddingNew(false);
    setEditingId(m.id);
    setFormName(m.name);
    setFormPhone(formatPhone(m.phone));
    setFormPassword(m.password);
    setFormPlan(m.plan);
    setFormPaymentDate(m.lastPaymentDate || m.createdAt || new Date().toLocaleDateString('pt-BR'));
    setFormValidUntil(m.validUntil || '31/12/2026');
    setFormStatus(m.status);
    setFormError(null);
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormError(null);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Por favor, informe o nome completo do sócio.');
      return;
    }

    const clean = cleanPhone(formPhone);
    if (clean.length < 10) {
      setFormError('Número de celular inválido (mínimo 10 dígitos com DDD).');
      return;
    }

    if (!formPassword.trim()) {
      setFormError('Defina uma senha de acesso para o sócio.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Edição de sócio existente
        const target = members.find((m) => m.id === editingId);
        if (!target) return;

        const updatedMember: MemberItem = {
          ...target,
          name: formName.trim(),
          phone: clean,
          password: formPassword.trim(),
          plan: formPlan,
          status: formStatus,
          lastPaymentDate: formPaymentDate.trim(),
          validUntil: formValidUntil.trim(),
        };

        await onSaveMember(updatedMember);
        showNotification(`Sócio "${updatedMember.name}" atualizado com sucesso!`);
      } else {
        // Cadastro de novo sócio
        const newId = 'mem_' + Date.now();
        const newMatricula = generateMatricula(members.length + 1);
        const today = new Date().toLocaleDateString('pt-BR');

        const newMember: MemberItem = {
          id: newId,
          matricula: newMatricula,
          name: formName.trim(),
          phone: clean,
          password: formPassword.trim(),
          plan: formPlan,
          status: formStatus,
          createdAt: today,
          lastPaymentDate: formPaymentDate.trim() || today,
          validUntil: formValidUntil.trim() || '31/12/2026',
        };

        await onSaveMember(newMember);
        showNotification(`Novo sócio "${newMember.name}" cadastrado e carteirinha emitida!`);
      }

      setIsAddingNew(false);
      setEditingId(null);
    } catch (err) {
      setFormError('Erro ao salvar sócio. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setMemberToDelete({ id, name });
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    const target = memberToDelete;
    setMemberToDelete(null);
    try {
      await onDeleteMember(target.id);
      showNotification(`Sócio "${target.name}" excluído com sucesso.`);
    } catch (err) {
      console.error(err);
      showNotification('Erro ao excluir sócio. Tente novamente.');
    }
  };

  const handleCopyAccessMessage = (m: MemberItem) => {
    const text = `🎉 Olá, ${m.name}! Seu cadastro como Sócio Torcedor Oficial do Poeirão F.C. está ativo!\n\n📋 Matrícula: ${m.matricula}\n⭐ Plano: ${PLAN_DETAILS[m.plan]?.name}\n📅 Vencimento: ${m.validUntil}\n\n📲 Para ver sua Carteirinha Virtual Oficial:\n1. Acesse o site oficial do clube\n2. Vá na aba "Área do Sócio"\n3. Entre com:\n   • Celular: ${formatPhone(m.phone)}\n   • Senha: ${m.password}\n\nSaudações Tricolores! 🔴⚪⚫`;
    navigator.clipboard.writeText(text);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2500);
    showNotification('Mensagem com dados de acesso copiada para o WhatsApp!');
  };

  const filteredMembers = members.filter((m) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.matricula.toLowerCase().includes(q) ||
      m.plan.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* CABEÇALHO DO PAINEL */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-600/30 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>Painel da Diretoria • Sócios Torcedores</span>
                <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                  ADMIN
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cadastre e edite torcedores que pagaram no Stripe ou Pix para liberar a Carteirinha Virtual.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
            title="Fechar Painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MENSAGEM TOAST DE SUCESSO */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* TELA DE AUTENTICAÇÃO COM SENHA '22232425' */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-red-950/60 border border-red-800/40 rounded-3xl flex items-center justify-center text-3xl mb-4 text-red-500 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white uppercase">
              Área Restrita da Diretoria
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
              Digite a senha de administrador do clube para cadastrar, editar ou gerenciar sócios e carteirinhas.
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-6 w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite a senha de administrador..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono text-center tracking-widest"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-bold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Senha incorreta. Tente novamente.</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition cursor-pointer"
              >
                Acessar Painel ➔
              </button>
            </form>
          </div>
        ) : (
          /* PAINEL ADMINISTRATIVO AUTENTICADO */
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* CONTROLE GLOBAL: ATIVAR/DESATIVAR BOTÃO PEDIR NO ZAP EM TODOS OS PRODUTOS DA LOJA */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                    storeOrdersEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                      Botão "Pedir no Zap" (Loja Oficial)
                    </h4>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        storeOrdersEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {storeOrdersEnabled ? '🟢 Ativado (Recebendo Pedidos)' : '🔴 Desativado (Sem Estoque)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {storeOrdersEnabled
                      ? 'O botão de compra pelo WhatsApp está ativo em todos os produtos da loja.'
                      : 'O botão de compra está desativado. Os produtos aparecem como "Esgotado".'}
                  </p>
                </div>
              </div>

              {onToggleStoreOrders && (
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !storeOrdersEnabled;
                    onToggleStoreOrders(nextVal);
                    showNotification(
                      nextVal
                        ? 'Botão "Pedir no Zap" ativado em todos os produtos da loja!'
                        : 'Botão "Pedir no Zap" pausado em todos os produtos (Produtos Esgotados).'
                    );
                  }}
                  className={`font-black text-xs uppercase px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shadow ${
                    storeOrdersEnabled
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  {storeOrdersEnabled ? 'Desativar "Pedir no Zap"' : 'Ativar "Pedir no Zap"'}
                </button>
              )}
            </div>

            {/* PAINEL DE EXPORTAÇÃO COMPLETA: CÓDIGO PARA NOTAS E NETLIFY */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                        Publicação no Netlify & Código Completo
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        100% Idêntico & Funcional
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Copie o código completo para colar nas suas notas ou baixe o arquivo <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded font-mono">index.html</code> para publicar direto no Netlify.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyStandaloneHtml}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase px-3.5 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer shadow"
                    title="Copiar todo o código HTML/CSS/JS para colar no Bloco de Notas"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    <span>{copiedCode ? 'Código Copiado!' : 'Copiar para Notas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadStandaloneHtml}
                    disabled={isDownloadingCode}
                    className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl transition cursor-pointer shadow shadow-cyan-600/30 disabled:opacity-50"
                    title="Baixar arquivo index.html pronto para arrastar no Netlify Drop"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingCode ? 'Baixando...' : 'Baixar index.html (Netlify)'}</span>
                  </button>

                  <a
                    href="/standalone.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 transition"
                    title="Abrir versão limpa em nova aba"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Tela Cheia</span>
                  </a>
                </div>
              </div>
            </div>

            {/* BARRA SUPERIOR COM BOTÃO NOVO SÓCIO E PESQUISA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar sócio por nome, celular ou matrícula..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {!isAddingNew && !editingId && (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Cadastrar Sócio Manualmente</span>
                </button>
              )}
            </div>

            {/* FORMULÁRIO DE CADASTRO OU EDIÇÃO */}
            {(isAddingNew || editingId) && (
              <div className="bg-slate-950 border-2 border-red-600/40 rounded-2xl p-5 sm:p-6 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <h4 className="text-sm sm:text-base font-black uppercase text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>
                      {editingId ? 'Editar Dados do Sócio' : 'Cadastrar Sócio (Pós-Pagamento Stripe/Pix)'}
                    </span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-800"
                  >
                    Cancelar
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 bg-red-950/80 border border-red-700 text-red-200 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveForm} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Nome Completo do Sócio
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo da Silva"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Celular / WhatsApp (Login) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Número de Celular / WhatsApp (Login)
                      </label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="(11) 99999-8888"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Senha */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Senha de Acesso do Sócio
                      </label>
                      <input
                        type="text"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="Ex: 123 ou senha criada"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-red-500"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        O sócio usará esta senha para entrar.
                      </span>
                    </div>

                    {/* Plano */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Plano Contratado
                      </label>
                      <select
                        value={formPlan}
                        onChange={(e) => setFormPlan(e.target.value as MemberPlan)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="prata">Sócio Prata+ (R$ 14,99)</option>
                        <option value="ouro">Sócio Ouro+ (R$ 24,99)</option>
                        <option value="patrocinador">Patrocinador+ (R$ 49,99)</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Situação / Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as MemberStatus)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="active">🟢 ATIVO (Pagamento Confirmado)</option>
                        <option value="pending">🟡 PENDENTE (Aguardando)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Dia que pagou */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Dia que a Pessoa Pagou (Data do Pagamento)
                      </label>
                      <input
                        type="text"
                        value={formPaymentDate}
                        onChange={(e) => setFormPaymentDate(e.target.value)}
                        placeholder="DD/MM/AAAA (Ex: 04/10/2026)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Vencimento */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Vencimento da Carteirinha
                      </label>
                      <input
                        type="text"
                        value={formValidUntil}
                        onChange={(e) => setFormValidUntil(e.target.value)}
                        placeholder="DD/MM/AAAA (Ex: 04/11/2026)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase px-6 py-2.5 rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting
                        ? 'Salvando...'
                        : editingId
                        ? 'Salvar Alterações do Sócio ➔'
                        : 'Emitir Carteirinha do Sócio ➔'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* LISTAGEM DOS SÓCIOS CADASTRADOS */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">
                  Sócios Cadastrados ({filteredMembers.length})
                </span>
                <span>
                  Ativos: {members.filter((m) => m.status === 'active').length} | Pendentes:{' '}
                  {members.filter((m) => m.status === 'pending').length}
                </span>
              </div>

              {filteredMembers.length === 0 ? (
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  Nenhum sócio encontrado. Clique em "+ Cadastrar Sócio Manualmente" acima para adicionar.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMembers.map((m) => (
                    <div
                      key={m.id}
                      className={`bg-slate-950 border rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        m.status === 'active'
                          ? 'border-slate-800 hover:border-slate-700'
                          : 'border-amber-900/60 bg-amber-950/10'
                      }`}
                    >
                      {/* INFORMAÇÕES DO SÓCIO */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 border ${
                            m.plan === 'ouro'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-500/50'
                              : m.plan === 'patrocinador'
                              ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/50'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="text-sm font-black text-white">{m.name}</h5>
                            <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                              {m.matricula}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                m.status === 'active'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {m.status === 'active' ? '● ATIVO' : '○ PENDENTE'}
                            </span>
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span>
                              📱 Celular/Login:{' '}
                              <strong className="text-white font-mono">{formatPhone(m.phone)}</strong>
                            </span>
                            <span>
                              🔑 Senha:{' '}
                              <strong className="text-amber-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {m.password}
                              </strong>
                            </span>
                            <span className="font-bold text-slate-300">
                              Plano: {PLAN_DETAILS[m.plan]?.name} ({PLAN_DETAILS[m.plan]?.price})
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span>
                              💳 Pagou em:{' '}
                              <strong className="text-slate-300">{m.lastPaymentDate || m.createdAt || 'Hoje'}</strong>
                            </span>
                            <span>
                              ⏳ Vencimento:{' '}
                              <strong className="text-emerald-400">{m.validUntil || '31/12/2026'}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AÇÕES DA DIRETORIA */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        {/* Botão copiar mensagem WhatsApp */}
                        <button
                          type="button"
                          onClick={() => handleCopyAccessMessage(m)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                          title="Copiar dados de login para enviar ao sócio pelo WhatsApp"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{copiedId === m.id ? 'Copiado!' : 'Copiar Acesso'}</span>
                        </button>

                        {/* Botão Editar */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(m)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/60 px-3 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* Botão Excluir */}
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id, m.name)}
                          className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-900/50 p-2 rounded-xl transition cursor-pointer"
                          title="Excluir sócio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-600/50 rounded-3xl max-w-sm w-full p-6 text-center text-white shadow-2xl animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-500 border border-red-600/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black uppercase text-white tracking-tight">
              Excluir Cadastro?
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Deseja realmente remover o sócio <strong>"{memberToDelete.name}"</strong>? O cadastro e a carteirinha virtual dele serão excluídos.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-red-600/40 transition cursor-pointer"
              >
                Sim, Excluir Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
