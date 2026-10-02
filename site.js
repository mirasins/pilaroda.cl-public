'use strict';
document.querySelectorAll('#y').forEach(el => { el.textContent = new Date().getFullYear(); });

// Aparición y deslizamiento de los contenidos al entrar en pantalla
const reveal = (el, kind, i = 0) => {
  el.dataset.reveal = kind;
  el.style.setProperty('--d', `${Math.min(i, 4) * 90}ms`);
};
document.querySelectorAll('main section:not(.hero) > .wrap').forEach(panel => reveal(panel, 'panel'));
const groups = document.querySelectorAll('main section:not(.hero) > .narrow, .about-grid > div, .services-head, .cards, .formacion, .formacion ul, .cta .wrap, #quien-soy > .wrap, #servicios > .wrap, .about-head, [data-group]');
groups.forEach(group => [...group.children].forEach((el, i) => {
  if (el.matches('.about-grid, .about-head, .cards, .services-head, .formacion, ul, [data-group]')) return;
  const kind = el.matches('h2, h3') ? 'left' : el.matches('li') ? 'right' : el.matches('.card, .btn, .services-more, .cta-alt, .cta p, article, details, img, form, table, blockquote, dl') ? 'up' : 'left';
  reveal(el, kind, i);
}));
const revealer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in');
  revealer.unobserve(entry.target);
}), { rootMargin: '0px 0px -10% 0px', threshold: .08 });
document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));

// Encabezado: sombra al desplazarse, barra de avance de lectura y sección activa en el menú
const header = document.querySelector('header');

// Menú desplegable en pantallas pequeñas
const menu = header.querySelector('nav');
const toggle = document.createElement('button');
toggle.className = 'menu-toggle';
toggle.type = 'button';
toggle.innerHTML = '<span></span>';
const setMenu = open => {
  header.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
setMenu(false);
toggle.addEventListener('click', () => setMenu(!header.classList.contains('open')));
menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
menu.before(toggle);
const progress = document.querySelector('.progress');
let scrollMax = 0, ticking = false;
const measure = () => { scrollMax = document.documentElement.scrollHeight - window.innerHeight; };
const paint = () => {
  ticking = false;
  header.classList.toggle('scrolled', window.scrollY > 24);
  progress.style.transform = `scaleX(${scrollMax > 0 ? Math.min(window.scrollY / scrollMax, 1) : 0})`;
};
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });
window.addEventListener('load', () => { measure(); onScroll(); });
measure();
onScroll();

