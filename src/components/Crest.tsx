import React, { useState, useEffect } from 'react';
import escudoOficialImg from '../assets/escudo-oficial.png';
import { SITE_CONFIG } from '../siteConfig';
import { subscribeToClubSettings } from '../services/firebase';

interface CrestProps {
  className?: string;
  size?: number | string;
  alt?: string;
  showFallbackOnFail?: boolean;
}

export const Crest: React.FC<CrestProps> = ({
  className = 'h-16 w-auto',
  alt = 'Escudo Oficial do Poeirão Futebol Clube - P.F.C.',
}) => {
  const [customSrc, setCustomSrc] = useState<string | null>(() => {
    try {
      return localStorage.getItem('poeirao_asset_escudo');
    } catch {
      return null;
    }
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setCustomSrc(localStorage.getItem('poeirao_asset_escudo'));
      } catch {}
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('asset-updated', handleUpdate);

    // Escuta em tempo real do banco na nuvem
    const unsub = subscribeToClubSettings((settings) => {
      if (settings.escudo) {
        setCustomSrc(settings.escudo);
        try {
          localStorage.setItem('poeirao_asset_escudo', settings.escudo);
        } catch {}
      }
    });

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('asset-updated', handleUpdate);
      unsub();
    };
  }, []);

  const imageSrc = customSrc || (hasError ? '/escudo-oficial.png?v=7' : (escudoOficialImg || `${SITE_CONFIG.escudoLogoUrl}`));

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`${className} object-contain transition-transform duration-300 hover:scale-105 select-none`}
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
        } else {
          (e.currentTarget as HTMLImageElement).src = '/escudo-oficial.png?v=7';
        }
      }}
    />
  );
};


