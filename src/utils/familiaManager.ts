export interface FamiliaPhotoItem {
  id: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
}

export const INITIAL_FAMILIA_PHOTOS: FamiliaPhotoItem[] = [
  {
    id: 'fam_1',
    title: 'Kits & Brindes Exclusivos',
    subtitle: 'Manto oficial e produtos exclusivos do sócio',
    imageSrc: '/foto-time-1.png',
  },
  {
    id: 'fam_2',
    title: 'Torcida Apaixonada',
    subtitle: 'Nossos sócios torcedores presentes em todos os jogos',
    imageSrc: '/foto-time-2.png',
  },
  {
    id: 'fam_3',
    title: 'A Nova Geração',
    subtitle: 'O amor pelo Poeirão passando de pai para filho',
    imageSrc: '/foto-time-3.png',
  },
  {
    id: 'fam_4',
    title: 'Família & Conquistas',
    subtitle: 'Celebrando cada vitória e campeonato do time',
    imageSrc: '/WhatsApp Image 2026-10-02 at 18.41.20.jpeg',
  },
  {
    id: 'fam_5',
    title: 'Experiência de Jogo',
    subtitle: 'A emoção de viver o Poeirão de perto',
    imageSrc: '/WhatsApp Image 2026-01-26 at 15.10.55.jpeg',
  },
];

const STORAGE_KEY_FAMILIA = 'poeirao_familia_photos_v1';

export function getStoredFamiliaPhotos(): FamiliaPhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAMILIA);
    if (!raw) return INITIAL_FAMILIA_PHOTOS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_FAMILIA_PHOTOS;
  } catch {
    return INITIAL_FAMILIA_PHOTOS;
  }
}

export function saveStoredFamiliaPhotos(photos: FamiliaPhotoItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_FAMILIA, JSON.stringify(photos));
    window.dispatchEvent(new Event('familia-photos-updated'));
  } catch (e) {
    console.error('Erro ao salvar fotos da família Poeirão:', e);
  }
}
