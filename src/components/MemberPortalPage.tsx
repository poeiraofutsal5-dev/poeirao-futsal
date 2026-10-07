import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Lock,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShoppingBag,
  MessageCircle,
  Clock,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Shield,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  MemberItem,
  MemberPlan,
  PLAN_DETAILS,
  formatPhone,
  cleanPhone,
  getLoggedMemberId,
  setLoggedMemberId,
} from '../utils/membersManager';
import { SITE_CONFIG } from '../siteConfig';
import { MemberCardVirtual } from './MemberCardVirtual';
import { AdminMembersModal } from './AdminMembersModal';

interface MemberPortalPageProps {
  onBackToHome: () => void;
  onNavigateToStore?: () => void;
  members: MemberItem[];
  onSaveMember: (member: MemberItem) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  escudoUrl?: string;
  storeOrdersEnabled?: boolean;
  onToggleStoreOrders?: (enabled: boolean) => void;
}

export const MemberPortalPage: React.FC<MemberPortalPageProps> = ({
  onBackToHome,
  onNavigateToStore,
  members,
  onSaveMember,
  onDeleteMember,
  escudoUrl,
  storeOrdersEnabled,
  onToggleStoreOrders,
}) => {
  // Estado de autenticação do sócio torcedor
  const [loggedId, setLoggedId] = useState<string | null>(getLoggedMemberId);

  // Formulário de Login (Celular + Senha)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Alteração de senha individual pelo próprio sócio logado
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);

  // Modal da Diretoria (Exige senha padrão 22232425)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sócio atualmente conectado
  const currentMember = members.find((m) => m.id === loggedId);

  const handleUpdateOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;
    setPasswordChangeStatus(null);

    const cleanPass = newPasswordInput.trim();
    if (cleanPass.length < 3) {
      setPasswordChangeStatus({
        type: 'error',
        msg: 'A nova senha deve ter no mínimo 3 caracteres.',
      });
      return;
    }
    if (cleanPass !== confirmPasswordInput.trim()) {
      setPasswordChangeStatus({
        type: 'error',
        msg: 'As senhas digitadas não coincidem. Digite a mesma senha nos dois campos.',
      });
      return;
    }

    try {
      const updated: MemberItem = {
        ...currentMember,
        password: cleanPass,
      };
      await onSaveMember(updated);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setIsChangingPassword(false);
      setPasswordChangeStatus({
        type: 'success',
        msg: 'Sua senha individual foi alterada com sucesso! Agora sua conta está protegida.',
      });
      setTimeout(() => setPasswordChangeStatus(null), 5000);
    } catch {
      setPasswordChangeStatus({
        type: 'error',
        msg: 'Erro ao salvar nova senha. Tente novamente.',
      });
    }
  };

  const getStripeLink = (plan: MemberPlan) => {
    if (plan === 'ouro') return SITE_CONFIG.stripeLinks.ouro;
    if (plan === 'patrocinador') return SITE_CONFIG.stripeLinks.diamante;
    return SITE_CONFIG.stripeLinks.prata;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = cleanPhone(loginPhone);
    if (!cleanInput) {
      setLoginError('Digite o seu número de celular com DDD.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Digite a sua senha de acesso.');
      return;
    }

    // Busca o sócio pelo celular limpo e senha
    const found = members.find(
      (m) => cleanPhone(m.phone) === cleanInput && m.password === loginPassword.trim()
    );

    if (found) {
      setLoggedId(found.id);
      setLoggedMemberId(found.id);
      setLoginPhone('');
      setLoginPassword('');
    } else {
      setLoginError(
        'Celular ou senha não encontrados. O acesso é liberado pela diretoria logo após a confirmação do pagamento no Stripe ou Pix.'
      );
    }
  };

  const handleLogout = () => {
    setLoggedId(null);
    setLoggedMemberId(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24 flex flex-col justify-between">
      <div>
        {/* ========================================================================= */}
        {/* TOPO COM NAVEGAÇÃO E IDENTIDADE DO CLUBE                                  */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-red-500" />
                <span>Voltar ao Site Principal</span>
              </button>

              {currentMember && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 block">Sócio Conectado</span>
                    <span className="text-sm font-black text-white">{currentMember.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-red-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
                    title="Sair da Conta"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-500 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Portal Oficial do Torcedor
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                Área do Sócio Torcedor
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-3">
                Acesse sua Carteirinha Virtual Oficial, consulte o plano contratado, o dia do pagamento e a data de vencimento.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTEÚDO PRINCIPAL (SÓCIO LOGADO OU TELA DE LOGIN EXCLUSIVA)              */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
          {currentMember ? (
            /* ===================================================================== */
            /* USUÁRIO AUTENTICADO: CARTEIRINHA VIRTUAL 3D & DADOS DO PLANO          */
            /* ===================================================================== */
            <div className="space-y-10">
              {/* 1. SEÇÃO DO CARTÃO VIRTUAL EM DESTAQUE */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 relative overflow-hidden">
                <div className="text-center mb-8">
                  <span className="text-xs font-black tracking-widest text-red-600 uppercase">
                    Identificação Digital Oficial
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 mt-1">
                    Seu Cartão do Sócio Torcedor
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Apresente este cartão digital nos jogos do clube e na Loja Oficial para obter descontos.
                  </p>
                </div>

                {/* RENDER DO CARTÃO VIRTUAL COM GIRO */}
                <MemberCardVirtual
                  member={currentMember}
                  escudoUrl={escudoUrl}
                  onOpenRenewModal={() => window.open(getStripeLink(currentMember.plan), '_blank')}
                />

                {/* SITUAÇÃO / STATUS DA CONTA */}
                <div className="mt-8 max-w-md mx-auto">
                  {currentMember.status === 'active' ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-black text-emerald-950 uppercase">
                          Plano Ativo & Regularizado
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Sua mensalidade está em dia! Você tem acesso liberado aos jogos e descontos exclusivos na Loja Poeirão.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-black text-amber-950 uppercase">
                          Pagamento Pendente de Confirmação
                        </h4>
                        <p className="text-xs text-amber-800 mt-0.5">
                          Assim que seu pagamento for confirmado no Stripe, seu status passará para <strong>ATIVO</strong>.
                        </p>
                        <a
                          href={getStripeLink(currentMember.plan)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer"
                        >
                          Concluir renovação no Stripe ➔
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. INFORMAÇÕES COMPLETAS DO PLANO, VENCIMENTO E DIA QUE PAGOU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* CARD DETALHES DO PLANO */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-red-600">
                        Seu Plano Atual
                      </span>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        {PLAN_DETAILS[currentMember.plan]?.price}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 uppercase">
                      {PLAN_DETAILS[currentMember.plan]?.name}
                    </h3>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-500">Matrícula Oficial:</span>
                        <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {currentMember.matricula}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-500">Celular Cadastrado:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatPhone(currentMember.phone)}
                        </span>
                      </div>

                      {/* DIA QUE A PESSOA PAGOU */}
                      <div className="flex justify-between items-center text-xs sm:text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-600 font-bold flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>Dia que Pagou:</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          {currentMember.lastPaymentDate || currentMember.createdAt || 'Confirmado'}
                        </span>
                      </div>

                      {/* DATA DE VENCIMENTO */}
                      <div className="flex justify-between items-center text-xs sm:text-sm bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                        <span className="text-emerald-950 font-bold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>Vencimento da Mensalidade:</span>
                        </span>
                        <span className="font-black text-emerald-700 font-mono text-sm">
                          {currentMember.validUntil || '31/12/2026'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
                    <a
                      href={
                        currentMember.plan === 'ouro'
                          ? SITE_CONFIG.stripeLinks.ouro
                          : currentMember.plan === 'patrocinador'
                          ? SITE_CONFIG.stripeLinks.diamante
                          : SITE_CONFIG.stripeLinks.prata
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-black uppercase py-4 px-4 rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Renovar Mensalidade no Stripe</span>
                    </a>
                  </div>
                </div>

                {/* CARD DE BENEFÍCIOS DO SÓCIO */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Benefícios Exclusivos do Sócio
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 uppercase">
                      O que seu plano dá direito:
                    </h3>

                    <ul className="mt-5 space-y-3.5">
                      {PLAN_DETAILS[currentMember.plan]?.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Acesso garantido aos jogos e eventos da comunidade tricolor</span>
                      </li>
                    </ul>
                  </div>

                  {/* BOTÃO PARA IR À LOJA POEIRÃO COM DESCONTO */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-black text-red-600 uppercase block">
                          Desconto de Sócio Ativo
                        </span>
                        <p className="text-xs text-slate-700 mt-0.5">
                          Aproveite seu desconto nas camisas oficiais da Loja!
                        </p>
                      </div>
                      {onNavigateToStore && (
                        <button
                          type="button"
                          onClick={onNavigateToStore}
                          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow transition cursor-pointer shrink-0"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Ir à Loja</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SEGURANÇA: ALTERAR SENHA INDIVIDUAL DO SÓCIO */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Key className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                        Privacidade & Proteção
                      </span>
                      <h3 className="text-lg sm:text-xl font-black uppercase text-slate-900">
                        Sua Senha Individual de Acesso
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sua senha é pessoal e única. Apenas você deve ter acesso à sua carteirinha virtual e benefícios.
                      </p>
                    </div>
                  </div>

                  {!isChangingPassword && (
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(true)}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Alterar Minha Senha</span>
                    </button>
                  )}
                </div>

                {passwordChangeStatus && (
                  <div
                    className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                      passwordChangeStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {passwordChangeStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{passwordChangeStatus.msg}</span>
                  </div>
                )}

                {isChangingPassword && (
                  <form onSubmit={handleUpdateOwnPassword} className="mt-5 pt-5 border-t border-slate-100 space-y-4 max-w-md animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Nova Senha Individual
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Digite sua nova senha pessoal..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                          required
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          title={showNewPassword ? 'Ocultar senha' : 'Ver senha'}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Repita a nova senha..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setNewPasswordInput('');
                          setConfirmPasswordInput('');
                          setPasswordChangeStatus(null);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase py-2.5 px-5 rounded-xl shadow transition cursor-pointer"
                      >
                        Salvar Nova Senha
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* ===================================================================== */
            /* TELA EXCLUSIVA DE ENTRAR (LOGIN COM CELULAR + SENHA INDIVIDUAL)       */
            /* ===================================================================== */
            <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-7 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Acessar Carteirinha
                </h3>
                <p className="text-xs text-white/90 mt-1">
                  Entre com o seu número de celular e a sua senha individual cadastrada.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                {loginError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-start gap-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span className="leading-relaxed">{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Número de Celular / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="(11) 99999-8888"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Senha Individual de Acesso
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Digite sua senha individual..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase py-4 px-4 rounded-xl shadow-lg shadow-red-600/30 transition-transform active:scale-95 cursor-pointer mt-2"
                  >
                    Entrar na Área do Sócio
                  </button>
                </form>

                {/* INFORMAÇÕES DE CADASTRO E SUPORTE */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-semibold">
                    Primeiro acesso ou esqueceu sua senha individual?
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cada sócio possui uma senha individual exclusiva para que ninguém mais acesse sua conta. Solicite ou redefina sua senha com a diretoria:
                  </p>
                  <a
                    href={`https://wa.me/55${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(
                      'Olá! Gostaria de receber ou redefinir minha senha individual de acesso à Área do Sócio do Poeirão F.C.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
                    <span>Solicitar Senha Individual no WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTÃO NA PARTE DE BAIXO EXIGINDO SENHA DA DIRETORIA                       */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-slate-200/80 w-full text-center">
        <button
          type="button"
          onClick={() => setIsAdminModalOpen(true)}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-red-500" />
          <span>Acesso da Diretoria • Cadastrar e Editar Sócios</span>
        </button>
        <p className="text-[11px] text-slate-400 mt-2">
          Área restrita aos administradores do clube.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DA DIRETORIA PARA CADASTRAR E EDITAR SÓCIOS                         */}
      {/* ========================================================================= */}
      <AdminMembersModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        members={members}
        onSaveMember={onSaveMember}
        onDeleteMember={onDeleteMember}
        storeOrdersEnabled={storeOrdersEnabled}
        onToggleStoreOrders={onToggleStoreOrders}
      />
    </div>
  );
};
