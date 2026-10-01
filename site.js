'use strict';
document.documentElement.classList.add('js');
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

// Helechos: un frond distinto crece sobre cada bloque de la portada cuando entra en pantalla
const FERN_TONES = ['#7c8450', '#99945f', '#6b7446', '#a89f66', '#868c58'];
// [posición %, espejo, giro °, escala, curvatura, punta, pares de hojas, largo de hoja, tono inicial]
const ferns = [[62, 1, -6, 1, 12, 44, 13, 27, 0], [38, -1, 5, .85, 30, 58, 10, 30, 2], [70, 1, 8, 1.1, 4, 30, 15, 24, 1], [30, -1, -4, 1.15, 20, 50, 12, 28, 3], [44, 1, -10, .9, 0, 62, 9, 32, 4], [72, -1, 2, 1, 16, 38, 14, 25, 2]];
const fern = ([x, flip, turn, scale, bend, tip, pairs, size, tone]) => {
  const p0 = [10, 114], p1 = [64, bend], p2 = [192, tip];
  let pinnae = '';
  for (let i = 1; i <= pairs; i++) {
    const t = i / (pairs + 1), u = 1 - t;
    const px = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], py = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const angle = Math.atan2(2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]), 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])) * 180 / Math.PI;
    const l = size * 1.3 * Math.pow(u, .55) * (.5 + .5 * Math.min(1, t * 3.5)), w = l * .34;
    const d = `M0 0C${(l * .3).toFixed(1)} ${(-w).toFixed(1)} ${(l * .75).toFixed(1)} ${(-w * .8).toFixed(1)} ${l.toFixed(1)} 0C${(l * .75).toFixed(1)} ${(w * .5).toFixed(1)} ${(l * .3).toFixed(1)} ${(w * .7).toFixed(1)} 0 0Z`;
    [-58, 56].forEach((side, k) => { pinnae += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${(angle + side).toFixed(1)})"><path class="pinna" style="--t:${t.toFixed(2)}" fill="${FERN_TONES[(tone + i + k) % FERN_TONES.length]}" d="${d}"/></g>`; });
  }
  return `<svg class="fern" aria-hidden="true" viewBox="0 0 200 120" style="--x:${x}%;--f:${flip};--r:${turn}deg;--k:${scale}"><path class="stem" pathLength="1" d="M${p0}Q${p1} ${p2}"/>${pinnae}</svg>`;
};
document.querySelectorAll('main#inicio section:not(.hero) > .wrap').forEach((panel, i) => panel.insertAdjacentHTML('beforeend', fern(ferns[i % ferns.length])));
