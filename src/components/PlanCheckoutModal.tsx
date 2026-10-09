import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Check,
  ShieldCheck,
  Lock,
  User,
  Phone,
  Sparkles,
  ExternalLink,
  QrCode,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  MemberPlan,
  PLAN_DETAILS,
  cleanPhone,
  formatPhone,
} from '../utils/membersManager';
import { SITE_CONFIG } from '../siteConfig';

interface PlanCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: MemberPlan;
  onCompletePayment: (data: {
    name: string;
    phone: string;
    password: string;
    plan: MemberPlan;
  }) => Promise<void>;
}

export const PlanCheckoutModal: React.FC<PlanCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onCompletePayment,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'pix'>('stripe');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const planInfo = PLAN_DETAILS[selectedPlan];
  const stripeUrl =
    selectedPlan === 'ouro'
      ? SITE_CONFIG.stripeLinks.ouro
      : selectedPlan === 'patrocinador'
      ? SITE_CONFIG.stripeLinks.diamante
      : selectedPlan === 'patrocinador_gold'
      ? SITE_CONFIG.stripeLinks.pix.patrocinador_gold
      : SITE_CONFIG.stripeLinks.prata;

  const pixKey = SITE_CONFIG.whatsapp.numero; // Chave Pix celular oficial (77) 98167-7054

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleOpenStripe = () => {
    window.open(stripeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    const clean = cleanPhone(phone);
    if (clean.length < 10) {
      setErrorMsg('Informe um número de celular válido com DDD (ex: 11 99999-8888).');
      return;
    }

    if (!password || password.length < 3) {
      setErrorMsg('Crie uma senha de acesso com no mínimo 3 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCompletePayment({
        name: name.trim(),
        phone: clean,
        password,
        plan: selectedPlan,
      });
      onClose();
    } catch (err) {
      setErrorMsg('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full text-slate-900 shadow-2xl border border-slate-200 relative overflow-hidden my-auto">
        {/* TOPO COM IDENTIDADE DO PLANO BLOQUEADO */}
        <div
          className={`p-6 sm:p-7 text-white relative ${
            selectedPlan === 'ouro'
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600'
              : selectedPlan === 'patrocinador'
              ? 'bg-gradient-to-r from-cyan-900 via-blue-900 to-slate-950'
              : 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Plano Selecionado • Valor Fixo
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            {planInfo?.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {planInfo?.price}
            </span>
            <span className="text-xs text-white/80 font-medium">
              (Garante o Cartão Oficial {planInfo?.name})
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 text-xs text-white/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Check className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{planInfo?.benefits[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Check className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Acesso imediato à Carteirinha Virtual Oficial</span>
            </div>
          </div>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* DADOS DE CADASTRO */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-600" />
              <span>1. Seus Dados de Identificação</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nome Completo (Para a Carteirinha)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Pedro da Silva"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Celular / WhatsApp (Login)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-8888"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Crie uma Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha para acessar"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORMA DE PAGAMENTO */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>2. Forma de Pagamento ({planInfo?.price})</span>
            </h4>

            {/* SELETOR DE MÉTODO */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black uppercase transition cursor-pointer ${
                  paymentMethod === 'stripe'
                    ? 'border-slate-900 bg-slate-900 text-white shadow'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão (Stripe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black uppercase transition cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Pix Instantâneo</span>
              </button>
            </div>

            {paymentMethod === 'stripe' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Ambiente Seguro Stripe Oficial
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                    SSL 256-bit
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pague de forma rápida e segura no cartão de crédito. Clique abaixo para abrir o checkout seguro do Stripe para o plano{' '}
                  <strong>{planInfo?.name}</strong>:
                </p>
                <button
                  type="button"
                  onClick={handleOpenStripe}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase py-3 px-4 rounded-xl shadow transition cursor-pointer hover:scale-[1.01]"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Abrir Pagamento Stripe ({planInfo?.price}) ➔</span>
                </button>
                <span className="text-[11px] text-slate-500 block text-center">
                  Após pagar no Stripe, clique em "Confirmar Pagamento & Acessar Carteirinha" abaixo!
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-950">
                    Chave Pix Oficial do Clube
                  </span>
                  <span className="text-xs font-black text-emerald-700 font-mono">
                    {planInfo?.price}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Faça a transferência Pix no valor de <strong>{planInfo?.price}</strong> para a chave celular abaixo:
                </p>
                <div className="flex items-center gap-2 bg-white border border-emerald-300 rounded-xl p-2.5">
                  <span className="text-xs font-mono font-bold text-slate-900 flex-1 truncate">
                    {pixKey} (Celular - Diretoria Poeirão F.C.)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BOTÃO PRINCIPAL DE CONCLUSÃO DO PAGAMENTO & ACESSO À CARTEIRINHA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase py-4 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Ativando seu plano...'
                  : `Confirmar Pagamento & Acessar Carteirinha ➔`}
              </span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              🔒 Ao confirmar, sua conta é criada com o plano <strong>{planInfo?.name}</strong> e você será direcionado diretamente para a <strong>Área do Sócio</strong> com sua carteirinha ativa.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
