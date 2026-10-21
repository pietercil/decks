// Slide definitions. All visible text comes from i18n via t(); skill names, commands and book titles stay untranslated.
(function () {
  const t = (k) => DECK.t(k);
  const { logo, mark, chip, chips, eyebrow, head, li, map, card } = DECK.h;
  DECK.id = 'mattpocock-skills';

  // ---------- chapters (minutes = time budget; the reference part is not presented) ----------
  DECK.chapters = [
    { id: 'why', min: 3 },
    { id: 'flow', min: 5 },
    { id: 'go', min: 2 },
    { id: 'ref', min: 0 },
  ];

  // Reference slides: one per stage, every skill as a printed card.
  const ref = (id, stage, ids, extra = () => '') => ({
    id, ch: 'ref', stage, cls: 'ref-slide', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t(id + '.title')}</h2>
      <div class="ref fill">${ids.map((k) => card(k, { compact: true })).join('')}${extra()}</div>` });

  DECK.slides = [
    // ===== Why =====
    { id: 'title', ch: 'why', stage: 'core', dark: true, render: () => `
      ${mark(620).replace('class="mark"', 'class="mark slab-mark"')}
      ${logo(44)}
      <div class="kicker" style="margin-top:110px">${t('title.kicker')}</div>
      <h1>Skills for<br>Real <em>Engineers</em></h1>
      <p class="lead" style="max-width:1000px">${t('title.sub')}</p>
      <div class="row mt-auto" style="gap:10px">
        ${DECK.stages.map((st) => `<span class="tag" style="color:var(--st-${st});border-color:var(--st-${st})">${t('stage.' + st)}</span>`).join('<span class="faint">›</span>')}
      </div>` },

    { id: 'why', ch: 'why', stage: 'core', render: (s) => `
      ${head(s)}
      <div class="grid g4 fill">
        ${[['grill-me', 'grill-with-docs'], ['domain-modeling'], ['tdd', 'diagnosing-bugs'], ['improve-codebase-architecture', 'codebase-design']].map((ids, i) => `
          <div class="panel top fm" data-f="${i + 1}">
            <span class="num">${i + 1}</span>
            <h3>${t('why.p' + (i + 1))}</h3>
            <p class="sym">${t('why.p' + (i + 1) + '.sym')}</p>
            <div class="fix"><span class="label">${t('why.fix')}</span><b>${t('why.p' + (i + 1) + '.fix')}</b><div class="row" style="gap:8px">${chips(ids, 'sm')}</div></div>
          </div>`).join('')}
      </div>
      <div class="callout" data-f="5"><p>${t('why.punch')}</p></div>` },

    { id: 'skill', ch: 'why', stage: 'core', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1.05fr 1fr">
        <div class="file" style="font-size:14px;line-height:1.4">
          <div class="fname"><span>skills/engineering/implement/SKILL.md</span><span>${t('skill.file')}</span></div>
          <pre><span class="c">---</span>
<span class="k">name</span>: <span class="s">implement</span>
<span class="k">description</span>: <span class="s">"Implement a piece of work based on a spec or set of tickets."</span>
<span class="k">disable-model-invocation</span>: <span class="s">true</span>
<span class="c">---</span>

Implement the work described by the user in the spec or tickets.

Call the Skill tool with "<span class="k">tdd</span>" where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, call the Skill tool with "<span class="k">code-review</span>" to review the work.

Commit your work to the current branch.</pre>
        </div>
        <div class="stack" style="gap:16px">
          <div class="panel" data-f="1" style="padding:18px 22px;gap:8px"><span class="tag user" style="align-self:flex-start">${t('modal.user')}</span><p class="small">${t('skill.user')}</p></div>
          <div class="panel" data-f="2" style="padding:18px 22px;gap:8px"><span class="tag model" style="align-self:flex-start">${t('modal.model')}</span><p class="small">${t('skill.model')}</p></div>
          <div class="callout sm" data-f="3"><p>${t('skill.rule')}</p></div>
        </div>
      </div>
      <div class="grid g3" data-f="4" style="gap:16px">
        ${[['The Pragmatic Programmer', 'Hunt &amp; Thomas', 'tracer bullets', 'to-tickets'],
           ['Domain-Driven Design', 'Eric Evans', 'ubiquitous language', 'domain-modeling'],
           ['A Philosophy of Software Design', 'John Ousterhout', 'deep modules', 'codebase-design']].map(([b, by, idea, id]) => `
          <div class="panel soft" style="padding:14px 18px;gap:6px;flex-direction:row;align-items:center;justify-content:space-between">
            <div><b style="font-size:19px">${b}</b><div class="xs dim">${by} · <i>${idea}</i></div></div>${chip(id, 'sm')}
          </div>`).join('')}
      </div>` },

    // ===== The flow =====
    { id: 'map', ch: 'flow', stage: 'core', render: (s) => `
      ${head(s)}
      <div class="fill stack" style="gap:12px">${map()}</div>
      <p class="xs faint">${t('map.hint')}</p>` },

    { id: 'grill', ch: 'flow', stage: 'analysis', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1fr 1fr">
        <div class="stack" style="gap:16px">
          <p class="dim">${t('grill.how')}</p>
          <div class="panel top" style="--c:var(--st-analysis);padding:18px 22px;gap:10px">${chip('grill-me', 'big')}<p>${t('grill.me')}</p></div>
          <div class="panel top" style="--c:var(--st-analysis);padding:18px 22px;gap:10px">${chip('grill-with-docs', 'big')}<p>${t('grill.docs')}</p></div>
        </div>
        <div class="stack" style="gap:16px">
          <div class="panel soft" data-f="1" style="gap:10px">
            <div class="row" style="justify-content:space-between"><span class="label">GLOSSARY.md</span><span class="tag concept">ubiquitous language</span></div>
            <p class="small"><span class="faint">${t('grill.before')}</span> ${t('grill.b')}</p>
            <p class="small"><span class="faint">${t('grill.after')}</span> <b>${t('grill.a')}</b></p>
            <p class="xs dim">${t('grill.gain')}</p>
          </div>
          <div class="panel" data-f="2" style="gap:8px">
            <span class="label">${t('grill.rule')}</span>
            <ul class="clean small">${li(['grill.r1', 'grill.r2', 'grill.r3'])}</ul>
          </div>
        </div>
      </div>` },

    { id: 'fog', ch: 'flow', stage: 'analysis', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:.9fr 1.1fr">
        <div class="stack" style="gap:14px">
          <p class="dim small">${t('fog.what')}</p>
          <div class="file" style="font-size:16px">
            <div class="fname"><span>issue · <span class="k">wayfinder:map</span></span><span>${t('fog.mapnote')}</span></div>
            <pre><span class="k">## Destination</span>
<span class="c">${t('fog.dest')}</span>
<span class="k">## Decisions so far</span>
<span class="c">${t('fog.dec')}</span>
<span class="k">## Not yet specified</span>
<span class="c">${t('fog.nys')}</span>
<span class="k">## Out of scope</span></pre>
          </div>
          <div class="callout sm" style="--c:var(--st-analysis)"><p>${t('fog.plan')}</p></div>
        </div>
        <div class="stack" style="gap:10px">
          <span class="label">${t('fog.who')}</span>
          ${[['research', 'AFK', ['research']], ['prototype', 'HITL', ['prototype']], ['grilling', 'HITL', ['grilling', 'domain-modeling']], ['task', 'AFK · HITL', ['wizard']]].map(([type, mode, ids], i) => `
            <div class="panel" data-f="${i + 1}" style="padding:12px 18px;gap:4px;--c:var(--st-shaping)">
              <div class="row" style="gap:10px"><span class="tag" style="color:var(--st-shaping);border-color:var(--st-shaping)">wayfinder:${type}</span><span class="tag">${mode}</span><span style="margin-left:auto" class="row">${chips(ids, 'sm')}</span></div>
              <p class="xs dim">${t('fog.t.' + type)}</p>
            </div>`).join('')}
          <div class="panel soft" data-f="5" style="padding:12px 18px;gap:4px">
            <div class="row" style="gap:10px"><b class="small">${t('fog.q')}</b><span style="margin-left:auto">${chip('to-questionnaire', 'sm')}</span></div>
            <p class="xs dim">${t('fog.qd')}</p>
          </div>
          <p class="xs faint">${t('fog.modes')}</p>
        </div>
      </div>` },

    { id: 'build', ch: 'flow', stage: 'planning', bar: ['planning', 'development'], render: (s) => `
      ${head(s)}
      <div class="flow">
        <div class="step" style="--c:var(--st-planning)">${chip('to-spec', 'big')}<p>${t('build.spec')}</p></div>
        <div class="step" style="--c:var(--st-planning)">${chip('to-tickets', 'big')}<p>${t('build.tickets')}</p><span class="tag concept" style="align-self:flex-start">tracer bullets</span></div>
        <div class="step" style="--c:var(--st-development);flex:1.5">
          <span class="label">${t('build.two')}</span>
          <div class="row" style="gap:10px">${chip('implement')}<span class="xs dim">${t('build.impl')}</span></div>
          <div class="row" style="gap:10px">${chip('implement-spec')}<span class="xs dim">${t('build.implspec')}</span></div>
        </div>
      </div>
      <div class="grid g3" data-f="1">
        ${[['tdd', 'build.tdd'], ['code-review', 'build.cr'], ['pr', 'build.pr']].map(([id, k]) => `
          <div class="panel top" style="--c:var(--st-development);padding:18px 22px;gap:10px">${chip(id)}<p class="dim">${t(k)}</p></div>`).join('')}
      </div>
      <div class="callout sm mt-auto" data-f="2" style="--c:var(--st-planning)"><p>${t('build.hygiene')}</p></div>` },

    { id: 'keep', ch: 'flow', stage: 'maintenance', render: (s) => `
      ${head(s)}
      <div class="grid g3 fill">
        ${[['triage', 'keep.triage', 'keep.triage.d'], ['diagnosing-bugs', 'keep.bugs', 'keep.bugs.d'], ['improve-codebase-architecture', 'keep.arch', 'keep.arch.d']].map(([id, k, d], i) => `
          <div class="panel top" data-f="${i}" style="--c:var(--st-maintenance)">
            <span class="label" style="color:var(--st-maintenance)">${t(k)}</span>
            ${chip(id)}
            <p class="dim">${t(d)}</p>
            ${id === 'improve-codebase-architecture' ? '<span class="tag concept mt-auto" style="align-self:flex-start">deep modules</span>' : ''}
          </div>`).join('')}
      </div>
      <div class="callout sm" data-f="3" style="--c:var(--st-maintenance)">${chip('retro', 'sm')}<p>${t('keep.retro')}</p></div>` },

    // ===== Get going =====
    { id: 'cheat', ch: 'go', stage: 'core', render: (s) => `
      ${head(s)}
      <div class="dt fill">
        ${[[1, ['ask-matt']], [2, ['grill-me']], [3, ['grill-with-docs']], [7, ['wayfinder']], [4, ['prototype']], [5, ['research']], [6, ['to-questionnaire']],
           [8, ['to-spec', 'to-tickets']], [9, ['implement', 'implement-spec']], [10, ['triage']], [11, ['diagnosing-bugs']], [12, ['improve-codebase-architecture']]]
          .map(([q, ids]) => `<div class="q">${t('cheat.q' + q)}</div><div class="a">${chips(ids)}</div>`).join('')}
      </div>
      <div class="row" style="gap:10px"><span class="label" style="margin-right:6px">${t('map.hand')}</span>
        ${['handoff', 'wait-what', 'retro', 'teach', 'pr'].map((id) => `${chip(id, 'sm')}<span class="xs dim" style="margin-right:10px">${t('cheat.h.' + id)}</span>`).join('')}
      </div>` },

    { id: 'go', ch: 'go', stage: 'core', dark: true, render: (s) => `
      ${mark(620).replace('class="mark"', 'class="mark slab-mark"')}
      <div class="row" style="justify-content:space-between">${eyebrow(s).replace('class="eyebrow"', 'class="eyebrow" style="color:var(--brand)"')}${logo(32)}</div>
      <h2>${t('go.title')}</h2>
      <div class="grid g2 fill" style="gap:40px">
        <div class="stack" style="gap:26px">
          <div class="stack" style="gap:6px"><span class="label">1 · ${t('go.install')}</span>
            <div class="file" style="background:#111"><pre>claude plugins install mattpocock-skills</pre></div>
            <p class="small dim">${t('go.or')} <code>npx skills@latest add mattpocock/skills</code> ${t('go.ord')}</p></div>
          <div class="stack" style="gap:6px"><span class="label">2 · ${t('go.setup')}</span>
            <div class="row">${chip('setup-matt-pocock-skills')}</div><p class="small dim">${t('go.setupd')}</p></div>
          <div class="stack" style="gap:6px"><span class="label">3 · ${t('go.ask')}</span>
            <div class="row">${chip('ask-matt')}</div><p class="small dim">${t('go.askd')}</p></div>
        </div>
        <div class="stack" data-f="1" style="gap:16px">
          <span class="kicker">${t('go.live')}</span>
          <div class="stack" style="gap:10px">
            ${['grill-with-docs', 'to-spec', 'to-tickets', 'implement'].map((id, i) => `<div class="row" style="gap:16px"><span class="faint" style="width:22px;font-weight:800">${i + 1}</span>${chip(id, 'big')}</div>`).join('')}
            <div class="row" style="gap:16px;padding-left:38px"><span class="dim small">${t('go.inside')}</span>${chips(['tdd', 'code-review'])}</div>
          </div>
          <p class="small dim mt-auto">${t('go.ref')}</p>
        </div>
      </div>` },

    // ===== Reference (not presented; the manual) =====
    ref('r-analysis', 'analysis', ['grill-with-docs', 'grill-me', 'wayfinder', 'grilling', 'domain-modeling']),
    ref('r-shaping', 'shaping', ['research', 'prototype', 'to-questionnaire', 'wizard']),
    ref('r-planning', 'planning', ['to-spec', 'to-tickets'], () => `
      <div class="panel soft" style="grid-column:span 1;gap:8px;padding:16px 18px">
        <span class="label">${t('r-planning.ctx')}</span>
        <p class="xs">${t('r-planning.ctxd')}</p>
      </div>
      <div class="panel soft" style="grid-column:1 / -1;gap:8px;padding:16px 18px">
        <span class="label">${t('r-planning.pb')}</span>
        <div class="grid" style="grid-template-columns:repeat(5,1fr);gap:14px">
          ${['continue', 'clear', 'handoff', 'subagent', 'compact'].map((k) => `<div><b class="mono" style="font-size:16px">${t('pb.' + k)}</b><p class="xs dim" style="font-size:14.5px">${t('pb.' + k + '.d')}</p></div>`).join('')}
        </div>
      </div>`),
    ref('r-development', 'development', ['implement', 'implement-spec', 'tdd', 'code-review', 'pr', 'codebase-design']),
    ref('r-maintenance', 'maintenance', ['triage', 'diagnosing-bugs', 'improve-codebase-architecture', 'retro']),
    ref('r-hand', 'core', ['setup-matt-pocock-skills', 'ask-matt', 'handoff', 'wait-what', 'teach', 'writing-for-agents']),

    { id: 'sources', ch: 'ref', stage: 'core', render: (s) => `
      ${head(s)}
      <div class="grid g2 fill">
        <div class="stack" style="gap:18px">
          ${[['github.com/mattpocock/skills', 'https://github.com/mattpocock/skills', 'src.repo'],
             ['aihero.dev/skills', 'https://www.aihero.dev/skills', 'src.site'],
             ['The Pragmatic Engineer · Matt Pocock', 'https://www.youtube.com/watch?v=4DhcSPkEbwI', 'src.talk']].map(([label, url, k]) => `
            <div class="stack" style="gap:4px"><a class="mono" href="${url}" target="_blank" rel="noopener" style="color:var(--brand-ink)">${label}</a><p class="small dim">${t(k)}</p></div>`).join('')}
          <p class="small faint mt-auto">${t('src.version')}</p>
        </div>
        <div class="stack" style="gap:12px">
          <span class="label">${t('src.books')}</span>
          ${[['The Pragmatic Programmer', 'David Thomas &amp; Andrew Hunt'], ['Domain-Driven Design', 'Eric Evans'], ['A Philosophy of Software Design', 'John Ousterhout'], ['Extreme Programming Explained', 'Kent Beck']].map(([b, by]) => `<p><b>${b}</b> <span class="dim">· ${by}</span></p>`).join('')}
          <span class="label" style="margin-top:14px">${t('src.keys')}</span>
          <div class="cmds">${DECK.cmdButtons(['all', 'theme', 'overview', 'presenter', 'pdf', 'pdfnotes'])}</div>
          <p class="xs dim">${t('src.keysd')}</p>
        </div>
      </div>` },
  ];
})();
