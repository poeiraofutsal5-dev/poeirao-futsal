import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { Crest } from './Crest';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroProps {
  editMode?: boolean;
  onNavigateToHistory?: () => void;
  onNavigateToMemberPortal?: () => void;
  onNavigateToPlans?: () => void;
  backgroundPhotos?: string[];
}

export const Hero: React.FC<HeroProps> = ({
  onNavigateToHistory,
  onNavigateToMemberPortal,
  onNavigateToPlans,
  backgroundPhotos,
}) => {
  // 3 FOTOS DE FUNDO ROTATIVAS CONFORME SOLICITAÇÃO DO USUÁRIO
  const defaultBgPhotos = [
    '/foto-time-1.png',
    '/foto-time-2.png',
    '/foto-time-3.png',
  ];

  const photos = backgroundPhotos && backgroundPhotos.length > 0 ? backgroundPhotos : defaultBgPhotos;

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Garante que o índice esteja sempre dentro dos limites das fotos
  useEffect(() => {
    if (currentPhotoIdx >= photos.length) {
      setCurrentPhotoIdx(0);
    }
  }, [photos.length, currentPhotoIdx]);

  // Troca automática suave de fotos a cada 5.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIdx((prev) => (prev + 1) % photos.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [photos.length]);

  const handlePrevPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToPlans) {
      onNavigateToPlans();
    } else {
      const el = document.getElementById('planos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePartnersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('patrocinadores');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative pt-[72px] sm:pt-[84px] bg-[#001426] text-white overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. FUNDO COM AS 3 FOTOS ROTATIVAS COM CROSSFADE SUAVE                       */}
      {/* ========================================================================= */}
      <div className="relative min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Camadas das 3 Fotos em Crossfade - Meio termo de opacidade equilibrada */}
        {photos.map((src, idx) => {
          const imgSrc = src || defaultBgPhotos[idx] || '/foto-time-1.png';
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentPhotoIdx === idx ? 'opacity-80 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={imgSrc}
                alt={`Poeirão F.C. Fundo ${idx + 1}`}
                className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/foto-time-1.png';
                }}
              />
            </div>
          );
        })}

        {/* Overlay equilibrado (meio-termo entre antes e agora: foto visível sem competir com os textos) */}
        <div className="absolute inset-0 bg-[#001020]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001426] via-transparent to-[#001426]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001020]/60 via-transparent to-[#001020]/60 pointer-events-none" />

        {/* SETAS DE NAVEGAÇÃO LATERAL (CIRCULARES COMO NO BAHIA) */}
        <button
          type="button"
          onClick={handlePrevPhoto}
          className="absolute left-2 sm:left-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNextPhoto}
          className="absolute right-2 sm:right-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* ========================================================================= */}
        {/* 2. CONTEÚDO ESCRITO: SOMENTE AS INFORMAÇÕES DAS IMAGENS 1 E 2              */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-8">
            
            {/* LADO ESQUERDO: EXATAMENTE CONFORME IMAGEM 1 (SEM CAIXA PESADA BLOQUEANDO O FUNDO) */}
            <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
              {/* Badge da Imagem 1 */}
              <div className="inline-block text-xs sm:text-sm font-extrabold tracking-widest text-white uppercase mb-2 bg-[#c8102e] px-3.5 py-1.5 rounded-full border border-red-400/40 shadow-md">
                ★ CAMISAS OFICIAIS & VANTAGENS EXCLUSIVAS
              </div>

              {/* Título Gigante da Imagem 1 */}
              <h1 className="font-condensed font-black text-4xl sm:text-6xl xl:text-7xl leading-[0.92] text-[#ffd100] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] tracking-tight uppercase mt-2">
                CHEGOU O <br />
                <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  SÓCIO POEIRÃO
                </span>
              </h1>

              {/* Subtítulo da Imagem 1 */}
              <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-200 max-w-lg font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Assine agora, garanta acesso com a sua Carteirinha Virtual Oficial e apoie o crescimento do futebol do Poeirão F.C.
              </p>

              {/* Botões de Ação */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <a
                  href="#planos"
                  onClick={handleJoinClick}
                  className="inline-flex items-center justify-center gap-2 bg-[#c8102e] hover:bg-[#a50d24] active:bg-[#850b1d] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-7 rounded-full shadow-xl shadow-red-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-red-500/40"
                >
                  <span>SEJA SÓCIO AGORA</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#patrocinadores"
                  onClick={handlePartnersClick}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                >
                  <span>CONHECER PARCEIROS</span>
                </a>
              </div>
            </div>

            {/* CENTRO: ESCUDO TRICOLOR DISCRETO COM GLOW */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
              <div className="w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>

            {/* LADO DIREITO: EXATAMENTE CONFORME IMAGEM 2 */}
            <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
              {/* Título Gigante da Imagem 2 */}
              <h2 className="font-condensed font-black text-3xl sm:text-5xl xl:text-6xl leading-[0.95] text-[#ffd100] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] tracking-tight uppercase">
                O MAIOR CLUBE <br />
                <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  DO FUTEBOL AMADOR
                </span> <br />
                <span className="text-[#ffd100]">
                  DA REGIÃO!
                </span>
              </h2>

              {/* CARD DE INFORMAÇÕES OFICIAIS DO CLUBE DA IMAGEM 2 */}
              <div className="mt-6 p-4 sm:p-5 bg-slate-950/80 border border-white/20 rounded-2xl backdrop-blur-md w-full max-w-md text-left shadow-2xl">
                <div className="flex items-center gap-3.5 mb-3 pb-3 border-b border-white/15">
                  <div className="p-1 rounded-xl bg-white/10 shrink-0 border border-white/20">
                    <Crest className="h-9 w-auto" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-amber-300 block">
                      CANAL OFICIAL DO SÓCIO
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide">
                      socio.poeiraofc.com.br
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">WhatsApp:</span>
                    <span className="text-white font-bold">{SITE_CONFIG.whatsapp.numeroFormatado}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold">Clube:</span>
                    <span className="text-slate-200">Poeirão F.C. · Fundado em 1998</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PONTOS DE PAGINAÇÃO DAS 3 FOTOS (ESTILO PÍLULA IDÊNTICO À IMAGEM 4) */}
        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-lg">
          {photos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentPhotoIdx(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentPhotoIdx === idx
                  ? 'w-7 h-2.5 bg-[#c8102e] ring-2 ring-white/40'
                  : 'w-2.5 h-2.5 bg-slate-400/60 hover:bg-white'
              }`}
              aria-label={`Ir para foto de fundo ${idx + 1}`}
              title={`Foto ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      {/* NOTA: A PARTE DE BAIXO (IMAGEM 3 - PRÓXIMO JOGO / CHECK-IN) FOI REMOVIDA CONFORME SOLICITADO */}
    </section>
  );
};
