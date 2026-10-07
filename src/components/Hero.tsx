import React, { useState } from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { Crest } from './Crest';
import { ArrowDown, ShieldCheck, Shirt, Users, Sparkles } from 'lucide-react';

interface HeroProps {
  editMode?: boolean;
  onNavigateToHistory?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToHistory }) => {
  // Lista de imagens candidatas da torcida
  const candidateImages = [
    SITE_CONFIG.torcidaBannerUrl,
    '/torcida.jpg',
    '/torcida.jpeg',
    '/torcida.png',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80',
  ];

  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [bgFailed, setBgFailed] = useState(false);

  const handleImageError = () => {
    if (currentCandidateIndex < candidateImages.length - 1) {
      setCurrentCandidateIndex(prev => prev + 1);
    } else {
      setBgFailed(true);
    }
  };

  const currentBannerImage = candidateImages[currentCandidateIndex];

  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950 text-white"
    >
      {/* 
        =================================================================================
        IMAGEM DE FUNDO DA TORCIDA DO POEIRÃO:
        Carrega /IMG_1610.jpg ou /torcida.jpg com filtro escurecido para leitura ideal do texto
        ================================================================================= 
      */}
      <div className="absolute inset-0 z-0">
        {!bgFailed ? (
          <img
            src={currentBannerImage}
            alt="Torcida Apaixonada do Poeirão Futebol Clube"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transform brightness-[0.38] contrast-[1.12] saturate-[0.9] animate-in fade-in duration-700"
            onError={handleImageError}
          />
        ) : (
          // Fallback dinâmico estilizado de arena esportiva escura
          <div className="w-full h-full bg-radial from-slate-900 via-neutral-950 to-black" />
        )}

        {/* 
          OVERLAY PROFISSIONAL ESCURECIDO (VINHETA E CONTRASTE):
          Camadas de gradiente preto, leve toque rubro-negro e vinheta radial
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-red-950/25 to-black/85" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90" />
        
        {/* Padrão sutil geométrico de gramado / textura esportiva */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* CONTEÚDO PRINCIPAL DO HERO */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* ESCUDO DO CLUBE NO CENTRO DO HERO */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-6 bg-red-600/25 rounded-full blur-2xl group-hover:bg-red-600/40 transition-all duration-500" />
            <div className="relative">
              <Crest className="h-28 w-auto sm:h-36 md:h-40 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
            <span>Poeirão Futebol Clube</span>
            <span aria-hidden="true">·</span>
            <span>Orgulho Tricolor</span>
          </div>
        </div>

        {/* TÍTULO PRINCIPAL EM CAIXA ALTA (EXATAMENTE COMO REQUISITADO) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl drop-shadow-md">
          SEJA SÓCIO POEIRÃO, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-300">
            VOCÊ FAZ NOSSA EQUIPE GANHAR!
          </span>
        </h1>

        {/* SUBTÍTULO COM CHAMADA PARA AÇÃO (CTA) */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow">
          Apoie diretamente o crescimento do nosso clube, garanta descontos exclusivos em camisas oficiais e faça parte dessa história que dinheiro nenhum compra.
        </p>

        {/* BOTÕES PRINCIPAIS: SEJA SÓCIO, PARCEIROS E HISTÓRIA DO POEIRÃO */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <a
            href="#planos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-base sm:text-lg uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Seja Sócio Agora</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </a>

          <a
            href="#patrocinadores"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 font-bold text-base px-6 py-4 rounded-xl backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Conhecer Nossos Parceiros</span>
          </a>

          <button
            type="button"
            onClick={() => {
              if (onNavigateToHistory) {
                onNavigateToHistory();
              } else {
                window.location.hash = '#historia';
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-950 text-white border border-slate-700/80 hover:border-red-500/60 font-bold text-base px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>História do Poeirão</span>
          </button>
        </div>

        {/* BARRA DE DESTAQUES RÁPIDOS (ESTATÍSTICAS / VALORES) */}
        <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/15 max-w-4xl text-left">
          <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Descontos em Camisas</p>
              <p className="text-sm font-semibold text-white">Preço Especial no Manto Oficial</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Exclusividade</p>
              <p className="text-sm font-semibold text-white">Faça parte dessa história</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="p-2.5 rounded-lg bg-white/20 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Apoio Real</p>
              <p className="text-sm font-semibold text-white">100% investido no Futebol do PFC</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
