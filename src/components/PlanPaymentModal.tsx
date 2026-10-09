import React from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Check,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Shirt,
} from 'lucide-react';
import { SITE_CONFIG } from '../siteConfig';

export type PlanId = 'prata' | 'ouro' | 'diamante' | 'patrocinador_gold';

interface PlanPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: PlanId | null;
}

export const PlanPaymentModal: React.FC<PlanPaymentModalProps> = ({
  isOpen,
  onClose,
  planId,
}) => {
  if (!isOpen || !planId) return null;

  const planDetails: Record<
    PlanId,
    {
      name: string;
      badge: string;
      price: string;
      period: string;
      bgGradient: string;
      accentColor: string;
      benefits: string[];
      pixUrl: string;
      cardUrl: string;
    }
  > = {
    prata: {
      name: 'SÓCIO PRATA+',
      badge: 'PLANO DE ENTRADA',
      price: 'R$ 14,99',
      period: '/ mês',
      bgGradient: 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900',
      accentColor: 'border-slate-300',
      benefits: [
        '10% de desconto nas camisas do time',
        'Carteirinha Virtual Oficial do Sócio',
        'Acesso à Área do Sócio pelo celular',
      ],
      pixUrl: SITE_CONFIG.stripeLinks.pix.prata,
      cardUrl: SITE_CONFIG.stripeLinks.cartao.prata, // https://buy.stripe.com/6oU28j2SOeNK6wFc0FfrW04
    },
    ouro: {
      name: 'SÓCIO OURO+',
      badge: '★ PLANO MAIS POPULAR',
      price: 'R$ 24,99',
      period: '/ mês',
      bgGradient: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600',
      accentColor: 'border-amber-400',
      benefits: [
        '30% de desconto em camisas do time',
        'Carteirinha Virtual Oficial com Selo Dourado',
        'Acesso liberado nos jogos e sorteios exclusivos',
        'Acesso à Área do Sócio pelo celular',
      ],
      pixUrl: SITE_CONFIG.stripeLinks.pix.ouro,
      cardUrl: SITE_CONFIG.stripeLinks.cartao.ouro,
    },
    diamante: {
      name: 'PATROCINADOR+',
      badge: '💎 PLANO CORPORATIVO & PARCERIAS',
      price: 'R$ 59,99',
      period: '/ mês',
      bgGradient: 'bg-gradient-to-r from-cyan-900 via-blue-900 to-slate-950',
      accentColor: 'border-cyan-400',
      benefits: [
        'Divulgação da logo no site oficial do clube',
        'Divulgação nas redes sociais (feed, stories)',
        'Carteirinha Virtual Oficial Nível Corporativo',
      ],
      pixUrl: SITE_CONFIG.stripeLinks.pix.diamante,
      cardUrl: SITE_CONFIG.stripeLinks.cartao.diamante,
    },
    patrocinador_gold: {
      name: 'SÓCIO PATROCINADOR GOLD+',
      badge: '👑 VIP CORPORATIVO GOLD',
      price: 'A partir de R$ 99,99',
      period: '/ mês',
      bgGradient: 'bg-gradient-to-r from-amber-950 via-yellow-900 to-zinc-950',
      accentColor: 'border-amber-400',
      benefits: [
        'Divulgação da logo no site oficial do clube',
        'Divulgação nas redes sociais (feed, stories)',
        'Direito a uma camisa oficial do time personalizada',
        'Carteirinha Virtual Oficial Nível Gold Corporativo',
      ],
      pixUrl: SITE_CONFIG.stripeLinks.pix.patrocinador_gold,
      cardUrl: '', // Somente via Pix
    },
  };

  const current = planDetails[planId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full text-slate-900 shadow-2xl border border-slate-200 relative overflow-hidden my-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL COM IDENTIDADE DO PLANO */}
        <div className={`p-6 sm:p-7 text-white relative ${current.bgGradient}`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{current.badge}</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {current.name}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {current.price}
            </span>
            <span className="text-sm text-white/80 font-medium">
              {current.period}
            </span>
          </div>
        </div>

        {/* CORPO: INFORMAÇÕES DO PLANO & DUAS OPÇÕES DE PAGAMENTO */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* BENEFÍCIOS DO PLANO */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Benefícios inclusos no plano:</span>
            </h4>
            <ul className="space-y-2.5">
              {current.benefits.map((benefit, index) => {
                const isShirt = benefit.includes('camisa oficial');
                return (
                  <li
                    key={index}
                    className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                      isShirt
                        ? 'text-cyan-950 font-bold bg-cyan-50/80 -mx-2 px-2.5 py-1.5 rounded-xl border border-cyan-200'
                        : 'text-slate-700'
                    }`}
                  >
                    {isShirt ? (
                      <Shirt className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <span>{benefit}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* DUAS OPÇÕES DE PAGAMENTO SOLICITADAS */}
          <div>
            <div className="text-center mb-3.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                Escolha a forma de pagamento:
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Checkout 100% seguro processado pelo Stripe Oficial
              </p>
            </div>

            <div className="space-y-3">
              {/* OPÇÃO 1: VIA PIX */}
              <a
                href={current.pixUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-950 transition-all duration-200 hover:scale-[1.01] active:scale-98 shadow-sm hover:shadow cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black uppercase tracking-wide text-emerald-950">
                        Opção via Pix
                      </span>
                      <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Instantâneo
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      Pague no Pix com aprovação imediata
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-emerald-700 font-bold group-hover:translate-x-1 transition-transform pl-2">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </a>

              {/* OPÇÃO 2: CARTÃO DE CRÉDITO (QUANDO DISPONÍVEL) */}
              {current.cardUrl ? (
                <a
                  href={current.cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border-2 border-slate-900 bg-slate-900 hover:bg-black text-white transition-all duration-200 hover:scale-[1.01] active:scale-98 shadow-lg shadow-slate-900/20 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                          Opção Cartão de Crédito
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold px-2 py-0.5 rounded-full">
                          SSL Seguro
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-0.5">
                        Pague no cartão de crédito em ambiente criptografado
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/90 font-bold group-hover:translate-x-1 transition-transform pl-2">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </a>
              ) : (
                <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/80 text-amber-950 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-black text-lg">
                    ⚡
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase text-amber-950">
                      Pagamento Exclusivo via Pix
                    </h5>
                    <p className="text-[11px] text-amber-900 mt-0.5">
                      Este plano corporativo Gold+ possui adesão simplificada exclusivamente via chave/checkout Pix no Stripe.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* INFORMAÇÃO PÓS-PAGAMENTO */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              🔒 Ao finalizar o pagamento no Stripe, seu acesso à <strong>Carteirinha Virtual</strong> será liberado na <strong>Área do Sócio</strong> com seu número de WhatsApp.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline pt-1 cursor-pointer"
            >
              ← Voltar aos Planos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
