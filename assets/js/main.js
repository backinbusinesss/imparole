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

/* ---------- Percorso guidato ---------- */
const NEEDS = {
  speech:   { label: 'Parla poco o si fa capire con fatica', ages: ['small', 'school'],
              area: 'Area logopedica', title: 'Linguaggio e comunicazione',
              text: 'Ritardi nel linguaggio, suoni pronunciati male o frasi brevi per l\'età sono tra i motivi più frequenti per cui le famiglie ci contattano. Prima si interviene, meglio è.',
              first: 'Valutazione logopedica', who: 'Logopedista e pedagogista' },
  learn:    { label: 'Legge, scrive o fa i calcoli con fatica', ages: ['school', 'adult'],
              area: 'Disturbi specifici dell\'apprendimento', title: 'Lettura, scrittura e calcolo',
              text: 'Se la fatica a scuola dura nel tempo, può trattarsi di un disturbo specifico dell\'apprendimento. Siamo autorizzati a rilasciare la certificazione DSA valida per la scuola.',
              first: 'Valutazione neuropsicologica', who: 'Psicologo, logopedista e pedagogista' },
  attention:{ label: 'Si distrae, è molto agitato', ages: ['small', 'school', 'adult'],
              area: 'ADHD e difficoltà attentive', title: 'Attenzione e autoregolazione',
              text: 'Fatica a stare seduto, a finire i compiti o ad aspettare il proprio turno. Capiamo da dove nasce e lavoriamo con la famiglia e la scuola su strategie concrete.',
              first: 'Valutazione neuropsicologica', who: 'Psicologo e neuropsicomotricista' },
  relation: { label: 'Fatica a comunicare e a stare con gli altri', ages: ['small', 'school'],
              area: 'Spettro autistico e abilità sociali', title: 'Relazione e comunicazione',
              text: 'Poco contatto con lo sguardo, gioco ripetitivo, difficoltà con i coetanei. Usiamo approcci come DIR Floortime® e TEACCH, sempre insieme ai genitori.',
              first: 'Osservazione e valutazione neuro-psicomotoria', who: 'Neuropsicomotricista, psicologo e logopedista' },
  motor:    { label: 'Movimenti impacciati, fatica nel disegno o nella scrittura', ages: ['small', 'school', 'adult'],
              area: 'Area psicomotoria', title: 'Movimento, coordinazione e gesto grafico',
              text: 'Inciampa spesso, fatica ad allacciarsi le scarpe o a tenere la matita. Corpo e apprendimento vanno insieme: si lavora con il gioco e il movimento.',
              first: 'Valutazione neuro-psicomotoria', who: 'Terapista della neuro e psicomotricità' },
  emotions: { label: 'Ansia, rabbia o tristezza', ages: ['small', 'school', 'adult', 'senior'],
              area: 'Disagi psicologici ed emotivi', title: 'Emozioni e benessere',
              text: 'Paure, chiusura, scatti di rabbia o calo di motivazione. Offriamo psicoterapia e counselling per bambini, ragazzi, adulti e per i genitori.',
              first: 'Colloquio psicologico', who: 'Psicologo psicoterapeuta' },
  voice:    { label: 'Balbuzie, voce o deglutizione', ages: ['small', 'school', 'adult', 'senior'],
              area: 'Area logopedica', title: 'Fluenza, voce e deglutizione',
              text: 'Balbuzie, voce rauca o affaticata, deglutizione atipica o difficoltosa: sono ambiti specifici della logopedia, per bambini e adulti.',
              first: 'Valutazione logopedica', who: 'Logopedista' },
  neuro:    { label: 'Dopo un ictus o un evento neurologico', ages: ['adult', 'senior'],
              area: 'Logopedia per adulti', title: 'Recuperare la parola',
              text: 'Afasia, disartria e disfagia richiedono un percorso mirato. In alcuni casi la logopedia è possibile anche a domicilio.',
              first: 'Valutazione logopedica', who: 'Logopedista' },
  memory:   { label: 'Memoria e attenzione che calano', ages: ['senior'],
              area: 'Terza età', title: 'Attivare la mente',
              text: 'Percorsi per mantenere e stimolare memoria, attenzione e linguaggio, in piccolo gruppo o individuali.',
              first: 'Colloquio di valutazione', who: 'Psicologo e pedagogista' },
};

