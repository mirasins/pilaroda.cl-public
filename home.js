'use strict';
document.documentElement.classList.add('js');
document.querySelector('#y').textContent = new Date().getFullYear();

// Aparición y deslizamiento de los contenidos al entrar en pantalla
const reveal = (el, kind, i = 0) => {
  el.dataset.reveal = kind;
  el.style.setProperty('--d', `${Math.min(i, 4) * 90}ms`);
};
document.querySelectorAll('main section:not(.hero) > .wrap').forEach(panel => reveal(panel, 'panel'));
const groups = document.querySelectorAll('main section:not(.hero) > .narrow, .about-grid > div, .services-head, .cards, .formacion, .formacion ul, .cta .wrap, #quien-soy > .wrap, #servicios > .wrap');
groups.forEach(group => [...group.children].forEach((el, i) => {
  if (el.matches('.about-grid, .cards, .services-head, .formacion, ul')) return;
  const kind = el.matches('h2, h3') ? 'left' : el.matches('li') ? 'right' : el.matches('.card, .btn, .services-more, .cta-alt, .cta p') ? 'up' : 'left';
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
const progress = document.querySelector('.progress');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
const links = new Map([...document.querySelectorAll('nav a[href^="#"]')].map(a => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(entries => entries.forEach(entry => {
  links.get(entry.target.id).classList.toggle('active', entry.isIntersecting);
}), { rootMargin: '-45% 0px -50% 0px' });
links.forEach((_, id) => spy.observe(document.getElementById(id)));

// Hojas de olivo: ramas que se mecen en los bordes y hojas que vuelan con el viento detrás del contenido
const LEAF = 'M0 0C12-10 40-10 56 0C40 10 12 10 0 0Z';
const stem = [[40, 30, 15], [88, 52, 24], [140, 88, 33], [196, 138, 41], [255, 202, 48], [310, 270, 54]];
const twig = [[165, 66, -8], [212, 64, 3], [256, 74, 14]];
const leaf = (x, y, angle, i) => `<g transform="translate(${x} ${y}) rotate(${angle})"><path class="leaf" style="--i:${i}" d="${LEAF}"/></g>`;
const pairs = (points, start) => points.map(([x, y, a], i) => leaf(x, y, a - 48, start + i * 2) + leaf(x, y, a + 44, start + i * 2 + 1)).join('');
const branch = `<svg viewBox="0 0 400 400" fill="currentColor"><path d="M-10 20C90 40 200 110 330 300M120 76C170 60 232 60 292 92" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>${pairs(stem, 0)}${leaf(330, 300, 58, 12)}${pairs(twig, 13)}${leaf(292, 92, 24, 19)}</svg>`;
const TONES = ['#6f7a45', '#8b8f58', '#55633a', '#a39a62', '#7d8a4e'];
// [alto %, duración s, desfase s, tamaño, tono, desenfoque px]
const flock = [[6, 19, -2, 1.1, 0, 0], [14, 26, -17, .7, 1, 1.5], [22, 16, -9, 1.3, 2, 0], [30, 23, -21, .8, 3, 2], [38, 18, -5, 1, 4, 0], [46, 28, -25, .65, 1, 2.5], [54, 17, -12, 1.25, 0, 0], [62, 24, -3, .85, 2, 1], [70, 20, -15, 1.05, 3, 0], [78, 27, -8, .7, 4, 2], [86, 16, -19, 1.2, 1, 0], [10, 22, -11, .9, 2, .8], [34, 15, -6, 1.4, 4, 0], [50, 21, -14, .95, 0, .6], [66, 25, -22, .75, 3, 1.8], [82, 18, -1, 1.1, 2, 0], [26, 29, -27, .6, 0, 2.5], [58, 14, -7, 1.3, 1, 0]];
const fly = ([top, time, delay, size, tone, blur]) => `<span class="fly" style="top:${top}%;--t:${time}s;--w:${delay}s;--s:${size};--c:${TONES[tone]};--b:${blur}px;--o:${blur ? .75 : .92}"><span><svg viewBox="-4 -14 64 28"><path d="${LEAF}"/><path class="rib" d="M3 0H50"/></svg></span></span>`;
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
