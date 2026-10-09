export type MemberPlan = 'prata' | 'ouro' | 'patrocinador' | 'patrocinador_gold';
export type MemberStatus = 'active' | 'pending';

export interface MemberItem {
  id: string;
  matricula: string;
  name: string;
  phone: string; // apenas numeros ou formatado
  password: string;
  plan: MemberPlan;
  status: MemberStatus;
  avatarUrl?: string;
  createdAt: string;
  validUntil: string;
  lastPaymentDate?: string;
  notes?: string;
}

export const INITIAL_MEMBERS: MemberItem[] = [
  {
    id: 'mem_1',
    matricula: 'POE-2026-0001',
    name: 'João Pedro da Silva',
    phone: '11999887766',
    password: 'joao@pfc26',
    plan: 'ouro',
    status: 'active',
    createdAt: '01/01/2026',
    validUntil: '31/12/2026',
    lastPaymentDate: '01/04/2026',
  },
  {
    id: 'mem_2',
    matricula: 'POE-2026-0002',
    name: 'Carlos Eduardo Rocha',
    phone: '11988776655',
    password: 'carlos@ouro77',
    plan: 'prata',
    status: 'active',
    createdAt: '15/01/2026',
    validUntil: '31/12/2026',
    lastPaymentDate: '15/04/2026',
  },
  {
    id: 'mem_3',
    matricula: 'POE-2026-0003',
    name: 'Supermercado Central (Apoiador)',
    phone: '11977665544',
    password: 'super@central9',
    plan: 'patrocinador',
    status: 'active',
    createdAt: '20/01/2026',
    validUntil: '31/12/2026',
    lastPaymentDate: '20/04/2026',
  },
];

export function generateRandomPassword(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Poeirao#${rand}`;
}

const STORAGE_KEY = 'poeirao_club_members_v1';
const LOGGED_KEY = 'poeirao_logged_member_id';

export function getStoredMembers(): MemberItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler membros locais:', e);
  }
  return INITIAL_MEMBERS;
}

export function saveStoredMembers(members: MemberItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.warn('Erro ao salvar membros locais:', e);
  }
}

export function getLoggedMemberId(): string | null {
  try {
    return localStorage.getItem(LOGGED_KEY);
  } catch {
    return null;
  }
}

export function setLoggedMemberId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(LOGGED_KEY, id);
    } else {
      localStorage.removeItem(LOGGED_KEY);
    }
  } catch {}
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function generateMatricula(sequenceNumber: number): string {
  const pad = String(sequenceNumber).padStart(4, '0');
  return `POE-2026-${pad}`;
}

export const PLAN_DETAILS: Record<
  MemberPlan,
  {
    name: string;
    badge: string;
    price: string;
    bgGradient: string;
    borderAccent: string;
    benefits: string[];
  }
> = {
  prata: {
    name: 'Sócio Prata+',
    badge: 'PRATA+',
    price: 'R$ 14,99/mês',
    bgGradient: 'from-slate-800 via-slate-700 to-slate-900',
    borderAccent: 'border-slate-400',
    benefits: ['10% de desconto em camisas e produtos na Loja Poeirão', 'Carteirinha Virtual Oficial'],
  },
  ouro: {
    name: 'Sócio Ouro+',
    badge: 'OURO+ MAIS POPULAR',
    price: 'R$ 24,99/mês',
    bgGradient: 'from-amber-600 via-amber-500 to-yellow-600',
    borderAccent: 'border-amber-300',
    benefits: [
      '30% de desconto em camisas e produtos na Loja Poeirão',
      'Carteirinha Virtual Oficial com Selo Dourado',
      'Prioridade e sorteios exclusivos de mantos autografados',
    ],
  },
  patrocinador: {
    name: 'Patrocinador+',
    badge: '💎 CORPORATIVO',
    price: 'R$ 59,99/mês',
    bgGradient: 'from-cyan-900 via-blue-900 to-slate-950',
    borderAccent: 'border-cyan-400',
    benefits: [
      'Divulgação da Logo Oficial no site do Poeirão F.C.',
      'Divulgação nas redes sociais oficiais do clube',
      'Carteirinha Virtual Oficial Nível Corporativo',
    ],
  },
  patrocinador_gold: {
    name: 'Patrocinador Gold+',
    badge: '👑 GOLD+ CORPORATIVO',
    price: 'A partir de R$ 99,99/mês',
    bgGradient: 'from-amber-900 via-yellow-950 to-slate-950',
    borderAccent: 'border-amber-400',
    benefits: [
      'Divulgação da Logo Oficial no site do Poeirão F.C.',
      'Divulgação nas redes sociais oficiais do clube',
      'Direito a 1 camisa oficial do time personalizada',
      'Carteirinha Virtual Oficial Nível Gold Corporativo',
    ],
  },
};
