'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navegacion');
if (toggle && nav) {
  toggle.hidden = false;
  toggle.removeAttribute('hidden');
  function closeMenu() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
}
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.querySelector('#service').value = link.dataset.service; }));
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const email = window.SITE_CONFIG?.email?.trim() || '';
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
if (!validEmail) document.querySelector('.form-note').textContent = 'El canal de contacto estará disponible próximamente. Este formulario no envía ni guarda datos.';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!validEmail) { status.textContent = 'El correo de contacto aún no está configurado. Tu consulta no se ha enviado ni guardado.'; return; }
  const data = new FormData(form);
  const subject = `Consulta: ${data.get('service')}`;
  const body = `Hola Pilar,\n\nMi nombre es ${String(data.get('name')).trim()}. Me gustaría consultar por: ${data.get('service')}.\n\n${String(data.get('message')).trim()}\n\nGracias.`;
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Se ha solicitado abrir tu aplicación de correo. Revisa el mensaje y pulsa enviar allí. Si no se abre, escribe a ' + email + '.';
});
