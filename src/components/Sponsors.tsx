import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { Handshake, MessageCircle, ExternalLink, ShieldCheck, Megaphone, Plus } from 'lucide-react';
import { getStoredSponsors, SponsorItem } from '../utils/sponsorsManager';

interface SponsorsProps {
  sponsors?: SponsorItem[];
}

export const Sponsors: React.FC<SponsorsProps> = ({ sponsors: propSponsors }) => {
  const [localSponsors, setLocalSponsors] = useState<SponsorItem[]>(getStoredSponsors);

  useEffect(() => {
    const handleUpdate = () => {
      setLocalSponsors(getStoredSponsors());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('asset-updated', handleUpdate);
    window.addEventListener('sponsors-changed', ((e: CustomEvent) => {
      if (e.detail) setLocalSponsors(e.detail);
    }) as EventListener);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('asset-updated', handleUpdate);
    };
  }, []);

  const sponsors = propSponsors || localSponsors;

  const whatsappPatrocinioUrl = `https://wa.me/${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(
    'Olá! Tenho interesse em anunciar e ser um patrocinador oficial do Poeirão Futebol Clube.'
  )}`;

  return (
    <section id="patrocinadores" className="py-20 bg-slate-50 text-slate-900 border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CABEÇALHO DA SEÇÃO DE PATROCINADORES (PARCEIROS POEIRÃO) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#c8102e] mb-2">
            <Handshake className="w-4 h-4" />
            <span>PARCEIROS POEIRÃO · JOGAM JUNTO COM O POEIRÃO</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tight font-condensed">
            NOSSOS PARCEIROS OFICIAIS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Marcas e empresas que apoiam o futebol tricolor e fortalecem o Poeirão F.C. dentro e fora de campo.
          </p>
        </div>

        {/* 
          =================================================================================
          GRADE DE PATROCINADORES EM ORDENS (5 CARDS POR FILA NO COMPUTADOR: lg:grid-cols-5)
          ================================================================================= 
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5 max-w-7xl mx-auto">
          {sponsors.map((sponsor) => {
            const hasLogo = Boolean(sponsor.logoSrc);

            if (hasLogo) {
              return (
                <div
                  key={sponsor.id}
                  className="group relative flex flex-col justify-between p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-red-500 shadow-xs hover:shadow-lg transition-all duration-300 text-center"
                >
                  {/* Badge com Numeração em Ordem */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 py-0.5 px-2 rounded-full border border-red-100">
                      <ShieldCheck className="w-3 h-3 text-red-600 shrink-0" />
                      <span>Oficial</span>
                    </span>
                    <span className="text-[11px] font-black text-slate-300 group-hover:text-red-500 transition-colors">
                      #{sponsor.order}
                    </span>
                  </div>

                  {/* ÁREA DA LOGO DO PATROCINADOR COM SOMBRA VERMELHA SUAVE DE DESTAQUE */}
                  <div className="flex-1 flex flex-col items-center justify-center py-2.5 min-h-[95px] relative">
                    {/* Sombra / Iluminação vermelha suave de fundo */}
                    <div
                      className="absolute inset-0 m-auto w-20 sm:w-24 h-14 bg-red-600/15 rounded-full blur-xl pointer-events-none group-hover:bg-red-600/25 transition-all duration-300 transform group-hover:scale-110"
                      aria-hidden="true"
                    />

                    {/* Imagem da Logo com drop-shadow vermelho suave nos contornos */}
                    <img
                      src={sponsor.logoSrc}
                      alt={`Logo Oficial de ${sponsor.name}`}
                      className="relative z-10 max-h-16 max-w-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none drop-shadow-[0_4px_10px_rgba(220,38,38,0.22)]"
                      loading="lazy"
                    />
                  </div>

                  {/* NOME DO PATROCINADOR */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {sponsor.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                      {sponsor.category}
                    </p>
                  </div>
                </div>
              );
            }

            // VAGA SEM LOGO: EXIBE 'DIVULGUE SUA MARCA AQUI'
            return (
              <a
                key={sponsor.id}
                href={whatsappPatrocinioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between p-4 bg-white/60 hover:bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-red-500 shadow-2xs hover:shadow-md transition-all duration-300 text-center cursor-pointer"
                title="Clique para ser um patrocinador oficial no WhatsApp"
              >
                {/* Badge da Vaga Disponível */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400 group-hover:text-red-600 group-hover:bg-red-50 py-0.5 px-1.5 rounded-md transition-colors">
                    <Plus className="w-2.5 h-2.5" />
                    <span>Disponível</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 group-hover:text-red-500 transition-colors">
                    #{sponsor.order}
                  </span>
                </div>

                {/* ÁREA CENTRAL COM CHAMADA 'DIVULGUE SUA MARCA AQUI' */}
                <div className="flex-1 flex flex-col items-center justify-center py-3 min-h-[95px]">
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-red-50 flex items-center justify-center text-slate-400 group-hover:text-red-600 transition-colors mb-2">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-slate-700 group-hover:text-red-600 leading-tight transition-colors">
                    DIVULGUE SUA MARCA AQUI
                  </span>
                </div>

                {/* RODAPÉ DO CARD COM CTA */}
                <div className="mt-1 pt-2 border-t border-slate-100/80">
                  <span className="text-[10px] font-bold text-red-600 group-hover:underline inline-flex items-center gap-1">
                    <span>Seja Patrocinador</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* BANNER INFORMATIVO: SEJA UM PATROCINADOR DO POEIRÃO F.C. */}
        <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-black text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-400 block mb-1">
              Divulgue a sua marca com o Poeirão
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Quer ver sua empresa estampada aqui?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              Apoie nosso clube, alcance centenas de torcedores e faça parte da nossa história vitoriosa.
            </p>
          </div>

          <a
            href={whatsappPatrocinioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-red-950/40 hover:scale-[1.02] shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Quero Patrocinar</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

      </div>
    </section>
  );
};
