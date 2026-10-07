import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import fallbackConfig from '../../firebase-applet-config.json';
import { SponsorItem, INITIAL_SPONSORS } from '../utils/sponsorsManager';
import { ShirtItem, INITIAL_SHIRTS, TeamPhotoItem, INITIAL_TEAM_PHOTOS } from '../utils/storeManager';
import { MemberItem, INITIAL_MEMBERS } from '../utils/membersManager';

// Permite usar variáveis de ambiente (como no Netlify / Vercel) ou o arquivo de configuração local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (fallbackConfig as any).firestoreDatabaseId || '(default)',
};

// Inicializa o app Firebase (singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Banco de dados Firestore com suporte a databaseId customizado ou padrão
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

// Validação de conexão inicial
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using cached local data.');
    }
  }
}
testConnection();

export interface ClubSettingsData {
  escudo?: string | null;
  jpxFooter?: string | null;
  storeOrdersEnabled?: boolean;
  updatedAt?: any;
}

/**
 * Escuta alterações no Escudo, Logo JPX e Status de Vendas da Loja em tempo real de qualquer dispositivo.
 */
export function subscribeToClubSettings(
  callback: (settings: { escudo?: string; jpxFooter?: string; storeOrdersEnabled?: boolean }) => void
) {
  try {
    const settingsRef = doc(db, 'settings', 'club');
    return onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback({
            escudo: data.escudo || undefined,
            jpxFooter: data.jpxFooter || undefined,
            storeOrdersEnabled: data.storeOrdersEnabled !== undefined ? data.storeOrdersEnabled : true,
          });
        }
      },
      (err) => {
        console.warn('Aviso no listener de settings do Firebase:', err);
      }
    );
  } catch (e) {
    console.error('Falha ao inicializar listener de configurações:', e);
    return () => {};
  }
}

/**
 * Escuta alterações nos 25 Patrocinadores em tempo real de qualquer dispositivo.
 */
export function subscribeToSponsors(
  callback: (sponsors: SponsorItem[]) => void
) {
  try {
    const sponsorsRef = doc(db, 'settings', 'sponsors_list');
    return onSnapshot(
      sponsorsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.items) && data.items.length > 0) {
            const cloudMap = new Map<string, SponsorItem>(
              data.items.map((s: SponsorItem) => [s.id, s])
            );
            const merged = INITIAL_SPONSORS.map((initial) => {
              const found = cloudMap.get(initial.id);
              if (found) {
                return {
                  ...initial,
                  name: found.name || initial.name,
                  logoSrc: found.logoSrc !== undefined ? found.logoSrc : initial.logoSrc,
                  description: found.description || initial.description,
                };
              }
              return initial;
            });
            callback(merged);
          }
        }
      },
      (err) => {
        console.warn('Aviso no listener de patrocinadores do Firebase:', err);
      }
    );
  } catch (e) {
    console.error('Falha ao inicializar listener de patrocinadores:', e);
    return () => {};
  }
}

/**
 * Salva o Escudo, Logo JPX e/ou Status da Loja na nuvem para refletir em todos os aparelhos.
 */
export async function saveClubSettingsToCloud(settings: {
  escudo?: string;
  jpxFooter?: string;
  storeOrdersEnabled?: boolean;
}): Promise<void> {
  try {
    const settingsRef = doc(db, 'settings', 'club');
    const payload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };
    if (settings.escudo !== undefined) payload.escudo = settings.escudo;
    if (settings.jpxFooter !== undefined) payload.jpxFooter = settings.jpxFooter;
    if (settings.storeOrdersEnabled !== undefined) payload.storeOrdersEnabled = settings.storeOrdersEnabled;

    await setDoc(settingsRef, payload, { merge: true });
  } catch (err) {
    console.error('Erro ao salvar configurações no Firebase:', err);
  }
}

/**
 * Salva a lista de patrocinadores na nuvem para refletir em todos os aparelhos.
 */
export async function saveSponsorsToCloud(sponsors: SponsorItem[]): Promise<void> {
  try {
    const sponsorsRef = doc(db, 'settings', 'sponsors_list');
    await setDoc(sponsorsRef, {
      items: sponsors,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Erro ao salvar patrocinadores no Firebase:', err);
  }
}

/**
 * Escuta alterações no catálogo de camisas da Loja Poeirão em tempo real.
 */
export function subscribeToStoreShirts(
  callback: (shirts: ShirtItem[]) => void
) {
  try {
    const storeRef = doc(db, 'settings', 'store_shirts');
    return onSnapshot(
      storeRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.items) && data.items.length > 0) {
            callback(data.items);
          }
        }
      },
      (err) => {
        console.warn('Aviso no listener da loja de camisas do Firebase:', err);
      }
    );
  } catch (e) {
    console.error('Falha ao inicializar listener da loja:', e);
    return () => {};
  }
}

/**
 * Salva a lista de camisas da Loja Poeirão na nuvem para refletir em todos os aparelhos.
 */
export async function saveStoreShirtsToCloud(shirts: ShirtItem[]): Promise<void> {
  try {
    const storeRef = doc(db, 'settings', 'store_shirts');
    await setDoc(storeRef, {
      items: shirts,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Erro ao salvar camisas no Firebase:', err);
  }
}

/**
 * Escuta alterações na lista de Sócios Torcedores em tempo real de qualquer dispositivo.
 */
export function subscribeToMembers(
  callback: (members: MemberItem[]) => void
) {
  try {
    const membersRef = doc(db, 'settings', 'members_list');
    return onSnapshot(
      membersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.items) && data.items.length > 0) {
            callback(data.items);
          }
        }
      },
      (err) => {
        console.warn('Aviso no listener de sócios torcedores do Firebase:', err);
      }
    );
  } catch (e) {
    console.error('Falha ao inicializar listener de sócios:', e);
    return () => {};
  }
}

/**
 * Salva a lista de sócios torcedores na nuvem para refletir em tempo real em todos os celulares.
 */
export async function saveMembersToCloud(members: MemberItem[]): Promise<void> {
  try {
    const membersRef = doc(db, 'settings', 'members_list');
    await setDoc(membersRef, {
      items: members,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Erro ao salvar sócios no Firebase:', err);
  }
}

/**
 * Escuta alterações nas Fotos Oficiais do Time / Ensaio da Loja em tempo real.
 */
export function subscribeToTeamPhotos(
  callback: (photos: TeamPhotoItem[]) => void
) {
  try {
    const galleryRef = doc(db, 'settings', 'team_gallery');
    return onSnapshot(
      galleryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.items) && data.items.length > 0) {
            callback(data.items);
          }
        }
      },
      (err) => {
        console.warn('Aviso no listener de galeria de fotos do Firebase:', err);
      }
    );
  } catch (e) {
    console.error('Falha ao inicializar listener de fotos do time:', e);
    return () => {};
  }
}

/**
 * Salva as fotos oficiais do time na nuvem para refletir em todos os aparelhos.
 */
export async function saveTeamPhotosToCloud(photos: TeamPhotoItem[]): Promise<void> {
  try {
    const galleryRef = doc(db, 'settings', 'team_gallery');
    await setDoc(galleryRef, {
      items: photos,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Erro ao salvar fotos do time no Firebase:', err);
  }
}

