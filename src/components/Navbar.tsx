import React, { useState, useEffect } from 'react';
import { Crest } from './Crest';
import { SITE_CONFIG } from '../siteConfig';
import { MessageCircle, Menu, X, ArrowUpRight, Lock, CreditCard } from 'lucide-react';

interface NavbarProps {
  onOpenAdminModal?: () => void;
  onNavigateToStore?: () => void;
  onNavigateToMemberPortal?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  activePage?: 'home' | 'loja' | 'socio' | 'historia';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminModal,
  onNavigateToStore,
  onNavigateToMemberPortal,
  onNavigateToHistory,
  onNavigateToHome,
  onNavigateToSection,
  activePage = 'home',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else if (onNavigateToHome) {
      onNavigateToHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.location.hash = '#' + sectionId;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* NAVBAR PRINCIPAL */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200'
            : 'bg-white py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* ESCUDO/LOGO DO TIME */}
          <button
            type="button"
            onClick={() => handleLinkClick('inicio')}
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md cursor-pointer text-left"
            aria-label="Poeirão Futebol Clube - Página Inicial"
          >
            <div className="relative">
              <Crest className="h-12 w-auto sm:h-14 drop-shadow-sm transition-transform duration-200 group-hover:scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-red-600 transition-colors">
                POEIRÃO F.C.
              </span>
              <span className="text-[11px] font-bold text-red-600 tracking-widest uppercase mt-0.5">
                SÓCIO TORCEDOR
              </span>
            </div>
          </button>

          {/* MENU DESKTOP REORGANIZADO E ELEGANTE */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* GRUPO 1: LINKS DE NAVEGAÇÃO PRINCIPAL */}
            <ul className="flex items-center gap-1.5 lg:gap-3 text-slate-700 font-semibold text-xs lg:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('inicio')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePage === 'home'
                      ? 'text-red-600 font-bold bg-red-50/80'
                      : 'hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('planos')}
                  className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-red-600 hover:bg-slate-50"
                >
                  Planos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToHistory) {
                      onNavigateToHistory();
                    } else {
                      window.location.hash = '#historia';
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePage === 'historia'
                      ? 'text-red-600 font-bold bg-red-50/80'
                      : 'hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  História do Poeirão
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToStore) {
                      onNavigateToStore();
                    } else {
                      window.location.hash = '#loja-poeirao';
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePage === 'loja'
                      ? 'text-red-600 font-bold bg-red-50/80'
                      : 'hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  Loja Poeirão
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('patrocinadores')}
                  className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-red-600 hover:bg-slate-50"
                >
                  Patrocinadores
                </button>
              </li>
            </ul>

            {/* SEPARADOR VERTICAL SUTIL */}
            <div className="h-5 w-px bg-slate-200"></div>

            {/* GRUPO 2: BOTÕES DE AÇÃO DESTACADOS (SEM 'SEJA SÓCIO', COM VISUAL PROFISSIONAL) */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* BOTÃO ÁREA DO SÓCIO COM CARTEIRINHA */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToMemberPortal) {
                    onNavigateToMemberPortal();
                  } else {
                    window.location.hash = '#socio';
                  }
                }}
                className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-sm ${
                  activePage === 'socio'
                    ? 'bg-red-600 text-white shadow-red-600/30'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200/80'
                }`}
                title="Acesse sua Carteirinha Virtual Oficial"
              >
                <CreditCard className="w-3.5 h-3.5 text-red-600" />
                <span>Área do Sócio</span>
              </button>

              {/* BOTÃO SUPORTE WHATSAPP */}
              <a
                href={SITE_CONFIG.whatsapp.linkDireto}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tirar dúvidas no WhatsApp"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all border border-emerald-500/30"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>

              {/* BOTÃO ÁREA RESTRITA DISCRETO */}
              {onOpenAdminModal && (
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-2.5 py-2 rounded-xl transition-colors cursor-pointer group"
                  title="Acesso com senha da diretoria"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span className="hidden xl:inline">Diretoria</span>
                </button>
              )}
            </div>
          </div>

          {/* BOTÃO MOBILE MENU (HAMBÚRGUER) */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={SITE_CONFIG.whatsapp.linkDireto}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Poeirão"
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MENU EXPANSÍVEL MOBILE */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <ul className="flex flex-col divide-y divide-slate-100">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('inicio')}
                  className="block w-full text-left py-3 text-base font-semibold text-slate-800 hover:text-red-600"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('planos')}
                  className="block w-full text-left py-3 text-base font-semibold text-slate-800 hover:text-red-600"
                >
                  Planos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateToHistory) {
                      onNavigateToHistory();
                    } else {
                      window.location.hash = '#historia';
                    }
                  }}
                  className={`block w-full text-left py-3 text-base font-semibold ${
                    activePage === 'historia' ? 'text-red-600 font-bold' : 'text-slate-800 hover:text-red-600'
                  }`}
                >
                  História do Poeirão
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateToStore) {
                      onNavigateToStore();
                    } else {
                      window.location.hash = '#loja';
                    }
                  }}
                  className="block w-full text-left py-3 text-base font-semibold text-slate-800 hover:text-red-600"
                >
                  Loja Poeirão
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('patrocinadores')}
                  className="block w-full text-left py-3 text-base font-semibold text-slate-800 hover:text-red-600"
                >
                  Patrocinadores
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateToMemberPortal) {
                      onNavigateToMemberPortal();
                    } else {
                      window.location.hash = '#socio';
                    }
                  }}
                  className={`w-full flex items-center justify-between py-3 text-base font-bold transition-colors ${
                    activePage === 'socio' ? 'text-red-600' : 'text-slate-800 hover:text-red-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-500" />
                    <span>Área do Sócio (Carteirinha)</span>
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-black uppercase">
                    Digital
                  </span>
                </button>
              </li>
              {onOpenAdminModal && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminModal();
                    }}
                    className="w-full flex items-center justify-between py-3 text-base font-semibold text-slate-500 hover:text-red-600"
                  >
                    <span>Área Restrita</span>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </button>
                </li>
              )}
            </ul>
            <div className="mt-4 pt-3 flex flex-col gap-2.5">
              <a
                href={SITE_CONFIG.whatsapp.linkDireto}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow uppercase text-xs tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento WhatsApp: {SITE_CONFIG.whatsapp.numeroFormatado}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

