document.documentElement.classList.add('js');

// Sticky nav border on scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  toggle.querySelector('.sr').textContent = open ? 'Chiudi il menu' : 'Apri il menu';
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Tabs (keyboard accessible)
const tabs = [...document.querySelectorAll('[role="tab"]')];
const selectTab = (tab) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
};
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next); next.focus();
  });
});

// Hero: "im" joins "parole"
const board = document.querySelector('.board');
requestAnimationFrame(() => setTimeout(() => board.classList.add('is-ready'), 350));

// Draggable letter tiles that spring back
document.querySelectorAll('.tile').forEach((tile) => {
  let sx = 0, sy = 0;
  tile.addEventListener('pointerdown', (e) => {
    sx = e.clientX; sy = e.clientY;
    tile.setPointerCapture(e.pointerId);
    tile.classList.add('is-drag');
  });
  tile.addEventListener('pointermove', (e) => {
    if (!tile.classList.contains('is-drag')) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    tile.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 8}deg) scale(1.08)`;
  });
  const end = () => {
    if (!tile.classList.contains('is-drag')) return;
    tile.classList.remove('is-drag');
    tile.style.transform = '';
  };
  tile.addEventListener('pointerup', end);
  tile.addEventListener('pointercancel', end);
});

document.getElementById('year').textContent = new Date().getFullYear();
