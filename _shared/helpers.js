// Shared slide helpers. Each deck defines DECK.id, DECK.stages, DECK.skills, DECK.mapCols, DECK.mapUnder,
// DECK.chapters and DECK.slides; these helpers turn that data into markup. All text goes through DECK.t.
(function () {
  const t = (k) => DECK.t(k);

  // Pietercil logo: the yellow mark plus the wordmark, which follows the text colour (currentColor).
  const MARK = '<path d="M27.4 25.1H14.6v13.4l13.8-13.4zM26.9 13.1H12.6L.3 25.1h14.3zM40.2.2H12.8L.5 12.2h27.4z"/><path d="M28.4 12.9v26.9l12.3-11.9V1z"/>';
  const WORD = 'M17.3 19.1c0-3.1-2.1-5.2-4.7-5.2S8 16 8 19v.1c0 3 2.1 5.2 4.6 5.2 2.7 0 4.7-2.1 4.7-5.2zM.3 7.7h8v3c1.6-1.9 3.5-3.5 6.9-3.5 5.4 0 10.1 4.5 10.1 11.8 0 7.4-4.7 11.9-10 11.9-3.4 0-5.5-1.6-6.9-3.3v9.5h-8V7.7zm28.1 22.5h7.7V8h-7.7v22.2zM28.3 6h8V.2h-8V6zm27.5 11.3c-.3-2.5-1.8-4.2-4-4.2-2.1 0-3.5 1.7-4 4.2h8zm-15.5 2c0-6.8 4.8-12.1 11.5-12.1 7.9 0 11.5 5.8 11.5 12.6v1.7H48c.6 2.5 2.4 3.8 4.9 3.8 1.9 0 3.4-.7 5.1-2.3l4.4 3.7c-2.2 2.8-5.3 4.7-9.9 4.7-7.2-.2-12.2-5-12.2-12.1zM68 23.7v-9.3h-2.7V8H68V2.2h8V8h5.3v6.4H76v7.7c0 1.6.7 2.3 2.2 2.3 1.1 0 2.1-.3 3-.8v6.3c-1.4.8-3.3 1.3-5.6 1.3-4.8 0-7.6-2.1-7.6-7.5m30.8-6.4c-.3-2.5-1.8-4.2-4-4.2-2.1 0-3.5 1.7-4 4.2h8zm-15.5 2c0-6.8 4.8-12.1 11.5-12.1 7.9 0 11.5 5.8 11.5 12.6v1.7H91c.6 2.5 2.4 3.8 4.9 3.8 1.9 0 3.4-.7 5.1-2.3l4.4 3.7c-2.2 2.8-5.4 4.7-9.9 4.7-7.2-.2-12.2-5-12.2-12.1zm27-11.7h7.9v4.6c1.3-3.1 3.4-5.1 7.1-4.9v8.4h-.7c-4.1 0-6.4 2.4-6.4 7.6v7h-7.9V7.6zm16 11.7c0-6.6 5-12.1 12.2-12.1 4.7 0 7.8 2 9.7 5.1l-5.4 4.1c-1.1-1.5-2.3-2.4-4.2-2.4-2.6 0-4.5 2.3-4.5 5.1v.1c0 3 1.8 5.2 4.5 5.2 1.9 0 3.1-.9 4.4-2.4l5.3 3.9c-2.1 3.1-5.1 5.3-10.1 5.3-6.9 0-11.9-5.4-11.9-11.9m25.1 10.9h7.7V8h-7.7v22.2zM151.3 6h8V.2h-8V6zM164.3 30.2h8V.2h-8z';
  const logo = (h = 40) => `<svg class="logo" style="height:${h}px" viewBox="0 0 224 40" role="img" aria-label="Pietercil">
    <g transform="translate(183)" fill="var(--brand)">${MARK}</g><path fill="currentColor" d="${WORD}"/></svg>`;
  const mark = (h = 40) => `<svg class="mark" style="height:${h}px" viewBox="0 0 41 40" aria-hidden="true"><g fill="var(--brand)">${MARK}</g></svg>`;

  // A clickable skill chip that opens its card. Model-invoked skills get a ◦.
  const chip = (id, cls = '') => {
    const s = DECK.skills[id];
    return `<button class="chip ${s.invoker === 'model' ? 'model' : ''} ${cls}" data-skill="${id}" style="--c:var(--st-${s.stage})">/${id}</button>`;
  };
  const chips = (ids, cls) => ids.map((id) => chip(id, cls)).join('');
  // A clickable term that opens its explanation (DECK.terms); the label defaults to the term's own name.
  const term = (id, label, cls = '') => `<button class="term ${cls}" data-term="${id}">${label || t('term.' + id + '.name')}</button>`;
  const eyebrow = (s) => `<div class="eyebrow">${t('ch.' + s.ch)}</div>`;
  const head = (s) => `${eyebrow(s)}<h2>${t(s.id + '.title')}</h2>`;
  const li = (keys) => keys.map((k) => `<li>${t(k)}</li>`).join('');

  // Lifecycle map: one column per stage, bands of chips underneath (DECK.mapUnder = { key: [ids] }).
  const map = () => `
    <div class="map" style="grid-template-columns:repeat(${DECK.stages.length}, 1fr)">
      ${DECK.stages.map((st, i) => `
        <div class="map-col" style="--st:var(--st-${st})">
          <span class="n">${i + 1}</span>
          <h4>${t('stage.' + st)}</h4>
          <div class="sub">${t('stage.' + st + '.sub')}</div>
          <div class="chips">${chips(DECK.mapCols[st])}</div>
        </div>`).join('')}
    </div>
    <div class="map-under">
      ${Object.entries(DECK.mapUnder).map(([k, ids]) => `<div class="band"><span class="label">${t('map.' + k)}</span>${chips(ids)}</div>`).join('')}
    </div>`;

  // A full skill card: used in the modal (close button) and printed on the reference slides (compact).
  const card = (id, opts = {}) => {
    const s = DECK.skills[id];
    const row = (k, v) => (v ? `<dt>${t('modal.' + k)}</dt><dd>${v}</dd>` : '');
    return `
      <div class="card ${opts.compact ? 'compact' : ''}" style="--c:var(--st-${s.stage})">
        <div class="top">
          <h3>/${id}</h3>
          <span class="tag ${s.invoker}">${t('modal.' + s.invoker)}</span>
          ${opts.close ? `<button class="btn" data-action="close">${t('modal.close')} ✕</button>` : ''}
        </div>
        <p class="purpose">${t('sk.' + id + '.purpose')}</p>
        <dl>
          ${row('when', t('sk.' + id + '.when'))}
          ${row('out', t('sk.' + id + '.out'))}
          ${row('uses', s.uses.length && (opts.compact ? s.uses.map((u) => '/' + u).join(' · ') : chips(s.uses)))}
          ${row('to', s.to.length && (opts.compact ? s.to.map((u) => '/' + u).join(' · ') : chips(s.to)))}
        </dl>
      </div>`;
  };

  DECK.chip = chip;
  DECK.h = { t, logo, mark, chip, chips, term, eyebrow, head, li, map, card };
})();
