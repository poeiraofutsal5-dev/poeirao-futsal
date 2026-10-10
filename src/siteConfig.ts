/**
 * =========================================================================================
 * ⚙️ ARQUIVO DE CONFIGURAÇÃO RÁPIDA - SÓCIO TORCEDOR POEIRÃO F.C.
 * =========================================================================================
 * 
 * Substitua aqui os links e imagens para personalizar toda a landing page de uma só vez!
 * Cada item possui instruções detalhadas de como preencher.
 */

export const SITE_CONFIG = {
  // ---------------------------------------------------------------------------------------
  // 1. ESCUDO E IMAGENS DO CLUBE
  // ---------------------------------------------------------------------------------------
  // O arquivo que você enviou oficial: '/escudo-oficial.png' (sem espaços no nome)
  escudoLogoUrl: '/escudo-oficial.png?v=6', // <-- Escudo oficial enviado pelo usuário
  
  // Imagem de fundo do Hero (Foto da Torcida do Poeirão F.C.)
  // O site tentará automaticamente '/IMG_1610.jpg' ou '/torcida.jpg' na pasta /public
  torcidaBannerUrl: '/IMG_1610.jpg',

  // Configurações do Match Ticker (Estilo Sócio Esquadrão Bahia)
  proximoJogo: {
    campeonato: 'CAMPEONATO REGIONAL 2026',
    data: '11/10',
    horario: '19h30',
    timeCasa: 'POEIRÃO F.C.',
    timeVisitante: 'SELEÇÃO REGIONAL',
    local: 'Estádio Municipal',
    checkinHabilitado: true,
  },

  // ---------------------------------------------------------------------------------------
  // 2. WHATSAPP DE SUPORTE
  // ---------------------------------------------------------------------------------------
  // Formato: código do país (55 para Brasil) + DDD + número (ex: 5577981677054)
  // Não use parênteses nem traços.
  whatsapp: {
    numero: '5577981677054', // <-- Número oficial de suporte do Poeirão F.C.
    numeroFormatado: '(77) 98167-7054',
    mensagemPadrao: 'Olá! Gostaria de tirar dúvidas sobre o plano de Sócio Torcedor do Poeirão F.C.',
    get linkDireto() {
      return `https://wa.me/${this.numero}?text=${encodeURIComponent(this.mensagemPadrao)}`;
    },
  },

  // ---------------------------------------------------------------------------------------
  // 3. LINKS DE PAGAMENTO DO STRIPE (PLANOS DE SÓCIO)
  // ---------------------------------------------------------------------------------------
  // Substitua as URLs abaixo pelos Payment Links gerados no seu painel da Stripe:
  stripeLinks: {
    // Links existentes (Opção via Pix)
    pix: {
      prata: 'https://buy.stripe.com/fZu7sD1OK20Y9IRfcRfrW03',
      ouro: 'https://buy.stripe.com/dRm7sDdxs6he5sBc0FfrW02',
      diamante: 'https://buy.stripe.com/fZu7sD2SO9tqbQZ5ChfrW0a', // Sócio Patrocinador+ no Pix (R$ 59,99)
      patrocinador_gold: 'https://buy.stripe.com/6oUbIT650fRO1cle8NfrW0b', // Sócio Patrocinador Gold+ no Pix (A partir de R$ 99,99)
    },
    // Links Cartão de Crédito Oficiais
    cartao: {
      prata: 'https://buy.stripe.com/6oU28j2SOeNK6wFc0FfrW04', // Sócio Prata+ no Cartão (R$ 14,99)
      ouro: 'https://buy.stripe.com/4gMcMXfFA20Yg7ffcRfrW07',   // Sócio Ouro+ no Cartão (R$ 24,99)
      diamante: 'https://buy.stripe.com/aFa00bgJE6he1cl8OtfrW09', // Sócio Patrocinador+ no Cartão (R$ 59,99)
      patrocinador_gold: '', // Somente via Pix
    },
    // Compatibilidade direta
    prata: 'https://buy.stripe.com/fZu7sD1OK20Y9IRfcRfrW03',
    ouro: 'https://buy.stripe.com/dRm7sDdxs6he5sBc0FfrW02',
    diamante: 'https://buy.stripe.com/fZu7sD2SO9tqbQZ5ChfrW0a',
    patrocinador_gold: 'https://buy.stripe.com/6oUbIT650fRO1cle8NfrW0b',
  },

  // ---------------------------------------------------------------------------------------
  // 4. PLANOS E BENEFÍCIOS
  // ---------------------------------------------------------------------------------------
  planos: [
    {
      id: 'prata',
      nome: 'Sócio Poeirão Prata+',
      preco: 'R$ 14,99',
      periodo: '/ mês',
      destaque: false,
      tagPopular: null,
      corDestaque: 'border-slate-300',
      badgeCor: 'bg-slate-700',
      linkStripe: 'https://buy.stripe.com/fZu7sD1OK20Y9IRfcRfrW03',
      linkPix: 'https://buy.stripe.com/fZu7sD1OK20Y9IRfcRfrW03',
      linkCartao: 'https://buy.stripe.com/6oU28j2SOeNK6wFc0FfrW04',
      descricao: 'Para o torcedor fiel que quer apoiar o clube e garantir 10% de desconto nas camisas.',
      beneficios: [
        '10% de desconto nas camisas do time',
      ],
      botaoTexto: 'Assinar Prata+ Agora',
    },
    {
      id: 'ouro',
      nome: 'Sócio Poeirão Ouro+',
      preco: 'R$ 24,99',
      periodo: '/ mês',
      destaque: true, // Destaque visual como "Mais Popular"
      tagPopular: 'PLANO OURO ⭐ MAIS POPULAR',
      corDestaque: 'border-amber-400 ring-2 ring-amber-400',
      badgeCor: 'bg-amber-500',
      linkStripe: 'https://buy.stripe.com/dRm7sDdxs6he5sBc0FfrW02',
      linkPix: 'https://buy.stripe.com/dRm7sDdxs6he5sBc0FfrW02',
      linkCartao: 'https://buy.stripe.com/4gMcMXfFA20Yg7ffcRfrW07',
      descricao: 'Ideal para quem quer 30% de desconto em camisas do time e apoiar o clube.',
      beneficios: [
        '30% de desconto em camisas do time',
      ],
      botaoTexto: 'Assinar Ouro+ Agora',
    },
    {
      id: 'diamante',
      nome: 'Sócio Poeirão Patrocinador+',
      preco: 'R$ 59,99',
      periodo: '/ mês',
      destaque: false,
      tagPopular: 'PLANO CORPORATIVO 💎',
      corDestaque: 'border-cyan-400',
      badgeCor: 'bg-cyan-600',
      linkStripe: 'https://buy.stripe.com/aFa00bgJE6he1cl8OtfrW09',
      linkPix: 'https://buy.stripe.com/fZu7sD2SO9tqbQZ5ChfrW0a',
      linkCartao: 'https://buy.stripe.com/aFa00bgJE6he1cl8OtfrW09',
      descricao: 'Visibilidade para sua marca no site oficial e nas redes sociais do clube.',
      beneficios: [
        'Divulgação da logo no site oficial do clube.',
        'Divulgação nas redes sociais (feed, stories).',
      ],
      botaoTexto: 'Assinar Patrocinador+ Agora',
    },
    {
      id: 'patrocinador_gold',
      nome: 'Sócio Patrocinador Gold+',
      preco: 'A partir de R$ 99,99',
      periodo: '/ mês',
      destaque: true,
      tagPopular: 'PLANO MASTER GOLD 👑',
      corDestaque: 'border-amber-400 ring-2 ring-amber-400/80',
      badgeCor: 'bg-amber-500',
      linkStripe: 'https://buy.stripe.com/6oUbIT650fRO1cle8NfrW0b',
      linkPix: 'https://buy.stripe.com/6oUbIT650fRO1cle8NfrW0b',
      linkCartao: '', // Somente via Pix
      descricao: 'Visibilidade máxima para sua marca com camisa oficial personalizada do clube.',
      beneficios: [
        'Divulgação da logo no site oficial do clube.',
        'Divulgação nas redes sociais (feed, stories).',
        'Direito a uma camisa oficial do time personalizada',
      ],
      botaoTexto: 'Assinar Gold+ Agora (Pix)',
    },
  ],

  // ---------------------------------------------------------------------------------------
  // 5. PATROCINADORES OFICIAIS
  // ---------------------------------------------------------------------------------------
  // Arquivos originais enviados pelo usuário
  patrocinadores: [
    {
      nome: 'JPX Studio',
      categoria: 'Patrocinador Oficial',
      logoUrl: '/patrocinador-jpx-studio.png?v=6', // Logo original enviada pelo usuário
      sigla: 'JPX',
    },
    {
      nome: 'Próton Serviços Contábeis',
      categoria: 'Patrocinador Oficial',
      logoUrl: '/patrocinador-proton-contabeis.png?v=6', // Logo original enviada pelo usuário
      sigla: 'PRÓTON',
    },
    {
      nome: 'NATO GYM',
      categoria: 'Patrocinador Oficial',
      logoUrl: '/patrocinador-nato-gym.png?v=6', // Logo original enviada pelo usuário
      sigla: 'NATO',
    },
    {
      nome: 'Espaço Disponível',
      categoria: 'Seja um Patrocinador',
      logoUrl: '',
      sigla: '+',
    },
    {
      nome: 'Espaço Disponível',
      categoria: 'Seja um Patrocinador',
      logoUrl: '',
      sigla: '+',
    },
    {
      nome: 'Espaço Disponível',
      categoria: 'Seja um Patrocinador',
      logoUrl: '',
      sigla: '+',
    },
  ],

  // ---------------------------------------------------------------------------------------
  // 6. PERGUNTAS FREQUENTES (FAQ)
  // ---------------------------------------------------------------------------------------
  faq: [
    {
      pergunta: 'Como funciona o pagamento da assinatura do sócio?',
      resposta:
        'O pagamento é realizado de forma 100% segura através da plataforma internacional Stripe. Você pode assinar utilizando Cartão de Crédito com renovação automática mensal ou conforme os métodos disponíveis na sua conta.',
    },
    {
      pergunta: 'Posso cancelar minha assinatura a qualquer momento?',
      resposta:
        'Sim! Não há fidelidade obrigatória. Você pode cancelar sua assinatura com apenas um clique diretamente no link do cliente Stripe ou solicitando suporte rápido pelo nosso WhatsApp.',
    },
    {
      pergunta: 'Como utilizo meus descontos em ingressos e produtos?',
      resposta:
        'Ao concluir sua adesão, você recebe acesso à Carteirinha Digital do Poeirão F.C. com seu CPF e número de matrícula. Nos dias de jogo e na loja oficial, basta apresentar a carteirinha ou inserir seu CPF no checkout.',
    },
    {
      pergunta: 'Como funciona a divulgação e o kit do Sócio Patrocinador+?',
      resposta:
        'Assim que sua assinatura for confirmada, nossa equipe de marketing entra em contato imediatamente para coletar a sua logo em alta resolução para divulgação no site oficial, feed, stories e artes de dia de jogo. O kit de boas-vindas com a camisa oficial é enviado em até 15 dias úteis.',
    },
    {
      pergunta: 'Preciso morar na cidade do clube para ser sócio?',
      resposta:
        'Não! Torcedores de todo o Brasil e do exterior podem ser sócios torcedores do Poeirão F.C. Além de fortalecer o time, você tem acesso a conteúdos exclusivos, transmissões e descontos na loja virtual.',
    },
  ],

  // ---------------------------------------------------------------------------------------
  // 7. INFORMAÇÕES INSTITUCIONAIS DO CLUBE
  // ---------------------------------------------------------------------------------------
  clube: {
    nome: 'Poeirão Futebol Clube',
    sigla: 'P.F.C.',
    lema: 'Você faz nossa equipe ganhar!',
    anoFundacao: '1978',
    cores: 'Vermelho, Preto e Branco',
    emailContato: 'poeiraofutsal5@gmail.com',
    cidade: 'Brasil',
  },
};