// Secciones cerca de la pantalla: cargan su imagen de fondo y activan el vaivén de sus hojas
const nearby = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('seen', entry.isIntersecting)), { rootMargin: '500px 0px' });
document.querySelectorAll('main section').forEach(section => nearby.observe(section));
const links = new Map([...document.querySelectorAll('nav a[href^="#"]')].map(a => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(entries => entries.forEach(entry => {
  links.get(entry.target.id).classList.toggle('active', entry.isIntersecting);
}), { rootMargin: '-45% 0px -50% 0px' });
links.forEach((_, id) => spy.observe(document.getElementById(id)));

// Hojas de olivo: ramas que se mecen en los bordes y hojas que vuelan con el viento detrás del contenido
const LEAF = 'M0 0C12-10 40-10 56 0C40 10 12 10 0 0Z';
const stem = [[40, 30, 15], [88, 52, 24], [140, 88, 33], [196, 138, 41], [255, 202, 48], [310, 270, 54]];
const twig = [[165, 66, -8], [212, 64, 3], [256, 74, 14]];
const leaf = (x, y, angle, i) => `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="${LEAF}"/></g>`;
const pairs = (points, start) => points.map(([x, y, a], i) => leaf(x, y, a - 48, start + i * 2) + leaf(x, y, a + 44, start + i * 2 + 1)).join('');
const branch = `<svg viewBox="0 0 400 400" fill="currentColor"><path d="M-10 20C90 40 200 110 330 300M120 76C170 60 232 60 292 92" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>${pairs(stem, 0)}${leaf(330, 300, 58, 12)}${pairs(twig, 13)}${leaf(292, 92, 24, 19)}</svg>`;
const TONES = ['#6f7a45', '#8b8f58', '#55633a', '#a39a62', '#7d8a4e'];
// [alto %, duración s, desfase s, tamaño, tono, desenfoque px]
const flock = [[12, 34, -4, .8, 1, 1.5], [30, 42, -22, .6, 3, 2.5], [48, 38, -13, .7, 0, 2], [66, 46, -31, .55, 2, 3], [84, 36, -8, .75, 4, 1.5]];
const fly = ([top, time, delay, size, tone, blur]) => `<span class="fly" style="top:${top}%;--t:${time}s;--w:${delay}s;--s:${size};--c:${TONES[tone]};--b:${blur}px;--o:.2"><span><svg viewBox="-4 -14 64 28"><path d="${LEAF}"/><path class="rib" d="M3 0H50"/></svg></span></span>`;
const leaves = document.createElement('div');
leaves.className = 'leaves';
leaves.setAttribute('aria-hidden', 'true');
leaves.innerHTML = ['l', 'r', 'bl', 'br'].map(side => `<div class="branch branch-${side}">${branch}</div>`).join('');
const flying = document.createElement('div');
flying.className = 'flying';
flying.setAttribute('aria-hidden', 'true');
flying.innerHTML = flock.map(fly).join('');
document.querySelector('.backdrop').after(flying);
document.body.append(leaves);

// Hojas en las esquinas: cada bloque recibe una combinación distinta que brota al entrar en pantalla
// [tipo, esquina, escala, giro °, espejo, vaivén s]
const sprigs = [
  [['olivo-a', 'tl', 1, -8, 1, 7], ['helecho', 'br', .9, 6, 1, 9]],
  [['helecho', 'tl', 1, -12, 1, 8], ['olivo-b', 'br', .95, 8, 1, 6.5]],
  [['rama', 'tl', .85, 12, -1, 8.5], ['olivo-a', 'br', 1, -6, 1, 7.5]],
  [['olivo-b', 'tl', 1.05, -5, 1, 10], ['helecho', 'br', .8, -8, 1, 8]],
  [['rama', 'tl', 1.05, 2, 1, 6.5], ['olivo-b', 'br', 1, 4, 1, 9.5]],
  [['olivo-a', 'tl', .95, -14, 1, 7.5], ['rama', 'br', .9, 8, 1, 8]]
];
const SPRIG_BASE = { 'olivo-a': 82, 'olivo-b': 70 };
const SPRIG_SIZE = { 'olivo-a': [480, 140], 'olivo-b': [480, 149], rama: [320, 248], helecho: [480, 241] };
const root = document.querySelector('link[rel="stylesheet"]').href.replace(/site\.css.*$/, '');
// El bloque de testimonios va rodeado: las cuatro esquinas y los costados
const wreath = [['helecho', 'tl', 1, -10, 1, 8], ['olivo-a', 'tr', .9, 6, 1, 7], ['olivo-b', 'bl', .9, -6, 1, 7.5], ['helecho', 'br', .95, 5, 1, 9], ['rama', 'ml', .8, 6, 1, 8.5, 38], ['rama', 'mr', .85, -6, -1, 7, 58]];
const sprig = ([kind, corner, scale, turn, mirror, sway, y = 45]) => `<span class="sprig ${kind.split('-')[0]} ${corner}" aria-hidden="true" style="--k:${scale};--r:${turn}deg;--m:${mirror};--sway:${sway}s;--y:${y}%;--by:${SPRIG_BASE[kind] || 58}%"><span><img src="${root}assets/hojas-${kind}.webp" width="${SPRIG_SIZE[kind][0]}" height="${SPRIG_SIZE[kind][1]}" alt="" loading="lazy" decoding="async"></span></span>`;
document.querySelectorAll('main section:not(.hero) > .wrap').forEach((panel, i) => panel.insertAdjacentHTML('beforeend', (panel.closest('#testimonios') ? wreath : sprigs[i % sprigs.length]).map(sprig).join('')));

// Enlace directo a un bloque desplegable (p. ej. servicios.html#adicionales): se abre al llegar
const linked = window.location.hash && document.getElementById(window.location.hash.slice(1));
if (linked && linked.matches('details')) { linked.open = true; linked.closest('section').scrollIntoView(); }

// Carrusel de testimonios: uno a la vez, con flechas, puntos, deslizamiento táctil y avance automático según el largo del texto
document.querySelectorAll('.carousel').forEach(carousel => {
  const slides = [...carousel.children];
  if (slides.length < 2) { slides.forEach(slide => slide.classList.add('current')); return; }
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  nav.innerHTML = `<button class="step" type="button" aria-label="Testimonio anterior">←</button><span class="carousel-dots">${slides.map((_, i) => `<button type="button" aria-label="Ver testimonio ${i + 1} de ${slides.length}"></button>`).join('')}</span><button class="step" type="button" aria-label="Testimonio siguiente">→</button>`;
  carousel.after(nav);
  const [prev, next] = nav.querySelectorAll('.step');
  const dots = [...nav.querySelectorAll('.carousel-dots button')];
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0, timer = 0, hold = false;
  const queue = () => {
    clearTimeout(timer);
    if (still || hold) return;
    const words = slides[current].textContent.trim().split(/\s+/).length;
    timer = setTimeout(() => show(current + 1), 6000 + words * 330);
  };
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('current', i === current);
      slide.classList.toggle('past', i < current);
      slide.setAttribute('aria-hidden', i !== current);
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === current));
    fit();
    queue();
  };
  // El alto del carrusel sigue al testimonio visible, así los textos cortos no dejan un hueco
  const fit = () => { carousel.style.height = slides[current].offsetHeight + 'px'; };
  window.addEventListener('resize', fit, { passive: true });
  document.fonts && document.fonts.ready.then(fit);
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  const pause = on => { hold = on; queue(); };
  [carousel, nav].forEach(el => {
    el.addEventListener('pointerenter', () => pause(true));
    el.addEventListener('pointerleave', () => pause(false));
    el.addEventListener('focusin', () => pause(true));
    el.addEventListener('focusout', () => pause(false));
  });
  let startX = 0;
  carousel.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 48) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
});
