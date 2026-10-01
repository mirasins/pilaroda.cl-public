'use strict';
document.documentElement.classList.add('js');
document.querySelector('#y').textContent = new Date().getFullYear();

// Aparición escalonada de los contenidos al entrar en pantalla
const groups = document.querySelectorAll('main section:not(.hero) .narrow, .about-grid, .services-head, .cards, .formacion ul, .cta .wrap, #quien-soy > .wrap, #servicios > .wrap');
groups.forEach(group => [...group.children].forEach((el, i) => {
  if (el.matches('.about-grid, .cards, .services-head, .formacion, ul')) return;
  el.dataset.reveal = '';
  el.style.setProperty('--d', `${Math.min(i, 6) * 90}ms`);
}));
const revealer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in');
  revealer.unobserve(entry.target);
}), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));

// Encabezado: sombra al desplazarse y sección activa en el menú
const header = document.querySelector('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
const links = new Map([...document.querySelectorAll('nav a[href^="#"]')].map(a => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(entries => entries.forEach(entry => {
  links.get(entry.target.id).classList.toggle('active', entry.isIntersecting);
}), { rootMargin: '-45% 0px -50% 0px' });
links.forEach((_, id) => spy.observe(document.getElementById(id)));

// Hojas de olivo: ramas que se mecen en las esquinas y hojas que caen lentamente en el fondo
const LEAF = 'M0 0C12-10 40-10 56 0C40 10 12 10 0 0Z';
const nodes = [[40, 30, 15], [88, 52, 24], [140, 88, 33], [196, 138, 41], [255, 202, 48], [310, 270, 54]];
const leaf = (x, y, angle, i) => `<g transform="translate(${x} ${y}) rotate(${angle})"><path class="leaf" style="--i:${i}" d="${LEAF}"/></g>`;
const branch = `<svg viewBox="0 0 400 400" fill="currentColor"><path d="M-10 20C90 40 200 110 330 300" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>${nodes.map(([x, y, a], i) => leaf(x, y, a - 48, i * 2) + leaf(x, y, a + 44, i * 2 + 1)).join('')}${leaf(330, 300, 58, 12)}</svg>`;
const leaves = document.createElement('div');
leaves.className = 'leaves';
leaves.setAttribute('aria-hidden', 'true');
leaves.innerHTML = `<div class="branch branch-l">${branch}</div><div class="branch branch-r">${branch}</div>`;
document.body.append(leaves);
const falling = [[8, 26, -3, .9], [24, 34, -19, .6], [43, 29, -11, 1.1], [61, 38, -27, .7], [77, 31, -7, 1], [91, 36, -22, .8]];
document.querySelector('.backdrop').insertAdjacentHTML('beforeend', falling.map(([left, time, delay, size]) =>
  `<svg class="fall" viewBox="-4 -14 64 28" style="left:${left}%;--t:${time}s;--w:${delay}s;--s:${size}"><path d="${LEAF}"/></svg>`).join(''));
