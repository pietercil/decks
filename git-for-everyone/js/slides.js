// Slide definitions. All visible text comes from i18n via t(); commands and file names stay untranslated.
// The thread: git as a time machine with parallel worlds. A commit is a saved moment, the history a trail of light,
// a branch a parallel world, a merge the way back to the main line, and reverting a jump to an earlier moment.
// Slides 4 to 7 are interactive: DECK.sim (js/sim.js) is a small simulated git whose repo grows along those slides.
(function () {
  const t = (k) => DECK.t(k);
  const { logo, mark, term, eyebrow, head, li } = DECK.h;
  DECK.id = 'git-for-everyone';

  // ---------- chapters (minutes = time budget; the reference part is not presented) ----------
  DECK.chapters = [
    { id: 'why', min: 2 },
    { id: 'basics', min: 5 },
    { id: 'team', min: 1 },
    { id: 'claude', min: 2 },
    { id: 'ref', min: 0 },
  ];

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const pf = () => DECK.platform();
  const P = (k) => t(`pf.${pf()}.${k}`);

  // A switch for one of the two settings, shown on the slides where it matters (the ☰ menu has both too).
  const switcher = (kind) => `
    <div class="switch" role="group" aria-label="${t('menu.' + kind)}">
      ${DECK[kind === 'scenario' ? 'scenarios' : 'platforms'].map((v) => `<button class="${DECK[kind]() === v ? 'on' : ''}" data-cmd="${kind}-${v}">${t(`cmd.${kind}-${v}`)}</button>`).join('')}
    </div>`;
  const headRow = (s, kinds) => `
    <div class="row headrow">
      <div class="stack" style="gap:8px">${eyebrow(s)}<h2>${t(s.id + '.title')}</h2></div>
      <div class="row" style="gap:10px">${kinds.map(switcher).join('')}</div>
    </div>`;

  // The four interactive slides share one frame: the live simulator, the say/do strip and one closing remark.
  const simSlide = (id, kinds) => (s) => `
    ${headRow(s, kinds)}
    <div class="fill" data-live="sim">${DECK.sim.ui(id)}</div>
    <div data-live="say">${DECK.sim.sayDo(id)}</div>
    <div class="callout sm" data-f="1"><p>${t(id + '.punch')}</p></div>`;

  // Decorative light trails for the title slide: three lanes that branch and merge.
  const trails = () => `
    <svg class="trails" viewBox="0 0 700 760" aria-hidden="true">
      <path class="tr a" d="M60 0 V330 C60 380 60 380 60 420 V760"/>
      <path class="tr b" d="M60 150 C60 200 200 190 200 250 V540 C200 600 60 580 60 640"/>
      <path class="tr c" d="M200 260 C200 300 340 290 340 350 V470 C340 520 200 500 200 540"/>
      ${[[60, 80], [60, 150], [60, 210], [60, 330], [60, 450], [60, 700], [200, 260], [200, 400], [200, 470], [340, 385], [340, 440], [200, 540, 1], [60, 640, 1]].map(([x, y, m], i) => `<circle class="dt ${m ? 'mg' : ''}" style="--i:${i};--dc:${{ 60: 'var(--l0)', 200: 'var(--l1)', 340: 'var(--l2)' }[x]}" cx="${x}" cy="${y}" r="${m ? 11 : 9}"/>`).join('')}
    </svg>`;

  // Slide 8: who talks to whom. `data-f` steps: the three places, clone, push, pull, remark.
  const verb = (k, f) => `
    <div class="verb" data-f="${f}">
      <div class="row" style="gap:10px"><code class="vname">${term(k, 'git ' + k)}</code></div>
      <p class="small">${t('remote.' + k)}</p>
      <p class="say-s">“${t('remote.' + k + '.say')}”</p>
      <code class="cmd-s">${esc(P('cmd.' + k))}</code>
    </div>`;

  // Slide 9 (conversation): one scenario at a time.
  const bubble = (who, text, f, extra = '') => `<div class="cb ${who}" data-f="${f}"><span class="lbl">${who === 'you' ? t('say.you') : 'Claude Code'}</span><p class="bt">${text}</p>${extra}</div>`;

  const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N} /]/gu, '').trim().toLowerCase();
  const sayRow = (k) => `
    <div class="th-say"><b>${t('rp.' + k + '.what')}</b></div>
    <div class="dim">“${t('rp.' + k + '.say')}”</div>
    <div><code>${esc(t('rp.' + k + '.cmd'))}</code></div>`;
  const PROMPTS = ['init', 'save', 'diff', 'log', 'why', 'back', 'branch', 'switch', 'pr', 'clone', 'push', 'pull'];

  DECK.slides = [
    // ===== Why =====
    { id: 'title', ch: 'why', stage: 'analysis', dark: true, render: () => `
      ${trails()}
      ${logo(44)}
      <div class="kicker" style="margin-top:100px">${t('title.kicker')}</div>
      <h1>${t('title.h1')}</h1>
      <p class="lead" style="max-width:980px">${t('title.sub')}</p>
      <div class="row mt-auto" style="gap:10px">
        ${['a', 'b', 'c'].map((k) => `<span class="tag neon">${t('title.' + k)}</span>`).join('<span class="faint">·</span>')}
      </div>` },

    { id: 'problem', ch: 'why', stage: 'analysis', render: (s) => `
      ${head(s)}
      <p class="lead">${t('problem.lead')}</p>
      <div class="grid fill" style="grid-template-columns:1fr 1fr;gap:44px">
        <div class="stack" style="gap:14px" data-f="1">
          <span class="label">${t('problem.files')}</span>
          <div class="files">${[1, 2, 3, 4, 5, 6].map((i) => `<code class="fl" style="--r:${[-1.2, .8, -.4, 1.1, -.9, .5][i - 1]}deg">${t('problem.f' + i)}</code>`).join('')}</div>
        </div>
        <div class="stack" style="gap:14px" data-f="2">
          <span class="label">${t('problem.asks')}</span>
          ${[1, 2, 3].map((i) => `<div class="qcard"><span class="n">${i}</span><div class="stack" style="gap:2px"><b>${t('problem.q' + i)}</b><p class="xs dim">${t('problem.q' + i + '.d')}</p></div></div>`).join('')}
        </div>
      </div>
      <div class="callout" data-f="3"><p>${t('problem.punch')}</p></div>` },

    { id: 'what', ch: 'why', stage: 'analysis', render: (s) => `
      ${head(s)}
      <p class="lead">${t('what.lead')}</p>
      <div class="grid g3 fill">
        ${['commit', 'branch', 'merge'].map((k, i) => `
          <div class="panel top world w${i}" data-f="${i + 1}">
            <span class="glyph" aria-hidden="true">${['●', '⑂', '⤵'][i]}</span>
            <span class="label">${t('what.' + k + '.is')}</span>
            <h3>${term(k, t('what.' + k + '.name'))}</h3>
            <p class="small dim">${t('what.' + k + '.d')}</p>
          </div>`).join('')}
      </div>
      <div class="callout sm" data-f="4"><p>${t('what.note')}</p></div>` },

    // ===== Basics (interactive) =====
    { id: 'commit', ch: 'basics', stage: 'planning', cls: 'simslide', render: simSlide('commit', ['scenario']) },
    { id: 'history', ch: 'basics', stage: 'planning', cls: 'simslide', render: simSlide('history', ['scenario']) },
    { id: 'branch', ch: 'basics', stage: 'planning', cls: 'simslide', render: simSlide('branch', ['scenario']) },
    { id: 'merge', ch: 'basics', stage: 'planning', cls: 'simslide', render: simSlide('merge', ['scenario', 'platform']) },

    // ===== Team =====
    { id: 'remote', ch: 'team', stage: 'development', render: (s) => `
      ${headRow(s, ['platform'])}
      <div class="net fill">
        <div class="node" data-f="1"><span class="ico" aria-hidden="true">▣</span><b>${t('remote.me')}</b><p class="xs dim">${t('remote.me.d')}</p></div>
        <div class="links l1">${verb('clone', 2)}${verb('push', 3)}</div>
        <div class="node hub" data-f="1"><span class="ico" aria-hidden="true">☁</span><b>${term('remote', P('place'))}</b><p class="xs dim">${t('remote.hub.d')}</p></div>
        <div class="links l2">${verb('pull', 4)}</div>
        <div class="node" data-f="1"><span class="ico" aria-hidden="true">▣</span><b>${t('remote.mate')}</b><p class="xs dim">${t('remote.mate.d')}</p></div>
      </div>
      <div class="callout sm" data-f="5"><p>${t('remote.punch')}</p></div>` },

    // ===== Claude Code =====
    // The conversation differs per scenario, so this slide has notes per scenario (n.claude.<scenario>).
    { id: 'claude', ch: 'claude', stage: 'shaping', perScenario: true, render: (s) => {
      const sc = DECK.scenario();
      const x = (k) => t(`cl.${sc}.${k}`);
      return `
      <div class="row headrow">
        <div class="stack" style="gap:8px">${eyebrow(s)}<h2>${t('claude.title')}</h2></div>
        ${switcher('scenario')}
      </div>
      <div class="grid fill" style="grid-template-columns:1.15fr 1fr;gap:34px">
        <div class="chat stack" style="gap:10px">
          ${bubble('you', x('u1'), 1)}
          ${bubble('cc', x('c1'), 2, '<div class="tools"><code>git status</code><code>git diff</code></div>')}
          ${bubble('cc', x('c2'), 3, `<div class="perm"><span class="lbl">${t('claude.perm')}</span><code>${esc(x('cmd'))}</code><div class="row" style="gap:8px"><span class="pb ok">${t('claude.allow')}</span><span class="pb">${t('claude.deny')}</span></div></div>`)}
          ${bubble('cc', x('c3'), 4)}
        </div>
        <div class="stack" style="gap:12px" data-f="5">
          <span class="label">${t('claude.maps')}</span>
          <div class="maps">
            ${['save', 'history', 'back', 'branch', 'share'].map((k) => `<div class="map-s"><p class="small">“${t('claude.m.' + k)}”</p><code>${esc(t('claude.c.' + k))}</code></div>`).join('')}
          </div>
          <p class="small dim">${t('claude.nocmd')}</p>
        </div>
      </div>`; } },

    { id: 'safety', ch: 'claude', stage: 'shaping', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1.1fr 1fr;gap:30px">
        <div class="stack" style="gap:12px" data-f="1">
          <span class="label ok">${t('safety.safe')}</span>
          ${[1, 2, 3].map((i) => `<div class="fact"><span class="ck" aria-hidden="true">✓</span><div class="stack" style="gap:2px"><b>${t('safety.s' + i)}</b><p class="xs dim">${t('safety.s' + i + '.d')}</p></div></div>`).join('')}
        </div>
        <div class="stack warnbox" style="gap:10px" data-f="2">
          <span class="label bad">${t('safety.careful')}</span>
          <ul class="clean xs">${li([1, 2, 3].map((n) => 'safety.w' + n))}</ul>
          <p class="small"><b>${t('safety.ask')}</b></p>
        </div>
      </div>
      <div class="callout" data-f="3"><p>${t('safety.punch')}</p></div>
      <div class="first" data-f="4">
        <span class="label">${t('safety.first')}</span>
        <div class="grid g3" style="gap:14px">${[1, 2, 3].map((i) => `<div class="fs"><span class="n">${i}</span><p class="small">“${t('safety.f' + i)}”</p></div>`).join('')}</div>
      </div>` },

    // ===== Reference (not presented; the manual) =====
    { id: 'r-prompts', ch: 'ref', stage: 'core', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-prompts.title')}</h2>
      <div class="xtable cheat fill">
        <div class="th">${t('r-prompts.what')}</div><div class="th">${t('r-prompts.say')}</div><div class="th">${t('r-prompts.runs')}</div>
        ${PROMPTS.map(sayRow).join('')}
      </div>
      <p class="xs faint">${t('r-prompts.note')}</p>` },

    { id: 'r-example', ch: 'ref', stage: 'core', perScenario: true, render: (s) => {
      const sc = DECK.scenario();
      return `
      <div class="row headrow"><div class="stack" style="gap:8px">${eyebrow(s)}<h2 style="font-size:40px">${t('r-example.title')}</h2></div>${switcher('scenario')}</div>
      <p class="xs faint" style="margin-top:-6px">${t(`r-example.${sc}.intro`)}</p>
      <div class="xtable ex fill">
        <div class="th">${t('r-example.step')}</div><div class="th">${t('r-prompts.say')}</div><div class="th">${t('r-example.result')}</div>
        ${['save', 'history', 'back', 'branch', 'pr', 'share'].map((k) => `
          <div class="th-say"><b>${t('r-example.k.' + k)}</b></div>
          <div class="dim">“${t(`r-example.${sc}.${k}.say`)}”</div>
          <div class="dim">${t(`r-example.${sc}.${k}.res`)}</div>`).join('')}
      </div>`; } },

    { id: 'r-platform', ch: 'ref', stage: 'core', render: (s) => `
      ${headRow(s, ['platform']).replace('<h2>', '<h2 style="font-size:40px">')}
      <div class="xtable plat fill">
        <div class="th"></div>${DECK.platforms.map((p) => `<div class="th ${pf() === p ? 'cur' : ''}">${t(`pf.${p}.name`)}</div>`).join('')}
        ${['place', 'url', 'create', 'approve', 'merge', 'cli', 'rules'].map((k) => `
          <div class="th-say"><b>${t('r-platform.' + k)}</b></div>
          ${DECK.platforms.map((p) => `<div class="${pf() === p ? 'cur' : 'dim'}">${k === 'url' || k === 'cli' ? `<code>${esc(t(`pf.${p}.${k}`))}</code>` : t(`pf.${p}.${k}`)}</div>`).join('')}`).join('')}
      </div>
      <p class="xs faint">${t('r-platform.note')}</p>` },

    { id: 'r-first', ch: 'ref', stage: 'core', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-first.title')}</h2>
      <div class="grid fill" style="grid-template-columns:1fr 1fr;gap:30px">
        <div class="stack" style="gap:12px">
          ${[1, 2, 3, 4].map((i) => `<div class="fact"><span class="n">${i}</span><div class="stack" style="gap:2px"><b>${t('r-first.s' + i)}</b><p class="xs dim">${t('r-first.s' + i + '.d')}</p></div></div>`).join('')}
        </div>
        <div class="stack" style="gap:10px">
          <span class="label">${t('r-first.file')} ${term('claude-md', 'CLAUDE.md', 'tag concept')}</span>
          <div class="file"><div class="fname"><span>CLAUDE.md</span><span>${t('r-first.copy')}</span></div><pre>${esc(t('r-first.md'))}</pre></div>
          <p class="xs dim">${t('r-first.note')}</p>
        </div>
      </div>` },

    { id: 'gloss', ch: 'ref', stage: 'core', render: (s) => {
      const ids = Object.keys(DECK.terms).sort((a, b) => plain(t('term.' + a + '.name')).localeCompare(plain(t('term.' + b + '.name'))));
      return `${eyebrow(s)}<h2 style="font-size:40px">${t('gloss.title')}</h2>
        <div class="gloss fill" style="grid-template-columns:repeat(3,1fr);gap:14px 32px">${ids.map((k) => `
          <div class="g"><b>${term(k)}</b><p>${t('term.' + k + '.def')}</p></div>`).join('')}</div>`;
    } },

    { id: 'sources', ch: 'ref', stage: 'core', render: (s) => `
      ${head(s)}
      <div class="grid g2 fill">
        <div class="stack" style="gap:16px">
          ${[['git-scm.com/book', 'https://git-scm.com/book/en/v2', 'src.book'],
             ['code.claude.com/docs', 'https://code.claude.com/docs', 'src.claude'],
             ['docs.github.com · pull requests', 'https://docs.github.com/en/pull-requests', 'src.github'],
             ['learn.microsoft.com · Azure Repos', 'https://learn.microsoft.com/en-us/azure/devops/repos/', 'src.azure'],
             ['../agent-plugins/', '../agent-plugins/', 'src.plugins']].map(([label, url, k]) => `
            <div class="stack" style="gap:2px"><a class="mono small" href="${url}" target="_blank" rel="noopener" style="color:var(--brand-ink)">${label}</a><p class="xs dim">${t(k)}</p></div>`).join('')}
        </div>
        <div class="stack" style="gap:12px">
          <span class="label">${t('src.keys')}</span>
          <div class="cmds">${DECK.cmdButtons(['all', 'theme', 'overview', 'presenter', 'pdf', 'pdfnotes', ...DECK.scenarios.map((v) => 'scenario-' + v), ...DECK.platforms.map((v) => 'platform-' + v)])}</div>
          <p class="xs dim">${t('src.keysd')}</p>
        </div>
      </div>` },
  ];
})();
