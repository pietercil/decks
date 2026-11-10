// The in-browser mini git: a small repo model, its commit graph and the controls on slides 4 to 7.
// It is a simulation (no real git), built so that one repo grows along the slides:
//  - every interactive slide keeps its own state; the first time it is shown after a previous interactive slide was used,
//    it continues from that state (if it still makes sense there), otherwise it starts from a fixed preset;
//  - rendering never changes state, so the overview, handout and PDF simply show the presets;
//  - "start over" throws every state away.
// All visible text comes from i18n (chg.<scenario>.*, sim.*, say.*, pf.<platform>.*). Commands are never translated.
(function () {
  const t = (k) => DECK.t(k);
  const sc = () => DECK.scenario();
  const pf = () => DECK.platform();
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => (o[k] != null ? o[k] : ''));

  const ORDER = ['commit', 'history', 'branch', 'merge'];
  // Authors and dates of the commits that are already in the history. Change n edits line n of the file.
  const SEED = [['Sam', '2026-09-02'], ['Lien', '2026-09-09'], ['Jonas', '2026-09-21'], ['Lien', '2026-10-05'], ['Sam', '2026-10-12'], ['Jonas', '2026-10-19']];
  const NCHG = SEED.length;
  const BR = 'experiment';

  // ---------- repo model ----------
  const fresh = () => ({ commits: [], br: {}, head: 'main', sel: null, pr: null, last: null, pick: null, q: 'good', seq: 0 });
  const clone = (s) => JSON.parse(JSON.stringify(s));
  const byId = (s, id) => s.commits.find((c) => c.id === id);
  function add(s, o) {
    const id = 'k' + s.seq++;
    const p = o.p || (s.br[o.br] ? [s.br[o.br]] : []);
    s.commits.push({ id, p, br: o.br, kind: o.kind || 'commit', chg: o.chg == null ? null : o.chg, q: o.q || 'good', au: o.au || 'me', dt: o.dt || 'today', of: o.of == null ? null : o.of });
    s.br[o.br] = id; s.sel = id;
    return id;
  }
  function seedMain(s, n) {
    add(s, { br: 'main', kind: 'init', au: 'Sam', dt: '2026-08-25' });
    for (let i = 0; i < n; i++) add(s, { br: 'main', chg: i, au: SEED[i][0], dt: SEED[i][1] });
    return s;
  }
  const PRESET = {
    commit: () => seedMain(fresh(), 1),
    history: () => { const s = seedMain(fresh(), 3); s.sel = s.commits[2].id; return s; },
    branch: () => seedMain(fresh(), 3),
    merge: () => {
      const s = seedMain(fresh(), 3);
      s.br[BR] = s.br.main;
      add(s, { br: BR, chg: 3, au: SEED[3][0], dt: SEED[3][1] });
      add(s, { br: BR, chg: 4, au: SEED[4][0], dt: SEED[4][1] });
      add(s, { br: 'main', chg: 5, au: SEED[5][0], dt: SEED[5][1] });
      s.sel = s.br[BR];
      return s;
    },
  };

  function anc(s, id) {
    const seen = new Set(), q = [id];
    while (q.length) { const c = q.pop(); if (!c || seen.has(c)) continue; seen.add(c); q.push(...byId(s, c).p); }
    return seen;
  }
  // The lines that differ from the first version at a tip: every change edits its own line, so order does not matter.
  function applied(s, tip) {
    const set = anc(s, tip), on = new Set(), off = new Set();
    s.commits.forEach((c) => { if (!set.has(c.id)) return; if (c.kind === 'commit') on.add(c.chg); if (c.kind === 'revert') off.add(c.chg); });
    return new Set([...on].filter((n) => !off.has(n)));
  }
  const used = (s) => new Set(s.commits.filter((c) => c.kind === 'commit').map((c) => c.chg));
  const unused = (s) => [...Array(NCHG).keys()].filter((n) => !used(s).has(n));
  const pickOf = (s) => { const u = unused(s); return u.includes(s.pick) ? s.pick : u[0]; };
  const reverted = (s, id) => s.commits.some((c) => c.kind === 'revert' && c.of === id);
  const ahead = (s) => Object.keys(s.br).filter((b) => b !== 'main' && !anc(s, s.br.main).has(s.br[b]));

  // ---------- state per slide ----------
  const VALID = { commit: () => true, history: () => true, branch: () => true, merge: (s) => ahead(s).length > 0 && s.pr !== 'merged' };
  let stored = {};
  function startOf(id) {
    if (stored[id]) return stored[id];
    const prev = stored[ORDER[ORDER.indexOf(id) - 1]];
    if (prev && VALID[id](prev)) { const s = clone(prev); s.last = null; s.pr = null; return s; }
    return PRESET[id]();
  }
  const get = (id) => startOf(id);
  const mut = (id, fn) => { const s = (stored[id] = startOf(id)); fn(s); return s; };

  // ---------- texts ----------
  const me = (s, a) => (a === 'me' ? t('sim.me') : a);
  const when = (d) => (d === 'today' ? t('sim.today') : d);
  const hash = (s, id) => (Math.imul(s.commits.findIndex((c) => c.id === id) + 7, 2654435761) >>> 0).toString(16).padStart(8, '0').slice(0, 7);
  const C = (n, k) => t(`chg.${sc()}.${n}.${k}`);
  const prTitle = () => t(`pr.${sc()}.title`);
  function msgOf(s, c) {
    if (c.kind === 'init') return t('sim.init');
    if (c.kind === 'revert') return fmt(t('sim.revertmsg'), { m: msgOf(s, byId(s, c.of)) });
    if (c.kind === 'merge') return fmt(t(`pf.${pf()}.mergemsg`), { b: c.of, title: prTitle() });
    return C(c.chg, c.q === 'bad' ? 'bad' : 'good');
  }
  const lineOld = (n) => t(`chg.${sc()}.base.${n}`);
  const lineNew = (n) => C(n, 'new');

  // ---------- the commit graph: a vertical light trail, newest on top ----------
  function graph(s, o = {}) {
    const list = s.commits.slice().reverse(), n = list.length;
    const lanes = [];
    s.commits.forEach((c) => { if (!lanes.includes(c.br)) lanes.push(c.br); });
    lanes.sort((a, b) => (a === 'main' ? -1 : b === 'main' ? 1 : 0));
    const L = (b) => lanes.indexOf(b);
    const rh = Math.max(36, Math.min(56, Math.floor((o.h || 500) / Math.max(n, 1))));
    const W = 26 + lanes.length * 30;
    const pos = {};
    list.forEach((c, i) => { pos[c.id] = { x: 20 + L(c.br) * 30, y: i * rh + rh / 2 }; });
    let edges = '', dots = '';
    list.forEach((c) => {
      c.p.forEach((pid) => {
        const a = pos[c.id], b = pos[pid], k = Math.max(L(c.br), L(byId(s, pid).br)) % 3, m = (a.y + b.y) / 2;
        edges += `<path class="e l${k}" d="${a.x === b.x ? `M${a.x} ${a.y}L${b.x} ${b.y}` : `M${a.x} ${a.y}C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}`}"/>`;
      });
    });
    list.forEach((c) => {
      const { x, y } = pos[c.id], k = L(c.br) % 3;
      if (c.id === s.sel) dots += `<circle class="halo l${k}" cx="${x}" cy="${y}" r="13"/>`;
      dots += c.kind === 'revert' ? `<rect class="d rev l${k}" x="${x - 6}" y="${y - 6}" width="12" height="12" transform="rotate(45 ${x} ${y})"/>`
        : c.kind === 'merge' ? `<circle class="d mrg l${k}" cx="${x}" cy="${y}" r="9"/><circle class="d in l${k}" cx="${x}" cy="${y}" r="3.5"/>`
        : `<circle class="d l${k}" cx="${x}" cy="${y}" r="7"/>`;
    });
    const rows = list.map((c) => {
      const pills = Object.keys(s.br).filter((b) => s.br[b] === c.id).map((b) => `<span class="pill l${L(b) % 3} ${s.head === b ? 'head' : ''}">${s.head === b ? '▶ ' : ''}${esc(b)}</span>`).join('');
      const vague = c.kind === 'commit' && c.q === 'bad';
      const gone = c.kind === 'commit' && reverted(s, c.id);
      return `<button class="crow k-${c.kind} ${c.id === s.sel ? 'sel' : ''} ${vague ? 'vague' : ''} ${gone ? 'gone' : ''}" data-act="select" data-sim="${o.sim}" data-id="${c.id}" title="${esc(msgOf(s, c))}">
        <span class="cm"><b class="msg">${esc(msgOf(s, c))}</b>${pills}</span>
        <span class="meta">${esc(me(s, c.au))} · ${esc(when(c.dt))} · <code>${hash(s, c.id)}</code></span></button>`;
    }).join('');
    return `<div class="glog ${rh < 44 ? 'tight' : ''}" style="--rh:${rh}px;--lw:${W}px">
      <svg class="gsvg" width="${W}" height="${n * rh}" aria-hidden="true">${edges}${dots}</svg>${rows}</div>`;
  }

  // The file as it is at a tip: changed lines glow.
  function fileView(s, tip, label, o = {}) {
    const on = applied(s, tip);
    return `<div class="fv ${o.cls || ''}"><div class="fv-h"><span>${esc(t(`chg.${sc()}.file`))}</span><span class="pill l${o.lane || 0}">${esc(label)}</span></div>
      <pre>${[...Array(NCHG).keys()].map((i) => `<span class="ln ${on.has(i) ? 'chg' : ''}">${esc(on.has(i) ? lineNew(i) : lineOld(i))}</span>`).join('')}</pre></div>`;
  }
  const diffCount = (s, a, b) => { const x = applied(s, a), y = applied(s, b); return [...new Set([...x, ...y])].filter((n) => x.has(n) !== y.has(n)).length; };

  const diffBlock = (n, swap) => {
    const a = swap ? lineNew(n) : lineOld(n), b = swap ? lineOld(n) : lineNew(n);
    return `<div class="diff"><div class="dh">${esc(t(`chg.${sc()}.file`))}</div><div class="dl del"><i>−</i>${esc(a)}</div><div class="dl add"><i>+</i>${esc(b)}</div></div>`;
  };

  // ---------- Jij zegt / Claude Code voert uit ----------
  const DEFAULT_LAST = { commit: (s) => ({ type: 'commit', chg: pickOf(s) == null ? 0 : pickOf(s), q: s.q }), history: () => ({ type: 'ask' }), branch: () => ({ type: 'branch' }), merge: () => ({ type: 'pr-open' }) };
  function sayDo(id) {
    const s = get(id), l = s.last || DEFAULT_LAST[id](s);
    const p = pf();
    let say, cmd;
    if (l.type === 'commit') {
      const msg = C(l.chg, l.q === 'bad' ? 'bad' : 'good');
      say = fmt(t(l.q === 'bad' ? 'say.commit.bad' : 'say.commit'), { label: C(l.chg, 'label') });
      cmd = `git add -A && git commit -m "${msg}"`;
    } else if (l.type === 'ask') { say = t('say.ask'); cmd = 'git log -p -- ' + t(`chg.${sc()}.file`); }
    else if (l.type === 'revert') { say = t('say.revert'); cmd = `git revert ${hash(s, l.id)}`; }
    else if (l.type === 'branch') { say = t('say.branch'); cmd = `git switch -c ${BR}`; }
    else if (l.type === 'switch') { say = fmt(t('say.switch'), { b: l.b }); cmd = `git switch ${l.b}`; }
    else if (l.type === 'pr-open') { say = t('say.pr-open'); cmd = p === 'github' ? `git push -u origin ${BR} && gh pr create` : `git push -u origin ${BR} && az repos pr create`; }
    else if (l.type === 'pr-approve') { say = t('say.pr-approve'); cmd = t('say.human'); }
    else { say = t('say.merge'); cmd = p === 'github' ? 'gh pr merge 12 --merge' : 'az repos pr update --id 12 --status completed'; }
    return `<div class="say">
      <div class="sd you"><span class="lbl">${t('say.you')}</span><span class="tx">“${esc(say)}”</span></div>
      <span class="arr" aria-hidden="true">→</span>
      <div class="sd cc"><span class="lbl">${t('say.cc')}</span><code class="tx">${esc(cmd)}</code></div></div>`;
  }

  // ---------- controls and panels per slide ----------
  const btn = (sim, act, label, o = {}) => `<button class="sbtn ${o.cls || ''}" data-act="${act}" data-sim="${sim}" ${o.id != null ? `data-id="${esc(o.id)}"` : ''} ${o.off ? 'disabled' : ''} ${o.on != null ? `aria-pressed="${!!o.on}"` : ''}>${label}</button>`;
  const resetBtn = (sim) => btn(sim, 'reset', '↺ ' + t('sim.reset'), { cls: 'ghost' });

  function ui(id) {
    const s = get(id);
    if (id === 'commit') return uiCommit(s);
    if (id === 'history') return uiHistory(s);
    if (id === 'branch') return uiBranch(s);
    return uiMerge(s);
  }

  function uiCommit(s) {
    const u = unused(s), pick = pickOf(s), shown = u.slice(0, 3), q = s.q;
    const left = `
      <div class="sbox">
        <div class="sbox-h"><span class="n">1</span>${t('sim.step.changes')}</div>
        ${shown.length ? shown.map((n) => `<button class="opt ${n === pick ? 'on' : ''}" data-act="pick" data-sim="commit" data-id="${n}" aria-pressed="${n === pick}">
            <b>${esc(C(n, 'label'))}</b><span class="mini"><i class="m">−</i>${esc(lineOld(n))}<br><i class="p">+</i>${esc(lineNew(n))}</span></button>`).join('')
          : `<p class="dim">${t('sim.nochanges')}</p>`}
      </div>
      <div class="sbox">
        <div class="sbox-h"><span class="n">2</span>${t('sim.step.message')}</div>
        <div class="seg">
          ${btn('commit', 'quality', t('sim.q.bad'), { id: 'bad', on: q === 'bad', cls: 'bad' })}
          ${btn('commit', 'quality', t('sim.q.good'), { id: 'good', on: q === 'good', cls: 'good' })}
        </div>
        ${pick != null ? `<div class="msgprev ${q}"><span class="lbl">${t('sim.msgprev')}</span><b>${esc(C(pick, q === 'bad' ? 'bad' : 'good'))}</b></div>` : ''}
      </div>
      ${btn('commit', 'commit', '● ' + t('sim.commit'), { cls: 'go', off: pick == null })}`;
    return `<div class="sim two"><div class="scol">${left}</div><div class="scol"><div class="sbar"><span class="label">${t('sim.history')}</span>${resetBtn('commit')}</div>${graph(s, { sim: 'commit', h: 470 })}</div></div>`;
  }

  function uiHistory(s) {
    const c = byId(s, s.sel) || s.commits[s.commits.length - 1];
    const msg = msgOf(s, c), au = me(s, c.au);
    let diff = '', why = '', ans = '';
    if (c.kind === 'commit') {
      diff = diffBlock(c.chg);
      if (c.q === 'bad') {
        why = `<div class="why warn"><span class="lbl">${t('sim.why')}</span><p>${t('sim.why.none')}</p></div>`;
        ans = fmt(t('ask.bad'), { msg: `«${msg}»`, old: lineOld(c.chg), new: lineNew(c.chg), au: c.au === 'me' ? t('sim.me.obj') : au });
      } else {
        why = `<div class="why"><span class="lbl">${t('sim.why')}</span><p>${esc(C(c.chg, 'why'))}</p></div>`;
        ans = fmt(t('ask.good'), { au, dt: when(c.dt), msg: `«${msg}»`, why: C(c.chg, 'why') });
      }
    } else if (c.kind === 'revert') {
      diff = diffBlock(byId(s, c.of).chg, true);
      why = `<div class="why"><span class="lbl">${t('sim.why')}</span><p>${t('sim.why.revert')}</p></div>`;
      ans = fmt(t('ask.revert'), { msg: `«${msgOf(s, byId(s, c.of))}»` });
    } else if (c.kind === 'merge') {
      why = `<div class="why"><span class="lbl">${t('sim.why')}</span><p>${t('sim.why.merge')}</p></div>`;
      ans = fmt(t('ask.merge'), { b: c.of });
    } else {
      why = `<div class="why"><span class="lbl">${t('sim.why')}</span><p>${t('sim.why.init')}</p></div>`;
      ans = t('ask.init');
    }
    const canRevert = c.kind === 'commit' && !reverted(s, c.id) && anc(s, s.br[s.head]).has(c.id);
    const card = `
      <div class="detail">
        <h3>${esc(msg)}</h3>
        <div class="who"><span>${esc(au)}</span><span>${esc(when(c.dt))}</span><code>${hash(s, c.id)}</code></div>
        ${diff}${why}
        <div class="ask"><div class="b you"><span class="lbl">${t('sim.ask.you')}</span>${t('sim.ask.q')}</div><div class="b cc"><span class="lbl">Claude Code</span>${esc(ans)}</div></div>
        <div class="srow">${btn('history', 'revert', '↩ ' + t('sim.revert'), { cls: 'warnb', off: !canRevert })}<span class="xs dim">${reverted(s, c.id) ? t('sim.reverted') : t('sim.revert.hint')}</span></div>
      </div>`;
    return `<div class="sim two"><div class="scol"><div class="sbar"><span class="label">${t('sim.history')} · ${t('sim.clickme')}</span>${resetBtn('history')}</div>${graph(s, { sim: 'history', h: 470 })}</div><div class="scol">${card}</div></div>`;
  }

  function uiBranch(s) {
    const hasBr = !!s.br[BR], u = unused(s);
    const main = s.br.main, ex = s.br[BR];
    const left = `
      <div class="sbox">
        <div class="sbox-h"><span class="n">1</span>${t('sim.step.branch')}</div>
        <div class="srow">
          ${btn('branch', 'branch', '⑂ ' + t('sim.newbranch') + ` <code>${BR}</code>`, { off: hasBr, cls: 'go' })}
        </div>
      </div>
      <div class="sbox">
        <div class="sbox-h"><span class="n">2</span>${t('sim.step.work')}</div>
        <div class="srow">
          ${btn('branch', 'commit', '● ' + t('sim.commitOn') + ` <code>${esc(s.head)}</code>`, { off: !u.length, cls: 'go' })}
        </div>
        <div class="srow">
          <span class="xs dim">${t('sim.workingon')}</span>
          ${Object.keys(s.br).map((b) => btn('branch', 'switch', esc(b), { id: b, on: s.head === b, cls: 'tog' })).join('')}
        </div>
        ${u.length ? '' : `<p class="xs dim">${t('sim.nochanges')}</p>`}
      </div>
      <div class="cmp">
        ${fileView(s, main, 'main', { lane: 0 })}
        ${hasBr ? fileView(s, ex, BR, { lane: 1 }) : `<div class="fv ghostbox"><p class="dim">${t('sim.nobranch')}</p></div>`}
      </div>
      <p class="xs ${hasBr && diffCount(s, main, ex) ? 'hl' : 'dim'}">${hasBr ? fmt(t('sim.differs'), { n: diffCount(s, main, ex) }) : ''}</p>`;
    return `<div class="sim two wide"><div class="scol">${left}</div><div class="scol"><div class="sbar"><span class="label">${t('sim.history')}</span>${resetBtn('branch')}</div>${graph(s, { sim: 'branch', h: 470 })}</div></div>`;
  }

  function uiMerge(s) {
    const b = ahead(s)[0] || BR, merged = s.pr === 'merged';
    const state = s.pr || 'none', p = pf();
    const pending = [...applied(s, s.br[b])].filter((n) => !applied(s, s.br.main).has(n));
    const shownChanges = merged ? s.commits.filter((c) => c.br === b && c.kind === 'commit').map((c) => c.chg) : pending;
    const card = `
      <div class="pr ${state}">
        <div class="pr-h"><span class="pfb">${t(`pf.${p}.name`)}</span><b>${t(`pf.${p}.prname`)} #12</b><span class="state">${t('pr.state.' + state)}</span></div>
        <h3>${esc(prTitle())}</h3>
        <div class="flowl"><code>${esc(b)}</code><span>→</span><code>main</code></div>
        <div class="changes"><span class="lbl">${t('pr.changes')}</span>
          ${shownChanges.length ? shownChanges.map((n) => `<div class="cl"><b>${esc(C(n, 'label'))}</b><span class="mini"><i class="m">−</i>${esc(lineOld(n))} <i class="p">+</i>${esc(lineNew(n))}</span></div>`).join('') : `<p class="xs dim">${t('pr.nochanges')}</p>`}
        </div>
        <div class="steps">
          ${btn('merge', 'pr-open', `<span class="n">1</span>${t(`pf.${p}.create`)}`, { off: !!s.pr, cls: s.pr ? 'done' : 'go next' })}
          ${btn('merge', 'pr-approve', `<span class="n">2</span>${t('pr.review')} · ${t(`pf.${p}.approve`)}`, { off: s.pr !== 'open', cls: s.pr === 'open' ? 'go next' : s.pr ? 'done' : '' })}
          ${btn('merge', 'pr-merge', `<span class="n">3</span>${t(`pf.${p}.merge`)}`, { off: s.pr !== 'approved', cls: s.pr === 'approved' ? 'go next' : merged ? 'done' : '' })}
        </div>
        <p class="xs dim">${merged ? t('pr.after') : s.pr === 'open' ? t('pr.hint.open') : s.pr === 'approved' ? t('pr.hint.approved') : t('pr.hint.none')}</p>
      </div>`;
    return `<div class="sim two"><div class="scol">${card}</div><div class="scol"><div class="sbar"><span class="label">${t('sim.history')}</span>${resetBtn('merge')}</div>${graph(s, { sim: 'merge', h: merged ? 300 : 470 })}${merged ? fileView(s, s.br.main, 'main', { lane: 0, cls: 'compact' }) : ''}</div></div>`;
  }

  // ---------- actions ----------
  function act(name, d) {
    const id = d.sim;
    if (name === 'reset') { stored = {}; return; }
    mut(id, (s) => {
      if (name === 'select') { s.sel = d.id; return; }
      if (name === 'pick') { s.pick = +d.id; return; }
      if (name === 'quality') { s.q = d.id; return; }
      if (name === 'commit') {
        const n = id === 'commit' ? pickOf(s) : unused(s)[0];
        if (n == null) return;
        const q = id === 'commit' ? s.q : 'good';
        add(s, { br: s.head, chg: n, q });
        s.pick = null; s.last = { type: 'commit', chg: n, q };
      }
      if (name === 'branch') {
        if (s.br[BR]) return;
        s.br[BR] = s.br[s.head]; s.head = BR; s.last = { type: 'branch' };
      }
      if (name === 'switch') { if (s.br[d.id]) { s.head = d.id; s.sel = s.br[d.id]; s.last = { type: 'switch', b: d.id }; } }
      if (name === 'revert') {
        const c = byId(s, s.sel);
        if (!c || c.kind !== 'commit' || reverted(s, c.id)) return;
        add(s, { br: s.head, kind: 'revert', chg: c.chg, of: c.id });
        s.last = { type: 'revert', id: c.id };
      }
      if (name === 'pr-open' && !s.pr) { s.pr = 'open'; s.last = { type: 'pr-open' }; }
      if (name === 'pr-approve' && s.pr === 'open') { s.pr = 'approved'; s.last = { type: 'pr-approve' }; }
      if (name === 'pr-merge' && s.pr === 'approved') {
        const b = ahead(s)[0] || BR;
        add(s, { br: 'main', kind: 'merge', p: [s.br.main, s.br[b]], of: b });
        s.pr = 'merged'; s.head = 'main'; s.last = { type: 'merge' };
      }
    });
  }

  DECK.act = act;
  DECK.sim = { ui, sayDo, reset: () => { stored = {}; } };
  // Presenter view and audience window are separate pages: the engine passes this state between them.
  DECK.getState = () => JSON.stringify(stored);
  DECK.setState = (json) => { try { stored = JSON.parse(json) || {}; } catch (e) { /* ignore a broken message */ } };
})();
