# ⚽ Sócio Torcedor Poeirão F.C. - Guia Rápido de Configuração

Esta landing page foi desenvolvida para ser **100% moderna, responsiva e pronta para publicação**.

Você pode personalizar tudo em **menos de 2 minutos** editando o arquivo:
👉 `src/siteConfig.ts`

---

## 🛡️ 1. Como colocar a sua logo/escudo (`escudo-time.png`)
1. Salve o seu arquivo de imagem do escudo com o nome `escudo-time.png` dentro da pasta `/public`.
2. O sistema já vem com o escudo oficial vetorial (com as 5 estrelas douradas, sigla **P.F.C.** e as listras tricolores com **POEIRÃO**) configurado por padrão.
3. Se quiser usar outro nome de arquivo ou link externo, abra `src/siteConfig.ts` e altere a linha:
   ```ts
   escudoLogoUrl: '/escudo-time.png',
   ```

---

## 💳 2. Como colocar seus links de pagamento da Stripe
1. Acesse seu painel da Stripe em: https://dashboard.stripe.com/payment-links
2. Crie 3 links de pagamento recorrentes (mensais):
   - **Plano Prata+**: R$ 14,99 / mês
   - **Plano Ouro+**: R$ 24,99 / mês
   - **Plano Diamante+**: R$ 49,99 / mês
3. Em `src/siteConfig.ts`, substitua os links correspondentes:
   ```ts
   stripeLinks: {
     prata: 'https://buy.stripe.com/test_9B6bITbs183KeazfuCa7C02', // Já configurado!
     ouro: 'https://buy.stripe.com/SEU_LINK_OURO',
     diamante: 'https://buy.stripe.com/SEU_LINK_DIAMANTE',
   }
   ```

---

## 📱 3. Como colocar seu WhatsApp de suporte
1. Em `src/siteConfig.ts`, edite o campo `whatsapp.numero` colocando seu código de país + DDD + telefone:
   ```ts
   whatsapp: {
     numero: '5571999999999', // Apenas números
   }
   ```
2. O botão flutuante no canto inferior direito, o botão do cabeçalho e o banner no final da página serão atualizados automaticamente!

---

## 🤝 4. Como colocar as logos dos patrocinadores
1. Salve as logos na pasta `/public` (ex: `patrocinador-1.png`, `patrocinador-2.png`).
2. Em `src/siteConfig.ts`, na lista `patrocinadores`, preencha o campo `logoUrl`:
   ```ts
   {
     nome: 'Nome da Empresa',
     categoria: 'Patrocinador Master',
     logoUrl: '/patrocinador-1.png',
   }
   ```
   *Se deixar vazio, um selo estilizado elegante com a sigla será exibido sem quebrar o layout!*
