(() => {
  const config = window.CAJUI_CONFIG || {};
  const money = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const products = {
    sol: { name: 'Sol do Litoral', price: 34.90, detail: 'Frango grelhado, manga, quinoa e castanha de caju' },
    mare: { name: 'Maré Dourada', price: 37.90, detail: 'Camarões, abacaxi, abacate e quinoa' },
    brisa: { name: 'Brisa do Porto', price: 32.90, detail: 'Atum, grão-de-bico, batata-doce e vegetais' },
    coalho: { name: 'Coalho Dourado', price: 32.90, detail: 'Queijo coalho, banana-da-terra e abacaxi' },
    porao: { name: 'Pôr do Sol', price: 29.90, detail: 'Manga, abacate, grão-de-bico e sementes' },
    raiz: { name: 'Raiz Tropical', price: 28.90, detail: 'Batata-doce, feijão-preto e folhas frescas' }
  };
  let cart = [];
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const overlay = $('#overlay');
  const cartPanel = $('#cart-panel');
  const builder = $('#builder-modal');
  const scrollLock = lock => document.body.classList.toggle('no-scroll', lock);

  function openCart() { cartPanel.classList.add('is-open'); cartPanel.setAttribute('aria-hidden', 'false'); overlay.classList.add('is-visible'); scrollLock(true); }
  function closeCart() { cartPanel.classList.remove('is-open'); cartPanel.setAttribute('aria-hidden', 'true'); overlay.classList.remove('is-visible'); scrollLock(false); }
  function openBuilder() { builder.classList.add('is-open'); builder.setAttribute('aria-hidden', 'false'); overlay.classList.add('is-visible'); scrollLock(true); updateBuilderPrice(); }
  function closeBuilder() { builder.classList.remove('is-open'); builder.setAttribute('aria-hidden', 'true'); overlay.classList.remove('is-visible'); scrollLock(false); }
  function addItem(id) { const product = products[id]; if (!product) return; const existing = cart.find(i => i.id === id && !i.custom); if (existing) existing.qty++; else cart.push({ id, name: product.name, detail: product.detail, price: product.price, qty: 1, custom: false }); renderCart(); openCart(); }
  function changeQty(index, amount) { if (!cart[index]) return; cart[index].qty += amount; if (cart[index].qty <= 0) cart.splice(index, 1); renderCart(); }
  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cart-count').textContent = count;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    $('#cart-total').textContent = money(total);
    $('#cart-bottom').hidden = cart.length === 0;
    if (!cart.length) {
      $('#cart-items').innerHTML = '<div class="empty-cart"><span>🥗</span><b>Seu carrinho está fresquinho… e vazio.</b><p>Escolha uma salada para começar.</p><button class="text-link" id="back-menu">Ver cardápio ↗</button></div>';
      $('#back-menu').addEventListener('click', () => { closeCart(); document.querySelector('#cardapio').scrollIntoView({ behavior: 'smooth' }); });
      return;
    }
    $('#cart-items').innerHTML = cart.map((item, index) => \`<div class="cart-item"><div class="cart-item-top"><div><b>\${escapeHtml(item.name)}</b><p>\${escapeHtml(item.detail || '')}</p></div><strong>\${money(item.price * item.qty)}</strong></div><div class="cart-item-bottom"><span>\${money(item.price)} / un.</span><div class="quantity"><button data-qty="\${index}" data-change="-1" aria-label="Diminuir">−</button><b>\${item.qty}</b><button data-qty="\${index}" data-change="1" aria-label="Aumentar">+</button></div></div></div>\`).join('');
    $$('#cart-items [data-qty]').forEach(btn => btn.addEventListener('click', () => changeQty(Number(btn.dataset.qty), Number(btn.dataset.change))));
  }
  function escapeHtml(str) { return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function updateBuilderPrice() { const selected = $('#builder-protein').value.split('|'); $('#builder-price').textContent = money(22.90 + Number(selected[1])); }

  $$('.add-link').forEach(btn => btn.addEventListener('click', () => addItem(btn.dataset.add)));
  $$('.quick-add').forEach(btn => btn.addEventListener('click', () => addItem(btn.closest('.product-card').dataset.id)));
  $('#open-cart').addEventListener('click', openCart);
  $('#close-cart').addEventListener('click', closeCart);
  $('#open-builder').addEventListener('click', openBuilder);
  $('#close-builder').addEventListener('click', closeBuilder);
  $('#footer-order').addEventListener('click', () => { document.querySelector('#cardapio').scrollIntoView({ behavior: 'smooth' }); });
  overlay.addEventListener('click', () => { closeCart(); closeBuilder(); });
  $('#builder-protein').addEventListener('change', updateBuilderPrice);
  $('#builder-complements').addEventListener('change', e => {
    const checked = $$('#builder-complements input:checked');
    if (checked.length > 3) { e.target.checked = false; alert('Escolha até três complementos para manter o bowl no valor base.'); }
  });
  $('#add-custom').addEventListener('click', () => {
    const complements = $$('#builder-complements input:checked').map(el => el.value);
    if (complements.length < 1) { alert('Escolha pelo menos um complemento.'); return; }
    const [protein, extra] = $('#builder-protein').value.split('|');
    const name = 'Meu bowl personalizado';
    const detail = [$('#builder-base').value, ...complements, protein !== 'Nenhuma' ? protein : null, $('#builder-crunch').value, $('#builder-sauce').value].filter(Boolean).join(' • ');
    cart.push({ id: 'custom-' + Date.now(), name, detail, price: 22.90 + Number(extra), qty: 1, custom: true });
    renderCart(); closeBuilder(); openCart();
  });
  $('#checkout').addEventListener('click', () => {
    if (!cart.length) return;
    const number = String(config.whatsappNumber || '').replace(/\D/g, '');
    if (!number) { alert('O WhatsApp ainda não foi configurado. Abra o arquivo config.js e informe o número comercial da Cajuí.'); return; }
    if (!/^55\d{10,13}$/.test(number)) { alert('Confira o número no arquivo config.js. Use DDI 55 + DDD + número, somente algarismos.'); return; }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const lines = cart.map(i => \`• \${i.qty}x \${i.name} — \${money(i.price * i.qty)}\n  \${i.detail}\`).join('\n');
    const message = \`Olá! Quero fazer um pedido na Cajuí 🥗\n\n\${lines}\n\nSubtotal: \${money(total)}\n\nGostaria de confirmar disponibilidade, taxa de entrega ou retirada e formas de pagamento.\`;
    window.open(\`https://wa.me/\${number}?text=\${encodeURIComponent(message)}\`, '_blank', 'noopener,noreferrer');
  });
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('active', b === button));
    const filter = button.dataset.filter;
    $$('.product-card').forEach(card => card.hidden = filter !== 'all' && card.dataset.category !== filter);
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeBuilder(); } });
  $('#year').textContent = new Date().getFullYear();
  renderCart();
})();