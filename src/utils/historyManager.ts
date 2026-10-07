import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface SubCategoryItem {
  id: string;
  categoryName: string;
  fullName: string;
  tagline: string;
  ageRange: string;
  playersCount?: string;
  description: string;
  imageSrc: string;
}

export const INITIAL_SUB_CATEGORIES: SubCategoryItem[] = [
  {
    id: 'sub11',
    categoryName: 'Sub-11',
    fullName: 'Categoria Sub-11 • A Sementinha do Poeirão',
    tagline: 'Futebol de Campo & Futsal • Base Inicial',
    ageRange: 'Até 11 anos',
    playersCount: 'Mais de 20 atletas mirins',
    description:
      'O início de tudo para nossos pequenos craques. Na categoria Sub-11, mais do que ensinar os fundamentos do futebol e futsal, ensinamos união, disciplina, respeito e amor às cores do Poeirão. É nessa fase que mais de 20 garotos dão os primeiros passos com a camisa do clube, viajando com frio na barriga, olhos brilhando e muita vontade de vencer por nossa terra.',
    imageSrc: '/foto-time-1.png',
  },
  {
    id: 'sub13',
    categoryName: 'Sub-13',
    fullName: 'Categoria Sub-13 • Formação e Garra',
    tagline: 'Futebol & Futsal • Formação Tática',
    ageRange: '12 e 13 anos',
    playersCount: '18 jovens atletas',
    description:
      'A fase do amadurecimento tático e coletivo. A garotada do Sub-13 disputa torneios e copas em diversos municípios da Bahia e fronteiras interestaduais. No campo de terra batida ou nas quadras de futsal, o Sub-13 representa a superação diária de quem enfrenta longas viagens para honrar o escudo e buscar um futuro melhor através do esporte.',
    imageSrc: '/foto-time-2.png',
  },
  {
    id: 'sub15',
    categoryName: 'Sub-15',
    fullName: 'Categoria Sub-15 • Competitividade e Conquistas',
    tagline: 'Futebol & Futsal • Rendimento Juvenil',
    ageRange: '14 e 15 anos',
    playersCount: '20 atletas em desenvolvimento',
    description:
      'Com técnica apurada e espírito guerreiro, o Sub-15 é destaque frequente em copas regionais e interestaduais. Nossos jovens enfrentam equipes tradicionais de todo o estado, mostrando a raça do interior baiano. Muitos desses garotos já despontam em avaliações e peneiras, carregando com bravura a bandeira do Poeirão.',
    imageSrc: '/foto-time-3.png',
  },
  {
    id: 'sub17',
    categoryName: 'Sub-17',
    fullName: 'Categoria Sub-17 • Rumo ao Alto Rendimento',
    tagline: 'Futebol & Futsal • Transição Pré-Profissional',
    ageRange: '16 e 17 anos',
    playersCount: '18 atletas em destaque',
    description:
      'Juventude, intensidade e disciplina máxima. No Sub-17, os atletas consolidam sua formação esportiva e cidadã. Representando o Poeirão em campeonatos de alto nível na Bahia e fora do estado, a equipe é sinônimo de resiliência e união, servindo de inspiração para as crianças menores da escolinha.',
    imageSrc: '/foto-time-1.png',
  },
  {
    id: 'sub20',
    categoryName: 'Sub-20',
    fullName: 'Categoria Sub-20 • Juniores e Força Jovem',
    tagline: 'Futebol de Campo • Ponte para o Titular',
    ageRange: '18 a 20 anos',
    playersCount: '16 atletas',
    description:
      'Ponte direta para o time principal. Os jovens do Sub-20 atuam com maturidade, unindo a velocidade da juventude à experiência adquirida em anos de projeto. Uma categoria forjada nas viagens mais difíceis, nos campos mais pesados e nas maiores vitórias da história do nosso clube.',
    imageSrc: '/foto-time-2.png',
  },
  {
    id: 'principal',
    categoryName: 'Quadro Principal',
    fullName: 'Quadro Principal • A Força Máxima do Poeirão',
    tagline: 'Futebol Amador de Alto Nível • Elite do Clube',
    ageRange: 'Livre / Adulto',
    playersCount: 'Elenco principal do Poeirão',
    description:
      'O time que arrasta multidões e faz o coração da torcida pulsar forte. O elenco principal do Poeirão é o espelho de todo o trabalho social: formado tanto por atletas que cresceram na base quanto por referências locais, jogando com a alma em cada dividida nos principais campeonatos da região.',
    imageSrc: '/foto-time-3.png',
  },
  {
    id: 'master',
    categoryName: 'Master (+35)',
    fullName: 'Categoria Master • A Raiz e a Tradição Viva',
    tagline: 'Futebol Veterano • Pioneiros do Clube',
    ageRange: 'Acima de 35 anos',
    playersCount: 'Veteranos e lendas do Poeirão',
    description:
      'Onde tudo começou e onde a paixão nunca envelhece. A categoria Master reúne os pioneiros que fundaram e mantiveram vivo o Poeirão através das décadas. Mostrando que o futebol é companheirismo e saúde para a vida toda, os veteranos continuam viajando, disputando clássicos e ensinando aos mais jovens o verdadeiro significado de ser Poeirão.',
    imageSrc: '/foto-time-1.png',
  },
];

const STORAGE_KEY_CATEGORIES = 'poeirao_history_categories_v1';

export function getStoredSubCategories(): SubCategoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao ler categorias locais:', e);
  }
  return INITIAL_SUB_CATEGORIES;
}

export function saveStoredSubCategories(categories: SubCategoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Erro ao salvar categorias locais:', e);
  }
}

/**
 * Escuta alterações em tempo real nas categorias da história do clube
 */
export function subscribeToSubCategories(callback: (categories: SubCategoryItem[]) => void) {
  try {
    const docRef = doc(db, 'settings', 'history_categories');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.items) && data.items.length > 0) {
            callback(data.items);
          }
        }
      },
      (err) => {
        console.warn('Aviso no listener de categorias históricas do Firebase:', err);
      }
    );
  } catch (e) {
    console.error('Falha ao inicializar listener de categorias históricas:', e);
    return () => {};
  }
}

/**
 * Salva categorias históricas na nuvem do Firebase
 */
export async function saveSubCategoriesToCloud(categories: SubCategoryItem[]): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'history_categories');
    await setDoc(docRef, {
      items: categories,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Erro ao salvar categorias históricas no Firebase:', err);
  }
}
