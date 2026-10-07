import React, { useState } from 'react';
import { SubCategoryItem } from '../utils/historyManager';
import { ArrowLeft, Users, Trophy, MapPin, Heart, Shield, Sparkles, Lock, ChevronRight, Award } from 'lucide-react';
import { SITE_CONFIG } from '../siteConfig';

interface HistoryPageProps {
  onBack: () => void;
  onOpenAdmin?: (tab?: 'store' | 'escudo_jpx' | 'sponsors' | 'members' | 'history') => void;
  onNavigateToPlans?: () => void;
  subCategories: SubCategoryItem[];
  onUpdateSubCategories?: (updated: SubCategoryItem[]) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onBack,
  onOpenAdmin,
  onNavigateToPlans,
  subCategories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories =
    selectedCategory === 'all'
      ? subCategories
      : subCategories.filter((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* BARRA SUPERIOR DE NAVEGAÇÃO DA PÁGINA */}
      <div className="sticky top-16 sm:top-20 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Voltar ao Início</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-full font-medium">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              Projeto Oficial Poeirão F.C.
            </span>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => onOpenAdmin('history')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                title="Área protegida por senha para administradores gerenciarem fotos e textos"
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Gerenciar Categorias (Admin)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CABEÇALHO PRINCIPAL COM MANIFESTO DO PROJETO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 pt-10 pb-16 sm:pt-14 sm:pb-20">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-600/30 text-red-400 text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-red-400" />
            História do Poeirão • Projeto Social & Esportivo
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-6">
            Mais que um time, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500">
              uma paixão que transforma vidas
            </span>
          </h1>

          {/* TEXTO DO PROJETO SOCIAL CONFORME BRIEFING DO USUÁRIO */}
          <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl mb-10 text-left sm:text-center">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Nosso projeto abraça <strong className="text-white font-bold">mais de 70 crianças e adolescentes</strong> da nossa comunidade, proporcionando inclusão social, educação, disciplina e cidadania através do futebol e do futsal.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-3 font-normal">
              Nossos atletas <strong className="text-red-400 font-semibold">não apenas viajam a Bahia inteira, mas também fora do estado</strong> para disputar torneios e campeonatos, levando o nome de Carinhanha e a bandeira do Poeirão ao topo dos pódios. 
              Um trabalho incansável que forma cidadãos e campeões <strong className="text-white font-bold">desde a base no Sub-11 até a tradição e respeito da categoria Master</strong>.
            </p>
          </div>

          {/* ESTATÍSTICAS E PILARES DO PROJETO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
              <div className="inline-flex p-2.5 bg-red-950/60 text-red-400 rounded-lg mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">+70</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Crianças Atendidas
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
              <div className="inline-flex p-2.5 bg-red-950/60 text-red-400 rounded-lg mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">Bahia & Além</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Viagens & Torneios
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
              <div className="inline-flex p-2.5 bg-red-950/60 text-red-400 rounded-lg mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">Campo & Futsal</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                2 Modalidades
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
              <div className="inline-flex p-2.5 bg-red-950/60 text-red-400 rounded-lg mb-2">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">Sub-11 ao Master</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                7 Categorias
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS DE CATEGORIA */}
      <section className="bg-slate-900/40 border-b border-slate-800/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
              Categorias:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Todas ({subCategories.length})
            </button>
            {subCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LISTAGEM DAS CATEGORIAS COM FOTO E HISTÓRIA EM BAIXO */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="space-y-12 sm:space-y-16">
          {filteredCategories.map((cat, idx) => (
            <article
              key={cat.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:border-slate-700 transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* 1. FOTO DA CATEGORIA */}
                <div className="lg:col-span-5 relative bg-slate-950 flex items-center justify-center min-h-[260px] sm:min-h-[340px] overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
                  <img
                    src={cat.imageSrc || '/foto-time-1.png'}
                    alt={cat.fullName}
                    className="w-full h-full object-cover object-center max-h-[420px] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/foto-time-1.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* BADGES SOBRE A IMAGEM */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                    <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                      {cat.categoryName}
                    </span>
                    {cat.ageRange && (
                      <span className="bg-slate-900/90 backdrop-blur-md text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {cat.ageRange}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. TEXTO E HISTÓRIA DA CATEGORIA */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    {/* CABEÇALHO DO CARD */}
                    <div className="mb-4">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
                        {cat.tagline || 'História & Trajetória'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {cat.fullName}
                      </h2>
                    </div>

                    {/* DESTAQUE DE ATLETAS */}
                    {cat.playersCount && (
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-lg mb-5">
                        <Users className="w-3.5 h-3.5 text-red-400" />
                        <span>{cat.playersCount}</span>
                      </div>
                    )}

                    {/* CORPO DA HISTÓRIA */}
                    <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                      <p className="whitespace-pre-line font-normal">{cat.description}</p>
                    </div>
                  </div>

                  {/* RODAPÉ DO CARD COM HIGHLIGHT */}
                  <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Competições na Bahia & Futsal Regional</span>
                    </div>

                    {onNavigateToPlans && (
                      <button
                        type="button"
                        onClick={onNavigateToPlans}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors group cursor-pointer"
                      >
                        <span>Apoiar o {cat.categoryName} no Sócio Torcedor</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BANNER INFERIOR DE APOIO E CONTATO */}
        <div className="mt-16 sm:mt-24 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/80 border border-red-700/40 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 fill-red-400" /> Faça Parte Desta História
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mb-4">
              Ajude a manter o sonho vivo
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              Cada mensalidade do Sócio Torcedor financia transporte, alimentação, uniformes e inscrições dos nossos garotos em campeonatos por toda a Bahia e fora do estado. Vista essa camisa com a gente!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {onNavigateToPlans && (
                <button
                  type="button"
                  onClick={onNavigateToPlans}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Seja Sócio Torcedor
                </button>
              )}
              <a
                href={SITE_CONFIG.whatsapp.linkDireto}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm px-6 py-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Conversar com a Coordenação
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
