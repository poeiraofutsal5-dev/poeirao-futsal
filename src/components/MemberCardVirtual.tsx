import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Download,
  CreditCard,
  Clock,
} from 'lucide-react';
import { MemberItem, PLAN_DETAILS, formatPhone } from '../utils/membersManager';
import escudoDefaultImg from '../assets/escudo-oficial.png';

interface MemberCardVirtualProps {
  member: MemberItem;
  escudoUrl?: string;
  onOpenRenewModal?: () => void;
}

export const MemberCardVirtual: React.FC<MemberCardVirtualProps> = ({
  member,
  escudoUrl,
  onOpenRenewModal,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const planInfo = PLAN_DETAILS[member.plan] || PLAN_DETAILS.prata;
  const clubCrest = escudoUrl || localStorage.getItem('poeirao_asset_escudo') || escudoDefaultImg;

  // GERADOR E DOWNLOAD REAL DE CARTEIRINHA EM ALTA DEFINIÇÃO (PNG)
  const handleDownloadPNG = async () => {
    try {
      setIsGeneratingPng(true);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert('Não foi possível gerar a imagem no seu navegador.');
        setIsGeneratingPng(false);
        return;
      }

      // Proporção de cartão de crédito em alta resolução (1200 x 756 px)
      const width = 1200;
      const height = 756;
      canvas.width = width;
      canvas.height = height;

      // Função auxiliar para desenhar retângulo com cantos arredondados
      const roundRect = (
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number
      ) => {
        c.beginPath();
        c.moveTo(x + radius, y);
        c.lineTo(x + w - radius, y);
        c.quadraticCurveTo(x + w, y, x + w, y + radius);
        c.lineTo(x + w, y + h - radius);
        c.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        c.lineTo(x + radius, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - radius);
        c.lineTo(x, y + radius);
        c.quadraticCurveTo(x, y, x + radius, y);
        c.closePath();
      };

      const cardPadding = 12;
      const cardW = width - cardPadding * 2;
      const cardH = height - cardPadding * 2;
      const cardRadius = 36;

      // 1. Fundo do Cartão com Gradiente Rico
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (member.plan === 'ouro') {
        bgGrad.addColorStop(0, '#2d1802');
        bgGrad.addColorStop(0.5, '#78350f');
        bgGrad.addColorStop(1, '#451a03');
      } else if (member.plan === 'patrocinador') {
        bgGrad.addColorStop(0, '#021024');
        bgGrad.addColorStop(0.5, '#083344');
        bgGrad.addColorStop(1, '#0f172a');
      } else if (member.plan === 'patrocinador_gold') {
        bgGrad.addColorStop(0, '#291305');
        bgGrad.addColorStop(0.5, '#78350f');
        bgGrad.addColorStop(1, '#0f172a');
      } else {
        bgGrad.addColorStop(0, '#0a0f1d');
        bgGrad.addColorStop(0.5, '#1e293b');
        bgGrad.addColorStop(1, '#0f172a');
      }

      ctx.save();
      roundRect(ctx, cardPadding, cardPadding, cardW, cardH, cardRadius);
      ctx.fillStyle = bgGrad;
      ctx.fill();
      ctx.clip();

      // Reflexo sutil
      const radGrad = ctx.createRadialGradient(cardW * 0.75, 100, 20, cardW * 0.75, 100, 450);
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(cardPadding, cardPadding, cardW, cardH);

      // Marca d'água e logo do clube
      const loadImg = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          if (src.startsWith('http://') || src.startsWith('https://')) {
            img.crossOrigin = 'anonymous';
          }
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Falha ao carregar'));
          img.src = src;
        });
      };

      let crestImg: HTMLImageElement | null = null;
      try {
        crestImg = await loadImg(clubCrest);
      } catch (e) {
        console.warn('Fallback escudo PNG', e);
      }

      // Marca d'água translúcida no fundo
      if (crestImg) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.drawImage(crestImg, width - 460, height / 2 - 200, 400, 400);
        ctx.restore();
      }

      // Borda sofisticada
      ctx.strokeStyle =
        member.plan === 'ouro'
          ? 'rgba(251, 191, 36, 0.75)'
          : member.plan === 'patrocinador'
          ? 'rgba(56, 189, 248, 0.75)'
          : member.plan === 'patrocinador_gold'
          ? 'rgba(245, 158, 11, 0.9)'
          : 'rgba(148, 163, 184, 0.65)';
      ctx.lineWidth = 5;
      roundRect(ctx, cardPadding + 3, cardPadding + 3, cardW - 6, cardH - 6, cardRadius - 2);
      ctx.stroke();

      // TOPO: ESCUDO & POEIRÃO F.C.
      const topY = 60;
      const leftX = 60;

      // Caixa do escudo
      roundRect(ctx, leftX, topY, 100, 100, 22);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (crestImg) {
        ctx.drawImage(crestImg, leftX + 10, topY + 10, 80, 80);
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PFC', leftX + 50, topY + 62);
      }

      // Título do clube
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('POEIRÃO F.C.', leftX + 120, topY + 46);

      const titleWidth = ctx.measureText('POEIRÃO F.C.').width;
      roundRect(ctx, leftX + 130 + titleWidth, topY + 20, 90, 30, 8);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OFICIAL', leftX + 130 + titleWidth + 45, topY + 41);

      // Subtítulo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SÓCIO TORCEDOR 2026', leftX + 120, topY + 80);

      // Chip Dourado no canto superior direito
      const chipX = width - 180;
      const chipY = topY + 12;
      const chipW = 96;
      const chipH = 72;

      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipGrad.addColorStop(0, '#fef08a');
      chipGrad.addColorStop(0.5, '#f59e0b');
      chipGrad.addColorStop(1, '#b45309');
      roundRect(ctx, chipX, chipY, chipW, chipH, 12);
      ctx.fillStyle = chipGrad;
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // MEIO: MATRÍCULA E BADGE DO PLANO
      const midY = 270;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '700 18px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('MATRÍCULA OFICIAL', leftX, midY);

      // Badge do Plano
      const planNameStr = `★ ${planInfo.name.toUpperCase()}`;
      ctx.font = '900 19px "Plus Jakarta Sans", sans-serif';
      const badgeW = ctx.measureText(planNameStr).width + 36;
      const badgeX = width - leftX - badgeW;
      const badgeY = midY - 24;

      roundRect(ctx, badgeX, badgeY, badgeW, 36, 18);
      if (member.plan === 'ouro') {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
        ctx.fill();
        ctx.fillStyle = '#451a03';
      } else if (member.plan === 'patrocinador') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.fill();
        ctx.fillStyle = '#082f49';
      } else if (member.plan === 'patrocinador_gold') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.95)';
        ctx.fill();
        ctx.fillStyle = '#451a03';
      } else {
        ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
        ctx.fill();
        ctx.fillStyle = '#0f172a';
      }
      ctx.textAlign = 'center';
      ctx.fillText(planNameStr, badgeX + badgeW / 2, badgeY + 25);

      // Matrícula em grande destaque
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 54px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(member.matricula, leftX, midY + 68);

      // Linha Fina
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX, midY + 110);
      ctx.lineTo(width - leftX, midY + 110);
      ctx.stroke();

      // RODAPÉ: TITULAR & VALIDADE
      const bottomY = midY + 160;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TITULAR / SÓCIO', leftX, bottomY);

      // Nome do Titular
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(member.name.toUpperCase(), leftX, bottomY + 45);

      // Celular
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '700 20px monospace';
      ctx.fillText(formatPhone(member.phone), leftX, bottomY + 80);

      // Validade
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('VALIDADE', width - leftX, bottomY);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 30px monospace';
      ctx.fillText(member.validUntil || '31/12/2026', width - leftX, bottomY + 45);

      // Badge Ativo / Pendente
      const statusText = member.status === 'active' ? 'ATIVO' : 'PENDENTE';
      const statusW = 115;
      const statusX = width - leftX - statusW;
      const statusY = bottomY + 60;
      roundRect(ctx, statusX, statusY, statusW, 30, 15);
      ctx.fillStyle = member.status === 'active' ? '#059669' : '#d97706';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(statusText, statusX + statusW / 2, statusY + 20);

      ctx.restore();

      // Criar o download PNG automático e opção de salvar na galeria
      const safeName = member.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-');
      const filename = `carteirinha-poeirao-${safeName}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          // Fallback para toDataURL caso toBlob falhe
          try {
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setIsGeneratingPng(false);
            return;
          } catch (canvasErr) {
            console.error('Falha ao exportar canvas:', canvasErr);
            alert('Não foi possível gerar a imagem da carteirinha.');
            setIsGeneratingPng(false);
            return;
          }
        }

        // Se estiver em celular (iOS Safari ou Android Chrome), permite salvar direto nas Fotos/Galeria via folha nativa
        try {
          const file = new File([blob], filename, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Carteirinha Oficial - ${member.name}`,
              text: `Carteirinha de Sócio Torcedor Oficial do Poeirão F.C. - Matrícula ${member.matricula}`,
            });
            setIsGeneratingPng(false);
            return;
          }
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            setIsGeneratingPng(false);
            return;
          }
        }

        // Download direto do arquivo PNG
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          setIsGeneratingPng(false);
        }, 1200);
      }, 'image/png');
    } catch (err) {
      console.error('Erro ao gerar PNG:', err);
      setIsGeneratingPng(false);
      alert('Não foi possível salvar o PNG.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* CONTROLE DE GIRO / INSTRUÇÃO */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Carteirinha Digital Oficial
        </span>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-red-600 font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm transition hover:shadow cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-600" />
          <span>{isFlipped ? 'Ver Frente' : 'Girar Cartão (Verso)'}</span>
        </button>
      </div>

      {/* CONTAINER DO CARTÃO VIRTUAL COM PERSPECTIVA */}
      <div className="relative [perspective:1000px] select-none">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full aspect-[1.586/1] rounded-3xl transition-transform duration-700 cursor-pointer [transform-style:preserve-3d] shadow-2xl ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* ======================================================================= */}
          {/* FRENTE DO CARTÃO (FRONT)                                                */}
          {/* ======================================================================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden [backface-visibility:hidden] p-5 sm:p-6 flex flex-col justify-between border-2 ${
              member.plan === 'ouro'
                ? 'bg-gradient-to-br from-amber-900 via-amber-700 to-yellow-800 border-amber-300/80 shadow-amber-500/20'
                : member.plan === 'patrocinador'
                ? 'bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950 border-cyan-400/80 shadow-cyan-500/20'
                : member.plan === 'patrocinador_gold'
                ? 'bg-gradient-to-br from-slate-950 via-[#3a1d04] to-amber-950 border-amber-400/90 shadow-amber-500/30'
                : 'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 border-slate-400/80 shadow-slate-900/30'
            }`}
          >
            {/* TEXTURA E REFLEXO DE LUXO */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-black" />
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            {/* MARCA D'ÁGUA DO ESCUDO NO FUNDO */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-48 h-48 flex items-center justify-center">
              <img
                src={clubCrest}
                alt="Escudo Poeirão Marca d'água"
                className="w-full h-full object-contain filter grayscale"
              />
            </div>

            {/* TOPO DO CARTÃO */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-1 border border-white/20 shadow-md flex items-center justify-center">
                  <img
                    src={clubCrest}
                    alt="Escudo Poeirão F.C."
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div>
                  <h4 className="text-white font-black tracking-wider text-sm sm:text-base uppercase leading-none flex items-center gap-1.5">
                    <span>POEIRÃO F.C.</span>
                    <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black tracking-widest">
                      OFICIAL
                    </span>
                  </h4>
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
                    SÓCIO TORCEDOR 2026
                  </p>
                </div>
              </div>

              {/* CHIP METÁLICO & NFC */}
              <div className="flex items-center gap-2">
                {/* Ícone Contactless / NFC */}
                <svg
                  className="w-5 h-5 text-white/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3" />
                  <path d="M5 18a6 6 0 0 0 6-6c0-3.3-1.5-5-2.5-7" />
                  <path d="M1.5 21.5A9.5 9.5 0 0 0 11 12c0-5.2-2.5-8-4-11" />
                </svg>

                {/* Chip Dourado */}
                <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 border border-amber-500/60 shadow-inner flex flex-col justify-between p-1">
                  <div className="w-full h-[1px] bg-amber-600/40" />
                  <div className="flex justify-between items-center h-full py-0.5">
                    <div className="w-1.5 h-full border-r border-amber-600/40" />
                    <div className="w-1.5 h-full border-l border-amber-600/40" />
                  </div>
                  <div className="w-full h-[1px] bg-amber-600/40" />
                </div>
              </div>
            </div>

            {/* MEIO: NÚMERO DE MATRÍCULA E BADGE DO PLANO */}
            <div className="relative z-10 my-auto pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
                  MATRÍCULA OFICIAL
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
                    member.plan === 'ouro'
                      ? 'bg-amber-300 text-amber-950 border-amber-200'
                      : member.plan === 'patrocinador'
                      ? 'bg-cyan-300 text-cyan-950 border-cyan-100'
                      : member.plan === 'patrocinador_gold'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-200 shadow-amber-400/30'
                      : 'bg-slate-200 text-slate-900 border-white'
                  }`}
                >
                  ★ {planInfo.badge}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-mono font-black text-white tracking-widest drop-shadow">
                {member.matricula}
              </p>
            </div>

            {/* BASE: NOME DO SÓCIO, VALIDADE E STATUS */}
            <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 block">
                  TITULAR / SÓCIO
                </span>
                <p className="text-sm sm:text-base font-black text-white tracking-wide uppercase truncate max-w-[210px] sm:max-w-[240px]">
                  {member.name}
                </p>
                <p className="text-[10px] font-mono text-white/75 mt-0.5">
                  {formatPhone(member.phone)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 block">
                  VALIDADE
                </span>
                <p className="text-xs font-mono font-bold text-white tracking-wider">
                  {member.validUntil || '12/2026'}
                </p>
                <div className="mt-1 flex items-center justify-end gap-1">
                  {member.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-300 bg-emerald-950/80 border border-emerald-400/50 px-2 py-0.5 rounded-full shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ATIVO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-300 bg-amber-950/80 border border-amber-400/50 px-2 py-0.5 rounded-full shadow-sm">
                      <Clock className="w-2.5 h-2.5" />
                      PENDENTE
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* VERSO DO CARTÃO (BACK)                                                  */}
          {/* ======================================================================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] p-5 flex flex-col justify-between border-2 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 ${
              member.plan === 'ouro'
                ? 'border-amber-400/70'
                : member.plan === 'patrocinador'
                ? 'border-cyan-400/70'
                : member.plan === 'patrocinador_gold'
                ? 'border-amber-400/90 shadow-amber-500/20'
                : 'border-slate-500/70'
            }`}
          >
            {/* FAIXA MAGNÉTICA PRETA SUPERIOR */}
            <div className="absolute top-4 left-0 right-0 h-10 bg-black/90 border-y border-white/10" />

            <div className="pt-12 relative z-10 flex items-center justify-between gap-4">
              {/* ÁREA DA ASSINATURA / CÓDIGO */}
              <div className="flex-1 bg-white/95 rounded-lg p-2.5 text-slate-900 shadow-inner flex items-center justify-between border border-white">
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase block leading-none">
                    ASSINATURA DO TITULAR
                  </span>
                  <p className="text-xs font-semibold italic text-slate-800 tracking-wider truncate max-w-[150px] mt-0.5 font-serif">
                    {member.name}
                  </p>
                </div>
                <div className="border-l border-slate-300 pl-2 text-right">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block leading-none">
                    CVC
                  </span>
                  <span className="text-xs font-mono font-black text-slate-900">
                    {member.matricula.slice(-3) || '924'}
                  </span>
                </div>
              </div>

              {/* QR CODE DE VALIDAÇÃO NA CATRACA */}
              <div className="bg-white p-1.5 rounded-xl shadow-md border border-white shrink-0 flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-950 p-1 rounded flex items-center justify-center">
                  {/* QR Code Ilustrativo Dinâmico */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-white fill-current"
                  >
                    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-5 0h3v3h-3v-3zm2 5h3v3h-3v-3zm-2 0h-2v-2h2v2zm4 2h2v2h-2v-2zm-8-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                  </svg>
                </div>
                <span className="text-[7px] font-mono font-bold text-slate-800 mt-0.5 uppercase">
                  VALIDAÇÃO
                </span>
              </div>
            </div>

            {/* REGRAS & TERMOS DO SÓCIO */}
            <div className="relative z-10 text-[9px] text-slate-400 leading-tight space-y-1">
              <p>
                • Este cartão é pessoal e intransferível. Apresente na bilheteria e na Loja Poeirão para obter descontos.
              </p>
              <p>
                • Válido mediante comprovação da mensalidade ativa ({planInfo.name}).
              </p>
            </div>

            {/* CÓDIGO DE BARRAS DE CATRACA ESTILIZADO */}
            <div className="relative z-10 pt-1 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-[2px] items-end h-5">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3,
                  1, 2,
                ].map((val, i) => (
                  <div
                    key={i}
                    style={{ width: `${val}px` }}
                    className="h-full bg-white/80 rounded-none"
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-white/70 tracking-widest">
                {member.matricula}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AÇÕES ABAIXO DO CARTÃO */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={isGeneratingPng}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase py-3 px-4 rounded-xl shadow transition hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          title="Baixar imagem personalizada do cartão em PNG"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{isGeneratingPng ? 'Gerando PNG...' : 'Salvar PNG'}</span>
        </button>

        {member.status !== 'active' ? (
          <button
            type="button"
            onClick={onOpenRenewModal}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase py-3 px-4 rounded-xl shadow-lg shadow-red-600/30 transition hover:scale-[1.02] cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Confirmar Pagamento</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Girar Cartão</span>
          </button>
        )}
      </div>
    </div>
  );
};
