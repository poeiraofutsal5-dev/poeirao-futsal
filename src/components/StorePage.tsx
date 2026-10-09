import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  ShoppingBag,
  ShieldCheck,
  Search,
  Tag,
  Award,
  Maximize2,
  X,
  Camera,
  Shirt,
  Flame,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { ShirtItem, TeamPhotoItem } from '../utils/storeManager';
import { SITE_CONFIG } from '../siteConfig';
import { Crest } from './Crest';

interface StorePageProps {
  onBack: () => void;
  onOpenAdmin: (tab?: 'store' | 'escudo_jpx' | 'sponsors' | 'members') => void;
  shirts: ShirtItem[];
  teamPhotos?: TeamPhotoItem[];
  storeOrdersEnabled?: boolean;
}

export const StorePage: React.FC<StorePageProps> = ({
  onBack,
  onOpenAdmin,
  shirts,
  teamPhotos = [],
  storeOrdersEnabled = true,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [customNumbers, setCustomNumbers] = useState<Record<string, string>>({});
  const [isCustomizing, setIsCustomizing] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoomedPhoto, setZoomedPhoto] = useState<TeamPhotoItem | null>(null);

  const handleSelectSize = (shirtId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [shirtId]: size }));
  };

  const handleToggleCustomize = (shirtId: string) => {
    setIsCustomizing((prev) => ({ ...prev, [shirtId]: !prev[shirtId] }));
  };

  const handleUpdateCustomName = (shirtId: string, name: string) => {
    setCustomNames((prev) => ({ ...prev, [shirtId]: name.toUpperCase().slice(0, 16) }));
  };

  const handleUpdateCustomNumber = (shirtId: string, num: string) => {
    const cleanNum = num.replace(/\D/g, '').slice(0, 3);
    setCustomNumbers((prev) => ({ ...prev, [shirtId]: cleanNum }));
  };

  const getWhatsAppBuyLink = (shirt: ShirtItem) => {
    const size = selectedSizes[shirt.id] || (shirt.sizes && shirt.sizes[0]) || 'M';
    const name = (customNames[shirt.id] || '').trim();
    const num = (customNumbers[shirt.id] || '').trim();
    const hasCustom = (isCustomizing[shirt.id] || name || num) && (name || num);

    let msg = `Olá! Gostaria de comprar o produto oficial "${shirt.name}" do Poeirão F.C. no valor de ${shirt.price} (Tamanho: ${size}`;
    if (hasCustom) {
      msg += `, Personalização: [Nome nas costas: ${name || 'Nenhum'}, Número: ${num || 'Nenhum'}]`;
    }
    msg += `). Como faço para combinar entrega e pagamento?`;
    return `https://wa.me/${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppReserveLink = (shirt: ShirtItem) => {
    const size = selectedSizes[shirt.id] || (shirt.sizes && shirt.sizes[0]) || 'M';
    const msg = `Olá! Gostaria de reservar uma unidade do produto "${shirt.name}" do Poeirão F.C. (Tamanho: ${size}) assim que o novo lote chegar ao estoque. Pode me avisar?`;
    return `https://wa.me/${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(msg)}`;
  };

  // Categorias disponíveis calculadas dinamicamente
  const categories = [
    { id: 'all', label: 'Todos os Itens', count: shirts.length },
    {
      id: 'camisas',
      label: 'Camisas de Jogo',
      count: shirts.filter((s) => !s.category || s.category === 'camisas' || s.category.includes('Jogo')).length,
    },
    {
      id: 'treino',
      label: 'Treino & Agasalhos',
      count: shirts.filter((s) => s.category === 'treino').length,
    },
    {
      id: 'acessorios',
      label: 'Acessórios & Bonés',
      count: shirts.filter((s) => s.category === 'acessorios').length,
    },
    {
      id: 'infantil',
      label: 'Linha Infantil & Kits',
      count: shirts.filter((s) => s.category === 'infantil').length,
    },
  ];

  // Filtra produtos por categoria e busca
  const filteredShirts = shirts.filter((shirt) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'camisas'
        ? !shirt.category || shirt.category === 'camisas' || shirt.category.includes('Jogo')
        : shirt.category === activeCategory;

    const matchesSearch =
      !searchTerm.trim() ||
      shirt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shirt.description && shirt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shirt.badge && shirt.badge.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white min-h-screen">
      {/* 1. SUB-BARRA DE NAVEGAÇÃO DA LOJA COM CORES DO POEIRÃO */}
      <div className="bg-[#0b101c] border-b border-red-950/40 py-3.5 px-4 sm:px-6 lg:px-8 sticky top-16 z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-red-950/60 border border-slate-800 hover:border-red-600/50 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Voltar ao Site</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center p-0.5">
              <Crest className="w-full h-full object-contain" />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-red-500">
              Loja Oficial Poeirão F.C.
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenAdmin('store')}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-red-950/60 border border-slate-800 hover:border-red-600/50 px-3.5 py-2 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>Gerenciar Loja</span>
          </button>
        </div>
      </div>

      {/* 2. HERO PRINCIPAL DA LOJA NAS CORES DO POEIRÃO (VERMELHO, PRETO E DOURADO) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#080c14] border-b border-red-950/50 py-12 sm:py-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 to-red-950/60 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-widest mb-4 shadow-lg">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Manto Sagrado • Temporada 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase max-w-4xl mx-auto leading-tight">
            VISTA AS CORES DO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">POEIRÃO F.C.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Produtos oficiais desenvolvidos com tecido de alta performance. <strong>100% do lucro das vendas</strong> é destinado diretamente aos atletas do clube, ajudando no custeio das viagens, uniformes, inscrições e materiais esportivos.
          </p>

          {/* BENEFÍCIOS E SELOS DE QUALIDADE */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-200 font-bold">
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Tecido Dry-Fit 100% Poliéster
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Escudo Oficial em Alta Definição
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Atendimento Direto no WhatsApp
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-amber-400">
              <Award className="w-4 h-4" /> Até 30% OFF para Sócios Torcedores
            </span>
          </div>
        </div>
      </section>

      {/* 3. ENSAIO OFICIAL DO MANTO (FOTOS DO TIME ESTILO IMAGEM 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4" />
              <span>Editorial & Lookbook Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Ensaio Oficial do Manto 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Confira os atletas do Poeirão F.C. e os detalhes de acabamento do novo uniforme em campo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
              3 Fotos Oficiais
            </span>
            <button
              type="button"
              onClick={() => onOpenAdmin('store')}
              className="text-xs font-bold text-red-300 hover:text-white bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Camera className="w-3.5 h-3.5 text-red-400" />
              <span>Trocar Fotos (Área Restrita)</span>
            </button>
          </div>
        </div>

        {/* GRADE DAS 3 FOTOS EDITORIAIS IDÊNTICA À IMAGEM DE REFERÊNCIA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {teamPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => photo.imageSrc && setZoomedPhoto(photo)}
              className="group relative bg-[#0e1422] border-2 border-red-950/60 hover:border-red-600/70 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-end min-h-[380px] sm:min-h-[460px] cursor-pointer"
            >
              {/* IMAGEM REAL SE ENVIADA, OU PAINEL ILUSTRADO COM IDENTIDADE POEIRÃO */}
              {photo.imageSrc ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#11192b] via-[#0a0f1b] to-[#080c14]">
                  {/* Ilustração estilizada do ensaio com escudo do clube */}
                  <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/30 transition-colors"></div>
                    <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-slate-900/80 border border-red-600/40 rounded-2xl p-3 shadow-xl">
                      {idx === 0 ? (
                        <Shirt className="w-10 h-10 text-red-500" />
                      ) : idx === 1 ? (
                        <Crest className="w-12 h-12 object-contain" />
                      ) : (
                        <Sparkles className="w-10 h-10 text-amber-400" />
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-900/50 px-2.5 py-1 rounded-full mb-2">
                    Foto #{idx + 1} • {idx === 0 ? 'Elenco' : idx === 1 ? 'Manto Titular' : 'Detalhes do Escudo'}
                  </span>
                  <p className="text-xs text-slate-400 text-center max-w-xs">
                    Adicione fotos do time (como a do ensaio) na Área Restrita da Diretoria.
                  </p>
                </div>
              )}

              {/* OVERLAY DE TEXTO E SELO */}
              <div className="relative z-10 p-6 space-y-2 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-900/40 px-2.5 py-0.5 rounded-full">
                    {photo.badge || `ENSAIO 2026 • FOTO ${idx + 1}`}
                  </span>
                  <span className="text-slate-400 group-hover:text-white transition-colors text-xs font-bold flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {photo.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BANNER DE DESCONTO EXCLUSIVO PARA SÓCIO TORCEDOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-amber-950/80 border-2 border-red-600/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Vantagem do Sócio Torcedor Poeirão F.C.</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                É Sócio Torcedor? Desconto garantido de até 30% em toda a Loja!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ao pedir no WhatsApp, informe seu número de matrícula ou o celular cadastrado na sua <strong>Carteirinha Virtual</strong>. O desconto de <strong>30% (Sócio Ouro)</strong> ou <strong>10% (Sócio Prata)</strong> é aplicado no ato da compra!
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <a
                href="#socio"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#socio';
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <span>⭐ Ver Carteirinha / Ser Sócio</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ÁREA DE PRODUTOS: FILTROS POR CATEGORIA, BUSCA E GRADE DETALHADA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* BARRA DE FILTROS E BUSCA */}
        <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-5 sm:p-6 mb-8 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Título da seção de itens */}
            <div>
              <span className="text-xs font-black uppercase text-red-500 tracking-wider block">
                Catálogo de Produtos Oficiais
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                Escolha seu Manto & Acessórios
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Campo de Busca Rápida */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, modelo..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Botão de Adicionar Produto (Abre Área Restrita da Loja) */}
              <button
                type="button"
                onClick={() => onOpenAdmin('store')}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer shrink-0"
              >
                <span>+ Adicionar Produto</span>
              </button>
            </div>
          </div>

          {/* BOTÕES DE CATEGORIAS ("SEPARAR POR ITENS") */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-500'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === cat.id ? 'bg-red-950 text-red-200' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* GRADE DE PRODUTOS DETALHADOS COM CORES DO POEIRÃO */}
        {filteredShirts.length === 0 ? (
          <div className="bg-[#0b101c] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white uppercase">Nenhum produto encontrado</h4>
            <p className="text-xs text-slate-400 mt-1">
              Tente selecionar outra categoria ou limpar a busca.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 text-xs font-bold text-red-400 hover:underline"
            >
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredShirts.map((shirt) => {
              const currentSize = selectedSizes[shirt.id] || (shirt.sizes && shirt.sizes[0]) || 'M';
              const isAvailable = shirt.inStock !== false && storeOrdersEnabled !== false;
              const buyLink = getWhatsAppBuyLink(shirt);
              const reserveLink = getWhatsAppReserveLink(shirt);

              return (
                <div
                  key={shirt.id}
                  className="group bg-[#0c1220] border border-slate-800 hover:border-red-600/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* TOPO: IMAGEM DO PRODUTO & SELOS */}
                  <div className="relative h-64 sm:h-72 bg-gradient-to-b from-[#131b2e] to-[#0c1220] flex items-center justify-center p-6 overflow-hidden border-b border-slate-800">
                    {/* Selo do Produto (ex: Lançamento, Oficial 2026) */}
                    {shirt.badge && (
                      <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        {shirt.badge}
                      </span>
                    )}

                    {/* Selo de Estoque INDIVIDUAL */}
                    <span
                      className={`absolute top-4 right-4 z-10 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                    >
                      {isAvailable ? '🟢 Em Estoque' : '🔴 Pausado'}
                    </span>

                    {/* Imagem ou ilustração */}
                    {shirt.imageSrc ? (
                      <img
                        src={shirt.imageSrc}
                        alt={shirt.name}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="relative w-44 h-48 flex items-center justify-center">
                        <svg
                          viewBox="0 0 200 200"
                          className="w-full h-full drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M60 40 L30 75 L55 90 L65 70 L65 175 L135 175 L135 70 L145 90 L170 75 L140 40 L115 50 C110 55 90 55 85 50 Z"
                            fill="#dc2626"
                            stroke="#991b1b"
                            strokeWidth="3"
                          />
                          <rect x="75" y="55" width="15" height="120" fill="#0b0f19" />
                          <rect x="110" y="55" width="15" height="120" fill="#0b0f19" />
                          <path d="M85 50 C90 55 110 55 115 50" stroke="#ffffff" strokeWidth="4" />
                        </svg>

                        <div className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none drop-shadow">
                          <Crest className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-lg">
                      {shirt.categoryLabel || 'Produto Oficial'}
                    </div>
                  </div>

                  {/* CORPO: DADOS, TECIDO, TAMANHOS E PREÇO */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                          {shirt.categoryLabel || 'Poeirão F.C.'}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">
                        {shirt.name}
                      </h3>

                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {shirt.description || 'Camisa oficial do Poeirão F.C. em tecido Dry-Fit e acabamento tricolor premium.'}
                      </p>

                      {/* DETALHE DO TECIDO */}
                      <div className="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{shirt.fabricDetails || 'Tecido Dry-Fit • Proteção UV • Costura Reforçada'}</span>
                      </div>

                      {/* SELETOR DE TAMANHOS */}
                      <div className="mt-4">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Tamanho / Opção:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(shirt.sizes || ['P', 'M', 'G', 'GG', 'XGG']).map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSelectSize(shirt.id, size)}
                              className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                currentSize === size
                                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40 ring-2 ring-red-500'
                                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* PERSONALIZAÇÃO: NOME E NÚMERO */}
                      {shirt.allowCustomization !== false && (
                        <div className="mt-4 pt-3 border-t border-slate-800/60">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Personalização Oficial</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleCustomize(shirt.id)}
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                                isCustomizing[shirt.id]
                                  ? 'bg-red-600/20 text-red-300 border-red-500/40'
                                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                              }`}
                            >
                              {isCustomizing[shirt.id] ? '✓ Personalizando' : '+ Adicionar Nome e Número'}
                            </button>
                          </div>

                          {isCustomizing[shirt.id] && (
                            <div className="bg-slate-950/80 border border-red-950/60 rounded-2xl p-3 space-y-2.5 animate-fade-in">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Nome na Camisa (Costas)
                                  </label>
                                  <input
                                    type="text"
                                    value={customNames[shirt.id] || ''}
                                    onChange={(e) => handleUpdateCustomName(shirt.id, e.target.value)}
                                    placeholder="Ex: SILVA"
                                    maxLength={15}
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white uppercase focus:outline-none focus:border-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Número (Nº)
                                  </label>
                                  <input
                                    type="text"
                                    value={customNumbers[shirt.id] || ''}
                                    onChange={(e) => handleUpdateCustomNumber(shirt.id, e.target.value)}
                                    placeholder="10"
                                    maxLength={3}
                                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-black text-amber-400 text-center focus:outline-none focus:border-red-500"
                                  />
                                </div>
                              </div>

                              {/* PRÉVIA VISUAL DO MANTO PERSONALIZADO */}
                              <div className="flex items-center justify-between text-[10px] text-slate-300 bg-black/40 border border-slate-800/80 rounded-xl px-2.5 py-1">
                                <span className="text-slate-400 font-medium">Prévia:</span>
                                <span className="font-mono font-black text-white tracking-widest uppercase">
                                  {customNames[shirt.id] || 'SEU NOME'} • #{customNumbers[shirt.id] || '10'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PREÇOS E BOTÃO INDIVIDUAL DE COMPRA */}
                    <div className="pt-4 border-t border-slate-800/80">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Preço Torcedor
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-400 tracking-tight">
                              {shirt.price}
                            </span>
                            {shirt.originalPrice && (
                              <span className="text-xs text-slate-500 line-through font-mono">
                                {shirt.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* DESCONTO SÓCIO */}
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/60 border border-amber-900/40 px-2 py-0.5 rounded-md inline-block">
                            Sócio Ouro: -30%
                          </span>
                        </div>
                      </div>

                      {/* BOTÃO INDIVIDUAL DE PEDIR NO ZAP OU ESGOTADO */}
                      {isAvailable ? (
                        <a
                          href={buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>
                            Pedir no Zap ({currentSize}
                            {(customNames[shirt.id] || customNumbers[shirt.id])
                              ? ` • ${customNames[shirt.id] ? customNames[shirt.id] + ' ' : ''}#${customNumbers[shirt.id] || ''}`
                              : ''})
                          </span>
                        </a>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="w-full inline-flex items-center justify-center gap-2 bg-red-950/40 text-red-300 font-bold text-xs py-3.5 px-4 rounded-xl border border-red-900/60 select-none">
                            <Clock className="w-4 h-4 text-red-400" />
                            <span>Produto Pausado no Momento</span>
                          </div>
                          <a
                            href={reserveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-slate-400 hover:text-emerald-300 hover:underline block text-center pt-0.5 cursor-pointer"
                          >
                            💬 Toque para consultar disponibilidade no WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. MODAL DE ZOOM PARA VER FOTOS DO TIME EM ALTA RESOLUÇÃO */}
      {zoomedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#0b101c] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomedPhoto(null)}
              className="absolute right-4 top-4 z-20 text-white/80 hover:text-white p-2 rounded-full bg-black/60 hover:bg-black/90 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {zoomedPhoto.imageSrc ? (
              <img
                src={zoomedPhoto.imageSrc}
                alt={zoomedPhoto.title}
                className="w-full max-h-[75vh] object-contain bg-black"
              />
            ) : null}

            <div className="p-6 bg-[#0b101c] border-t border-slate-800">
              <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/60 border border-amber-900/40 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                {zoomedPhoto.badge || 'ENSAIO OFICIAL DO POEIRÃO F.C.'}
              </span>
              <h3 className="text-xl font-black text-white uppercase">{zoomedPhoto.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{zoomedPhoto.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
