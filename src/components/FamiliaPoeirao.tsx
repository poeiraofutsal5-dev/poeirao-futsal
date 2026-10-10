import React, { useState } from 'react';
import { FamiliaPhotoItem } from '../utils/familiaManager';
import { Camera, X, Heart, Sparkles, ChevronRight, Users } from 'lucide-react';

interface FamiliaPoeiraoProps {
  photos: FamiliaPhotoItem[];
  onOpenAdmin?: () => void;
}

export const FamiliaPoeirao: React.FC<FamiliaPoeiraoProps> = ({
  photos,
  onOpenAdmin,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<FamiliaPhotoItem | null>(null);

  return (
    <section id="familia-poeirao" className="py-14 sm:py-20 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 text-center">
        {/* TÍTULO DESTACADO IDÊNTICO À IMAGEM 7 (#FAMÍLIAPALMEIRAS -> #FAMÍLIAPOEIRÃO) */}
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#c8102e] hover:opacity-90 transition-opacity">
            #FAMÍLIAPOEIRÃO
          </h2>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto font-medium">
          A paixão tricolor que une famílias, torcedores e atletas da nossa terra.
        </p>

        {onOpenAdmin && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition cursor-pointer"
              title="Editar fotos da galeria no painel da diretoria"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Editar fotos no cadeado</span>
            </button>
          </div>
        )}
      </div>

      {/* GALERIA HORIZONTAL COM AS 5 FOTOS LADO A LADO IDÊNTICA À IMAGEM 7 */}
      <div className="w-full px-2 sm:px-4 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 items-stretch">
          {photos.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedPhoto(item)}
              className="group relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={item.imageSrc || '/foto-time-1.png'}
                alt={item.title || `Foto ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Vinheta gradiente de leitura */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Legenda discreta no rodapé */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block drop-shadow">
                  {item.title}
                </span>
                {item.subtitle && (
                  <p className="text-[11px] text-slate-200 line-clamp-2 mt-0.5 font-medium leading-snug drop-shadow-sm">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Ícone de zoom no hover */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE ZOOM DA FOTO */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] w-full flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-5 bg-slate-900 border-t border-slate-800 text-white">
              <h3 className="text-lg font-black uppercase text-amber-300">
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {selectedPhoto.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
