export interface ShirtItem {
  id: string;
  name: string;
  category?: string;
  price: string;
  imageSrc: string;
  description?: string;
  badge?: string;
  sizes?: string[];
}

// Apenas 1 modelo aparente por padrão no site (outros podem ser adicionados na Área Restrita)
export const INITIAL_SHIRTS: ShirtItem[] = [
  {
    id: 'shirt_oficial_2026',
    name: 'Camisa Oficial 2026 - Poeirão F.C.',
    category: 'Jogo 1',
    price: 'R$ 89,90',
    imageSrc: '',
    badge: 'Oficial 2026',
    description: 'Camisa oficial de jogo em tecido Dry-Fit e poliéster, acabamento premium e detalhes tricolores exclusivos.',
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
  },
];

const STORAGE_KEY_SHIRTS = 'poeirao_store_shirts_v3';

export function getStoredShirts(): ShirtItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHIRTS);
    if (!raw) return INITIAL_SHIRTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
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
