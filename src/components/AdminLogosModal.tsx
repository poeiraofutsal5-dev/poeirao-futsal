import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Shield,
  Handshake,
  Sparkles,
  RotateCcw,
  Shirt,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2,
} from 'lucide-react';
import escudoOficialImg from '../assets/escudo-oficial.png';
import jpxWhiteLogoImg from '../assets/patrocinador-jpx-studio-white.png';
import {
  getStoredSponsors,
  saveStoredSponsors,
  compressImage,
  SponsorItem,
} from '../utils/sponsorsManager';
import {
  ShirtItem,
  getStoredShirts,
  saveStoredShirts,
} from '../utils/storeManager';
import {
  MemberItem,
  MemberPlan,
  MemberStatus,
  PLAN_DETAILS,
  getStoredMembers,
  saveStoredMembers,
  formatPhone,
  cleanPhone,
  generateMatricula,
} from '../utils/membersManager';
import {
  saveClubSettingsToCloud,
  saveSponsorsToCloud,
  saveStoreShirtsToCloud,
  saveMembersToCloud,
  subscribeToClubSettings,
  subscribeToStoreShirts,
  subscribeToMembers,
} from '../services/firebase';

interface AdminLogosModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onAuthenticate: (success: boolean) => void;
  sponsors?: SponsorItem[];
  onUpdateSponsors?: (sponsors: SponsorItem[]) => void;
  shirts?: ShirtItem[];
  onUpdateShirts?: (shirts: ShirtItem[]) => void;
  members?: MemberItem[];
  onUpdateMembers?: (members: MemberItem[]) => void;
  initialTab?: 'escudo_jpx' | 'sponsors' | 'store' | 'members';
  storeOrdersEnabled?: boolean;
  onToggleStoreOrders?: (enabled: boolean) => void;
}

const ADMIN_PASSWORD = '22232425';

