import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Plans } from './components/Plans';
import { StoreSection } from './components/StoreSection';
import { StorePage } from './components/StorePage';
import { MemberPortalPage } from './components/MemberPortalPage';
import { Sponsors } from './components/Sponsors';
import { SupportBanner } from './components/SupportBanner';
import { Footer } from './components/Footer';
import { AdminLogosModal } from './components/AdminLogosModal';
import { getStoredSponsors, SponsorItem } from './utils/sponsorsManager';
import {
  getStoredShirts,
  saveStoredShirts,
  ShirtItem,
  TeamPhotoItem,
  getStoredTeamPhotos,
  saveStoredTeamPhotos,
} from './utils/storeManager';
import {
  getStoredMembers,
  saveStoredMembers,
  MemberItem,
} from './utils/membersManager';
import {
  subscribeToClubSettings,
  subscribeToSponsors,
  subscribeToStoreShirts,
  subscribeToMembers,
  subscribeToTeamPhotos,
  saveMembersToCloud,
  saveClubSettingsToCloud,
  saveStoreShirtsToCloud,
  saveTeamPhotosToCloud,
} from './services/firebase';

export default function App() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sponsors, setSponsors] = useState<SponsorItem[]>(getStoredSponsors);
  const [shirts, setShirts] = useState<ShirtItem[]>(getStoredShirts);
  const [teamPhotos, setTeamPhotos] = useState<TeamPhotoItem[]>(getStoredTeamPhotos);
  const [members, setMembers] = useState<MemberItem[]>(getStoredMembers);
  const [storeOrdersEnabled, setStoreOrdersEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('poeirao_store_orders_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [adminInitialTab, setAdminInitialTab] = useState<'escudo_jpx' | 'sponsors' | 'store' | 'members'>('store');
  
  // Controle de visualização: 'home' (página inicial), 'loja' (loja poeirão) ou 'socio' (área do sócio torcedor)
  const [viewMode, setViewMode] = useState<'home' | 'loja' | 'socio'>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('plano') || searchParams.has('plan') || searchParams.get('status') === 'sucesso') {
      return 'socio';
    }
    const cleanHash = window.location.hash.split('?')[0];
    if (cleanHash === '#loja') return 'loja';
    if (cleanHash === '#socio' || cleanHash === '#area-do-socio' || cleanHash === '#carteirinha') return 'socio';
    return 'home';
  });

  useEffect(() => {
    const handleHash = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('plano') || searchParams.has('plan') || searchParams.get('status') === 'sucesso') {
        setViewMode('socio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const cleanHash = window.location.hash.split('?')[0];
      if (cleanHash === '#loja') {
        setViewMode('loja');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (cleanHash === '#socio' || cleanHash === '#area-do-socio' || cleanHash === '#carteirinha') {
        setViewMode('socio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setViewMode('home');
      }
    };

    window.addEventListener('hashchange', handleHash);

    // 1. Sincroniza lista de patrocinadores em tempo real para qualquer celular ou computador
    const unsubSponsors = subscribeToSponsors((cloudSponsors) => {
      setSponsors(cloudSponsors);
      try {
        localStorage.setItem('poeirao_all_sponsors_v4', JSON.stringify(cloudSponsors));
      } catch {}
    });

    // 2. Sincroniza Escudo Oficial, Logo JPX e Status da Loja em tempo real
    const unsubClub = subscribeToClubSettings((settings) => {
      if (settings.escudo) {
        try {
          localStorage.setItem('poeirao_asset_escudo', settings.escudo);
        } catch {}
        window.dispatchEvent(new Event('asset-updated'));
      }
      if (settings.jpxFooter) {
        try {
          localStorage.setItem('poeirao_asset_jpx_footer', settings.jpxFooter);
          localStorage.setItem('poeirao_asset_jpx_white', settings.jpxFooter);
        } catch {}
        window.dispatchEvent(new Event('asset-updated'));
        window.dispatchEvent(new CustomEvent('jpx-logo-updated', { detail: settings.jpxFooter }));
      }
      if (settings.storeOrdersEnabled !== undefined) {
        setStoreOrdersEnabled(settings.storeOrdersEnabled);
        try {
          localStorage.setItem('poeirao_store_orders_enabled', String(settings.storeOrdersEnabled));
        } catch {}
      }
    });

    // 3. Sincroniza catálogo de camisas da Loja Poeirão em tempo real
    const unsubStore = subscribeToStoreShirts((cloudShirts) => {
      setShirts(cloudShirts);
      try {
        localStorage.setItem('poeirao_store_shirts_v4', JSON.stringify(cloudShirts));
      } catch {}
    });

    // 3.5. Sincroniza fotos oficiais do time em tempo real
    const unsubTeamPhotos = subscribeToTeamPhotos((cloudPhotos) => {
      setTeamPhotos(cloudPhotos);
      try {
        localStorage.setItem('poeirao_team_photos_v1', JSON.stringify(cloudPhotos));
      } catch {}
    });

    // 4. Sincroniza lista de sócios torcedores em tempo real
    const unsubMembers = subscribeToMembers((cloudMembers) => {
      setMembers(cloudMembers);
      try {
        localStorage.setItem('poeirao_club_members_v1', JSON.stringify(cloudMembers));
      } catch {}
    });

    return () => {
      window.removeEventListener('hashchange', handleHash);
      unsubSponsors();
      unsubClub();
      unsubStore();
      unsubTeamPhotos();
      unsubMembers();
    };
  }, []);

  const handleNavigateToStore = () => {
    setViewMode('loja');
    window.location.hash = '#loja';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMemberPortal = () => {
    setViewMode('socio');
    window.location.hash = '#socio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setViewMode('home');
    window.location.hash = '#inicio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSection = (sectionId: string) => {
    setViewMode('home');
    window.location.hash = '#' + sectionId;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSaveMember = async (newMember: MemberItem) => {
    const updated = [newMember, ...members.filter((m) => m.id !== newMember.id)];
    setMembers(updated);
    saveStoredMembers(updated);
    await saveMembersToCloud(updated);
  };

  const handleDeleteMember = async (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    saveStoredMembers(updated);
    await saveMembersToCloud(updated);
  };

  const handleUpdateShirts = async (updatedShirts: ShirtItem[]) => {
    setShirts(updatedShirts);
    saveStoredShirts(updatedShirts);
    await saveStoreShirtsToCloud(updatedShirts);
  };

  const handleUpdateTeamPhotos = async (updatedPhotos: TeamPhotoItem[]) => {
    setTeamPhotos(updatedPhotos);
    saveStoredTeamPhotos(updatedPhotos);
    await saveTeamPhotosToCloud(updatedPhotos);
  };

  const handleToggleStoreOrders = async (enabled: boolean) => {
    setStoreOrdersEnabled(enabled);
    try {
      localStorage.setItem('poeirao_store_orders_enabled', String(enabled));
    } catch {}
    await saveClubSettingsToCloud({ storeOrdersEnabled: enabled });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. CABEÇALHO FIXO COM BARRA VERMELHA, LOGO E LINKS (SEMPRE PRESENTE) */}
      <Navbar
        onOpenAdminModal={() => {
          setAdminInitialTab('escudo_jpx');
          setIsAdminModalOpen(true);
        }}
        onNavigateToStore={handleNavigateToStore}
        onNavigateToMemberPortal={handleNavigateToMemberPortal}
        onNavigateToHome={handleBackToHome}
        onNavigateToSection={handleNavigateToSection}
        activePage={viewMode}
      />

      {viewMode === 'loja' ? (
        /* ========================================================================= */
        /* ABA EXCLUSIVA DEDICADA À LOJA POEIRÃO (PRODUTOS, CAMISAS E ACESSÓRIOS)    */
        /* ========================================================================= */
        <main className="flex-1 pt-20">
          <StorePage
            onBack={handleBackToHome}
            onOpenAdmin={(tab) => {
              setAdminInitialTab(tab || 'store');
              setIsAdminModalOpen(true);
            }}
            shirts={shirts}
            teamPhotos={teamPhotos}
            storeOrdersEnabled={storeOrdersEnabled}
          />
        </main>
      ) : viewMode === 'socio' ? (
        /* ========================================================================= */
        /* ABA EXCLUSIVA DEDICADA À ÁREA DO SÓCIO TORCEDOR (CARTEIRINHA VIRTUAL)     */
        /* ========================================================================= */
        <main className="flex-1 pt-20">
          <MemberPortalPage
            onBackToHome={handleBackToHome}
            onNavigateToStore={handleNavigateToStore}
            members={members}
            onSaveMember={handleSaveMember}
            onDeleteMember={handleDeleteMember}
            storeOrdersEnabled={storeOrdersEnabled}
            onToggleStoreOrders={handleToggleStoreOrders}
          />
        </main>
      ) : (
        /* ========================================================================= */
        /* PÁGINA PRINCIPAL DO CLUBE                                                 */
        /* ========================================================================= */
        <main className="flex-1">
          {/* 2. SEÇÃO HERO (BANNER IMPACTANTE DA TORCIDA COM CTA E ESCUDO) */}
          <Hero />

          {/* 3. SEÇÃO DE PLANOS (PAGAMENTO SEGURO DIRETO NO STRIPE) */}
          <Plans />

          {/* 4. BANNER EXPLICATIVO ACIMA DE PATROCINADORES COM BOTÃO PARA ABRIR A LOJA */}
          <StoreSection
            shirts={shirts}
            onNavigateToStore={handleNavigateToStore}
          />

          {/* 5. SEÇÃO DE PATROCINADORES OFICIAIS */}
          <Sponsors sponsors={sponsors} />

          {/* 6. BANNER RÁPIDO DE CONTATO NO WHATSAPP */}
          <SupportBanner />
        </main>
      )}

      {/* 7. RODAPÉ COM CRÉDITOS JPX STUDIO, TERMOS E DIREITOS (SEMPRE PRESENTE) */}
      <Footer />

      {/* 8. MODAL DE ADMINISTRAÇÃO COM SENHA '22232425' (ACESSÍVEL DE QUALQUER TELA) */}
      <AdminLogosModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAuthenticated={isAuthenticated}
        onAuthenticate={(auth) => setIsAuthenticated(auth)}
        sponsors={sponsors}
        onUpdateSponsors={(updatedSponsors) => setSponsors(updatedSponsors)}
        shirts={shirts}
        onUpdateShirts={handleUpdateShirts}
        teamPhotos={teamPhotos}
        onUpdateTeamPhotos={handleUpdateTeamPhotos}
        members={members}
        onUpdateMembers={(updatedMembers) => setMembers(updatedMembers)}
        initialTab={adminInitialTab}
        storeOrdersEnabled={storeOrdersEnabled}
        onToggleStoreOrders={handleToggleStoreOrders}
      />
    </div>
  );
}
