import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Plans } from './components/Plans';
import { FamiliaPoeirao } from './components/FamiliaPoeirao';
import { MemberPortalPage } from './components/MemberPortalPage';
import { HistoryPage } from './components/HistoryPage';
import { Sponsors } from './components/Sponsors';
import { Footer } from './components/Footer';
import { AdminLogosModal } from './components/AdminLogosModal';
import { getStoredSponsors, saveStoredSponsors, SponsorItem } from './utils/sponsorsManager';
import {
  getStoredMembers,
  saveStoredMembers,
  MemberItem,
} from './utils/membersManager';
import {
  SubCategoryItem,
  getStoredSubCategories,
  saveStoredSubCategories,
  subscribeToSubCategories,
  saveSubCategoriesToCloud,
} from './utils/historyManager';
import {
  FamiliaPhotoItem,
  getStoredFamiliaPhotos,
  saveStoredFamiliaPhotos,
} from './utils/familiaManager';
import {
  subscribeToClubSettings,
  subscribeToSponsors,
  subscribeToMembers,
  subscribeToFamiliaPhotos,
  subscribeToHeroBgPhotos,
  saveSponsorsToCloud,
  saveMembersToCloud,
  saveClubSettingsToCloud,
  saveFamiliaPhotosToCloud,
  saveHeroBgPhotosToCloud,
} from './services/firebase';

