// Slide definitions. All visible text comes from i18n via t(); product names, commands and file names stay untranslated.
// The ship of Theseus runs lightly through the deck: every plank (code, docs) gets replaced over time,
// and the plugin keeps the documentation the same, true ship.
(function () {
  const t = (k) => DECK.t(k);
  const { logo, mark, term, eyebrow, head, li } = DECK.h;
  DECK.id = 'ship-of-theseus';

  // ---------- chapters (minutes = time budget; the reference part is not presented) ----------
  DECK.chapters = [
    { id: 'why', min: 3 },
    { id: 'what', min: 2 },
    { id: 'how', min: 4 },
    { id: 'next', min: 1 },
    { id: 'ref', min: 0 },
  ];

  const P = '/ship-of-theseus:';
  const SKILLS = ['setup', 'distill', 'check', 'document', 'release-notes'];
  // Slide 6: five rows per scenario. Code blocks are illustrative (an invented project); the format is the real one.
  const switcher = () => `
    <div class="switch" role="group" aria-label="${t('menu.scenario')}">
      ${DECK.scenarios.map((v) => `<button class="${DECK.scenario() === v ? 'on' : ''}" data-cmd="scenario-${v}">${t('cmd.scenario-' + v)}</button>`).join('')}
    </div>`;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const code = (s) => `<div class="file"><pre>${esc(s)}</pre></div>`;

  // Slide 7: the Stop hook as a chain of conditions; the last one is the nudge.
  const HOOK = ['h1', 'h2', 'h3', 'h4'];
  // Slide 8: the Matrix excerpt (rows = kind of Change, columns = doc types). yes / maybe / - as in documentation.template.md.
  const MATRIX = [
    ['feature', 'yes', 'maybe', 'yes', 'maybe', 'yes', 'yes'],
    ['bugfix', 'maybe', '-', 'maybe', 'maybe', 'maybe', 'yes'],
    ['refactor', '-', 'yes', 'maybe', '-', '-', '-'],
    ['infra', '-', 'maybe', 'maybe', 'yes', '-', 'maybe'],
  ];
  const MCOLS = ['functional', 'architecture', 'reference', 'runbook', 'userguide', 'releasenotes'];
  const cell = (v) => `<span class="mx ${v === '-' ? 'no' : v}">${v === '-' ? '–' : v}</span>`;

  const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N} /]/gu, '').trim().toLowerCase();

  DECK.slides = [
    // ===== Why =====
    { id: 'title', ch: 'why', dark: true, render: () => `
      ${mark(620).replace('class="mark"', 'class="mark slab-mark"')}
      ${logo(44)}
      <div class="kicker" style="margin-top:110px">${t('title.kicker')}</div>
      <h1>${t('title.h1')}</h1>
      <p class="lead" style="max-width:1050px">${t('title.sub')}</p>
      <div class="row mt-auto" style="gap:10px">
        ${['plugin', 'docs', 'pr'].map((k) => `<span class="tag" style="color:var(--brand);border-color:var(--brand)">${t('title.' + k)}</span>`).join('<span class="faint">·</span>')}
      </div>` },

    { id: 'drift', ch: 'why', render: (s) => `
      ${head(s)}
      <p class="lead">${t('drift.lead')}</p>
      <div class="grid g3 fill">
        ${[1, 2, 3].map((i) => `
          <div class="panel top fm" data-f="${i}">
            <span class="num">${i}</span>
            <h3>${t('drift.p' + i)}</h3>
            <p class="dim">${t('drift.p' + i + '.d')}</p>
          </div>`).join('')}
      </div>
      <div class="callout" data-f="4"><p>${t('drift.punch')}</p></div>` },

    { id: 'matters', ch: 'why', render: (s) => `
      ${head(s)}
      <div class="grid g2 fill" style="gap:30px">
        ${['people', 'agents'].map((k, i) => `
          <div class="panel top stack" data-f="${i + 1}" style="gap:14px">
            <span class="label">${t('matters.' + k)}</span>
            <p class="small">${t('matters.' + k + '.d')}</p>
            <ul class="clean small">${li([1, 2, 3].map((n) => 'matters.' + k + n))}</ul>
          </div>`).join('')}
      </div>
      <div class="callout" data-f="3"><p>${t('matters.punch')}</p></div>` },

    // ===== What =====
    { id: 'flow', ch: 'what', render: (s) => `
      ${head(s)}
      <div class="lane" data-f="1">
        ${[['setup', 'once'], ['change', 'work'], ['distill', 'before'], ['pr', 'review'], ['release-notes', 'release']].map(([k, w], i) => `
          ${i ? '<span class="arr" aria-hidden="true">→</span>' : ''}
          <div class="node ${k === 'change' || k === 'pr' ? 'human' : ''}">
            <span class="when">${t('flow.when.' + w)}</span>
            ${k === 'change' || k === 'pr' ? `<b>${t('flow.' + k + '.b')}</b>` : `<code>${P}${k}</code>`}
            <p class="xs dim">${t('flow.' + k)}</p>
          </div>`).join('')}
      </div>
      <div class="grid g2" data-f="2" style="gap:22px">
        ${['check', 'document'].map((k) => `
          <div class="panel soft stack" style="gap:6px">
            <div class="row" style="gap:12px"><code class="big-code">${P}${k}</code><span class="tag">${t('flow.' + k + '.tag')}</span></div>
            <p class="small dim">${t('flow.' + k)}</p>
          </div>`).join('')}
      </div>
      <div class="rules fill" data-f="3">
        ${[1, 2, 3].map((i) => `
          <div class="rule">
            <h3>${t('flow.r' + i)}</h3>
            <p class="xs dim">${t('flow.r' + i + '.d')}</p>
          </div>`).join('')}
      </div>
      <div class="callout sm" data-f="4"><p>${t('flow.punch')}</p></div>` },

    { id: 'terms', ch: 'what', render: (s) => `
      ${head(s)}
      <div class="tgrid fill">
        ${['change', 'spec', 'living-doc', 'doc-drift', 'distillation', 'change-fragment', 'adr'].map((id, i) => `
          <div class="tcard" data-f="${i < 4 ? 1 : 2}">
            <div class="row" style="gap:10px">${term(id, '', 'tag concept')}</div>
            <p class="small">${t('terms.' + id)}</p>
          </div>`).join('')}
        <div class="tcard note" data-f="2"><p class="small dim">${t('terms.note')}</p></div>
      </div>` },

    // ===== How =====
    // Two versions, switched live: a bugfix in a project that has docs (default), or a project that is just starting (?scenario=start, S).
    { id: 'example', ch: 'how', perScenario: true, render: (s) => {
      const sc = DECK.scenario();
      const x = (k) => t('ex.' + sc + '.' + k);
      return `
      <div class="row" style="justify-content:space-between;align-items:flex-end">
        <div class="stack" style="gap:10px">${eyebrow(s)}<h2>${t('example.title')}</h2></div>
        ${switcher()}
      </div>
      <p class="xs faint" style="margin-top:-6px"><span class="tag illus">${t('example.illus')}</span> ${x('intro')}</p>
      <div class="xrows fill">
        ${[1, 2, 3, 4, 5].map((i) => `
          <div class="xrow" data-f="${i}">
            <span class="n">${i}</span>
            <div class="stack" style="gap:3px">
              <b>${x('s' + i)}</b>
              <p class="xs dim">${x('d' + i)}</p>
            </div>
            ${code(x('c' + i))}
          </div>`).join('')}
      </div>`; } },

    { id: 'check', ch: 'how', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1fr 1.1fr;gap:34px">
        <div class="stack" style="gap:10px">
          <span class="label">${t('check.hook')} ${term('stop-hook', t('check.hookterm'), 'tag concept')}</span>
          <div class="hookchain" data-f="1">
            ${HOOK.map((k, i) => `
              <div class="hk"><span class="n">${i + 1}</span><div class="stack" style="gap:2px"><b>${t('check.' + k)}</b><p class="xs dim">${t('check.' + k + '.d')}</p></div></div>`).join('')}
            <div class="hk go"><span class="n">→</span><div class="stack" style="gap:2px"><b>${t('check.go')}</b><p class="xs dim">${t('check.go.d')}</p></div></div>
          </div>
        </div>
        <div class="stack" style="gap:10px" data-f="2">
          <span class="label">${t('check.skill')} <code>${P}check</code> · ${t('check.readonly')}</span>
          <div class="file"><pre>${esc(t('check.out'))}</pre></div>
          <ul class="clean xs">${li([1, 2, 3].map((n) => 'check.n' + n))}</ul>
        </div>
      </div>
      <div class="callout sm" data-f="3"><p>${t('check.punch')}</p></div>` },

    { id: 'distill', ch: 'how', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1fr 1fr;gap:34px">
        <div class="stack steps" style="gap:6px" data-f="1">
          ${[1, 2, 3, 4, 5].map((i) => `
            <div class="dstep">
              <span class="n">${i}</span>
              <div class="stack" style="gap:2px"><b>${t('distill.s' + i)}</b><p class="xs dim">${t('distill.s' + i + '.d')}</p></div>
            </div>`).join('')}
        </div>
        <div class="stack" style="gap:12px" data-f="2">
          <span class="label">${term('matrix', t('distill.matrix'), 'tag concept')} · ${t('distill.matrix.sub')}</span>
          <div class="mtx">
            <div class="th"></div>${MCOLS.map((c) => `<div class="th">${t('col.' + c)}</div>`).join('')}
            ${MATRIX.map((r) => `<div class="rowh">${t('kind.' + r[0])}</div>${r.slice(1).map(cell).join('')}`).join('')}
          </div>
          <p class="xs dim">${t('distill.matrix.d')}</p>
        </div>
      </div>
      <div class="callout sm" data-f="3"><p>${t('distill.punch')}</p></div>` },

    // ===== What next =====
    { id: 'limits', ch: 'next', render: (s) => `
      ${head(s)}
      <div class="status"><span class="tag warn">${t('limits.status')}</span><p class="small">${t('limits.status.d')}</p></div>
      <div class="grid fill" style="grid-template-columns:repeat(3,1fr);gap:18px">
        ${[1, 2, 3, 4, 5, 6].map((i) => `
          <div class="panel soft stack" data-f="${i <= 3 ? 1 : 2}" style="gap:6px;padding:18px 22px">
            <h3>${t('limits.l' + i)}</h3>
            <p class="xs dim">${t('limits.l' + i + '.d')}</p>
          </div>`).join('')}
      </div>
      <div class="callout sm" data-f="3"><p>${t('limits.punch')}</p></div>` },

    { id: 'try', ch: 'next', dark: true, render: (s) => `
      ${mark(620).replace('class="mark"', 'class="mark slab-mark"')}
      <div class="row" style="justify-content:space-between">${eyebrow(s).replace('class="eyebrow"', 'class="eyebrow" style="color:var(--brand)"')}${logo(32)}</div>
      <h2 style="font-size:72px">${t('try.title')}</h2>
      <div class="trysteps fill">
        ${[1, 2, 3, 4].map((i) => `<div class="r"><span class="n">${i}</span><div class="stack" style="gap:2px"><b>${t('try.s' + i)}</b><code>${t('try.c' + i)}</code></div></div>`).join('')}
      </div>
      <p class="small dim" data-f="1">${t('try.feedback')}</p>` },

    // ===== Reference (not presented; the manual) =====
    { id: 'r-skills', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-skills.title')}</h2>
      <div class="xtable skl fill">
        <div class="th">${t('r-skills.skill')}</div><div class="th">${t('r-skills.when')}</div><div class="th">${t('r-skills.does')}</div><div class="th">${t('r-skills.start')}</div>
        ${SKILLS.map((k) => `
          <div><code>${P}${k}</code></div>
          <div class="dim">${t('r-skills.' + k + '.when')}</div>
          <div class="dim">${t('r-skills.' + k + '.does')}</div>
          <div class="xs ${k === 'setup' || k === 'release-notes' ? '' : 'faint'}">${t('r-skills.start.' + (k === 'setup' || k === 'release-notes' ? 'user' : 'both'))}</div>`).join('')}
      </div>
      <p class="xs faint">${t('r-skills.note')}</p>` },

    { id: 'r-settings', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-settings.title')}</h2>
      <div class="grid fill" style="grid-template-columns:1fr 1fr;gap:22px">
        <div class="stack" style="gap:10px">
          <div class="file" style="font-size:15px">
            <div class="fname"><span>docs/agents/documentation.md</span><span>${t('r-settings.file')}</span></div>
            <pre>${esc(t('r-settings.md'))}</pre>
          </div>
          <p class="xs dim">${t('r-settings.note')}</p>
        </div>
        <div class="stack" style="gap:6px">
          <span class="label">${t('r-settings.keys')}</span>
          <div class="srcs">${['code-paths', 'doc-paths', 'audiences', 'changelog', 'fragments-path', 'reference-command'].map((k) => `<code>${k}</code><span class="dim">${t('r-settings.k.' + k)}</span>`).join('')}</div>
        </div>
      </div>` },

    { id: 'r-types', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-types.title')}</h2>
      <div class="xtable typ fill">
        <div class="th">${t('r-types.type')}</div><div class="th">${t('r-types.audience')}</div><div class="th">${t('r-types.what')}</div><div class="th">${t('r-types.where')}</div>
        ${[['functional', 'docs/functional/'], ['architecture', 'docs/architecture/'], ['reference', 'docs/reference/'], ['runbook', 'docs/runbooks/'], ['userguide', 'docs/user/'], ['onboarding', 'docs/onboarding.md'], ['agentdocs', 'AGENTS.md / CLAUDE.md'], ['releasenotes', 'CHANGELOG.md · docs/user/release-notes.md']].map(([k, w]) => `
          <div><b>${t('type.' + k)}</b></div>
          <div class="dim">${t('r-types.' + k + '.aud')}</div>
          <div class="dim">${t('r-types.' + k)}</div>
          <div class="mono xs faint">${w}</div>`).join('')}
      </div>
      <p class="xs faint">${t('r-types.note')}</p>` },

    { id: 'r-design', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-design.title')}</h2>
      <div class="stack fill" style="gap:12px">
        ${[1, 2, 3, 4].map((i) => `
          <div class="panel" style="padding:12px 20px;gap:4px">
            <div class="row" style="gap:12px"><span class="tag">ADR 000${i}</span><b class="small">${t('r-design.a' + i)}</b></div>
            <p class="xs dim">${t('r-design.a' + i + '.d')}</p>
            <p class="xs faint">${t('r-design.a' + i + '.r')}</p>
          </div>`).join('')}
      </div>` },

    { id: 'gloss', ch: 'ref', render: (s) => {
      const ids = Object.keys(DECK.terms).sort((a, b) => plain(t('term.' + a + '.name')).localeCompare(plain(t('term.' + b + '.name'))));
      return `${eyebrow(s)}<h2 style="font-size:40px">${t('gloss.title')}</h2>
        <div class="gloss fill" style="grid-template-columns:repeat(3,1fr);gap:16px 32px">${ids.map((k) => `
          <div class="g"><b>${term(k)}</b><p>${t('term.' + k + '.def')}</p></div>`).join('')}</div>`;
    } },

    { id: 'sources', ch: 'ref', render: (s) => `
      ${head(s)}
      <div class="grid g2 fill">
        <div class="stack" style="gap:16px">
          ${[['github.com/pietercil/agent-plugins', 'https://github.com/pietercil/agent-plugins', 'src.repo'],
             ['GLOSSARY.md', 'https://github.com/pietercil/agent-plugins/blob/main/GLOSSARY.md', 'src.gloss'],
             ['docs/adr/', 'https://github.com/pietercil/agent-plugins/tree/main/docs/adr', 'src.adr'],
             ['plugins/ship-of-theseus/skills/', 'https://github.com/pietercil/agent-plugins/tree/main/plugins/ship-of-theseus/skills', 'src.skills'],
             ['code.claude.com/docs/en/hooks-guide', 'https://code.claude.com/docs/en/hooks-guide', 'src.hooks'],
             ['../mattpocock-skills/', '../mattpocock-skills/', 'src.matt']].map(([label, url, k]) => `
            <div class="stack" style="gap:2px"><a class="mono small" href="${url}" target="_blank" rel="noopener" style="color:var(--brand-ink)">${label}</a><p class="xs dim">${t(k)}</p></div>`).join('')}
          <p class="xs faint mt-auto">${t('src.version')}</p>
        </div>
        <div class="stack" style="gap:12px">
          <span class="label">${t('src.keys')}</span>
          <div class="cmds">${DECK.cmdButtons(['all', 'theme', 'overview', 'presenter', 'pdf', 'pdfnotes', ...DECK.scenarios.map((v) => 'scenario-' + v)])}</div>
          <p class="xs dim">${t('src.keysd')}</p>
        </div>
      </div>` },
  ];
})();
