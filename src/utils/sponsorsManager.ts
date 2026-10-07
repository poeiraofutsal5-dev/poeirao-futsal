import jpxLogoImg from '../assets/patrocinador-jpx-studio.png';
import protonLogoImg from '../assets/patrocinador-proton-contabeis.png';
import natoLogoImg from '../assets/patrocinador-nato-gym.png';

export interface SponsorItem {
  id: string;
  order: number;
  name: string;
  category: string;
  logoSrc: string;
  description?: string;
}

// 25 VAGAS TOTAIS (3 PRINCIPAIS + 22 DISPONÍVEIS = EXATAMENTE 5 FILAS DE 5)
export const INITIAL_SPONSORS: SponsorItem[] = [
  {
    id: 'jpx',
    order: 1,
    name: 'JPX Studio',
    category: 'Patrocinador Oficial',
    logoSrc: jpxLogoImg,
    description: 'Design e Desenvolvimento Web Oficial',
  },
  {
    id: 'proton',
    order: 2,
    name: 'Próton Serviços Contábeis',
    category: 'Patrocinador Oficial',
    logoSrc: protonLogoImg,
    description: 'Positivando a Sua Empresa',
  },
  {
    id: 'nato',
    order: 3,
    name: 'NATO GYM',
    category: 'Patrocinador Oficial',
    logoSrc: natoLogoImg,
    description: 'Centro de Treinamento e Saúde',
  },
  // VAGAS #4 ATÉ #25 (TODAS VISÍVEIS NO SITE: SE NÃO TIVER LOGO, EXIBE 'DIVULGUE SUA MARCA AQUI')
  ...Array.from({ length: 22 }, (_, i) => {
    const order = i + 4;
    return {
      id: `slot_${i + 1}`,
      order,
      name: `Patrocinador #${order}`,
      category: 'Patrocinador Oficial',
      logoSrc: '',
      description: 'Apoiador Oficial do Poeirão F.C.',
    };
  }),
];

const STORAGE_KEY = 'poeirao_all_sponsors_v4';

/**
 * Redimensiona e comprime imagens enviadas pelo usuário para que não estourem
 * a cota de 5MB do localStorage e carreguem instantaneamente no site.
 */
export function compressImage(
  file: File,
  maxDim = 600,
  preferredFormat: 'image/jpeg' | 'image/png' | 'auto' = 'auto'
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        const isPng = file.type === 'image/png' && preferredFormat !== 'image/jpeg';
        const useFormat = preferredFormat === 'auto'
          ? (isPng ? 'image/png' : 'image/jpeg')
          : preferredFormat;

        if (useFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const result = canvas.toDataURL(useFormat, 0.82);
          resolve(result);
        } catch {
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export function getStoredSponsors(): SponsorItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingMap = new Map<string, SponsorItem>(parsed.map((s: SponsorItem) => [s.id, s]));
        return INITIAL_SPONSORS.map((initial) => {
          const found = existingMap.get(initial.id);
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
      }
    }
  } catch (err) {
    console.error('Erro ao ler patrocinadores do localStorage:', err);
  }
  return INITIAL_SPONSORS;
}

export function saveStoredSponsors(sponsors: SponsorItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sponsors));
  } catch (err) {
    console.warn('Aviso ao salvar no localStorage (possível cota excedida):', err);
  }

  // Notifica todos os componentes no navegador
  window.dispatchEvent(new CustomEvent('sponsors-changed', { detail: sponsors }));
  window.dispatchEvent(new Event('asset-updated'));
}
