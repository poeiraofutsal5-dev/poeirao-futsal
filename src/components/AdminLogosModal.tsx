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
  Camera,
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
  TeamPhotoItem,
  getStoredTeamPhotos,
  saveStoredTeamPhotos,
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
  saveTeamPhotosToCloud,
  subscribeToClubSettings,
  subscribeToStoreShirts,
  subscribeToMembers,
  subscribeToTeamPhotos,
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
  teamPhotos?: TeamPhotoItem[];
  onUpdateTeamPhotos?: (photos: TeamPhotoItem[]) => void;
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
  teamPhotos: propTeamPhotos,
  onUpdateTeamPhotos,
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
  const [activeTab, setActiveTab] = useState<'escudo_jpx' | 'sponsors' | 'store' | 'members'>(
    (initialTab as any) === 'team_photos' ? 'store' : (initialTab || 'store')
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab((initialTab as any) === 'team_photos' ? 'store' : initialTab);
    }
  }, [initialTab]);

  // Lista local caso propSponsors não seja passado
  const [localSponsors, setLocalSponsors] = useState<SponsorItem[]>(getStoredSponsors);
  const sponsors = propSponsors || localSponsors;

  // Lista de camisas da loja
  const [localShirts, setLocalShirts] = useState<ShirtItem[]>(getStoredShirts);
  const shirts = propShirts || localShirts;

  // Lista de fotos oficiais do time
  const [localTeamPhotos, setLocalTeamPhotos] = useState<TeamPhotoItem[]>(getStoredTeamPhotos);
  const teamPhotos = propTeamPhotos || localTeamPhotos;

  // Lista de sócios torcedores
  const [localMembers, setLocalMembers] = useState<MemberItem[]>(getStoredMembers);
  const members = propMembers || localMembers;

  useEffect(() => {
    if (propShirts) setLocalShirts(propShirts);
  }, [propShirts]);

  useEffect(() => {
    if (propTeamPhotos) setLocalTeamPhotos(propTeamPhotos);
  }, [propTeamPhotos]);

  useEffect(() => {
    if (propSponsors) setLocalSponsors(propSponsors);
  }, [propSponsors]);

  useEffect(() => {
    if (propMembers) setLocalMembers(propMembers);
  }, [propMembers]);

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
  const targetTypeRef = useRef<'escudo' | 'sponsor' | 'jpx_footer' | 'shirt' | 'team_photo'>('escudo');
  const targetSponsorIdRef = useRef<string>('');
  const targetShirtIdRef = useRef<string>('');
  const targetPhotoIdRef = useRef<string>('');

  useEffect(() => {
    if (isOpen) {
      setLocalSponsors(getStoredSponsors());
      setLocalShirts(getStoredShirts());
      setLocalTeamPhotos(getStoredTeamPhotos());
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

      return () => {
        unsubClub();
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

  const triggerUpload = (
    type: 'escudo' | 'sponsor' | 'jpx_footer' | 'shirt' | 'team_photo',
    id?: string
  ) => {
    targetTypeRef.current = type;
    if (type === 'sponsor') {
      targetSponsorIdRef.current = id || '';
    } else if (type === 'shirt') {
      targetShirtIdRef.current = id || '';
    } else if (type === 'team_photo') {
      targetPhotoIdRef.current = id || '';
    }
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const isPhoto = targetTypeRef.current === 'shirt' || targetTypeRef.current === 'team_photo';
      const dataUrl = await compressImage(file, isPhoto ? 700 : 500, isPhoto ? 'image/jpeg' : 'auto');
      if (!dataUrl) {
        throw new Error('Falha ao converter imagem');
      }

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
        saveStoredShirts(updated);
        if (onUpdateShirts) {
          onUpdateShirts(updated);
        } else {
          await saveStoreShirtsToCloud(updated);
        }

        setSuccessMessage('Foto do produto atualizada e sincronizada com sucesso!');
        setTimeout(() => setSuccessMessage(null), 3500);
      } else if (targetTypeRef.current === 'team_photo') {
        const id = targetPhotoIdRef.current;
        const updated = teamPhotos.map((tp) => (tp.id === id ? { ...tp, imageSrc: dataUrl } : tp));
        setLocalTeamPhotos(updated);
        saveStoredTeamPhotos(updated);
        if (onUpdateTeamPhotos) {
          onUpdateTeamPhotos(updated);
        } else {
          await saveTeamPhotosToCloud(updated);
        }

        setSuccessMessage('Foto oficial do time atualizada e sincronizada com sucesso!');
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
        saveStoredSponsors(updated);
        if (onUpdateSponsors) {
          onUpdateSponsors(updated);
        } else {
          await saveSponsorsToCloud(updated);
        }

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
      setSuccessMessage('Aviso: Não foi possível carregar a imagem. Tente uma foto JPG ou PNG menor.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  // Funções de Gestão de Fotos do Time (Lookbook Oficial)
  const handleUpdateTeamPhotoTitle = (id: string, title: string) => {
    const updated = teamPhotos.map((tp) => (tp.id === id ? { ...tp, title } : tp));
    setLocalTeamPhotos(updated);
    if (onUpdateTeamPhotos) onUpdateTeamPhotos(updated);
    saveStoredTeamPhotos(updated);
    saveTeamPhotosToCloud(updated);
  };

  const handleUpdateTeamPhotoSubtitle = (id: string, subtitle: string) => {
    const updated = teamPhotos.map((tp) => (tp.id === id ? { ...tp, subtitle } : tp));
    setLocalTeamPhotos(updated);
    if (onUpdateTeamPhotos) onUpdateTeamPhotos(updated);
    saveStoredTeamPhotos(updated);
    saveTeamPhotosToCloud(updated);
  };

  const handleUpdateTeamPhotoBadge = (id: string, badge: string) => {
    const updated = teamPhotos.map((tp) => (tp.id === id ? { ...tp, badge } : tp));
    setLocalTeamPhotos(updated);
    if (onUpdateTeamPhotos) onUpdateTeamPhotos(updated);
    saveStoredTeamPhotos(updated);
    saveTeamPhotosToCloud(updated);
  };

  const handleRemoveTeamPhotoImage = (id: string) => {
    const updated = teamPhotos.map((tp) => (tp.id === id ? { ...tp, imageSrc: '' } : tp));
    setLocalTeamPhotos(updated);
    if (onUpdateTeamPhotos) onUpdateTeamPhotos(updated);
    saveStoredTeamPhotos(updated);
    saveTeamPhotosToCloud(updated);
    setSuccessMessage('Foto do ensaio removida.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCopyPhoto3SubtitleToAll = () => {
    const p3 = teamPhotos.find((p) => p.id === 'photo_3_detalhes') || teamPhotos[2];
    const targetSub = p3?.subtitle || 'Postura, garra e identidade visual que representam nossa terra';
    const updated = teamPhotos.map((p) => ({ ...p, subtitle: targetSub }));
    setLocalTeamPhotos(updated);
    saveStoredTeamPhotos(updated);
    if (onUpdateTeamPhotos) {
      onUpdateTeamPhotos(updated);
    } else {
      saveTeamPhotosToCloud(updated);
    }
    setSuccessMessage('Legenda da Imagem 3 copiada para as fotos 1 e 2!');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Funções da Loja Poeirão
  const handleToggleShirtStock = (id: string) => {
    const updated = shirts.map((sh) =>
      sh.id === id ? { ...sh, inStock: sh.inStock === false ? true : false } : sh
    );
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
    const target = updated.find((s) => s.id === id);
    setSuccessMessage(
      `Status do produto "${target?.name}": ${
        target?.inStock ? '🟢 Em Estoque (Pedidos Ativos)' : '🔴 Esgotado / Pausado'
      }`
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleShirtCustomization = (id: string) => {
    const updated = shirts.map((sh) =>
      sh.id === id
        ? { ...sh, allowCustomization: sh.allowCustomization === false ? true : false }
        : sh
    );
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
    const target = updated.find((s) => s.id === id);
    setSuccessMessage(
      `Personalização de Nome/Número para "${target?.name}": ${
        target?.allowCustomization !== false ? 'ATIVADA' : 'DESATIVADA'
      }`
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleUpdateShirtCategory = (id: string, category: string) => {
    let categoryLabel = 'Camisa de Jogo';
    if (category === 'treino') categoryLabel = 'Treino & Agasalhos';
    else if (category === 'acessorios') categoryLabel = 'Acessórios & Bonés';
    else if (category === 'infantil') categoryLabel = 'Linha Infantil & Kits';
    const updated = shirts.map((sh) =>
      sh.id === id ? { ...sh, category, categoryLabel } : sh
    );
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtOriginalPrice = (id: string, originalPrice: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, originalPrice } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtDescription = (id: string, description: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, description } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtFabric = (id: string, fabricDetails: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, fabricDetails } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtSizes = (id: string, sizesStr: string) => {
    const sizes = sizesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, sizes } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtName = (id: string, name: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, name } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtPrice = (id: string, price: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, price } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleUpdateShirtBadge = (id: string, badge: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, badge } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
  };

  const handleRemoveShirtImage = (id: string) => {
    const updated = shirts.map((sh) => (sh.id === id ? { ...sh, imageSrc: '' } : sh));
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
    setSuccessMessage('Foto personalizada removida. O produto agora usa a ilustração padrão.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddNewShirt = () => {
    const newShirt: ShirtItem = {
      id: `shirt_${Date.now()}`,
      name: `Novo Produto Oficial #${shirts.length + 1}`,
      category: 'camisas',
      categoryLabel: 'Camisa de Jogo',
      price: 'R$ 89,90',
      originalPrice: 'R$ 119,90',
      imageSrc: '',
      badge: 'Lançamento 2026',
      description: 'Camisa oficial do Poeirão F.C. em tecido Dry-Fit respirável com acabamento tricolor premium.',
      sizes: ['P', 'M', 'G', 'GG', 'XGG'],
      inStock: true,
      fabricDetails: '100% Poliéster Dry-Fit • Proteção UV • Costura Reforçada',
      allowCustomization: true,
    };
    const updated = [...shirts, newShirt];
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
    setSuccessMessage('Novo produto adicionado com sucesso! Role para baixo para editá-lo.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleDeleteShirt = (id: string) => {
    if (shirts.length <= 1) {
      alert('A loja precisa ter pelo menos um produto cadastrado.');
      return;
    }
    const updated = shirts.filter((sh) => sh.id !== id);
    setLocalShirts(updated);
    saveStoredShirts(updated);
    if (onUpdateShirts) {
      onUpdateShirts(updated);
    } else {
      saveStoreShirtsToCloud(updated);
    }
    setSuccessMessage('Produto removido da loja.');
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
              {/* ABA 1: GERENCIAR LOJA POEIRÃO & FOTOS DO TIME (LOOKBOOK)          */}
              {/* ================================================================= */}
              {activeTab === 'store' && (
                <div className="space-y-8">
                  {/* SEÇÃO 1: FOTOS OFICIAIS DO TIME & ENSAIO LOOKBOOK (IMAGENS 1, 2 E 3) */}
                  <div className="bg-gradient-to-b from-[#11192b] to-[#0a0f1b] border-2 border-red-900/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/40 px-3 py-1 rounded-full mb-1.5">
                          <Camera className="w-3.5 h-3.5 text-red-400" />
                          <span>Ensaio Oficial • 3 Fotos do Time</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                          📸 Fotos Oficiais do Time & Lookbook da Loja
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Altere as 3 fotos do topo da loja (Imagens 1, 2 e 3), títulos, legendas e selos. Sincroniza em tempo real.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyPhoto3SubtitleToAll}
                        className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0"
                        title="Aplica a mesma legenda da foto 3 nas fotos 1 e 2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar Legenda da Foto 3 p/ Todas</span>
                      </button>
                    </div>

                    {/* GRADE DAS 3 FOTOS DO TIME */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {teamPhotos.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3.5 shadow-md hover:border-red-900/60 transition"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 border border-amber-900/40 px-2 py-0.5 rounded-md">
                                Foto #{idx + 1} • {photo.badge || 'Oficial'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">
                                Imagem {idx + 1}
                              </span>
                            </div>

                            {/* PREVIEW DA FOTO */}
                            <div className="relative w-full h-40 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center mb-3">
                              {photo.imageSrc ? (
                                <img
                                  src={photo.imageSrc}
                                  alt={photo.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-3 text-slate-500">
                                  <Camera className="w-8 h-8 mx-auto text-slate-600 mb-1" />
                                  <span className="text-[10px] block">Sem foto (usa ilustração)</span>
                                </div>
                              )}
                            </div>

                            {/* BOTÕES DE UPLOAD / REMOÇÃO DA FOTO */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <button
                                type="button"
                                onClick={() => triggerUpload('team_photo', photo.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer flex-1 justify-center"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{photo.imageSrc ? 'Trocar Foto' : 'Subir Imagem'}</span>
                              </button>

                              {photo.imageSrc && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTeamPhotoImage(photo.id)}
                                  className="text-xs text-slate-400 hover:text-red-400 px-2 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
                                >
                                  Remover
                                </button>
                              )}
                            </div>

                            {/* CAMPOS DE EDIÇÃO: TÍTULO, LEGENDA E BADGE */}
                            <div className="space-y-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                  Título da Imagem:
                                </label>
                                <input
                                  type="text"
                                  value={photo.title}
                                  onChange={(e) => handleUpdateTeamPhotoTitle(photo.id, e.target.value)}
                                  placeholder="Ex: Ensaio Oficial do Elenco"
                                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                  Legenda / Descrição:
                                </label>
                                <textarea
                                  rows={2}
                                  value={photo.subtitle}
                                  onChange={(e) => handleUpdateTeamPhotoSubtitle(photo.id, e.target.value)}
                                  placeholder="Postura, garra e identidade visual que representam nossa terra"
                                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 resize-none leading-relaxed"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                  Selo no Card:
                                </label>
                                <input
                                  type="text"
                                  value={photo.badge || ''}
                                  onChange={(e) => handleUpdateTeamPhotoBadge(photo.id, e.target.value)}
                                  placeholder="Ex: LANÇAMENTO 2026"
                                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-red-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEÇÃO 2: CONTROLE GLOBAL DE EMERGÊNCIA (PAUSA GERAL) */}
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
                            Pausa Geral de Emergência (Todos os Produtos)
                          </h4>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              storeOrdersEnabled
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {storeOrdersEnabled ? '🟢 Loja Aberta' : '🔴 Pedidos Gerais Pausados'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {storeOrdersEnabled
                            ? 'A loja está aberta. Cada produto abaixo controla o seu próprio botão de WhatsApp individualmente.'
                            : 'Pausa geral ativada: todos os botões do WhatsApp estão suspensos de uma só vez.'}
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
                              ? 'Loja REABERTA! Cada produto segue seu próprio estoque individual.'
                              : 'Pausa geral ATIVADA em toda a loja.'
                          );
                          setTimeout(() => setSuccessMessage(null), 3500);
                        }}
                        className={`font-black text-xs uppercase px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shadow ${
                          storeOrdersEnabled
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-600/30'
                        }`}
                      >
                        {storeOrdersEnabled ? 'Pausar Toda a Loja' : 'Reabrir Toda a Loja'}
                      </button>
                    )}
                  </div>

                  {/* SEÇÃO 3: CATÁLOGO DE PRODUTOS COM CONTROLE INDIVIDUAL DE ESTOQUE/WHATSAPP */}
                  <div className="space-y-4">
                    <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Shirt className="w-4 h-4 text-red-500" />
                          Catálogo de Produtos ({shirts.length} Itens Cadastrados)
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Cada item possui seu próprio botão para ligar ou desligar pedidos no WhatsApp sem afetar os outros produtos.
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

                    {/* LISTA COMPLETA DOS PRODUTOS */}
                    <div className="space-y-4">
                      {shirts.map((shirt, idx) => {
                        const isItemInStock = shirt.inStock !== false;
                        const isCustomAllowed = shirt.allowCustomization !== false;

                        return (
                          <div
                            key={shirt.id}
                            className={`bg-slate-950 border rounded-3xl p-4 sm:p-5 flex flex-col gap-4 transition-all shadow-xl ${
                              isItemInStock
                                ? 'border-slate-800 hover:border-slate-700'
                                : 'border-red-950/70 bg-red-950/10'
                            }`}
                          >
                            {/* LINHA SUPERIOR: STATUS DO ESTOQUE INDIVIDUAL & PERSONALIZAÇÃO */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/60 border border-red-900/40 px-2.5 py-0.5 rounded-md">
                                  Item #{idx + 1}
                                </span>
                                <span className="text-xs font-black text-white truncate max-w-[200px] sm:max-w-xs">
                                  {shirt.name}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* BOTÃO EXCLUSIVO: CONTROLE INDIVIDUAL DE ESTOQUE / WHATSAPP DESTE PRODUTO */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleShirtStock(shirt.id)}
                                  className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                                    isItemInStock
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                                  }`}
                                  title="Clique para alternar o botão do WhatsApp apenas para este produto"
                                >
                                  <span>{isItemInStock ? '🟢 Pedir no Zap: ATIVO' : '🔴 Esgotado / Pausado'}</span>
                                </button>

                                {/* BOTÃO EXCLUSIVO: PERMITIR PERSONALIZAÇÃO (NOME E NÚMERO) */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleShirtCustomization(shirt.id)}
                                  className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isCustomAllowed
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                  }`}
                                  title="Ativa/desativa campos de Nome e Número para o cliente personalizar"
                                >
                                  <span>{isCustomAllowed ? '✍️ Personalização (Nome/Nº): SIM' : '✍️ Personalização: NÃO'}</span>
                                </button>

                                {/* EXCLUIR PRODUTO */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteShirt(shirt.id)}
                                  className="text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 py-1.5 px-2.5 rounded-xl transition cursor-pointer"
                                  title="Excluir este produto da loja"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* LINHA DO MEIO: FOTO DO PRODUTO & CAMPOS EDITÁVEIS */}
                            <div className="flex flex-col md:flex-row gap-5 items-start">
                              {/* FOTO E BOTÕES DE UPLOAD */}
                              <div className="flex flex-col items-center gap-2 w-full md:w-36 shrink-0">
                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                                  {shirt.imageSrc ? (
                                    <img
                                      src={shirt.imageSrc}
                                      alt={shirt.name}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-500 text-center">
                                      <Shirt className="w-8 h-8 text-red-500/70 mb-1" />
                                      <span className="text-[9px] font-bold">Ilustração Padrão</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-1.5 w-full justify-center">
                                  <button
                                    type="button"
                                    onClick={() => triggerUpload('shirt', shirt.id)}
                                    disabled={isProcessing}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <span>{shirt.imageSrc ? 'Trocar' : 'Subir Foto'}</span>
                                  </button>

                                  {shirt.imageSrc && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveShirtImage(shirt.id)}
                                      className="text-[11px] text-slate-400 hover:text-red-400 px-2 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
                                    >
                                      Remover
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* GRADE DE CAMPOS: DADOS COMPLETOS DO PRODUTO */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                                {/* Nome do produto */}
                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Nome do Produto
                                  </label>
                                  <input
                                    type="text"
                                    value={shirt.name}
                                    onChange={(e) => handleUpdateShirtName(shirt.id, e.target.value)}
                                    placeholder="Ex: Camisa Oficial 2026 - Poeirão F.C."
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>

                                {/* Categoria */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Categoria (Aba na Loja)
                                  </label>
                                  <select
                                    value={shirt.category || 'camisas'}
                                    onChange={(e) => handleUpdateShirtCategory(shirt.id, e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
                                  >
                                    <option value="camisas">Camisas de Jogo</option>
                                    <option value="treino">Treino & Agasalhos</option>
                                    <option value="acessorios">Acessórios & Bonés</option>
                                    <option value="infantil">Linha Infantil & Kits</option>
                                  </select>
                                </div>

                                {/* Preço de Venda */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Preço de Venda (R$)
                                  </label>
                                  <input
                                    type="text"
                                    value={shirt.price}
                                    onChange={(e) => handleUpdateShirtPrice(shirt.id, e.target.value)}
                                    placeholder="R$ 89,90"
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-black text-emerald-400 focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>

                                {/* Preço Original (De / Por) */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Preço Original / De (opcional)
                                  </label>
                                  <input
                                    type="text"
                                    value={shirt.originalPrice || ''}
                                    onChange={(e) => handleUpdateShirtOriginalPrice(shirt.id, e.target.value)}
                                    placeholder="Ex: R$ 119,90"
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>

                                {/* Selo / Badge */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Selo / Destaque
                                  </label>
                                  <input
                                    type="text"
                                    value={shirt.badge || ''}
                                    onChange={(e) => handleUpdateShirtBadge(shirt.id, e.target.value)}
                                    placeholder="Ex: Lançamento 2026, Mais Vendido"
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>

                                {/* Tecido / Detalhes de Fabricação */}
                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Tecido / Detalhes de Fabricação
                                  </label>
                                  <input
                                    type="text"
                                    value={shirt.fabricDetails || ''}
                                    onChange={(e) => handleUpdateShirtFabric(shirt.id, e.target.value)}
                                    placeholder="Ex: 100% Poliéster Dry-Fit • Proteção UV • Costura Reforçada"
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>

                                {/* Tamanhos Disponíveis */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Tamanhos (separados por vírgula)
                                  </label>
                                  <input
                                    type="text"
                                    value={(shirt.sizes || []).join(', ')}
                                    onChange={(e) => handleUpdateShirtSizes(shirt.id, e.target.value)}
                                    placeholder="P, M, G, GG, XGG"
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>

                                {/* Descrição Completa */}
                                <div className="sm:col-span-3">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Descrição Completa do Produto
                                  </label>
                                  <input
                                    type="text"
                                    value={shirt.description || ''}
                                    onChange={(e) => handleUpdateShirtDescription(shirt.id, e.target.value)}
                                    placeholder="Ex: Camisa oficial de jogo em tecido Dry-Fit e poliéster com escudo em alta definição."
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500 transition"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
