'use strict';
const contactForm = document.querySelector('#message-form');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const fields = new FormData(contactForm);
  const subject = String(fields.get('subject'));
  const body = `Hola Pilar,\n\nSoy ${String(fields.get('name')).trim()}.\n\n${String(fields.get('message')).trim()}\n\nGracias.`;
  window.location.href = `mailto:oda.pili@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#message-status').textContent = 'Revisa y envía el mensaje en tu aplicación de correo. Si no se abre, puedes escribir directamente a oda.pili@gmail.com.';
});

// Preselecciona el motivo cuando se llega con ?asunto=… desde otra página
const asked = new URLSearchParams(window.location.search).get('asunto');
const subjectField = contactForm.querySelector('#subject');
if ([...subjectField.options].some(option => option.value === asked)) subjectField.value = asked;
