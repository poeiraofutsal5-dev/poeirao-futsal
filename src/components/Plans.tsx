import React, { useState } from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { Check, CreditCard, Sparkles, Shirt } from 'lucide-react';
import { PlanPaymentModal, PlanId } from './PlanPaymentModal';

export const Plans: React.FC = () => {
  const [selectedPlanModal, setSelectedPlanModal] = useState<PlanId | null>(null);

  return (
    <section id="planos" className="py-20 bg-slate-50 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABEÇALHO DA SEÇÃO DE PLANOS */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-red-600 uppercase">
            Planos Oficiais 2026
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tight">
            Escolha o seu Plano
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Cada assinatura fortalece o Poeirão F.C. e garante benefícios exclusivos para você vibrar em cada lance. Escolha o seu e vista a camisa!
          </p>
        </div>

        {/* GRID DOS 4 CARDS DE PLANOS: PRATA+, OURO+, PATROCINADOR+ E PATROCINADOR GOLD+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          
          {/* =========================================================================== */}
          {/* CARD 1: SÓCIO PRATA+                                                        */}
          {/* =========================================================================== */}
          <div className="flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Topo escuro */}
            <div className="bg-[#18212f] text-white p-6 sm:p-7">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                PLANO DE ENTRADA
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                SÓCIO PRATA+
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">R$ 14,99</span>
                <span className="text-slate-300 text-sm font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo branco com benefícios */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <ul className="space-y-3.5 pt-1">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>10% de desconto</strong> nas camisas do time</span>
                </li>
              </ul>

              {/* Botão Modal Prata+ */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('prata')}
                  className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-extrabold uppercase text-xs sm:text-sm tracking-wider py-3.5 px-5 rounded-2xl shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>ASSINAR PRATA+</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================== */}
          {/* CARD 2: SÓCIO OURO+ (MAIS POPULAR)                                          */}
          {/* =========================================================================== */}
          <div className="flex flex-col bg-white rounded-3xl border-2 border-[#f59e0b] shadow-xl shadow-amber-500/10 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            {/* Faixa Superior Ouro - Mais Popular */}
            <div className="bg-[#f59e0b] text-slate-950 text-xs font-black uppercase tracking-wider text-center py-1.5 flex items-center justify-center gap-1.5">
              <span>★ PLANO OURO - MAIS POPULAR</span>
            </div>

            {/* Topo Dourado / Âmbar */}
            <div className="bg-gradient-to-b from-[#d97706] to-[#b45309] text-white p-6 sm:p-7">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block mb-1">
                O QUERIDINHO DA TORCIDA
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                SÓCIO OURO+
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">R$ 24,99</span>
                <span className="text-amber-100 text-sm font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo branco com benefícios */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <ul className="space-y-3.5 pt-1">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>30% de desconto</strong> em camisas do time</span>
                </li>
              </ul>

              {/* Botão Modal Ouro+ */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('ouro')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-amber-500 hover:to-amber-600 text-white font-extrabold uppercase text-xs sm:text-sm tracking-wider py-3.5 px-5 rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>ASSINAR OURO+</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================== */}
          {/* CARD 3: PATROCINADOR+ (PLANO CORPORATIVO)                                   */}
          {/* =========================================================================== */}
          <div className="flex flex-col bg-white rounded-3xl border-2 border-[#00b4db] shadow-xl shadow-cyan-500/10 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            {/* Faixa Superior Corporativo */}
            <div className="bg-gradient-to-r from-[#00b4db] to-[#0083b0] text-white text-xs font-black uppercase tracking-wider text-center py-1.5 flex items-center justify-center gap-1.5">
              <span>💎 PLANO CORPORATIVO</span>
            </div>

            {/* Topo Azul Marinho Profundo */}
            <div className="bg-[#0b192c] text-white p-6 sm:p-7">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                💎 NÍVEL CORPORATIVO & PARCERIAS
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                PATROCINADOR+
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">R$ 59,99</span>
                <span className="text-slate-300 text-sm font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo branco com benefícios */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <ul className="space-y-3.5 pt-1">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Divulgação da logo no site oficial</strong> do clube.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Divulgação nas redes sociais</strong> (feed, stories).</span>
                </li>
              </ul>

              {/* Botão Modal Patrocinador+ */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('diamante')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00b4db] to-[#0083b0] hover:opacity-95 text-white font-extrabold uppercase text-xs sm:text-sm tracking-wider py-3.5 px-5 rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <span>💎 ASSINAR PATROCINADOR+</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================== */}
          {/* CARD 4: SÓCIO PATROCINADOR GOLD+ (PLANO MASTER VIP)                        */}
          {/* =========================================================================== */}
          <div className="flex flex-col bg-white rounded-3xl border-2 border-amber-400 shadow-xl shadow-amber-500/10 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            {/* Faixa Superior Gold+ */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider text-center py-1.5 flex items-center justify-center gap-1.5 shadow-sm">
              <span>👑 PLANO MASTER GOLD</span>
            </div>

            {/* Topo Dourado Luxo Profundo */}
            <div className="bg-gradient-to-b from-[#451a03] via-[#291305] to-[#18181b] text-white p-6 sm:p-7">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                👑 MÁXIMA EXPOSIÇÃO & MANTO OFICIAL
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                PATROCINADOR GOLD+
              </h3>
              <div className="mt-4 flex flex-col items-start gap-0.5">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                  A partir de R$ 99,99
                </span>
                <span className="text-slate-300 text-xs font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo branco com benefícios */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <ul className="space-y-3 pt-1">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Divulgação da logo no site oficial</strong> do clube.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Divulgação nas redes sociais</strong> (feed, stories).</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-amber-950 font-bold bg-amber-50/90 p-2.5 rounded-xl border border-amber-300">
                  <Shirt className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Direito a 1 camisa oficial</strong> do time personalizada.</span>
                </li>
              </ul>

              {/* Botão Modal Gold+ */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('patrocinador_gold')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-wider py-3.5 px-5 rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>ASSINAR GOLD+ (PIX)</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL DE INFORMAÇÕES DO PLANO COM OPÇÕES DE PAGAMENTO (PIX E CARTÃO DE CRÉDITO) */}
      <PlanPaymentModal
        isOpen={!!selectedPlanModal}
        planId={selectedPlanModal}
        onClose={() => setSelectedPlanModal(null)}
      />
    </section>
  );
};