export default function App() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sponsors, setSponsors] = useState<SponsorItem[]>(getStoredSponsors);
  const [members, setMembers] = useState<MemberItem[]>(getStoredMembers);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>(getStoredSubCategories);
  const [familiaPhotos, setFamiliaPhotos] = useState<FamiliaPhotoItem[]>(getStoredFamiliaPhotos);
  const [heroBgPhotos, setHeroBgPhotos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('poeirao_hero_bg_photos_v1');
      return saved ? JSON.parse(saved) : ['/foto-time-1.png', '/foto-time-2.png', '/foto-time-3.png'];
    } catch {
      return ['/foto-time-1.png', '/foto-time-2.png', '/foto-time-3.png'];
    }
  });

  const [adminInitialTab, setAdminInitialTab] = useState<'escudo_jpx' | 'sponsors' | 'familia' | 'members' | 'history'>('familia');
  
  // Controle de visualização: 'home', 'socio' ou 'historia' (Loja removida conforme solicitação)
  const [viewMode, setViewMode] = useState<'home' | 'socio' | 'historia'>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('plano') || searchParams.has('plan') || searchParams.get('status') === 'sucesso') {
      return 'socio';
    }
    const cleanHash = window.location.hash.split('?')[0];
    if (cleanHash === '#historia' || cleanHash === '#historia-do-poeirao' || cleanHash === '#historia-poeirao') return 'historia';
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
      if (cleanHash === '#historia' || cleanHash === '#historia-do-poeirao' || cleanHash === '#historia-poeirao') {
        setViewMode('historia');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (cleanHash === '#socio' || cleanHash === '#area-do-socio' || cleanHash === '#carteirinha') {
        setViewMode('socio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setViewMode('home');
      }
    };

    window.addEventListener('hashchange', handleHash);

    // 1. Sincroniza patrocinadores (Parceiros Poeirão) em tempo real
    const unsubSponsors = subscribeToSponsors((cloudSponsors) => {
      setSponsors(cloudSponsors);
      try {
        localStorage.setItem('poeirao_all_sponsors_v4', JSON.stringify(cloudSponsors));
      } catch {}
    });

    // 2. Sincroniza Escudo Oficial e Logo JPX
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
      if (settings.logoSocio !== undefined) {
        try {
          if (settings.logoSocio) {
            localStorage.setItem('poeirao_asset_logo_socio', settings.logoSocio);
          } else {
            localStorage.removeItem('poeirao_asset_logo_socio');
          }
        } catch {}
        window.dispatchEvent(new Event('asset-updated'));
        window.dispatchEvent(new CustomEvent('logo-socio-updated', { detail: settings.logoSocio }));
      }
    });

    // 3. Sincroniza fotos da galeria #FAMÍLIAPOEIRÃO em tempo real
    const unsubFamilia = subscribeToFamiliaPhotos((cloudPhotos) => {
      setFamiliaPhotos(cloudPhotos);
      try {
        localStorage.setItem('poeirao_familia_photos_v1', JSON.stringify(cloudPhotos));
      } catch {}
    });

    // 4. Sincroniza sócios torcedores em tempo real
    const unsubMembers = subscribeToMembers((cloudMembers) => {
      setMembers(cloudMembers);
      try {
        localStorage.setItem('poeirao_club_members_v1', JSON.stringify(cloudMembers));
      } catch {}
    });

    // 5. Sincroniza categorias e história do clube em tempo real
    const unsubHistory = subscribeToSubCategories((cloudCats) => {
      setSubCategories(cloudCats);
      try {
        localStorage.setItem('poeirao_history_categories_v1', JSON.stringify(cloudCats));
      } catch {}
    });

    // 6. Sincroniza as 3 fotos de fundo do Banner Principal (Hero) em tempo real entre PC e celular
    const unsubHeroBg = subscribeToHeroBgPhotos((cloudPhotos) => {
      if (Array.isArray(cloudPhotos) && cloudPhotos.length > 0) {
        setHeroBgPhotos(cloudPhotos);
        try {
          localStorage.setItem('poeirao_hero_bg_photos_v1', JSON.stringify(cloudPhotos));
        } catch {}
      }
    });

    // Auto-sincronização do PC para a nuvem: se este aparelho já possui fotos salvas
    // no localStorage (como o PC do usuário), enviamos para a nuvem para que o celular receba de imediato!
    try {
      const localHeroRaw = localStorage.getItem('poeirao_hero_bg_photos_v1');
      if (localHeroRaw) {
        const localHero = JSON.parse(localHeroRaw);
        if (Array.isArray(localHero) && localHero.length > 0) {
          saveHeroBgPhotosToCloud(localHero);
        }
      }
    } catch {}

    // Auto-sincronização de patrocinadores locais para a nuvem:
    // Se o usuário adicionou ou alterou patrocinadores neste navegador (ex: Opera),
    // enviamos para o Firebase para que Brave, celulares e outros navegadores recebam instantaneamente!
    try {
      const localSponsors = getStoredSponsors();
      const hasCustom = localSponsors.some(
        (s) => s.id.startsWith('slot_') && (s.logoSrc || (s.name && !s.name.startsWith('Patrocinador #')))
      );
      if (hasCustom) {
        saveSponsorsToCloud(localSponsors);
      }
    } catch {}

    return () => {
      window.removeEventListener('hashchange', handleHash);
      unsubSponsors();
      unsubClub();
      unsubFamilia();
      unsubMembers();
      unsubHistory();
      unsubHeroBg();
    };
  }, []);

  const handleNavigateToMemberPortal = () => {
    setViewMode('socio');
    window.location.hash = '#socio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHistory = () => {
    setViewMode('historia');
    window.location.hash = '#historia';
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

  const handleUpdateSponsors = async (updatedSponsors: SponsorItem[]) => {
    setSponsors(updatedSponsors);
    saveStoredSponsors(updatedSponsors);
    await saveSponsorsToCloud(updatedSponsors);
  };

  const handleUpdateMembers = async (updatedMembers: MemberItem[]) => {
    setMembers(updatedMembers);
    saveStoredMembers(updatedMembers);
    await saveMembersToCloud(updatedMembers);
  };

  const handleUpdateFamiliaPhotos = async (updatedPhotos: FamiliaPhotoItem[]) => {
    setFamiliaPhotos(updatedPhotos);
    saveStoredFamiliaPhotos(updatedPhotos);
    await saveFamiliaPhotosToCloud(updatedPhotos);
  };

  const handleUpdateHeroBgPhotos = async (updatedPhotos: string[]) => {
    setHeroBgPhotos(updatedPhotos);
    try {
      localStorage.setItem('poeirao_hero_bg_photos_v1', JSON.stringify(updatedPhotos));
    } catch {}
    await saveHeroBgPhotosToCloud(updatedPhotos);
  };

  const handleUpdateSubCategories = async (updatedCategories: SubCategoryItem[]) => {
    setSubCategories(updatedCategories);
    saveStoredSubCategories(updatedCategories);
    await saveSubCategoriesToCloud(updatedCategories);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. CABEÇALHO FIXO COM BARRA VERMELHA, LOGO E LINKS */}
      <Navbar
        onOpenAdminModal={() => {
          setAdminInitialTab('familia');
          setIsAdminModalOpen(true);
        }}
        onNavigateToMemberPortal={handleNavigateToMemberPortal}
        onNavigateToHistory={handleNavigateToHistory}
        onNavigateToHome={handleBackToHome}
        onNavigateToSection={handleNavigateToSection}
        activePage={viewMode}
        members={members}
      />

      {viewMode === 'historia' ? (
        /* ========================================================================= */
        /* ABA EXCLUSIVA DEDICADA À HISTÓRIA DO POEIRÃO & CATEGORIAS (SUB-11 AO MASTER) */
        /* ========================================================================= */
        <main className="flex-1 pt-20">
          <HistoryPage
            onBack={handleBackToHome}
            onOpenAdmin={(tab) => {
              setAdminInitialTab((tab as any) || 'history');
              setIsAdminModalOpen(true);
            }}
            onNavigateToPlans={() => handleNavigateToSection('planos')}
            subCategories={subCategories}
            onUpdateSubCategories={handleUpdateSubCategories}
          />
        </main>
      ) : viewMode === 'socio' ? (
        /* ========================================================================= */
        /* ABA EXCLUSIVA DEDICADA À ÁREA DO SÓCIO TORCEDOR (CARTEIRINHA VIRTUAL)     */
        /* ========================================================================= */
        <main className="flex-1 pt-20">
          <MemberPortalPage
            onBackToHome={handleBackToHome}
            members={members}
            onSaveMember={handleSaveMember}
            onDeleteMember={handleDeleteMember}
          />
        </main>
      ) : (
        /* ========================================================================= */
        /* PÁGINA PRINCIPAL DO CLUBE                                                 */
        /* ========================================================================= */
        <main className="flex-1">
          {/* 2. SEÇÃO HERO (SOMENTE AS INFORMAÇÕES DAS IMAGENS 1 E 2 + 3 FOTOS DE FUNDO) */}
          <Hero
            onNavigateToHistory={handleNavigateToHistory}
            onNavigateToMemberPortal={handleNavigateToMemberPortal}
            onNavigateToPlans={() => handleNavigateToSection('planos')}
            backgroundPhotos={heroBgPhotos}
          />

          {/* 3. SEÇÃO DE PLANOS (PAGAMENTO SEGURO DIRETO NO STRIPE) */}
          <Plans />

          {/* 4. GALERIA #FAMÍLIAPOEIRÃO EDITÁVEL NO CADEADO (IMAGEM 7) */}
          <FamiliaPoeirao
            photos={familiaPhotos}
            onOpenAdmin={() => {
              setAdminInitialTab('familia');
              setIsAdminModalOpen(true);
            }}
          />

          {/* 5. SEÇÃO DE PATROCINADORES OFICIAIS (PARCEIROS POEIRÃO) */}
          <Sponsors sponsors={sponsors} />
        </main>
      )}

      {/* 6. RODAPÉ COM CRÉDITOS JPX STUDIO, TERMOS E DIREITOS */}
      <Footer />

      {/* 7. MODAL DE ADMINISTRAÇÃO ("CADEADO DE DIREÇÃO") - SENHA '22232425' */}
      <AdminLogosModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAuthenticated={isAuthenticated}
        onAuthenticate={(auth) => setIsAuthenticated(auth)}
        sponsors={sponsors}
        onUpdateSponsors={handleUpdateSponsors}
        familiaPhotos={familiaPhotos}
        onUpdateFamiliaPhotos={handleUpdateFamiliaPhotos}
        heroBgPhotos={heroBgPhotos}
        onUpdateHeroBgPhotos={handleUpdateHeroBgPhotos}
        members={members}
        onUpdateMembers={handleUpdateMembers}
        subCategories={subCategories}
        onUpdateSubCategories={handleUpdateSubCategories}
        initialTab={adminInitialTab}
      />
    </div>
  );
}
