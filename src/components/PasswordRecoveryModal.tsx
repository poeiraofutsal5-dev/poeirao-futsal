import React, { useState } from 'react';
import { X, Lock, Phone, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { MemberItem, formatPhone, cleanPhone } from '../utils/membersManager';
import { SITE_CONFIG } from '../siteConfig';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberItem[];
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
  members,
}) => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'found' | 'not_found'>('idle');
  const [matchedMember, setMatchedMember] = useState<MemberItem | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanPhone(phone);
    if (!cleaned || cleaned.length < 10) {
      alert('Digite o número do seu WhatsApp com DDD completo (ex: 77 98167-7054)');
      return;
    }

    const found = members.find((m) => cleanPhone(m.phone) === cleaned);
    if (found) {
      setMatchedMember(found);
      setStatus('found');
    } else {
      setStatus('not_found');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setPhone('');
    setMatchedMember(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full text-slate-900 shadow-2xl border border-slate-200 relative overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOPO VERMELHO MARCA POEIRÃO / BAHIA */}
        <div className="bg-[#c8102e] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Sócio Poeirão · Recuperação</span>
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tight text-white font-condensed">
            Recuperar Senha de Sócio
          </h3>
          <p className="text-xs text-red-100 mt-1">
            Informe o celular cadastrado para recuperar o acesso à sua Carteirinha Virtual.
          </p>
        </div>

        {/* CORPO */}
        <div className="p-6">
          {status === 'idle' && (
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Número de Celular / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(77) 98167-7054"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600 focus:bg-white transition"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Digite seu DDD e número cadastrado no momento da adesão.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0070d2] hover:bg-[#005fb3] text-white font-black uppercase text-xs tracking-wider py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Verificar Cadastro</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(
                    'Olá diretoria! Preciso de ajuda para recuperar minha senha de Sócio do Poeirão F.C.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Precisa de ajuda? Fale no WhatsApp oficial</span>
                </a>
              </div>
            </form>
          )}

          {status === 'found' && matchedMember && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-emerald-950 uppercase">
                    Cadastro Localizado!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Olá, <strong>{matchedMember.name}</strong> (Matrícula: {matchedMember.matricula}).
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular:</span>
                  <span className="font-bold text-slate-900">{matchedMember.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telefone:</span>
                  <span className="font-mono font-bold text-slate-900">{formatPhone(matchedMember.phone)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sua Senha Atual:</span>
                  <span className="font-mono font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {matchedMember.password || '••••••••'}
                  </span>
                </div>
              </div>

              <a
                href="#socio"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-[#c8102e] hover:bg-[#a50d24] text-white font-black uppercase text-xs tracking-wider py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Acessar Área do Sócio Agora</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-1"
              >
                Buscar outro número
              </button>
            </div>
          )}

          {status === 'not_found' && (
            <div className="space-y-4 text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                <h4 className="text-sm font-black text-amber-950 uppercase">
                  Nenhum cadastro encontrado com este número
                </h4>
                <p className="text-xs text-amber-900 mt-1">
                  Não encontramos nenhum sócio com o telefone <strong>{phone}</strong>. Verifique se digitou o DDD correto ou fale com a nossa equipe no WhatsApp para vincular seu pagamento.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp.numero}?text=${encodeURIComponent(
                    `Olá! Fiz o pagamento de Sócio Torcedor no Poeirão F.C., mas meu telefone ${phone} não foi localizado para entrar na Área do Sócio. Podem me ajudar?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-wider py-3.5 px-4 rounded-xl shadow-md transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar com a Diretoria no WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 py-2 cursor-pointer"
                >
                  Tentar outro telefone
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
