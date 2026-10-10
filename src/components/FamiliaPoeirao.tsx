import React, { useState, useRef, useEffect } from 'react';
import { FamiliaPhotoItem } from '../utils/familiaManager';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface FamiliaPoeiraoProps {
  photos: FamiliaPhotoItem[];
  onOpenAdmin?: () => void;
}

export const FamiliaPoeirao: React.FC<FamiliaPoeiraoProps> = ({
  photos,
  onOpenAdmin,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Monitora o estado de rolagem do carrossel para habilitar/desabilitar botões
  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [photos.length]);

  const handleScrollLeft = () => {
    if (!carouselRef.current) return;
    const containerWidth = carouselRef.current.clientWidth;
    // Rola proporcionalmente ao tamanho visível (ou ~2 a 3 cards)
    const scrollDistance = containerWidth > 640 ? containerWidth * 0.75 : containerWidth * 0.85;
    carouselRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    if (!carouselRef.current) return;
    const containerWidth = carouselRef.current.clientWidth;
    const scrollDistance = containerWidth > 640 ? containerWidth * 0.75 : containerWidth * 0.85;
    carouselRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
  };

  const handlePrevZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! - 1 + photos.length) % photos.length);
  };

  const handleNextZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! + 1) % photos.length);
  };

  const currentZoomPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <section id="familia-poeirao" className="py-14 sm:py-20 bg-slate-50 text-slate-900 border-t border-slate-200/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 text-center">
        {/* TÍTULO DESTACADO (#FAMÍLIAPOEIRÃO) CONFORME IMAGEM 1 */}
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#c8102e] hover:opacity-90 transition-opacity">
            #FAMÍLIAPOEIRÃO
          </h2>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto font-medium">
          A paixão tricolor que une famílias, torcedores e atletas da nossa terra.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* CARROSSEL DE FOTOS ILIMITADAS COM BOTÕES CIRCULARES IDENTICOS À IMAGEM 2    */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-10">
        
        {/* BOTÃO NAVEGAR PARA A ESQUERDA (CIRCULAR COMO NA IMAGEM 2) */}
        <button
          type="button"
          onClick={handleScrollLeft}
          className={`absolute left-1 sm:left-3 lg:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl ${
            canScrollLeft ? 'opacity-100' : 'opacity-40 hover:scale-100 cursor-default'
          }`}
          aria-label="Ver fotos anteriores"
          title="Fotos anteriores"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* BOTÃO NAVEGAR PARA A DIREITA (CIRCULAR COMO NA IMAGEM 2) */}
        <button
          type="button"
          onClick={handleScrollRight}
          className={`absolute right-1 sm:right-3 lg:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl ${
            canScrollRight ? 'opacity-100' : 'opacity-40 hover:scale-100 cursor-default'
          }`}
          aria-label="Ver próximas fotos"
          title="Próximas fotos"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* CONTAINER DO CARROSSEL HORIZONTAL COM ROLAGEM SUAVE E SNAP */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 sm:px-4 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group relative flex-none w-[240px] sm:w-[270px] md:w-[290px] lg:w-[310px] h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 snap-start border border-slate-800"
            >
              <img
                src={item.imageSrc || '/foto-time-1.png'}
                alt={item.title || `Foto ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/foto-time-1.png';
                }}
              />

              {/* Vinheta gradiente de leitura de legenda */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Tag com numeração da foto */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-white/10">
                #{idx + 1}
              </div>

              {/* Ícone de zoom no hover */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-amber-300" />
              </div>

              {/* Legenda destacada no rodapé */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#ffd100] block drop-shadow-md">
                  {item.title}
                </span>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2 mt-1 font-medium leading-snug drop-shadow-sm">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DE ZOOM DA FOTO EM ALTA RESOLUÇÃO COM NAVEGAÇÃO LATERAL             */}
      {/* ========================================================================= */}
      {currentZoomPhoto && selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Botão fechar */}
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-600 transition cursor-pointer border border-white/20 shadow-2xl"
            aria-label="Fechar zoom"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Seta anterior no modal */}
          <button
            type="button"
            onClick={handlePrevZoom}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Seta próxima no modal */}
          <button
            type="button"
            onClick={handleNextZoom}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 w-full flex items-center justify-center bg-black min-h-[300px] overflow-hidden">
              <img
                src={currentZoomPhoto.imageSrc || '/foto-time-1.png'}
                alt={currentZoomPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain select-none"
              />
            </div>
            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 block mb-0.5">
                  Foto {selectedPhotoIndex + 1} de {photos.length}
                </span>
                <h3 className="text-base sm:text-xl font-black uppercase text-white">
                  {currentZoomPhoto.title}
                </h3>
                {currentZoomPhoto.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {currentZoomPhoto.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
