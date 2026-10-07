import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, Image as ImageIcon, RotateCcw, Trash2, Sparkles } from 'lucide-react';

interface JpxLogoModalProps {
  isOpen: boolean;
  currentLogo: string;
  onClose: () => void;
  onSave: (newLogoUrl: string) => void;
  onReset: () => void;
}

export const JpxLogoModal: React.FC<JpxLogoModalProps> = ({
  isOpen,
  currentLogo,
  onClose,
  onSave,
  onReset,
}) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLogoUrl(currentLogo);
    }
  }, [isOpen, currentLogo]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG ou WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logoUrl.trim()) {
      onSave(logoUrl.trim());
    }
    onClose();
  };

  const handleResetToDefault = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                Logo da JPX STUDIO
              </h3>
              <p className="text-xs text-slate-400">
                Adicione ou altere manualmente a logo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* UPLOAD MANUAL DE ARQUIVO */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
              1. Enviar Imagem da Logo
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-purple-600 bg-purple-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {logoUrl ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  {/* Prévia com fundo escuro similar ao footer */}
                  <div className="h-20 w-full max-w-[220px] bg-slate-950 rounded-xl p-2.5 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                    <img
                      src={logoUrl}
                      alt="Prévia da Logo JPX Studio"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Clique para escolher outro arquivo</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      Clique para escolher a logo do seu dispositivo
                    </span>
                    <span className="text-xs text-slate-500">
                      Recomendado: PNG com fundo transparente ou SVG
                    </span>
                  </div>
                </div>
              )}
            </div>

            {logoUrl && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Logo carregada com sucesso
                </span>
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Limpar
                </button>
              </div>
            )}
          </div>

          {/* OU DIGITAR LINK DIRETO */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">
              2. Ou Digite a URL / Caminho da Imagem
            </label>
            <div className="relative">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/patrocinador-jpx-studio-white.png ou https://..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
              <ImageIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* PRÉVIA NO CARD DO FOOTER */}
          <div className="pt-2">
            <span className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
              Como aparecerá no Rodapé do Site:
            </span>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="h-14 w-28 flex items-center justify-center p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Prévia JPX Studio"
                    className="max-h-10 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-400">SEM LOGO</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  JPX STUDIO
                </span>
                <span className="text-[10px] text-slate-400">
                  Desenvolvimento & Design Oficial
                </span>
              </div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="w-full sm:w-auto text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 py-2 px-3 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto text-xs font-bold px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto text-xs font-black uppercase tracking-wider px-5 py-2.5 text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Logo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
