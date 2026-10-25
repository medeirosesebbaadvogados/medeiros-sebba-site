/* Medeiros & Sebba Advogados — scripts do site institucional */

/* ---------- Menu mobile ---------- */
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

/* ---------- Menu suspenso "Advocacia Especializada" ---------- */
document.querySelectorAll('.nav-drop').forEach((drop) => {
  const btn = drop.querySelector('button');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = drop.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!drop.contains(e.target)) { drop.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { drop.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
  });
});

/* ---------- Ano no rodapé ---------- */
const year = document.getElementById('current-year');
if (year) year.textContent = new Date().getFullYear();

/* ---------- Últimas postagens ----------
   Os dados ficam em /postagens/postagens.js (variável window.POSTAGENS).
   Cada artigo fica em sua própria pasta dentro de /postagens/.
   A página que exibe a lista define data-base com o caminho até a raiz do site. */
(function renderPosts() {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;
  const base = grid.dataset.base || '';
  const posts = (window.POSTAGENS || []).slice().sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  const cats = document.getElementById('post-cats');
  const fmt = (d) => { if (!d) return ''; const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function draw(filter) {
    const list = posts.filter((p) => !filter || p.categoria === filter).slice(0, 6);
    if (!list.length) {
      grid.innerHTML = '<div class="posts-empty" style="grid-column:1/-1"><b>Em breve, novos conteúdos</b>Estamos preparando artigos e orientações sobre saúde, direito digital e direitos do consumidor.</div>';
      return;
    }
    grid.innerHTML = list.map((p) => `
      <a class="post-card" href="${base}postagens/${esc(p.pasta)}/index.html">
        <div class="thumb">${p.imagem ? `<img src="${base}postagens/${esc(p.pasta)}/${esc(p.imagem)}" alt="" loading="lazy">` : '<i>M&amp;S</i>'}</div>
        <div class="pbody">
          <span class="pmeta">${esc(p.categoria)} · ${fmt(p.data)}</span>
          <h3>${esc(p.titulo)}</h3>
          <p>${esc(p.resumo)}</p>
          <span class="more">Ler artigo <span>↗</span></span>
        </div>
      </a>`).join('');
  }

  if (cats) {
    const unique = [...new Set(posts.map((p) => p.categoria).filter(Boolean))];
    if (unique.length) {
      cats.innerHTML = ['Todas', ...unique].map((c, i) => `<button type="button" data-cat="${i ? esc(c) : ''}" class="${i ? '' : 'is-active'}">${esc(c)}</button>`).join('');
      cats.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        cats.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x === b));
        draw(b.dataset.cat);
      });
    } else {
      cats.remove();
    }
  }
  draw('');
})();
