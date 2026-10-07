export interface ShirtItem {
  id: string;
  name: string;
  category?: string; // 'camisas' | 'treino' | 'acessorios' | 'infantil' | string
  categoryLabel?: string;
  price: string;
  originalPrice?: string;
  imageSrc: string;
  description?: string;
  badge?: string;
  sizes?: string[];
  inStock?: boolean; // Controle INDIVIDUAL por produto (true = Pedir no Zap ativo; false = Esgotado)
  fabricDetails?: string;
  allowCustomization?: boolean; // Opção de personalizar com Nome e Número
}

export interface TeamPhotoItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageSrc: string;
}

// Modelos iniciais padrão da Loja Oficial Poeirão F.C.
export const INITIAL_SHIRTS: ShirtItem[] = [
  {
    id: 'shirt_oficial_2026',
    name: 'Camisa Oficial 2026 - Poeirão F.C.',
    category: 'camisas',
    categoryLabel: 'Camisa de Jogo',
    price: 'R$ 89,90',
    originalPrice: 'R$ 119,90',
    imageSrc: '/foto-time-1.png',
    badge: 'Lançamento 2026',
    description: 'Camisa oficial de jogo em tecido Dry-Fit e poliéster de alta tecnologia, escudo oficial em alta definição e acabamento tricolor premium.',
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    inStock: true,
    fabricDetails: '100% Poliéster Dry-Fit • Proteção UV • Costura Reforçada',
    allowCustomization: true,
  },
  {
    id: 'shirt_reserva_2026',
    name: 'Manto Reserva Branco 2026',
    category: 'camisas',
    categoryLabel: 'Camisa de Jogo',
    price: 'R$ 89,90',
    originalPrice: 'R$ 119,90',
    imageSrc: '/foto-time-2.png',
    badge: 'Edição Especial',
    description: 'Segundo uniforme oficial na cor branca clássica com faixas em vermelho e preto e gola tricolor trabalhada.',
    sizes: ['P', 'M', 'G', 'GG'],
    inStock: true,
    fabricDetails: 'Tecido Dry-Fit Ventilado • Secagem Rápida',
    allowCustomization: true,
  },
  {
    id: 'agasalho_treino_2026',
    name: 'Camisa de Treino & Pré-Jogo',
    category: 'treino',
    categoryLabel: 'Treino & Agasalhos',
    price: 'R$ 79,90',
    imageSrc: '/foto-time-3.png',
    badge: 'Linha Atleta',
    description: 'Modelo leve para aquecimento e treinos diários dos atletas do Poeirão F.C.',
    sizes: ['P', 'M', 'G', 'GG'],
    inStock: true,
    fabricDetails: 'Microfibra Respirável • Logo JPX e Patrocinadores',
    allowCustomization: true,
  },
  {
    id: 'bone_tricolor_2026',
    name: 'Boné Aba Curva Oficial Poeirão',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Bonés',
    price: 'R$ 49,90',
    imageSrc: '',
    badge: 'Mais Vendido',
    description: 'Boné estruturado com escudo bordado em relevo 3D e fecho ajustável de metal.',
    sizes: ['Único'],
    inStock: true,
    fabricDetails: 'Sarja 100% Algodão Premium • Fecho Ajustável',
    allowCustomization: false,
  },
];

// 3 Espaços de Fotos Oficiais do Time (Ensaio Editorial estilo imagem de referência)
// Mesma legenda da imagem 3 aplicada em todas conforme solicitação: "Postura, garra e identidade visual que representam nossa terra"
export const INITIAL_TEAM_PHOTOS: TeamPhotoItem[] = [
  {
    id: 'photo_1_elenco',
    title: 'Ensaio Oficial do Elenco',
    subtitle: 'Postura, garra e identidade visual que representam nossa terra',
    badge: 'LANÇAMENTO 2026',
    imageSrc: '/foto-time-1.png',
  },
  {
    id: 'photo_2_manto',
    title: 'O Manto em Campo',
    subtitle: 'Postura, garra e identidade visual que representam nossa terra',
    badge: 'ENSAIO EXCLUSIVO',
    imageSrc: '/foto-time-2.png',
  },
  {
    id: 'photo_3_detalhes',
    title: 'Detalhes do Escudo & Tecido',
    subtitle: 'Postura, garra e identidade visual que representam nossa terra',
    badge: 'QUALIDADE PREMIUM',
    imageSrc: '/foto-time-3.png',
  },
];

const STORAGE_KEY_SHIRTS = 'poeirao_store_shirts_v4';
const STORAGE_KEY_TEAM_PHOTOS = 'poeirao_team_photos_v1';

export function getStoredShirts(): ShirtItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHIRTS);
    if (!raw) {
      // Fallback para versão anterior se existir
      const oldRaw = localStorage.getItem('poeirao_store_shirts_v3');
      if (oldRaw) {
        const parsed = JSON.parse(oldRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Garante inStock true como padrão
          return parsed.map((item: any) => ({
            ...item,
            inStock: item.inStock !== undefined ? item.inStock : true,
            category: item.category || 'camisas',
          }));
        }
      }
      return INITIAL_SHIRTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => ({
        ...item,
        inStock: item.inStock !== undefined ? item.inStock : true,
        category: item.category || 'camisas',
        allowCustomization: item.allowCustomization !== undefined ? item.allowCustomization : item.category !== 'acessorios',
      }));
    }
  } catch (e) {
    console.warn('Erro ao carregar camisas do localStorage:', e);
  }
  return INITIAL_SHIRTS;
}

export function saveStoredShirts(shirts: ShirtItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHIRTS, JSON.stringify(shirts));
    window.dispatchEvent(new CustomEvent('shirts-updated', { detail: shirts }));
  } catch (e) {
    console.warn('Erro ao salvar camisas no localStorage:', e);
  }
}

export function getStoredTeamPhotos(): TeamPhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM_PHOTOS);
    if (!raw) return INITIAL_TEAM_PHOTOS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return INITIAL_TEAM_PHOTOS.map((defPhoto, idx) => {
        const found = parsed.find((p: any) => p.id === defPhoto.id) || parsed[idx];
        if (!found) return defPhoto;
        return {
          ...defPhoto,
          ...found,
          imageSrc: found.imageSrc || defPhoto.imageSrc,
          subtitle: found.subtitle || defPhoto.subtitle,
        };
      });
    }
  } catch (e) {
    console.warn('Erro ao carregar fotos do time:', e);
  }
  return INITIAL_TEAM_PHOTOS;
}

export function saveStoredTeamPhotos(photos: TeamPhotoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAM_PHOTOS, JSON.stringify(photos));
    window.dispatchEvent(new CustomEvent('team-photos-updated', { detail: photos }));
  } catch (e) {
    console.warn('Erro ao salvar fotos do time no localStorage:', e);
  }
}
