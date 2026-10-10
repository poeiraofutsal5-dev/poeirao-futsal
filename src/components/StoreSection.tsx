import React from 'react';
import { ShoppingBag, Sparkles, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { ShirtItem } from '../utils/storeManager';

interface StoreSectionProps {
  shirts?: ShirtItem[];
  onNavigateToStore: () => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({ onNavigateToStore }) => {
  return (
    <section id="loja-poeirao" className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER PRINCIPAL COM EXPLICAÇÃO DETALHADA E BOTÃO QUE ABRE A PÁGINA DA LOJA */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 md:p-12 shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Coleção Oficial 2026 • Linha do Torcedor
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight font-condensed">
                Vista a Camisa Oficial do <span className="text-red-500">Poeirão F.C.</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                <strong className="text-white font-bold">Para que serve este espaço?</strong> Aqui é a loja oficial do clube! Cada camisa ou produto adquirido ajuda diretamente a custear as viagens, arbitragens, inscrições nos campeonatos e os uniformes dos nossos atletas. Você apoia o time da sua terra e veste as cores oficiais do Poeirão F.C.!
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Tecido Dry-Fit e Poliéster
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Envio Rápido e Seguro
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Camisas e Futuros Produtos
                </span>
              </div>
            </div>

            {/* BOTÃO EM DESTAQUE "LOJA POEIRÃO" QUE ABRE A ABA EXCLUSIVA DA LOJA */}
            <div className="flex items-center justify-center lg:justify-end w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={onNavigateToStore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-base sm:text-lg px-8 py-5 rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>LOJA POEIRÃO</span>
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
