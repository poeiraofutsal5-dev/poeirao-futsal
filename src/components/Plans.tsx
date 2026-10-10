import React, { useState } from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { Check, CreditCard, Sparkles, Shirt } from 'lucide-react';
import { PlanPaymentModal, PlanId } from './PlanPaymentModal';

export const Plans: React.FC = () => {
  const [selectedPlanModal, setSelectedPlanModal] = useState<PlanId | null>(null);

  return (
    <section id="planos" className="py-10 sm:py-16 lg:py-20 bg-slate-50 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABEÇALHO DA SEÇÃO DE PLANOS ESTILO SÓCIO ESQUADRÃO */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <span className="text-[10px] sm:text-xs md:text-sm font-black tracking-widest text-[#c8102e] uppercase inline-flex items-center gap-2">
            <span>★</span>
            <span>PROGRAMA OFICIAL DE SÓCIOS 2026</span>
            <span>★</span>
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-950 font-condensed tracking-tight">
            ESCOLHA SEU PLANO E VISTA A CAMISA
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Cada assinatura fortalece o Poeirão F.C., garante descontos em camisas oficiais e dá acesso à sua Carteirinha Virtual Oficial.
          </p>
        </div>

        {/* 
          GRID DOS 4 CARDS DE PLANOS: 
          - ESTRUTURA E TAMANHOS TOTALMENTE SIMÉTRICOS E PADRONIZADOS
          - CORES ORIGINAIS DE CADA PLANO PRESERVADAS (PRATA, OURO, CIANO, MASTER GOLD)
          - NO CELULAR: 2 FILAS COM 2 PLANOS CADA (grid-cols-2)
          - NO COMPUTADOR: 4 COLUNAS LADO A LADO (xl:grid-cols-4)
        */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 items-stretch max-w-7xl mx-auto">
          
          {/* =========================================================================== */}
          {/* CARD 1: SÓCIO PRATA+ (CORES ORIGINAIS: GRAFITE / BLACK COM BARRA PADRÃO)    */}
          {/* =========================================================================== */}
          <div className="flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Barra Superior Prata Padronizada */}
            <div className="h-6 sm:h-7 bg-[#273549] text-slate-100 text-[9px] sm:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-b border-slate-800/40 px-2">
              <span>★ PLANO PRATA</span>
            </div>

            {/* Topo Escuro Original */}
            <div className="bg-[#18212f] text-white p-3.5 sm:p-6">
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-0.5 sm:mb-1">
                PLANO DE ENTRADA
              </span>
              <h3 className="text-xs sm:text-lg font-black uppercase tracking-tight text-white truncate">
                SÓCIO PRATA+
              </h3>
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
                <span className="text-lg sm:text-3xl font-black text-white">R$ 14,99</span>
                <span className="text-slate-300 text-[10px] sm:text-xs font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo com Benefícios Padronizados */}
            <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>10% de desconto</strong> nas camisas</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Carteirinha Virtual Oficial</span>
                </li>
              </ul>

              {/* Botão de Assinatura Original */}
              <div className="pt-3 sm:pt-6 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('prata')}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#111827] hover:bg-black text-white font-extrabold uppercase text-[10px] sm:text-xs tracking-wider py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>ASSINAR PRATA+</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================== */}
          {/* CARD 2: SÓCIO OURO+ (CORES ORIGINAIS: DOURADO / ÂMBAR)                       */}
          {/* =========================================================================== */}
          <div className="flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border-2 border-[#f59e0b] shadow-xl shadow-amber-500/10 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            {/* Barra Superior Ouro Original */}
            <div className="h-6 sm:h-7 bg-[#f59e0b] text-slate-950 text-[9px] sm:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 px-2">
              <span>★ PLANO OURO (GOLD)</span>
            </div>

            {/* Topo Dourado / Âmbar Original */}
            <div className="bg-gradient-to-b from-[#d97706] to-[#b45309] text-white p-3.5 sm:p-6">
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-100 block mb-0.5 sm:mb-1">
                QUERIDINHO
              </span>
              <h3 className="text-xs sm:text-lg font-black uppercase tracking-tight text-white truncate">
                SÓCIO OURO+
              </h3>
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
                <span className="text-lg sm:text-3xl font-black text-white">R$ 24,99</span>
                <span className="text-amber-100 text-[10px] sm:text-xs font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo com Benefícios Padronizados */}
            <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>30% de desconto</strong> nas camisas</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Carteirinha Virtual Oficial</span>
                </li>
              </ul>

              {/* Botão de Assinatura Original */}
              <div className="pt-3 sm:pt-6 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('ouro')}
                  className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-amber-500 hover:to-amber-600 text-white font-extrabold uppercase text-[10px] sm:text-xs tracking-wider py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>ASSINAR OURO+</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================== */}
          {/* CARD 3: PATROCINADOR+ (CORES ORIGINAIS: CIANO / AZUL MARINHO)               */}
          {/* =========================================================================== */}
          <div className="flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border-2 border-[#00b4db] shadow-xl shadow-cyan-500/10 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            {/* Barra Superior Ciano Original */}
            <div className="h-6 sm:h-7 bg-gradient-to-r from-[#00b4db] to-[#0083b0] text-white text-[9px] sm:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 px-2">
              <span>💎 CORPORATIVO</span>
            </div>

            {/* Topo Azul Marinho Profundo Original */}
            <div className="bg-[#0b192c] text-white p-3.5 sm:p-6">
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5 sm:mb-1">
                💎 PARCERIAS
              </span>
              <h3 className="text-xs sm:text-lg font-black uppercase tracking-tight text-white truncate">
                PATROCINADOR+
              </h3>
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
                <span className="text-lg sm:text-3xl font-black text-white">R$ 59,99</span>
                <span className="text-slate-300 text-[10px] sm:text-xs font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo com Benefícios Padronizados */}
            <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Logo no site oficial</strong> do clube</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>Divulgação nas redes sociais</span>
                </li>
              </ul>

              {/* Botão de Assinatura Original */}
              <div className="pt-3 sm:pt-6 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('diamante')}
                  className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-[#00b4db] to-[#0083b0] hover:opacity-95 text-white font-extrabold uppercase text-[10px] sm:text-xs tracking-wider py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>💎 ASSINAR</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================== */}
          {/* CARD 4: PATROCINADOR GOLD+ (CORES ORIGINAIS: MASTER GOLD / OURO LUXO)       */}
          {/* =========================================================================== */}
          <div className="flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-xl shadow-amber-500/10 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            {/* Barra Superior Gold+ Original */}
            <div className="h-6 sm:h-7 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 text-[9px] sm:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm px-2">
              <span>👑 MASTER GOLD</span>
            </div>

            {/* Topo Dourado Luxo Profundo Original */}
            <div className="bg-gradient-to-b from-[#451a03] via-[#291305] to-[#18181b] text-white p-3.5 sm:p-6">
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5 sm:mb-1">
                👑 MÁXIMA EXPOSIÇÃO
              </span>
              <h3 className="text-xs sm:text-lg font-black uppercase tracking-tight text-white truncate">
                PATROCINADOR GOLD+
              </h3>
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
                <span className="text-lg sm:text-3xl font-black text-amber-300">R$ 99,99</span>
                <span className="text-slate-300 text-[10px] sm:text-xs font-medium">/ mês</span>
              </div>
            </div>

            {/* Corpo com Benefícios Padronizados */}
            <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Logo no site oficial</strong> e redes</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-800 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>1 camisa oficial</strong> do time</span>
                </li>
              </ul>

              {/* Botão de Assinatura Original */}
              <div className="pt-3 sm:pt-6 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal('patrocinador_gold')}
                  className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black uppercase text-[10px] sm:text-xs tracking-wider py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950" />
                  <span>ASSINAR GOLD+</span>
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
