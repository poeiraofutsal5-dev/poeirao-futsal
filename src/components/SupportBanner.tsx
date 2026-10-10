import React from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const SupportBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Detalhe de fundo */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-black/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Atendimento Personalizado</span>
          </div>

          {/* TÍTULO EXATO REQUISITADO */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-condensed">
            Ficou com alguma dúvida? Fale conosco no WhatsApp!
          </h2>
          
          <p className="mt-2 text-sm sm:text-base text-red-100 max-w-xl">
            Nossa equipe de atendimento ao sócio torcedor está pronta para ajudar você a escolher o melhor plano ou tirar dúvidas sobre pagamentos.
          </p>
        </div>

        {/* 
          ===============================================================================
          BOTÃO DIRETO DO WHATSAPP (BANNER FINAL):
          Substitua o número em src/siteConfig.ts ou utilize o link: https://wa.me/SEU_NUMERO
          =============================================================================== 
        */}
        <a
          href={SITE_CONFIG.whatsapp.linkDireto}
          target="_blank"
          rel="noopener noreferrer"
          title={`Falar no WhatsApp: ${SITE_CONFIG.whatsapp.numeroFormatado}`}
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-base uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 border border-emerald-400/30"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span>Falar no WhatsApp: {SITE_CONFIG.whatsapp.numeroFormatado}</span>
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};