export const AdminLogosModal: React.FC<AdminLogosModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  onAuthenticate,
  sponsors: propSponsors,
  onUpdateSponsors,
  shirts: propShirts,
  onUpdateShirts,
  members: propMembers,
  onUpdateMembers,
  initialTab = 'store',
  storeOrdersEnabled = true,
  onToggleStoreOrders,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'escudo_jpx' | 'sponsors' | 'store' | 'members'>(initialTab);

  // Lista local caso propSponsors não seja passado
  const [localSponsors, setLocalSponsors] = useState<SponsorItem[]>(getStoredSponsors);
  const sponsors = propSponsors || localSponsors;

  // Lista de camisas da loja
  const [localShirts, setLocalShirts] = useState<ShirtItem[]>(getStoredShirts);
  const shirts = propShirts || localShirts;

  // Lista de sócios torcedores
  const [localMembers, setLocalMembers] = useState<MemberItem[]>(getStoredMembers);
  const members = propMembers || localMembers;

  // Filtro e formulário de novo sócio
  const [memberSearch, setMemberSearch] = useState('');
  const [newMemName, setNewMemName] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('');
  const [newMemPlan, setNewMemPlan] = useState<MemberPlan>('ouro');
  const [newMemStatus, setNewMemStatus] = useState<'active' | 'pending'>('active');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  const [escudoPreview, setEscudoPreview] = useState<string>(
    () => localStorage.getItem('poeirao_asset_escudo') || escudoOficialImg
  );

  const [jpxFooterPreview, setJpxFooterPreview] = useState<string>(
    () =>
      localStorage.getItem('poeirao_asset_jpx_footer') ||
      localStorage.getItem('poeirao_asset_jpx_white') ||
      jpxWhiteLogoImg
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetTypeRef = useRef<'escudo' | 'sponsor' | 'jpx_footer' | 'shirt'>('escudo');
  const targetSponsorIdRef = useRef<string>('');
  const targetShirtIdRef = useRef<string>('');

  useEffect(() => {
    if (isOpen) {
      setLocalSponsors(getStoredSponsors());
      setLocalShirts(getStoredShirts());
      setEscudoPreview(localStorage.getItem('poeirao_asset_escudo') || escudoOficialImg);
      setJpxFooterPreview(
        localStorage.getItem('poeirao_asset_jpx_footer') ||
        localStorage.getItem('poeirao_asset_jpx_white') ||
        jpxWhiteLogoImg
      );

      const unsubClub = subscribeToClubSettings((settings) => {
        if (settings.escudo) setEscudoPreview(settings.escudo);
        if (settings.jpxFooter !== undefined) setJpxFooterPreview(settings.jpxFooter || jpxWhiteLogoImg);
      });

      const unsubStore = subscribeToStoreShirts((cloudShirts) => {
        setLocalShirts(cloudShirts);
        if (onUpdateShirts) onUpdateShirts(cloudShirts);
      });

      const unsubMembers = subscribeToMembers((cloudMembers) => {
        setLocalMembers(cloudMembers);
        if (onUpdateMembers) onUpdateMembers(cloudMembers);
      });

      return () => {
        unsubClub();
        unsubStore();
        unsubMembers();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setPasswordError(false);
      onAuthenticate(true);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const triggerUpload = (type: 'escudo' | 'sponsor' | 'jpx_footer' | 'shirt', id?: string) => {
    targetTypeRef.current = type;
    if (type === 'sponsor') {
      targetSponsorIdRef.current = id || '';
    } else if (type === 'shirt') {
      targetShirtIdRef.current = id || '';
    }
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reseta o input para permitir selecionar a mesma imagem novamente se quiser
    e.target.value = '';

    setIsProcessing(true);
    try {
      const dataUrl = await compressImage(file, 600);

      if (targetTypeRef.current === 'escudo') {
        localStorage.setItem('poeirao_asset_escudo', dataUrl);
        setEscudoPreview(dataUrl);
        window.dispatchEvent(new Event('asset-updated'));

        // Salva na nuvem para sincronizar com todos os aparelhos
        await saveClubSettingsToCloud({ escudo: dataUrl });

        await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetKey: 'escudo', dataUrl }),
        }).catch(() => {});

        setSuccessMessage('Escudo oficial atualizado e sincronizado em todos os aparelhos!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else if (targetTypeRef.current === 'jpx_footer') {
        localStorage.setItem('poeirao_asset_jpx_footer', dataUrl);
        localStorage.setItem('poeirao_asset_jpx_white', dataUrl);
        localStorage.setItem('poeirao_asset_jpx', dataUrl);
        setJpxFooterPreview(dataUrl);
        window.dispatchEvent(new Event('asset-updated'));
        window.dispatchEvent(new CustomEvent('jpx-logo-updated', { detail: dataUrl }));

        // Salva na nuvem para sincronizar com todos os aparelhos
        await saveClubSettingsToCloud({ jpxFooter: dataUrl });

        await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetKey: 'jpx_footer', dataUrl }),
        }).catch(() => {});

        setSuccessMessage('Logo da JPX Studio atualizada e sincronizada em todos os aparelhos!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else if (targetTypeRef.current === 'shirt') {
        const id = targetShirtIdRef.current;
        const updated = shirts.map((sh) => (sh.id === id ? { ...sh, imageSrc: dataUrl } : sh));
        setLocalShirts(updated);
        if (onUpdateShirts) onUpdateShirts(updated);
        saveStoredShirts(updated);
        await saveStoreShirtsToCloud(updated);

        setSuccessMessage('Foto da camisa atualizada e sincronizada com sucesso!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        const id = targetSponsorIdRef.current;
        const targetSponsor = sponsors.find((s) => s.id === id);
        const orderNum = targetSponsor ? targetSponsor.order : '';

        const updated = sponsors.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              logoSrc: dataUrl,
            };
          }
          return item;
        });

        setLocalSponsors(updated);
        if (onUpdateSponsors) {
          onUpdateSponsors(updated);
        }
        saveStoredSponsors(updated);
        await saveSponsorsToCloud(updated);

        await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetKey: id, dataUrl }),
        }).catch(() => {});

        setSuccessMessage(`Logo da Vaga #${orderNum} aplicada e sincronizada em todos os aparelhos!`);
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetJpxLogo = async () => {
    localStorage.removeItem('poeirao_asset_jpx_footer');
    localStorage.removeItem('poeirao_asset_jpx_white');
    localStorage.removeItem('poeirao_asset_jpx');
    setJpxFooterPreview(jpxWhiteLogoImg);
    window.dispatchEvent(new Event('asset-updated'));
    window.dispatchEvent(new CustomEvent('jpx-logo-updated', { detail: jpxWhiteLogoImg }));
    await saveClubSettingsToCloud({ jpxFooter: '' });
    setSuccessMessage('Logo da JPX Studio restaurada para o padrão oficial.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleUpdateName = (id: string, newName: string) => {
    const updated = sponsors.map((s) => (s.id === id ? { ...s, name: newName } : s));
    setLocalSponsors(updated);
    if (onUpdateSponsors) {
      onUpdateSponsors(updated);
    }
    saveStoredSponsors(updated);
    saveSponsorsToCloud(updated);
  };

  const handleRemoveLogo = (id: string) => {
    const target = sponsors.find((s) => s.id === id);
    const orderNum = target ? target.order : '';

    const updated = sponsors.map((s) => {
      if (s.id === id) {
        return { ...s, logoSrc: '' };
      }
      return s;
    });

    setLocalSponsors(updated);
    if (onUpdateSponsors) {
      onUpdateSponsors(updated);
    }
    saveStoredSponsors(updated);
    saveSponsorsToCloud(updated);

    setSuccessMessage(`Logo da Vaga #${orderNum} removida.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Funções da Loja Poeirão
  const handleUpdateShirtName = (id: string, name: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, name } : sh));
    setLocalShirts(updated);
    if (onUpdateShirts) onUpdateShirts(updated);
    saveStoredShirts(updated);
    saveStoreShirtsToCloud(updated);
  };

  const handleUpdateShirtPrice = (id: string, price: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, price } : sh));
    setLocalShirts(updated);
    if (onUpdateShirts) onUpdateShirts(updated);
    saveStoredShirts(updated);
    saveStoreShirtsToCloud(updated);
  };

  const handleUpdateShirtBadge = (id: string, badge: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, badge } : sh));
    setLocalShirts(updated);
    if (onUpdateShirts) onUpdateShirts(updated);
    saveStoredShirts(updated);
    saveStoreShirtsToCloud(updated);
  };

  const handleRemoveShirtImage = (id: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, imageSrc: '' } : sh));
    setLocalShirts(updated);
    if (onUpdateShirts) onUpdateShirts(updated);
    saveStoredShirts(updated);
    saveStoreShirtsToCloud(updated);
    setSuccessMessage('Foto personalizada removida. A camisa agora usa a ilustração padrão.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddNewShirt = () => {
    const newShirt: ShirtItem = {
      id: `shirt_${Date.now()}`,
      name: `Nova Camisa Oficial #${shirts.length + 1}`,
      price: 'R$ 89,90',
      imageSrc: '',
      badge: 'Lançamento',
      description: 'Camisa oficial do Poeirão F.C. em tecido Dry-Fit respirável.',
      sizes: ['P', 'M', 'G', 'GG'],
    };
    const updated = [...shirts, newShirt];
    setLocalShirts(updated);
    if (onUpdateShirts) onUpdateShirts(updated);
    saveStoredShirts(updated);
    saveStoreShirtsToCloud(updated);
    setSuccessMessage('Novo modelo de camisa adicionado com sucesso!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteShirt = (id: string) => {
    if (shirts.length <= 1) {
      alert('A loja precisa ter pelo menos um modelo de camisa cadastrado.');
      return;
    }
    const updated = shirts.filter((sh) => sh.id !== id);
    setLocalShirts(updated);
    if (onUpdateShirts) onUpdateShirts(updated);
    saveStoredShirts(updated);
    saveStoreShirtsToCloud(updated);
    setSuccessMessage('Modelo de camisa removido da loja.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Funções de Gestão de Sócios Torcedores
  const handleToggleMemberStatus = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const newStatus: MemberStatus = target.status === 'active' ? 'pending' : 'active';
    const updated = members.map((m) =>
      m.id === id
        ? {
            ...m,
            status: newStatus,
            lastPaymentDate: newStatus === 'active' ? new Date().toLocaleDateString('pt-BR') : m.lastPaymentDate,
          }
        : m
    );
    setLocalMembers(updated);
    if (onUpdateMembers) onUpdateMembers(updated);
    saveStoredMembers(updated);
    saveMembersToCloud(updated);
    setSuccessMessage(
      newStatus === 'active'
        ? `Pagamento de ${target.name} APROVADO! Carteirinha ativada.`
        : `Status de ${target.name} alterado para PENDENTE.`
    );
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleUpdateMemberPlan = (id: string, plan: MemberPlan) => {
    const updated = members.map((m) => (m.id === id ? { ...m, plan } : m));
    setLocalMembers(updated);
    if (onUpdateMembers) onUpdateMembers(updated);
    saveStoredMembers(updated);
    saveMembersToCloud(updated);
    setSuccessMessage('Plano do sócio atualizado com sucesso.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    setMemberToDelete({ id: target.id, name: target.name });
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    const target = memberToDelete;
    setMemberToDelete(null);
    const updated = members.filter((m) => m.id !== target.id);
    setLocalMembers(updated);
    if (onUpdateMembers) onUpdateMembers(updated);
    saveStoredMembers(updated);
    await saveMembersToCloud(updated);
    setSuccessMessage(`Sócio "${target.name}" excluído com sucesso.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim()) {
      alert('Digite o nome do novo sócio.');
      return;
    }
    const clean = cleanPhone(newMemPhone);
    if (clean.length < 10) {
      alert('Digite um celular válido com DDD.');
      return;
    }

    const newId = 'mem_' + Date.now();
    const newMatricula = generateMatricula(members.length + 1);
    const today = new Date().toLocaleDateString('pt-BR');

    const newMember: MemberItem = {
      id: newId,
      matricula: newMatricula,
      name: newMemName.trim(),
      phone: clean,
      password: '123',
      plan: newMemPlan,
      status: newMemStatus,
      createdAt: today,
      validUntil: '31/12/2026',
      lastPaymentDate: today,
    };

    const updated = [newMember, ...members];
    setLocalMembers(updated);
    if (onUpdateMembers) onUpdateMembers(updated);
    saveStoredMembers(updated);
    saveMembersToCloud(updated);

    setNewMemName('');
    setNewMemPhone('');
    setIsAddingMember(false);
    setSuccessMessage(`Sócio ${newMember.name} cadastrado com sucesso!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const countWithLogo = sponsors.filter((s) => Boolean(s.logoSrc)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* INPUT DE ARQUIVO OCULTO */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />

        {/* ========================================================================= */}
        {/* TELA DE AUTENTICAÇÃO COM A SENHA '22232425'                               */}
        {/* ========================================================================= */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white uppercase">
              Área Restrita da Diretoria
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">
              Digite a senha de administrador para trocar o escudo, patrocinadores ou gerenciar a Loja Poeirão.
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-8 w-full max-w-xs space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Digite a senha..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 pr-11 text-center font-mono text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {passwordError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-bold bg-red-950/40 border border-red-900/50 py-2 rounded-lg animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Senha incorreta! Tente novamente.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-sm py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-transform active:scale-95 cursor-pointer"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* TELA DO PAINEL ADMINISTRATIVO (AUTENTICADO)                              */
          /* ========================================================================= */
          <>
            {/* CABEÇALHO DO PAINEL */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">
                    Painel Administrativo do Poeirão F.C.
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sincronizado automaticamente com o banco de dados Firebase Firestore
                  </p>
                </div>
              </div>

              {/* BARRA DE ABAS */}
              <div className="mt-5 flex gap-2 border-b border-slate-800 pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('store')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                    activeTab === 'store'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Shirt className="w-4 h-4" />
                  <span>👕 Loja Poeirão ({shirts.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('escudo_jpx')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                    activeTab === 'escudo_jpx'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>🛡️ Escudo & Rodapé</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sponsors')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                    activeTab === 'sponsors'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Handshake className="w-4 h-4" />
                  <span>🤝 25 Patrocinadores ({countWithLogo})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('members')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                    activeTab === 'members'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">💳</span>
                  <span>Sócios Torcedores ({members.length})</span>
                </button>
              </div>

              {/* MENSAGEM DE SUCESSO / FEEDBACK */}
              {successMessage && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 py-2.5 px-3 rounded-xl animate-fade-in shadow-inner">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}
            </div>

            {/* CONTEÚDO SCROLLÁVEL */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

              {/* ================================================================= */}
              {/* ABA 1: GERENCIAR LOJA POEIRÃO (CAMISAS, MODELOS, VALORES)         */}
              {/* ================================================================= */}
              {activeTab === 'store' && (
                <div className="space-y-6">
                  {/* CONTROLE GLOBAL: ATIVAR/DESATIVAR BOTÃO PEDIR NO ZAP */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          storeOrdersEnabled
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                            Botão "Pedir no Zap" em Todos os Produtos
                          </h4>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              storeOrdersEnabled
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {storeOrdersEnabled ? '🟢 Ativado (Recebendo Pedidos)' : '🔴 Desativado (Sem Estoque)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {storeOrdersEnabled
                            ? 'O botão de compra pelo WhatsApp está ativo em todas as camisas e produtos.'
                            : 'O botão de WhatsApp está oculto e os produtos aparecem como "Esgotado".'}
                        </p>
                      </div>
                    </div>

                    {onToggleStoreOrders && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !storeOrdersEnabled;
                          onToggleStoreOrders(nextVal);
                          setSuccessMessage(
                            nextVal
                              ? 'Botão "Pedir no Zap" ATIVADO em todos os produtos da loja!'
                              : 'Botão "Pedir no Zap" PAUSADO em todos os produtos (Produtos Esgotados).'
                          );
                          setTimeout(() => setSuccessMessage(null), 3500);
                        }}
                        className={`font-black text-xs uppercase px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shadow ${
                          storeOrdersEnabled
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-600/30'
                        }`}
                      >
                        {storeOrdersEnabled ? 'Pausar Pedidos no Zap' : 'Reativar Pedidos no Zap'}
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-red-500" />
                        Catálogo de Camisas e Produtos da Loja Oficial
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Gerencie as camisas e produtos da loja. Você pode adicionar outros produtos (bonés, copos, agasalhos) quando desejar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewShirt}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Produto</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {shirts.map((shirt, idx) => (
                      <div
                        key={shirt.id}
                        className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:border-slate-700 transition"
                      >
                        {/* FOTO E BOTÃO DE UPLOAD */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="relative w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 overflow-hidden shrink-0">
                            {shirt.imageSrc ? (
                              <img src={shirt.imageSrc} alt={shirt.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-500 text-center">
                                <Shirt className="w-7 h-7 text-red-500/70" />
                                <span className="text-[9px] font-bold mt-1">Padrão</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/60 border border-red-900/40 px-2 py-0.5 rounded-md">
                              Modelo #{idx + 1}
                            </span>
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => triggerUpload('shirt', shirt.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{shirt.imageSrc ? 'Trocar Imagem' : 'Subir Imagem'}</span>
                              </button>

                              {shirt.imageSrc && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveShirtImage(shirt.id)}
                                  className="text-xs text-slate-400 hover:text-red-400 px-2 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
                                >
                                  Remover Foto
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CAMPOS DE TEXTO: NOME DO MODELO, VALOR E DESTAQUE */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:flex-1">
                          {/* Nome do modelo ou produto */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Nome do Produto ou Modelo
                            </label>
                            <input
                              type="text"
                              value={shirt.name}
                              onChange={(e) => handleUpdateShirtName(shirt.id, e.target.value)}
                              placeholder="Ex: Camisa Oficial 2026, Boné Tricolor, Copo..."
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500 transition"
                            />
                          </div>

                          {/* Valor */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Valor do Produto (R$)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={shirt.price}
                                onChange={(e) => handleUpdateShirtPrice(shirt.id, e.target.value)}
                                placeholder="R$ 89,90"
                                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-black text-emerald-400 focus:outline-none focus:border-red-500 transition"
                              />
                            </div>
                          </div>

                          {/* Badge / Categoria */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Selo / Categoria (ex: Oficial 2026, Acessório)
                            </label>
                            <input
                              type="text"
                              value={shirt.badge || ''}
                              onChange={(e) => handleUpdateShirtBadge(shirt.id, e.target.value)}
                              placeholder="Ex: Oficial 2026, Acessório, etc."
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-red-500 transition"
                            />
                          </div>

                          {/* Excluir Camisa */}
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteShirt(shirt.id)}
                              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 py-1.5 px-3 rounded-xl transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* ABA 2: ESCUDO DO CLUBE & LOGO JPX (RODAPÉ)                        */}
              {/* ================================================================= */}
              {activeTab === 'escudo_jpx' && (
                <div className="space-y-6">
                  {/* SEÇÃO DO ESCUDO OFICIAL */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          Escudo Oficial do Poeirão F.C.
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Substitui o escudo que aparece no cabeçalho, hero e rodapé para todos os usuários.
                        </p>
                      </div>
                      <span className="text-[10px] font-black text-red-400 bg-red-950/60 border border-red-800/40 px-2.5 py-1 rounded-full uppercase">
                        Principal
                      </span>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shrink-0">
                        <img src={escudoPreview} alt="Escudo Oficial Preview" className="max-h-full max-w-full object-contain" />
                      </div>

                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() => triggerUpload('escudo')}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-red-600/20 transition cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{isProcessing ? 'Processando...' : 'Trocar Escudo Oficial'}</span>
                        </button>
                        <p className="text-[11px] text-slate-500 mt-2">
                          Recomendado: PNG com fundo transparente.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO DA LOGO JPX STUDIO (RODAPÉ) */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Logo JPX Studio (Crédito do Rodapé)
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Personalize ou altere a logo da empresa desenvolvedora no rodapé do site.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-28 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shrink-0">
                        <img src={jpxFooterPreview} alt="JPX Footer Preview" className="max-h-full max-w-full object-contain" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => triggerUpload('jpx_footer')}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Trocar Logo do Rodapé</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetJpxLogo}
                          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-800 transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restaurar Padrão</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* ABA 3: GERENCIAR OS 25 PATROCINADORES                             */}
              {/* ================================================================= */}
              {activeTab === 'sponsors' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Clique em "Trocar Logo" para fazer upload da imagem do patrocinador.</span>
                    <span className="font-bold text-white">{countWithLogo} de 25 ativas</span>
                  </div>

                  {sponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                          {sponsor.logoSrc ? (
                            <img src={sponsor.logoSrc} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-xs font-black text-slate-600">#{sponsor.order}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-red-500">Vaga #{sponsor.order}</span>
                            <input
                              type="text"
                              value={sponsor.name}
                              onChange={(e) => handleUpdateName(sponsor.id, e.target.value)}
                              className="bg-transparent text-xs sm:text-sm font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-red-500 focus:outline-none px-1 py-0.5 transition w-44 sm:w-64"
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {sponsor.logoSrc ? 'Logo Ativa' : 'Disponível (DIVULGUE SUA MARCA)'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => triggerUpload('sponsor', sponsor.id)}
                          disabled={isProcessing}
                          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                        >
                          {sponsor.logoSrc ? 'Trocar' : '+ Adicionar'}
                        </button>

                        {sponsor.logoSrc && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLogo(sponsor.id)}
                            className="text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 px-2.5 py-1.5 rounded-lg border border-red-900/50 transition cursor-pointer"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ================================================================= */}
              {/* ABA 4: GERENCIAR SÓCIOS TORCEDORES & CARTEIRINHAS VIRTUAIS        */}
              {/* ================================================================= */}
              {activeTab === 'members' && (
                <div className="space-y-6">
                  {/* CABEÇALHO DA ABA DE SÓCIOS */}
                  <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="text-base">💳</span>
                        Controle de Sócios Torcedores & Carteirinhas
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Gerencie os sócios torcedores, aprove pagamentos para ativar a carteirinha virtual ou adicione novos membros.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingMember(!isAddingMember)}
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase py-2 px-3.5 rounded-xl shadow transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingMember ? 'Cancelar' : 'Cadastrar Novo Sócio'}</span>
                    </button>
                  </div>

                  {/* FORMULÁRIO DE ADIÇÃO MANUAL PELA DIRETORIA */}
                  {isAddingMember && (
                    <form
                      onSubmit={handleCreateMember}
                      className="bg-slate-950 border border-red-500/40 rounded-2xl p-5 space-y-4 animate-fade-in"
                    >
                      <h5 className="text-xs font-black text-red-500 uppercase tracking-wider">
                        Cadastrar Novo Sócio Torcedor (Pela Diretoria)
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            value={newMemName}
                            onChange={(e) => setNewMemName(e.target.value)}
                            placeholder="Ex: Matheus Alencar"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Celular / WhatsApp (Com DDD)
                          </label>
                          <input
                            type="tel"
                            value={newMemPhone}
                            onChange={(e) => setNewMemPhone(e.target.value)}
                            placeholder="(11) 98765-4321"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Plano
                          </label>
                          <select
                            value={newMemPlan}
                            onChange={(e) => setNewMemPlan(e.target.value as MemberPlan)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="prata">Sócio Prata+ (R$ 14,99/mês)</option>
                            <option value="ouro">Sócio Ouro+ (R$ 24,99/mês)</option>
                            <option value="patrocinador">Patrocinador+ (R$ 49,99/mês)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Status do Pagamento
                          </label>
                          <select
                            value={newMemStatus}
                            onChange={(e) => setNewMemStatus(e.target.value as 'active' | 'pending')}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="active">🟢 Ativo (Carteirinha Liberada)</option>
                            <option value="pending">🟡 Pendente (Aguardando Pagamento)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingMember(false)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase py-2 px-4 rounded-xl shadow transition"
                        >
                          Salvar e Emitir Carteirinha
                        </button>
                      </div>
                    </form>
                  )}

                  {/* BARRA DE PESQUISA & RESUMO */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Pesquisar por nome ou celular..."
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 w-full sm:w-72"
                    />

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">
                        Total: <strong className="text-white">{members.length}</strong>
                      </span>
                      <span className="text-emerald-400">
                        Ativos: <strong>{members.filter((m) => m.status === 'active').length}</strong>
                      </span>
                      <span className="text-amber-400">
                        Pendentes: <strong>{members.filter((m) => m.status !== 'active').length}</strong>
                      </span>
                    </div>
                  </div>

                  {/* LISTAGEM DOS SÓCIOS */}
                  <div className="space-y-3">
                    {members
                      .filter((m) => {
                        if (!memberSearch.trim()) return true;
                        const query = memberSearch.toLowerCase();
                        return (
                          m.name.toLowerCase().includes(query) ||
                          m.phone.includes(query) ||
                          m.matricula.toLowerCase().includes(query)
                        );
                      })
                      .map((mem) => {
                        const plan = PLAN_DETAILS[mem.plan] || PLAN_DETAILS.prata;
                        return (
                          <div
                            key={mem.id}
                            className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                                  mem.plan === 'ouro'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    : mem.plan === 'patrocinador'
                                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                                    : 'bg-slate-700/40 text-slate-300 border-slate-600/30'
                                }`}
                              >
                                {mem.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-black text-white truncate max-w-[200px] sm:max-w-xs">
                                    {mem.name}
                                  </h5>
                                  <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                                    {mem.matricula}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                                  <span className="font-mono text-slate-300">{formatPhone(mem.phone)}</span>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-slate-400 font-bold">{plan.name}</span>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-[11px] text-slate-500">Validade: {mem.validUntil}</span>
                                </div>
                              </div>
                            </div>

                            {/* CONTROLES DO SÓCIO: ATIVAR/PENDENTE, TROCAR PLANO E WHATSAPP */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Botão WhatsApp */}
                              <a
                                href={`https://wa.me/55${cleanPhone(mem.phone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/50 p-2 rounded-xl text-xs transition"
                                title="Falar no WhatsApp"
                              >
                                💬 WhatsApp
                              </a>

                              {/* Seletor de Plano */}
                              <select
                                value={mem.plan}
                                onChange={(e) => handleUpdateMemberPlan(mem.id, e.target.value as MemberPlan)}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-red-500"
                              >
                                <option value="prata">Prata+</option>
                                <option value="ouro">Ouro+</option>
                                <option value="patrocinador">Patrocinador+</option>
                              </select>

                              {/* Toggle Ativar / Pendente */}
                              <button
                                type="button"
                                onClick={() => handleToggleMemberStatus(mem.id)}
                                className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                                  mem.status === 'active'
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-amber-950/50 hover:text-amber-300 hover:border-amber-500/50'
                                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 animate-pulse'
                                }`}
                                title={mem.status === 'active' ? 'Clique para marcar como pendente' : 'Clique para APROVAR pagamento'}
                              >
                                {mem.status === 'active' ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Ativo</span>
                                  </>
                                ) : (
                                  <>
                                    <span>⚡ Aprovar Pagamento</span>
                                  </>
                                )}
                              </button>

                              {/* Botão Excluir */}
                              <button
                                type="button"
                                onClick={() => handleDeleteMember(mem.id)}
                                className="p-2 text-slate-500 hover:text-red-400 bg-slate-900 hover:bg-red-950/40 rounded-xl border border-slate-800 hover:border-red-900/50 transition cursor-pointer"
                                title="Remover sócio"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO DE SÓCIO */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-600/50 rounded-3xl max-w-sm w-full p-6 text-center text-white shadow-2xl animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-500 border border-red-600/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black uppercase text-white tracking-tight">
              Excluir Cadastro?
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Deseja realmente remover o sócio <strong>"{memberToDelete.name}"</strong>? O cadastro e a carteirinha virtual dele serão excluídos.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-red-600/40 transition cursor-pointer"
              >
                Sim, Excluir Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
