import React from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    /* 
      ===================================================================================
      BOTÃO OFICIAL DE SUPORTE WHATSAPP DO TIME
      Link: https://wa.me/SEU_NUMERO
      Substitua o número no arquivo src/siteConfig.ts na chave 'whatsapp.numero'
      =================================================================================== 
    */
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      {/* BOTÃO PRINCIPAL COM EFEITO DE PULSO */}
      <a
        href={SITE_CONFIG.whatsapp.linkDireto}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar com o Suporte Oficial no WhatsApp do Poeirão F.C. ${SITE_CONFIG.whatsapp.numeroFormatado}`}
        title={`Falar no WhatsApp do Poeirão F.C.: ${SITE_CONFIG.whatsapp.numeroFormatado}`}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-110"
      >
        {/* Anel pulsante */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
        
        {/* Ícone */}
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform group-hover:rotate-12" />
        
        {/* Badge "Online" */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full z-20" />
      </a>
    </div>
  );
};
