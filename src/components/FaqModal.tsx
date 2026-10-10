import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../siteConfig';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPlans?: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPlans,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Como faço para me associar ao Sócio Poeirão?',
      a: 'Basta escolher um dos planos (Prata+, Ouro+, Patrocinador+ ou Patrocinador Gold+) e clicar em "Assinar". Você pode efetuar o pagamento via Pix instantâneo ou Cartão de Crédito pelo Stripe oficial.',
    },
    {
      q: 'Como acesso minha Carteirinha Virtual após o pagamento?',
      a: 'Após a confirmação do pagamento pelo Stripe, acesse a "Área do Sócio" no topo do site e digite o número de WhatsApp informado na assinatura. Sua carteirinha oficial com foto, matrícula e selo tricolor estará liberada na hora.',
    },
    {
      q: 'Como utilizo o meu desconto nas camisas da Loja Poeirão?',
      a: 'Sócios com mensalidade ativa têm até 30% de desconto automático nas camisas oficiais da Loja Poeirão. Ao pedir pelo WhatsApp ou na loja virtual do clube, informe sua matrícula de sócio para aplicar o valor com desconto.',
    },
    {
      q: 'Como funciona a renovação mensal?',
      a: 'Você pode renovar a qualquer momento diretamente dentro da Área do Sócio clicando nos botões "Renovar via Pix" ou "Renovar via Cartão". Se pagar no cartão com assinatura automática, a renovação é processada mês a mês.',
    },
    {
      q: 'O que é o check-in de jogos para os sócios?',
      a: 'O check-in garante sua presença e prioridade nos jogos oficiais e amistosos do Poeirão F.C., além de concorrer a sorteios de camisas oficiais e prêmios da diretoria.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full text-slate-900 shadow-2xl border border-slate-200 relative overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOPO VERMELHO BAHIA / POEIRÃO */}
        <div className="bg-[#c8102e] text-white p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-white" />
              <span>Dúvidas Frequentes · Central de Ajuda</span>
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tight text-white font-condensed">
            Tire Suas Dúvidas sobre o Sócio
          </h3>
          <p className="text-xs text-red-100 mt-1">
            Entenda como funciona o programa oficial de sócios do Poeirão F.C.
          </p>
        </div>

        {/* LISTA DE PERGUNTAS */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-red-600 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-red-600' : 'text-slate-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <a
            href={SITE_CONFIG.whatsapp.linkDireto}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar no WhatsApp oficial</span>
          </a>

          {onNavigateToPlans && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToPlans();
              }}
              className="bg-[#0070d2] hover:bg-[#005fb3] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Conhecer os Planos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
