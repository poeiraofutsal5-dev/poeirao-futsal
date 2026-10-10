import React, { useState, useEffect } from 'react';
import { Crest } from './Crest';
import { SITE_CONFIG } from '../siteConfig';
import { Menu, X, Lock, LogIn, KeyRound, MessageCircle, User } from 'lucide-react';
import { PasswordRecoveryModal } from './PasswordRecoveryModal';
import { FaqModal } from './FaqModal';
import { MemberItem } from '../utils/membersManager';

interface NavbarProps {
  onOpenAdminModal?: () => void;
  onNavigateToStore?: () => void;
  onNavigateToMemberPortal?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  activePage?: 'home' | 'loja' | 'socio' | 'historia';
  members?: MemberItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminModal,
  onNavigateToStore,
  onNavigateToMemberPortal,
  onNavigateToHistory,
  onNavigateToHome,
  onNavigateToSection,
  activePage = 'home',
  members = [],
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [logoSocio, setLogoSocio] = useState<string | null>(() => {
    try {
      return localStorage.getItem('poeirao_asset_logo_socio');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setLogoSocio(localStorage.getItem('poeirao_asset_logo_socio'));
      } catch {}
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('asset-updated', handleUpdate);
    window.addEventListener('logo-socio-updated', ((e: CustomEvent) => {
      setLogoSocio(e.detail || null);
    }) as EventListener);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('asset-updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

  const handleJoinClick = () => {
    handleLinkClick('planos');
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    if (onNavigateToMemberPortal) {
      onNavigateToMemberPortal();
    } else {
      window.location.hash = '#socio';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* BARRA PRINCIPAL ESTILO SÓCIO ESQUADRÃO (VERMELHO TRICOLOR) */}
        <nav
          className={`w-full bg-[#c8102e] text-white shadow-xl transition-all duration-300 border-b border-red-700/60 ${
            isScrolled ? 'py-1.5 sm:py-2 backdrop-blur-md' : 'py-2.5 sm:py-3.5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* LOGO ESQUERDA: ESCUDO DO TIME + NA FRENTE A LOGO DO SÓCIO (EDITÁVEL NA DIREÇÃO) */}
              <button
                type="button"
                onClick={() => handleLinkClick('inicio')}
                className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl cursor-pointer text-left py-1"
                aria-label="Sócio Poeirão - Página Inicial"
              >
                {/* 1. ESCUDO DO TIME */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute -inset-1 bg-white/15 rounded-full blur-xs group-hover:bg-white/25 transition-all" />
                  <Crest className="h-10 sm:h-12 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105" />
                </div>

                {/* 2. NA FRENTE: LOGO DO SÓCIO */}
                {logoSocio ? (
                  <img
                    src={logoSocio}
                    alt="Logo do Sócio Poeirão"
                    className="h-9 sm:h-11 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center leading-none">
                      <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-white/95">
                        SÓCIO
                      </span>
                    </div>
                    <span className="font-condensed font-black text-2xl sm:text-3xl text-white tracking-wider leading-none mt-0.5 group-hover:text-amber-300 transition-colors">
                      POEIRÃO
                    </span>
                  </div>
                )}
              </button>

              {/* DIREITA DESKTOP: DOIS NÍVEIS (BOTÕES DE AÇÃO NO TOPO + LINKS DE MENU EMBAIXO) */}
              <div className="hidden lg:flex flex-col items-end gap-1.5">
                {/* LINHA 1: 3 BOTÕES DE AÇÃO IDÊNTICOS AO BAHIA (RECUPERAR SENHA, QUERO ME ASSOCIAR, ENTRAR) */}
                <div className="flex items-center gap-2.5">
                  {/* BOTÃO 1: RECUPERAR SENHA (AZUL ROYAL) */}
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-[#0070d2] hover:bg-[#005fb3] active:bg-[#005299] text-white text-[11px] font-black uppercase tracking-wider py-1.5 px-3.5 rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer border border-blue-400/30"
                    title="Recuperar senha de acesso"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-white" />
                    <span>Recuperar Senha</span>
                  </button>

                  {/* BOTÃO 2: QUERO ME ASSOCIAR (AZUL ROYAL) */}
                  <button
                    type="button"
                    onClick={handleJoinClick}
                    className="inline-flex items-center gap-1.5 bg-[#0070d2] hover:bg-[#005fb3] active:bg-[#005299] text-white text-[11px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer border border-blue-400/30"
                  >
                    <span>Quero me associar</span>
                  </button>

                  {/* BOTÃO 3: ENTRAR (VERMELHO COM BORDA BRANCA) */}
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="inline-flex items-center gap-1.5 bg-[#c8102e] hover:bg-white hover:text-[#c8102e] text-white text-[11px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full border-2 border-white shadow-md transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white group-hover:text-[#c8102e] transition-colors" />
                    <span>Entrar</span>
                  </button>

                  {/* ACESSO DIRETORIA DISCRETO */}
                  {onOpenAdminModal && (
                    <button
                      type="button"
                      onClick={onOpenAdminModal}
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                      title="Painel Administrativo da Diretoria"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* LINHA 2: NAVEGAÇÃO DE LINKS (PLANOS, PARCEIROS, HISTÓRIA, LOJA, DÚVIDAS, FALE CONOSCO) */}
                <ul className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/90">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('planos')}
                      className="hover:text-amber-300 transition-colors cursor-pointer py-1"
                    >
                      Planos
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('patrocinadores')}
                      className="hover:text-amber-300 transition-colors cursor-pointer py-1"
                    >
                      Parceiros Poeirão
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className="hover:text-amber-300 transition-colors cursor-pointer py-1 inline-flex items-center gap-1.5"
                    >
                      <span>Sua Área</span>
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
                      className={`hover:text-amber-300 transition-colors cursor-pointer py-1 ${
                        activePage === 'historia' ? 'text-amber-300 font-black underline underline-offset-4' : ''
                      }`}
                    >
                      História do Poeirão
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsFaqModalOpen(true)}
                      className="hover:text-amber-300 transition-colors cursor-pointer py-1"
                    >
                      Dúvidas
                    </button>
                  </li>
                  <li>
                    <a
                      href={SITE_CONFIG.whatsapp.linkDireto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-300 transition-colors cursor-pointer py-1 inline-flex items-center gap-1"
                    >
                      <span>Fale Conosco</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* BOTÕES RÁPIDOS TABLET/MOBILE */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>

                <button
                  type="button"
                  onClick={handleJoinClick}
                  className="bg-[#0070d2] hover:bg-[#005fb3] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-full shadow cursor-pointer"
                >
                  <span>Associar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-white hover:bg-white/10 rounded-lg focus:outline-none transition-colors"
                  aria-label="Abrir menu mobile"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* MENU EXPANSÍVEL MOBILE */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-3 pt-3 border-t border-white/20 pb-3 space-y-2 animate-fade-in">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPasswordModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#0070d2] text-white text-xs font-black uppercase py-2.5 px-3 rounded-xl shadow"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Recuperar Senha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLoginClick();
                    }}
                    className="flex items-center justify-center gap-1.5 bg-white text-[#c8102e] text-xs font-black uppercase py-2.5 px-3 rounded-xl shadow"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Entrar no Sócio</span>
                  </button>
                </div>

                <ul className="space-y-1 font-bold text-sm uppercase">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('planos')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                      Planos de Sócio
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('patrocinadores')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                      Parceiros Poeirão
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition flex items-center justify-between"
                    >
                      <span>Sua Área</span>
                      <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-black uppercase">Sócio</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onNavigateToHistory) onNavigateToHistory();
                        else window.location.hash = '#historia';
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                      História do Poeirão
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsFaqModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                      Dúvidas Frequentes
                    </button>
                  </li>
                  <li>
                    <a
                      href={SITE_CONFIG.whatsapp.linkDireto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-emerald-300 font-black transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Fale Conosco (WhatsApp)</span>
                    </a>
                  </li>
                  {onOpenAdminModal && (
                    <li className="pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenAdminModal();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-white/60 hover:text-white flex items-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Acesso Diretoria</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* MODAL RECUPERAÇÃO DE SENHA */}
      <PasswordRecoveryModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        members={members}
      />

      {/* MODAL DE DÚVIDAS / FAQ */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onNavigateToPlans={() => handleLinkClick('planos')}
      />
    </>
  );
};
