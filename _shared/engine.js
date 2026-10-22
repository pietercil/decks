// Deck engine: routing, fragments, i18n, presenter view, overview, skill cards, print, sync between windows.
(function () {
  const LANGS = Object.keys(I18N);
  const W = 1600, H = 900;
  const qs = new URLSearchParams(location.search);
  const MODE = qs.has('presenter') ? 'presenter' : qs.has('print') ? 'print' : 'show';
  // Everything a viewer's browser remembers is namespaced per deck, so two decks on one origin stay independent.
  const NS = 'deck.' + (DECK.id || 'default') + '.';
  const store = {
    get(k) { try { return localStorage.getItem(NS + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(NS + k, v); } catch (e) { /* storage unavailable */ } },
  };

  // ---------- i18n ----------
  // The deck's languages are whatever i18n files it loads; the first one is the fallback.
  const BASE = LANGS[0];
  const missing = new Set();
  const fromBrowser = (navigator.languages || [navigator.language || BASE])
    .map((l) => String(l).toLowerCase().split('-')[0])
    .find((l) => LANGS.includes(l));
  let lang = qs.get('lang') || store.get('lang') || fromBrowser || BASE;
  if (!LANGS.includes(lang)) lang = BASE;

  // [[id]] or [[id|label]] in a string becomes a clickable term (DECK.h.term).
  const terms = (v) => (typeof v === 'string' && v.includes('[[') ? v.replace(/\[\[([a-z-]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => DECK.h.term(id, label)) : v);
  DECK.t = (k) => {
    const v = (I18N[lang] || {})[k];
    if (v != null) return terms(v);
    if (!missing.has(lang + ':' + k)) { missing.add(lang + ':' + k); console.warn(`[deck] missing ${lang}: ${k}`); }
    return I18N[BASE][k] != null ? terms(I18N[BASE][k]) : `⟨${k}⟩`;
  };
  DECK.checkI18n = () => {
    const base = Object.keys(I18N[BASE]);
    LANGS.forEach((l) => {
      const keys = Object.keys(I18N[l] || {});
      console.log(`[deck] ${l}: ${keys.length} keys, missing`, base.filter((k) => !keys.includes(k)), 'extra', keys.filter((k) => !base.includes(k)));
    });
  };

  // Speaker notes are one paragraph per click: "[→]" in n.<slide-id> marks where the next step starts.
  const noteParts = (id) => DECK.t('n.' + id).split('[→]').map((p) => p.trim()).filter(Boolean);

  // ---------- state ----------
  const slides = DECK.slides;
  // A hash is a slide number (#7) or a slide id (#map).
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (/^\d+$/.test(h)) return Math.min(slides.length - 1, Math.max(0, +h - 1));
    const i = slides.findIndex((s) => s.id === h);
    return i >= 0 ? i : null;
  };
  let idx = fromHash() ?? 0;
  let step = 0;
  // Handout mode: every fragment visible at once. ?all in the URL wins; otherwise the browser remembers the last choice.
  // The presenter view always works in steps, and print always shows everything.
  let ALL = MODE === 'show' && (qs.has('all') || store.get('all') === '1');
  if (qs.has('all')) store.set('all', '1');
  const maxCache = {};
  // In handout mode every fragment is already visible, so a slide has no steps left to click through.
  const maxOf = (i) => {
    if (ALL) return 0;
    if (maxCache[i] == null) {
      const tmp = document.createElement('div');
      tmp.innerHTML = slides[i].render(slides[i]);
      maxCache[i] = Math.max(0, ...[...tmp.querySelectorAll('[data-f]')].map((el) => +el.dataset.f));
    }
    return maxCache[i];
  };

  // ---------- rendering ----------
  function paint(stageEl, i, st, opts = {}) {
    const s = slides[i];
    if (ALL) { opts = { all: true }; st = 99; }
    stageEl.style.setProperty('--c', `var(--st-${s.stage || 'core'})`);
    stageEl.innerHTML = `<section class="slide ${s.cls || ''}" data-id="${s.id}">${s.render(s)}</section>`;
    stageEl.classList.toggle('all', !!opts.all);
    stageEl.classList.toggle('dark-slide', !!s.dark);
    applyStep(stageEl, opts.all ? 99 : st);
  }
  function applyStep(stageEl, st) {
    stageEl.querySelectorAll('[data-f]').forEach((el) => el.classList.toggle('on', +el.dataset.f <= st));
  }
  function fit(stageEl, box) {
    const r = box.getBoundingClientRect();
    stageEl.style.transform = `translate(-50%, -50%) scale(${Math.min(r.width / W, r.height / H)})`;
  }
  // Re-run fn whenever el changes size (window resize, rotation, fullscreen, mobile URL bar).
  function onResize(el, fn) {
    if (window.ResizeObserver) new ResizeObserver(() => fn()).observe(el);
    else window.addEventListener('resize', fn);
  }

  // ---------- sync between windows ----------
  let bc = null;
  try { bc = new BroadcastChannel(NS + 'sync'); } catch (e) { /* not supported */ }
  function send(msg) {
    if (bc) bc.postMessage(msg);
    store.set('sync', JSON.stringify({ ...msg, ts: Date.now() }));
  }
  function receive(msg) {
    if (!msg) return;
    if (msg.type === 'nav' && (msg.idx !== idx || msg.step !== step)) go(msg.idx, msg.step, false);
    if (msg.type === 'lang' && msg.lang !== lang) setLang(msg.lang, false);
    if (msg.type === 'all' && MODE === 'show' && msg.on !== ALL) setAll(msg.on, false);
  }
  if (bc) bc.onmessage = (e) => receive(e.data);
  window.addEventListener('storage', (e) => { if (e.key === NS + 'sync' && e.newValue) receive(JSON.parse(e.newValue)); });

  // ---------- navigation ----------
  let view = null; // set per mode
  function go(i, st = 0, broadcast = true) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const changed = i !== idx;
    idx = i; step = Math.max(0, Math.min(st, maxOf(i)));
    if (changed || !view.rendered) view.render(); else view.step();
    if (MODE === 'show') syncUrl();
    if (broadcast) send({ type: 'nav', idx, step });
  }
  // The URL mirrors the slide and the handout mode, so a copied link opens the same view.
  function syncUrl() {
    const p = new URLSearchParams(location.search);
    if (ALL) p.set('all', ''); else p.delete('all');
    const q = p.toString().replace(/=(?=&|$)/g, '');
    history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + '#' + (idx + 1));
  }
  function setAll(on, broadcast = true) {
    if (MODE === 'show') {
      ALL = on;
      if (on) step = 0;
      view.render(); syncUrl();
    }
    store.set('all', on ? '1' : '0');
    updateBadge();
    if (broadcast) send({ type: 'all', on });
  }
  const next = () => (step < maxOf(idx) ? go(idx, step + 1) : idx < slides.length - 1 && go(idx + 1, 0));
  const prev = () => (step > 0 ? go(idx, step - 1) : idx > 0 && go(idx - 1, maxOf(idx - 1)));

  function setLang(l, broadcast = true) {
    lang = l; store.set('lang', l);
    document.documentElement.lang = l;
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === l));
    setUiText();
    view.render();
    if (broadcast) send({ type: 'lang', lang: l });
  }

  // Light is the default; dark only when chosen (T, the button, or ?theme=dark).
  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  }
  const savedTheme = ['light', 'dark'].includes(qs.get('theme')) ? qs.get('theme') : store.get('theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  // ---------- skill card modal ----------
  function openSkill(id, stageEl) {
    const s = DECK.skills[id]; if (!s) return;
    closeModal(stageEl);
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="/${id}" style="--c:var(--st-${s.stage})">
      ${DECK.h.card(id, { close: true })}</div>`;
    stageEl.appendChild(wrap);
    wrap.querySelector('[data-action="close"]').focus();
  }
  // ---------- term dialog: what a word means, where it comes from, which skills use it ----------
  function openTerm(id, stageEl) {
    const tm = (DECK.terms || {})[id]; if (!tm) return;
    const t = DECK.t;
    closeModal(stageEl);
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = `<div class="modal term-modal" role="dialog" aria-modal="true" aria-label="${t('term.' + id + '.name').replace(/<[^>]+>/g, '')}" style="--c:var(--gold)">
      <div class="card">
        <div class="top"><h3>${t('term.' + id + '.name')}</h3><span class="tag">${t('modal.term')}</span><button class="btn" data-action="close">${t('modal.close')} ✕</button></div>
        <p class="purpose">${t('term.' + id + '.def')}</p>
        <dl>
          <dt>${t('modal.origin')}</dt><dd>${t('term.' + id + '.origin')}</dd>
          ${tm.skills.length ? `<dt>${t('modal.skills')}</dt><dd>${tm.skills.map((s) => DECK.chip(s)).join('')}</dd>` : ''}
          ${tm.src ? `<dt>${t('modal.src')}</dt><dd><a href="${tm.src}" target="_blank" rel="noopener">${tm.srcLabel} ↗</a></dd>` : ''}
        </dl>
      </div></div>`;
    stageEl.appendChild(wrap);
    wrap.querySelector('[data-action="close"]').focus();
  }
  function closeModal(stageEl) {
    const m = (stageEl || document).querySelectorAll('.modal-wrap');
    m.forEach((x) => x.remove());
    return m.length > 0;
  }

  // ---------- commands: the ☰ menu and the buttons on a slide share these ----------
  const printUrl = (notes) => location.pathname + '?print' + (notes ? '&notes' : '');
  const CMDS = {
    all: { key: 'H', run: () => setAll(!ALL), on: () => ALL },
    pdf: { run: () => window.open(printUrl(false), '_blank') },
    pdfnotes: { run: () => window.open(printUrl(true), '_blank') },
    theme: { key: 'T', run: () => toggleTheme(), on: () => document.documentElement.dataset.theme === 'dark' },
    overview: { key: 'O', run: () => toggleOverview() },
    presenter: { key: 'P', run: () => openPresenter() },
    fullscreen: { key: 'F', run: () => toggleFullscreen() },
    blackout: { key: 'B', run: () => { blackout.hidden = false; } },
  };
  const runCmd = (c) => { if (CMDS[c]) { toggleMenu(false); CMDS[c].run(); } };
  const cmdButtons = (ids) => ids.map((c) => `
    <button class="cmd ${CMDS[c].on && CMDS[c].on() ? 'on' : ''}" data-cmd="${c}">
      <span>${DECK.t('cmd.' + c)}</span>${CMDS[c].key ? `<kbd>${CMDS[c].key}</kbd>` : ''}</button>`).join('');
  DECK.cmdButtons = cmdButtons;

  const menu = document.createElement('div');
  menu.id = 'menu'; menu.hidden = true;
  document.body.appendChild(menu);
  function toggleMenu(force) {
    const show = force != null ? force : menu.hidden;
    menu.hidden = !show;
    if (!show) return;
    menu.innerHTML = `
      <div class="menu-in" role="dialog" aria-label="${DECK.t('ui.menu')}">
        ${MODE === 'show' ? `<a class="cmd home" href="../"><span>← ${DECK.t('ui.home')}</span></a>` : ''}
        <span class="label">${DECK.t('menu.view')}</span>${cmdButtons(['all', 'theme', 'overview', 'fullscreen', 'blackout'])}
        <span class="label">${DECK.t('menu.present')}</span>${cmdButtons(['presenter'])}
        <span class="label">${DECK.t('menu.export')}</span>${cmdButtons(['pdf', 'pdfnotes'])}
        <p class="hint">${DECK.t('menu.keys')}</p>
      </div>`;
    menu.querySelector('button.cmd')?.focus();
  }
  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }
  // A badge that never fades while handout mode is on, so nobody starts presenting with everything visible.
  const badge = document.createElement('button');
  badge.id = 'allBadge'; badge.hidden = true;
  badge.addEventListener('click', () => setAll(false));
  document.body.appendChild(badge);
  function updateBadge() {
    badge.hidden = !(ALL && MODE === 'show');
    badge.textContent = DECK.t('ui.handout') + ' ✕';
    badge.title = DECK.t('ui.handoutoff');
  }

  // ---------- in-slide actions (event delegation) ----------
  document.addEventListener('click', (e) => {
    const cmdEl = e.target.closest('[data-cmd]');
    if (cmdEl && !e.target.closest('#overview')) { e.stopPropagation(); runCmd(cmdEl.dataset.cmd); return; }
    if (!menu.hidden && !e.target.closest('#menu') && !e.target.closest('#menuBtn')) toggleMenu(false);
    const stageEl = e.target.closest('.stage');
    const termEl = e.target.closest('.term[data-term]');
    if (termEl && stageEl && !e.target.closest('#overview')) { e.stopPropagation(); openTerm(termEl.dataset.term, stageEl); return; }
    const chipEl = e.target.closest('.chip[data-skill]');
    if (chipEl && stageEl && !e.target.closest('#overview')) { e.stopPropagation(); openSkill(chipEl.dataset.skill, stageEl); return; }
    if (e.target.classList.contains('modal-wrap') || e.target.closest('[data-action="close"]')) { closeModal(stageEl); return; }
    const gotoEl = e.target.closest('[data-goto]');
    if (gotoEl && !e.target.closest('#overview')) { const i = slides.findIndex((s) => s.id === gotoEl.dataset.goto); if (i >= 0) go(i); }
  });

  // ---------- keyboard ----------
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === 'Escape') {
      if (!menu.hidden) return toggleMenu(false);
      if (closeModal()) return;
      if (ov && !ov.hidden) return toggleOverview(false);
      if (blackout && !blackout.hidden) blackout.hidden = true;
      return;
    }
    const tgt = e.target instanceof Element ? e.target : document.body;
    if ([' ', 'Enter'].includes(k) && tgt.closest('button,[role=button],a')) return; // let the focused control handle it
    if (k === '?' && MODE === 'show') return toggleMenu();
    if ((k === 'h' || k === 'H') && MODE === 'show') return setAll(!ALL);
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); closeModal(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); closeModal(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if ((k === 'l' || k === 'L') && LANGS.length > 1) setLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]);
    else if (k === 't' || k === 'T') toggleTheme();
    else if ((k === 'o' || k === 'O') && MODE === 'show') toggleOverview();
    else if ((k === 'p' || k === 'P') && MODE === 'show') openPresenter();
    else if ((k === 'b' || k === 'B' || k === '.') && MODE === 'show') blackout.hidden = !blackout.hidden;
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if ((k === 'r' || k === 'R') && MODE === 'presenter') resetTimer();
  });

  // ---------- chrome ----------
  const topbar = document.getElementById('topbar');
  if (LANGS.length > 1) {
    topbar.insertAdjacentHTML('afterbegin', LANGS.map((l) => `<button data-lang="${l}">${l.toUpperCase()}</button>`).join(''));
    topbar.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  }
  topbar.insertAdjacentHTML('beforeend', '<button id="menuBtn" aria-haspopup="dialog">☰</button>');
  document.getElementById('menuBtn').addEventListener('click', () => toggleMenu());
  function setUiText() {
    const set = (id, k, attr) => { const el = document.getElementById(id); if (el) el[attr || 'textContent'] = DECK.t(k); };
    set('rotateTxt', 'ui.rotate');
    set('themeBtn', 'ui.theme', 'title'); set('ovBtn', 'ui.overview', 'title'); set('prBtn', 'ui.presenter', 'title');
    set('menuBtn', 'ui.menu', 'title');
    set('pPrev', 'p.prev'); set('pNext', 'p.nextbtn'); set('pReset', 'p.reset');
    updateBadge();
  }
  const ov = document.getElementById('overview');
  const blackout = document.getElementById('blackout');
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
  document.getElementById('ovBtn').addEventListener('click', () => toggleOverview());
  document.getElementById('prBtn').addEventListener('click', openPresenter);
  document.getElementById('prevBtn').addEventListener('click', prev);
  document.getElementById('nextBtn').addEventListener('click', next);
  blackout.addEventListener('click', () => { blackout.hidden = true; });

  let idleT;
  const wake = () => { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('idle'), 2500); };
  document.addEventListener('mousemove', wake);
  document.addEventListener('pointerdown', wake); wake();

  // Opening the presenter view means presenting: back to steps in every window.
  function openPresenter() {
    if (ALL) setAll(false);
    const w = window.open(location.pathname + '?presenter&lang=' + lang + '#' + (idx + 1), 'deck-presenter', 'width=1400,height=900');
    if (!w) console.warn('[deck] presenter window blocked: allow pop-ups or open ?presenter manually');
    setTimeout(() => send({ type: 'nav', idx, step }), 800);
  }

  // Progress: one segment per slide in the colour of its stage (s.bar = [stage, stage] splits it; 'core' is gold).
  // Seen slides are full colour, upcoming ones a light tint; a wider gap marks a new chapter.
  const segFill = (s) => {
    const col = (st) => (st === 'core' ? 'var(--gold)' : `var(--st-${st})`);
    if (s.bar) return `linear-gradient(90deg, ${s.bar.map((st, i) => `${col(st)} ${(i / s.bar.length) * 100}% ${((i + 1) / s.bar.length) * 100}%`).join(', ')})`;
    return (s.stage || 'core') === 'core' ? 'var(--gold-fill)' : col(s.stage);
  };
  function buildProgress() {
    const bar = document.getElementById('progress');
    bar.innerHTML = slides.map((s, i) => `<div class="seg ${i && s.ch !== slides[i - 1].ch ? 'ch-start' : ''}" data-i="${i}" style="--fill:${segFill(s)}" title="${i + 1} · ${DECK.t('ch.' + s.ch)}"></div>`).join('');
    bar.querySelectorAll('.seg').forEach((seg) => seg.addEventListener('click', () => go(+seg.dataset.i)));
  }
  function updateProgress() {
    document.querySelectorAll('#progress .seg').forEach((seg, i) => {
      seg.classList.toggle('todo', i > idx);
      seg.classList.toggle('cur', i === idx);
    });
    document.getElementById('count').textContent = `${idx + 1} / ${slides.length}`;
  }

  function toggleOverview(force) {
    const show = force != null ? force : ov.hidden;
    ov.hidden = !show;
    if (!show) return;
    ov.innerHTML = `<div class="og">${slides.map((s, i) => `<div class="th ${i === idx ? 'cur' : ''}" data-i="${i}"><div class="stage"></div><span class="n">${i + 1} · ${DECK.t('ch.' + s.ch)}</span></div>`).join('')}</div>`;
    ov.querySelectorAll('.th').forEach((th) => {
      const st = th.querySelector('.stage');
      paint(st, +th.dataset.i, 99, { all: true });
      st.style.transform = `scale(${th.clientWidth / W})`;
      th.addEventListener('click', () => { toggleOverview(false); go(+th.dataset.i); });
    });
    ov.querySelector('.th.cur')?.scrollIntoView({ block: 'center' });
  }
  onResize(ov, () => {
    if (!ov.hidden) ov.querySelectorAll('.th').forEach((th) => { th.querySelector('.stage').style.transform = `scale(${th.clientWidth / W})`; });
  });

  // ---------- views ----------
  let startTime = +store.get('start') || Date.now();
  function resetTimer() { startTime = Date.now(); store.set('start', startTime); }

  if (MODE === 'show') {
    const stageEl = document.getElementById('stage');
    const vp = document.getElementById('viewport');
    view = {
      render() { paint(stageEl, idx, step); document.body.classList.toggle('on-dark', !!slides[idx].dark); this.rendered = true; buildProgress(); updateProgress(); },
      step() { applyStep(stageEl, step); updateProgress(); },
    };
    const doFit = () => fit(stageEl, vp);
    onResize(vp, doFit); doFit();

    // Swipe left/right to navigate; gestures that start on interactive elements are left alone.
    let sw = null;
    vp.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || e.target.closest('button,a,[role=button],.modal-wrap')) { sw = null; return; }
      sw = { x: e.clientX, y: e.clientY, t: Date.now() };
    });
    vp.addEventListener('pointerup', (e) => {
      if (!sw) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y, quick = Date.now() - sw.t < 800;
      sw = null;
      if (quick && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { closeModal(); dx < 0 ? next() : prev(); }
    });
    vp.addEventListener('pointercancel', () => { sw = null; });

    // Portrait phones: suggest rotating (dismissible, remembered per browser).
    const rot = document.getElementById('rotate');
    if (store.get('rotateDismissed') !== '1') rot.hidden = false;
    document.getElementById('rotateBtn').addEventListener('click', () => { rot.hidden = true; store.set('rotateDismissed', '1'); });
  }

  // Print is always light. ?print gives one landscape page per slide; ?print&notes puts the notes under each slide on a portrait page.
  if (MODE === 'print') {
    const withNotes = qs.has('notes');
    document.documentElement.dataset.theme = 'light';
    document.body.classList.add('print');
    document.body.classList.toggle('with-notes', withNotes);
    document.querySelectorAll('.chrome,#progress,#viewport,#menu,#allBadge').forEach((el) => el.remove());
    view = {
      render() {
        document.querySelectorAll('body > .page').forEach((el) => el.remove());
        slides.forEach((s, i) => {
          const page = document.createElement('div');
          page.className = 'page';
          page.innerHTML = '<div class="stage"></div>' + (withNotes
            ? `<div class="print-notes"><div class="ch">${i + 1} / ${slides.length} · ${DECK.t('ch.' + s.ch)}</div>${noteParts(s.id).map((p) => `<p>${p}</p>`).join('')}</div>`
            : '');
          document.body.appendChild(page);
          paint(page.querySelector('.stage'), i, 99, { all: true });
        });
        this.rendered = true;
      },
      step() {},
    };
  }

  if (MODE === 'presenter') {
    document.body.classList.add('presenter');
    ['viewport', 'navbar', 'progress', 'ovBtn', 'prBtn'].forEach((id) => document.getElementById(id).remove());
    const root = document.createElement('div');
    root.id = 'presenter';
    root.innerHTML = `
      <div class="pv" id="pvCur"><div class="stage"></div></div>
      <div class="side">
        <div class="clock"><span class="big" id="pClock">00:00</span><span class="pace" id="pPace"></span></div>
        <div class="dim mono small" id="pChap"></div>
        <div class="pbtns"><button class="btn" id="pPrev"></button><button class="btn" id="pNext"></button><button class="btn" id="pReset"></button></div>
        <span class="nextlbl" id="pNextLbl"></span>
        <div class="pv" id="pvNext" style="width:70%"><div class="stage"></div></div>
      </div>
      <div class="notes" id="pNotes"></div>`;
    document.body.prepend(root);
    root.querySelector('#pPrev').onclick = prev;
    root.querySelector('#pNext').onclick = next;
    root.querySelector('#pReset').onclick = resetTimer;
    const cur = root.querySelector('#pvCur .stage'), nxt = root.querySelector('#pvNext .stage');
    const doFit = () => { [cur, nxt].forEach((s) => { s.style.transform = `scale(${s.parentElement.clientWidth / W})`; }); };
    // A chapter's window on the clock: the minutes of every chapter before it, then its own.
    const windowOf = (ci) => {
      const from = DECK.chapters.slice(0, ci).reduce((a, c) => a + c.min, 0);
      return [from, from + DECK.chapters[ci].min];
    };
    view = {
      render() {
        paint(cur, idx, step);
        if (idx < slides.length - 1) paint(nxt, idx + 1, 0); else nxt.innerHTML = '';
        doFit(); this.rendered = true; this.step();
      },
      step() {
        applyStep(cur, step);
        const s = slides[idx];
        const ci = DECK.chapters.findIndex((c) => c.id === s.ch);
        const [from, to] = windowOf(ci);
        const notesEl = root.querySelector('#pNotes');
        notesEl.innerHTML = `<div class="ch">${idx + 1}/${slides.length} · ${DECK.t('ch.' + s.ch)} · step ${step}/${maxOf(idx)}</div>` +
          noteParts(s.id).map((p, i) => `<p class="np ${i < step ? 'past' : i === step ? 'cur' : ''}">${i ? '<span class="click">→</span>' : ''}${p}</p>`).join('');
        notesEl.querySelector('.np.cur')?.scrollIntoView({ block: 'nearest' });
        root.querySelector('#pChap').textContent = DECK.chapters[ci].min ? `${DECK.t('p.budget')}: ${DECK.chapters[ci].min} min · ${from}:00 → ${to}:00` : DECK.t('p.nobudget');
        root.querySelector('#pNextLbl').textContent = step < maxOf(idx) ? `${DECK.t('p.next')}: ${DECK.t('p.morestep')}` : `${DECK.t('p.next')}:`;
        tick();
      },
    };
    const tick = () => {
      const el = (Date.now() - startTime) / 1000;
      root.querySelector('#pClock').textContent = `${String(Math.floor(el / 60)).padStart(2, '0')}:${String(Math.floor(el % 60)).padStart(2, '0')}`;
      const ci = DECK.chapters.findIndex((c) => c.id === slides[idx].ch);
      const [from, to] = windowOf(ci).map((m) => m * 60);
      const pace = root.querySelector('#pPace');
      if (!DECK.chapters[ci].min) { pace.className = 'pace'; pace.textContent = ''; }
      else if (el > to) { pace.className = 'pace behind'; pace.textContent = `${DECK.t('p.behind')} ${Math.ceil((el - to) / 60)} min`; }
      else if (el < from) { pace.className = 'pace ahead'; pace.textContent = `${DECK.t('p.ahead')} ${Math.floor((from - el) / 60)} min`; }
      else { pace.className = 'pace ahead'; pace.textContent = DECK.t('p.ontime'); }
    };
    setInterval(tick, 1000);
    onResize(root, doFit);
    // Opened directly via ?presenter: the audience window goes back to steps too.
    setTimeout(() => setAll(false), 300);
  }

  setUiText();
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  window.addEventListener('hashchange', () => { const i = fromHash(); if (i != null && i !== idx) go(i); });
  view.render();
  if (MODE === 'show') syncUrl();
  if (MODE === 'print') setTimeout(() => window.print(), 900);
  if (qs.has('debug')) DECK.checkI18n();
})();