const card = document.querySelector('.finder__card');
if (card) {
  const qAge = card.querySelector('[data-q="age"]');
  const qNeed = card.querySelector('[data-q="need"]');
  const result = card.querySelector('.finder__result');
  const needBox = document.getElementById('need-choices');
  const show = (step) => {
    card.dataset.step = step;
    qAge.hidden = step !== 1; qNeed.hidden = step !== 2; result.hidden = step !== 3;
    const target = step === 3 ? result.querySelector('h3') : card.querySelector(`[data-q="${step === 1 ? 'age' : 'need'}"] button`);
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  };
  qAge.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]'); if (!b) return;
    needBox.innerHTML = '';
    Object.entries(NEEDS).filter(([, n]) => n.ages.includes(b.dataset.v)).forEach(([k, n]) => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.dataset.v = k; btn.textContent = n.label;
      needBox.appendChild(btn);
    });
    show(2);
  });
  needBox.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]'); if (!b) return;
    const n = NEEDS[b.dataset.v];
    document.getElementById('r-area').textContent = n.area;
    document.getElementById('r-title').textContent = n.title;
    document.getElementById('r-text').textContent = n.text;
    document.getElementById('r-first').textContent = n.first;
    document.getElementById('r-who').textContent = n.who;
    show(3);
  });
  card.querySelector('.finder__back').addEventListener('click', () => show(1));
  card.querySelector('.finder__restart').addEventListener('click', () => show(1));
}

/* ---------- Pannello servizi ---------- */
const SVC = {
  'v-neuro': { kind: 'Valutazione', title: 'Valutazione neuropsicologica', url: 'valutazione-neuropsicologica',
    lead: 'Fotografa come funzionano attenzione, memoria, linguaggio, ragionamento e apprendimenti, per capire risorse e fragilità.',
    for: ['Sospetto di DSA: dislessia, disortografia, disgrafia, discalculia', 'Difficoltà di attenzione o iperattività', 'Rinnovo della certificazione DSA per la scuola'],
    how: 'Alcuni incontri con test standardizzati, un colloquio con i genitori e una restituzione finale con relazione scritta. Siamo autorizzati alla certificazione DSA ai sensi della legge 170/2010.' },
  'v-logo': { kind: 'Valutazione', title: 'Valutazione logopedica', url: 'valutazione-logopedica',
    lead: 'Analizza linguaggio, pronuncia, comprensione, voce e funzioni della bocca.',
    for: ['Ritardo nel linguaggio o pronuncia poco chiara', 'Balbuzie o voce affaticata', 'Deglutizione atipica'],
    how: 'Osservazione, prove specifiche per l\'età e colloquio con la famiglia. Alla fine ricevi un quadro chiaro e, se serve, un progetto di trattamento.' },
  'v-psico': { kind: 'Valutazione', title: 'Valutazione neuro-psicomotoria', url: 'valutazione-neuro-psicomotoria',
    lead: 'Osserva movimento, coordinazione, gioco e relazione: come il bambino usa il corpo per conoscere il mondo.',
    for: ['Ritardo nelle tappe motorie', 'Goffaggine, disprassia, fatica nel gesto grafico', 'Difficoltà di relazione nei più piccoli'],
    how: 'Il bambino gioca in una stanza attrezzata mentre il terapista osserva. Segue un colloquio di restituzione con i genitori.' },
  'v-lpad': { kind: 'Valutazione', title: 'Valutazione dinamica LPAD', url: 'valutazione-dinamiche-lpad',
    lead: 'Il Learning Propensity Assessment Device di Feuerstein non misura solo ciò che la persona sa, ma quanto può imparare con il giusto aiuto.',
    for: ['Disabilità cognitive', 'Quando i test tradizionali non raccontano tutto', 'Per orientare un percorso Feuerstein'],
    how: 'Durante le prove l\'esaminatore insegna e media, e osserva come la persona risponde all\'aiuto. Il risultato è un profilo del potenziale di apprendimento.' },
  logopedia: { kind: 'Trattamento', title: 'Logopedia', url: 'logopedia',
    lead: 'Per linguaggio, comunicazione, voce e deglutizione, a ogni età.',
    for: ['Disturbi del linguaggio e fonetico-fonologici', 'Balbuzie, disfonia, disprassia verbale', 'Ipoacusia e sordità, autismo', 'Adulti: afasia, disartria, disfagia, anche a domicilio'],
    how: 'Sedute individuali con obiettivi condivisi con la famiglia. Si usano anche metodi specifici come Prompt© e Oral Motor Therapy.' },
  psicomotricita: { kind: 'Trattamento', title: 'Neuro e psicomotricità', url: 'psicomotricita',
    lead: 'Attraverso il gioco e il movimento il bambino sviluppa competenze motorie, cognitive ed emotive.',
    for: ['Disturbi motori e della coordinazione', 'Disturbi cognitivi', 'Difficoltà emotive e di comportamento'],
    how: 'Sedute in stanze attrezzate con materiali pensati per l\'età. Il terapista media il gioco e condivide i progressi con i genitori.' },
  cognitivo: { kind: 'Trattamento', title: 'Potenziamento cognitivo', url: 'potenziamento-cognitivo',
    lead: 'Con gli strumenti del metodo Feuerstein si allenano le funzioni che servono per imparare: attenzione, confronto, pianificazione.',
    for: ['DSA e difficoltà scolastiche', 'Disabilità cognitive', 'Ragazzi che vogliono un metodo di studio più efficace'],
    how: 'Esercizi carta e matita e attività guidate, sempre con un mediatore che aiuta a trasferire quanto appreso nella vita di tutti i giorni.' },
  dsa: { kind: 'Trattamento', title: 'Training DSA', url: 'training-dsa',
    lead: 'Allenamento mirato di lettura, scrittura e calcolo, con strategie compensative per lo studio.',
    for: ['Dislessia, disortografia, disgrafia, discalculia', 'Rendere lo studio più autonomo', 'Imparare a usare gli strumenti compensativi'],
    how: 'Cicli di sedute individuali o in piccolo gruppo, con indicazioni per casa e per gli insegnanti.' },
  sociali: { kind: 'Trattamento', title: 'Potenziamento abilità sociali', url: 'potenziamento-abilita-sociali',
    lead: 'Gruppi per imparare a stare con gli altri: comunicare, collaborare, gestire i conflitti.',
    for: ['Bambini e ragazzi nello spettro autistico', 'Timidezza o isolamento', 'Difficoltà a rispettare regole e turni'],
    how: 'Piccoli gruppi omogenei per età, guidati da terapisti, con giochi e situazioni reali.' },
  psicoterapia: { kind: 'Trattamento', title: 'Psicoterapia e counselling', url: 'psicoterapia-e-counselling',
    lead: 'Uno spazio di ascolto e cura per bambini, ragazzi, adulti e genitori.',
    for: ['Ansia, paure, tristezza', 'Blocco dello studente', 'Sostegno alla genitorialità', 'Traumi, anche con EMDR'],
    how: 'Colloqui individuali o familiari, con frequenza concordata. Il terapista lavora in équipe con gli altri professionisti del centro.' },
  psicoeducativo: { kind: 'Trattamento', title: 'Trattamento psicoeducativo', url: 'trattamento-psicoeducativo',
    lead: 'Percorsi strutturati per sviluppare autonomia, comunicazione e comportamento adattivo.',
    for: ['Disturbi dello spettro autistico', 'Disabilità intellettive', 'Bisogno di continuità tra casa, scuola e centro'],
    how: 'Si lavora con metodi come TEACCH e CAT-Kit, coinvolgendo genitori e insegnanti per usare le stesse strategie ovunque.' },
  intensivi: { kind: 'Trattamento', title: 'Trattamenti intensivi', url: 'trattamenti-intensivi',
    lead: 'Più ore di terapia concentrate in pochi giorni, per dare una spinta al percorso.',
    for: ['Famiglie che arrivano da lontano', 'Periodi di vacanza scolastica', 'Momenti in cui serve accelerare'],
    how: 'Un calendario personalizzato con più professionisti. Abbiamo strutture convenzionate per il pernottamento vicino alla sede.' },
};

