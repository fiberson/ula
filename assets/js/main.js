const body = document.body;
const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const dialog = document.querySelector('#request-dialog');
const requestForm = dialog?.querySelector('.request-form');
const formStatus = requestForm?.querySelector('.request-form__status');
let dialogCloseTimer;

const setMenuState = (isOpen) => {
  menuButton?.setAttribute('aria-expanded', String(isOpen));
  menuButton?.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  siteNav?.classList.toggle('is-open', isOpen);
  body.classList.toggle('menu-open', isOpen);
};

menuButton?.addEventListener('click', () => {
  setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

const openDialog = () => {
  if (!dialog || dialog.open) return;

  window.clearTimeout(dialogCloseTimer);
  dialog.dataset.state = 'opening';
  dialog.showModal();
  body.classList.add('dialog-open');

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (dialog.open) dialog.dataset.state = 'open';
    });
  });
};

const closeDialog = () => {
  if (!dialog?.open || dialog.dataset.state === 'closing') return;

  dialog.dataset.state = 'closing';
  const closeDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 180 : 280;

  dialogCloseTimer = window.setTimeout(() => {
    if (dialog.open) dialog.close();
  }, closeDelay);
};

document.querySelectorAll('[data-open-dialog]').forEach((button) => {
  button.addEventListener('click', openDialog);
});

document.querySelector('[data-close-dialog]')?.addEventListener('click', closeDialog);

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

dialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});

dialog?.addEventListener('close', () => {
  window.clearTimeout(dialogCloseTimer);
  delete dialog.dataset.state;
  body.classList.remove('dialog-open');
  if (formStatus) formStatus.textContent = '';
});

requestForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!requestForm.checkValidity()) {
    requestForm.reportValidity();
    if (formStatus) formStatus.textContent = 'Заполните обязательные поля и подтвердите согласие.';
    return;
  }

  const submitButton = requestForm.querySelector('button[type="submit"]');
  submitButton?.setAttribute('disabled', '');
  if (formStatus) formStatus.textContent = 'Спасибо! Форма готова к подключению к WordPress.';

  window.setTimeout(() => {
    requestForm.reset();
    submitButton?.removeAttribute('disabled');
  }, 900);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 767) setMenuState(false);
});
