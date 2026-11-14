# Cajuí — Saladas Tropicais

Site estático responsivo da Cajuí, marca de saladas tropicais artesanais em São Miguel dos Campos, AL.

## Arquivos
- \`index.html\`: estrutura e conteúdo do site.
- \`styles.css\`: identidade visual e layout responsivo.
- \`script.js\`: filtros, carrinho, personalização de bowls e envio do pedido.
- \`config.js\`: dados de configuração da loja.

## Configurar o WhatsApp
Edite \`config.js\` e informe o número comercial com DDI + DDD + telefone, somente números:

\`\`\`js
window.CAJUI_CONFIG = {
  whatsappNumber: "55DDDNÚMERO",
  city: "São Miguel dos Campos - AL",
  currency: "BRL"
};
\`\`\`

Substitua o exemplo pelo número real antes de divulgar o site. Sem essa configuração, o checkout informa que o contato ainda não foi cadastrado.

## Revisar antes da inauguração
- Confirmar preços, porções, ingredientes e disponibilidade.
- Trocar as fotografias demonstrativas por fotos reais dos produtos.
- Informar horários, endereço de retirada, bairros atendidos, taxas de entrega e formas de pagamento.
- Conferir alergênicos e informações sanitárias/legalmente exigidas.

## Publicação
O projeto não exige etapa de build. Pode ser publicado como site estático, por exemplo no Cloudflare Pages ou GitHub Pages.