import React, { useState, useEffect } from 'react';
import { Crest } from './Crest';
import { SITE_CONFIG } from '../siteConfig';
import { ShieldCheck, Heart, Instagram, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import jpxWhiteLogoImg from '../assets/patrocinador-jpx-studio-white.png';
import { subscribeToClubSettings } from '../services/firebase';

interface FooterProps {
  // Footer props
}

export const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  const [jpxCustom, setJpxCustom] = useState<string | null>(() => {
    return (
      localStorage.getItem('poeirao_asset_jpx_footer') ||
      localStorage.getItem('poeirao_asset_jpx_white') ||
      localStorage.getItem('poeirao_asset_jpx')
    );
  });

  useEffect(() => {
    const handleUpdate = () => {
      setJpxCustom(
        localStorage.getItem('poeirao_asset_jpx_footer') ||
        localStorage.getItem('poeirao_asset_jpx_white') ||
        localStorage.getItem('poeirao_asset_jpx')
      );
    };
    const handleJpxEvent = (e: CustomEvent) => {
      if (e.detail) setJpxCustom(e.detail);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('asset-updated', handleUpdate);
    window.addEventListener('jpx-logo-updated', handleJpxEvent as EventListener);

    // Escuta em tempo real da nuvem
    const unsub = subscribeToClubSettings((settings) => {
      if (settings.jpxFooter !== undefined) {
        setJpxCustom(settings.jpxFooter || null);
        try {
          if (settings.jpxFooter) {
            localStorage.setItem('poeirao_asset_jpx_footer', settings.jpxFooter);
            localStorage.setItem('poeirao_asset_jpx_white', settings.jpxFooter);
          } else {
            localStorage.removeItem('poeirao_asset_jpx_footer');
            localStorage.removeItem('poeirao_asset_jpx_white');
          }
        } catch {}
      }
    });

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('asset-updated', handleUpdate);
      window.removeEventListener('jpx-logo-updated', handleJpxEvent as EventListener);
      unsub();
    };
  }, []);

  const logoSrc = jpxCustom || jpxWhiteLogoImg;

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PARTE SUPERIOR DO FOOTER: INFORMAÇÕES DO CLUBE E NAVEGAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* COLUNA 1: IDENTIDADE DO CLUBE */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <Crest className="h-14 w-auto" />
              <div>
                <span className="font-black text-xl tracking-tight text-white block">
                  {SITE_CONFIG.clube.nome}
                </span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  {SITE_CONFIG.clube.sigla} · PROGRAMA SÓCIO TORCEDOR
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              O Poeirão Futebol Clube é mais que um time: é uma paixão comunitária, tradição e garra dentro das quatro linhas. Cada sócio torcedor é o combustível para nossas vitórias e conquistas.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Plataforma oficial de sócios torcedores com pagamentos processados via Stripe.</span>
            </div>
          </div>

          {/* COLUNA 2: LINKS RÁPIDOS */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#inicio" className="hover:text-red-400 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-red-400 transition-colors">
                  Planos de Sócio
                </a>
              </li>
              <li>
                <a href="#historia" className="hover:text-red-400 transition-colors font-medium">
                  História do Poeirão
                </a>
              </li>
              <li>
                <a href="#loja" className="hover:text-red-400 transition-colors">
                  Loja Poeirão
                </a>
              </li>
              <li>
                <a href="#patrocinadores" className="hover:text-red-400 transition-colors">
                  Patrocinadores Oficiais
                </a>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO E SUPORTE DO CLUBE */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">
              Atendimento do Clube
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p>
                <strong className="text-slate-300 block text-xs uppercase tracking-wider">WhatsApp Oficial:</strong>
                <a
                  href={SITE_CONFIG.whatsapp.linkDireto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {SITE_CONFIG.whatsapp.numeroFormatado}
                </a>
              </p>
              <p>
                <strong className="text-slate-300 block text-xs uppercase tracking-wider">E-mail:</strong>
                <a
                  href={`mailto:${SITE_CONFIG.clube.emailContato}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.clube.emailContato}
                </a>
              </p>
              <p className="text-xs text-slate-500">
                Horário de atendimento: Segunda a Sexta das 08h às 18h e em dias de partidas oficiais.
              </p>
            </div>
          </div>

        </div>

        {/* 
          =================================================================================
          CRÉDITOS OFICIAIS DE CRIAÇÃO DO SITE: JPX STUDIO
          Contato: 77 98167-7054 | Instagram: @jpxstudio9
          ================================================================================= 
        */}
        <div className="py-8 my-6 px-6 sm:px-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          {/* Brilho sutil de fundo */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Lado Esquerdo: Logo e Identidade JPX Studio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            
            {/* Bloco da Logo JPX Studio */}
            <div className="flex flex-col items-center shrink-0">
              <div 
                className="h-16 w-36 flex items-center justify-center p-2 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner"
              >
                <img
                  src={logoSrc}
                  alt="Logo JPX Studio - Criador do Site"
                  className="max-h-12 max-w-full object-contain drop-shadow"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-red-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Desenvolvimento & Design Oficial</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                Site Criado e Desenvolvido por JPX STUDIO
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                Especialistas em identidade visual, desenvolvimento web de alta performance e soluções digitais completas.
              </p>
            </div>
          </div>

          {/* Lado Direito: Botões Diretos de Contato JPX Studio */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {/* Botão Direto WhatsApp JPX Studio */}
            <a
              href="https://wa.me/5577981677054?text=Ol%C3%A1%20JPX%20Studio!%20Vi%20o%20site%20do%20Poeir%C3%A3o%20F.C.%20e%20gostaria%20de%20um%20or%C3%A7amento."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com JPX Studio no WhatsApp"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 sm:px-5 rounded-xl transition-all shadow-md shadow-emerald-950/40 hover:scale-[1.03] active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp: (77) 98167-7054</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* Botão Direto Instagram JPX Studio */}
            <a
              href="https://instagram.com/jpxstudio9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar Instagram @jpxstudio9"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 sm:px-5 rounded-xl transition-all shadow-md shadow-pink-950/40 hover:scale-[1.03] active:scale-98"
            >
              <Instagram className="w-4 h-4" />
              <span>@jpxstudio9</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* PARTE INFERIOR DO FOOTER: DIREITOS AUTORAIS E TERMOS */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {currentYear} {SITE_CONFIG.clube.nome} ({SITE_CONFIG.clube.sigla}). Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="#planos"
              className="hover:text-slate-300 transition-colors"
            >
              Termos de Uso do Sócio
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#planos"
              className="hover:text-slate-300 transition-colors"
            >
              Política de Privacidade
            </a>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              Feito com <Heart className="w-3.5 h-3.5 text-red-600 fill-current" /> pela torcida
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