const drawer = document.getElementById('drawer');
let lastFocus = null;
const openDrawer = (key) => {
  const s = SVC[key]; if (!s) return;
  document.getElementById('d-kind').textContent = s.kind;
  document.getElementById('d-title').textContent = s.title;
  document.getElementById('d-lead').textContent = s.lead;
  document.getElementById('d-how').textContent = s.how;
  document.getElementById('d-more').href = `https://www.imparole.it/${s.url}/`;
  const ul = document.getElementById('d-for'); ul.innerHTML = '';
  s.for.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
  lastFocus = document.activeElement;
  drawer.hidden = false; document.body.classList.add('no-scroll');
  drawer.querySelector('.drawer__panel').focus();
};
const closeDrawer = () => {
  if (drawer.hidden) return;
  drawer.hidden = true; document.body.classList.remove('no-scroll');
  if (lastFocus) lastFocus.focus();
};
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-svc]'); if (b) openDrawer(b.dataset.svc);
  if (e.target.closest('[data-close]')) closeDrawer();
});
document.addEventListener('keydown', (e) => {
  if (drawer.hidden) return;
  if (e.key === 'Escape') closeDrawer();
  if (e.key === 'Tab') { // focus trap
    const f = [...drawer.querySelectorAll('button, a[href]')];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- Mappa sedi ---------- */
const highlight = (place, on) => {
  document.querySelectorAll(`[data-place="${place}"]`).forEach((el) => el.classList.toggle('is-on', on));
};
document.querySelectorAll('.place[data-place], .pin[data-place]').forEach((el) => {
  const p = el.dataset.place;
  el.addEventListener('mouseenter', () => highlight(p, true));
  el.addEventListener('mouseleave', () => highlight(p, false));
  el.addEventListener('focusin', () => highlight(p, true));
  el.addEventListener('focusout', () => highlight(p, false));
});

/* ---------- Menu attivo + barra mobile ---------- */
const links = [...document.querySelectorAll('.nav__menu a[href^="#"]:not(.btn)')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
}
const dock = document.getElementById('dock');
const hero = document.querySelector('.hero');
const ctaEnd = document.querySelector('.cta');
const updateDock = () => {
  const pastHero = hero.getBoundingClientRect().bottom < 0;
  const atEnd = ctaEnd.getBoundingClientRect().top < window.innerHeight;
  dock.classList.toggle('is-on', pastHero && !atEnd);
};
window.addEventListener('scroll', updateDock, { passive: true });
updateDock();
