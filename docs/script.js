/* ===== CleverPillows — interactions ===== */

// Nav: shadow on scroll + mobile toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

// Scroll reveal
const revealEls = document.querySelectorAll('.card, .price, .emo, .split__text, .split__visual, .section__head');
revealEls.forEach(el => el.setAttribute('data-reveal', ''));
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ===== Configurator ===== */
const state = {
  size: { val: 'S · 50×137', price: 1899 },
  fill: { val: 'Střední', add: 0 },
  side: { val: 'Chladivá + hřejivá', add: 0 },
};

const fmt = n => n.toLocaleString('cs-CZ') + ' Kč';

function recalc() {
  const motif = document.getElementById('motif').value.trim();
  const extra = document.getElementById('extraMotif').checked;
  let total = state.size.price + state.fill.add + state.side.add + (extra ? 199 : 0);

  document.getElementById('sumSize').textContent = state.size.val;
  document.getElementById('sumFill').textContent = state.fill.val;
  document.getElementById('sumSide').textContent = state.side.val;
  document.getElementById('sumMotif').textContent =
    (motif || '—') + (extra ? (motif ? ' + 2.' : '2 motivy') : '');
  document.getElementById('sumTotal').textContent = fmt(total);
}

// Option buttons
document.querySelectorAll('.opts').forEach(group => {
  const key = group.dataset.group;
  group.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.opt').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (key === 'size') {
        state.size = { val: btn.textContent.trim(), price: +btn.dataset.price };
      } else if (key === 'fill') {
        state.fill = { val: btn.dataset.val, add: +btn.dataset.add };
      } else if (key === 'side') {
        state.side = { val: btn.dataset.val, add: +btn.dataset.add };
      }
      recalc();
    });
  });
});

document.getElementById('motif').addEventListener('input', recalc);
document.getElementById('extraMotif').addEventListener('change', recalc);

// Pricing cards -> preselect size in configurator
document.querySelectorAll('.price a[href="#konfigurator"]').forEach(link => {
  link.addEventListener('click', () => {
    const tag = link.closest('.price').querySelector('.price__tag').textContent.trim();
    const target = document.querySelector(`.opts[data-group="size"] .opt[data-val="${tag}"]`);
    if (target) target.click();
  });
});

// Order -> toast
const toast = document.getElementById('toast');
document.getElementById('orderBtn').addEventListener('click', () => {
  toast.textContent = `Přidáno: ${state.size.val.split(' ·')[0]} · ${document.getElementById('sumTotal').textContent} 💜`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
});

recalc();
