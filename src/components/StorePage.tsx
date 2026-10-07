import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { ShirtItem } from '../utils/storeManager';
import { SITE_CONFIG } from '../siteConfig';
import { Crest } from './Crest';

interface StorePageProps {
  onBack: () => void;
  onOpenAdmin: () => void;
  shirts: ShirtItem[];
  storeOrdersEnabled?: boolean;
}

export const StorePage: React.FC<StorePageProps> = ({
  onBack,
  onOpenAdmin,
  shirts,
  storeOrdersEnabled = true,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSelectSize = (shirtId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [shirtId]: size }));
  };

  const getWhatsAppBuyLink = (shirt: ShirtItem) => {
    const size = selectedSizes[shirt.id] || (shirt.sizes && shirt.sizes[1]) || 'M';
    const msg = `Olá! Gostaria de comprar o produto oficial "${shirt.name}" do Poeirão F.C. no valor de ${shirt.price} (Tamanho/Opção: ${size}). Como faço para combinar o pagamento e entrega?`;
    return `https://wa.me/${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. SUB-BARRA DA LOJA COM BOTÃO VOLTAR E INDICADOR */}
      <div className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-850 border border-slate-800 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Voltar ao Site Principal</span>
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-red-500">
            Loja Oficial Poeirão F.C.
          </span>
        </div>
      </div>

      {/* 2. HERO EXCLUSIVO DA LOJA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 py-12 sm:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Loja Oficial do Poeirão Futebol Clube
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase max-w-3xl mx-auto leading-tight">
            VISTA AS CORES DO <span className="text-red-500">POEIRÃO F.C.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Aqui você adquire os produtos oficiais do time. <strong>100% da renda das vendas</strong> é revertida diretamente para o clube, ajudando no custeio das viagens, uniformes, arbitragens e materiais esportivos dos atletas.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Tecido Dry-Fit e Poliéster
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Envio Rápido e Seguro
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Atendimento Direto no WhatsApp
            </span>
          </div>
        </div>
      </section>

      {/* 3. FILTROS E PRODUTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                activeCategory === 'all'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todos os Produtos ({shirts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('camisas')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                activeCategory === 'camisas'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Camisas Oficiais
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('em_breve')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                activeCategory === 'em_breve'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Novidades em Breve
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Entregas em toda a região e envio para torcedores de todo o Brasil
          </p>
        </div>

        {/* AVISO QUANDO PEDIDOS ESTIVEREM DESATIVADOS PELA DIRETORIA */}
        {!storeOrdersEnabled && (
          <div className="mb-8 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                Pedidos pelo WhatsApp Temporariamente Pausados
              </h4>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                No momento nossos produtos estão aguardando reposição de estoque. Os pedidos via WhatsApp foram pausados pela diretoria para não acumular mensagens. Assim que novas unidades chegarem, as vendas serão reativadas imediatamente!
              </p>
            </div>
          </div>
        )}

        {/* GRADE DE PRODUTOS */}
        {activeCategory !== 'em_breve' && (
          <div className={`grid gap-6 sm:gap-8 ${
            shirts.length === 1 
              ? 'max-w-md mx-auto grid-cols-1' 
              : shirts.length === 2 
                ? 'max-w-3xl mx-auto grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {shirts.map((shirt) => {
              const currentSize = selectedSizes[shirt.id] || (shirt.sizes && shirt.sizes[1]) || 'M';
              const buyLink = getWhatsAppBuyLink(shirt);

              return (
                <div
                  key={shirt.id}
                  className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  {/* IMAGEM DO PRODUTO */}
                  <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-6 overflow-hidden border-b border-slate-800">
                    {shirt.badge && (
                      <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        {shirt.badge}
                      </span>
                    )}

                    {shirt.imageSrc ? (
                      <img
                        src={shirt.imageSrc}
                        alt={shirt.name}
                        className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="relative w-44 h-48 flex items-center justify-center">
                        <svg
                          viewBox="0 0 200 200"
                          className="w-full h-full drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M60 40 L30 75 L55 90 L65 70 L65 175 L135 175 L135 70 L145 90 L170 75 L140 40 L115 50 C110 55 90 55 85 50 Z"
                            fill="#dc2626"
                            stroke="#991b1b"
                            strokeWidth="3"
                          />
                          <rect x="75" y="55" width="15" height="120" fill="#0f172a" />
                          <rect x="110" y="55" width="15" height="120" fill="#0f172a" />
                          <path d="M85 50 C90 55 110 55 115 50" stroke="#ffffff" strokeWidth="4" />
                        </svg>

                        <div className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none drop-shadow">
                          <Crest className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 text-[11px] font-bold text-slate-400 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-lg">
                      Dry-Fit e Poliéster
                    </div>
                  </div>

                  {/* DADOS DO PRODUTO */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
                        {shirt.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {shirt.description || 'Camisa oficial do Poeirão F.C. em tecido Dry-Fit e poliéster de alta durabilidade.'}
                      </p>

                      {/* TAMANHOS */}
                      <div className="mt-5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Selecione o tamanho:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(shirt.sizes || ['P', 'M', 'G', 'GG', 'XGG']).map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSelectSize(shirt.id, size)}
                              className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                                currentSize === size
                                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-600 ring-offset-2 ring-offset-slate-900'
                                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* PREÇO E BOTÃO PEDIR NO WHATSAPP */}
                    <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Preço</span>
                        <span className="text-2xl font-black text-emerald-400 tracking-tight">{shirt.price}</span>
                      </div>

                      {storeOrdersEnabled ? (
                        <a
                          href={buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>Pedir no Zap</span>
                        </a>
                      ) : (
                        <div
                          className="inline-flex items-center gap-1.5 bg-slate-950 text-slate-400 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-3 rounded-xl border border-slate-800 cursor-not-allowed select-none opacity-80"
                          title="Vendas pausadas temporariamente por falta de estoque"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Esgotado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CARD DE FUTUROS PRODUTOS / EM BREVE */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
          <div className="w-14 h-14 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-white uppercase">
            Mais Produtos Oficiais em Breve!
          </h4>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Estamos preparando a linha completa do torcedor tricolor: <strong>bonés oficiais, copos térmicos, agasalhos e chaveiros</strong>. Assim que estiverem prontos, a diretoria adicionará todos aqui na loja!
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-3 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Página Principal</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
