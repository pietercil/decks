// Slide definitions. All visible text comes from i18n via t(); product names, commands and file names stay untranslated.
// The workshop metaphor runs through the deck: agent = craftsperson, plugin = toolkit for one trade (a domain),
// skill = tool, marketplace = the rack of toolkits.
(function () {
  const t = (k) => DECK.t(k);
  const { logo, mark, term, eyebrow, head, li } = DECK.h;
  DECK.id = 'agent-plugins';

  // ---------- chapters (minutes = time budget; the reference part is not presented) ----------
  DECK.chapters = [
    { id: 'why', min: 2 },
    { id: 'what', min: 3 },
    { id: 'how', min: 4 },
    { id: 'next', min: 1 },
    { id: 'ref', min: 0 },
  ];

  // What a plugin holds: workshop name ↔ real term (slide 4 and the first reference slide).
  // Commands are the older form of a skill; they appear only in the reference.
  const PARTS = ['skill', 'subagent', 'mcp', 'hook'];
  // Where each component works, per claude.com/docs/plugins/overview (checked 2026-10-26).
  const WHERE = { skill: 'Chat · Cowork · Code', command: 'Chat · Cowork · Code', subagent: 'Cowork · Code', mcp: 'Chat · Cowork · Code', hook: 'Cowork · Code' };

  // The switch on slide 6 runs the same command as the ☰ menu and the S key.
  const switcher = () => `
    <div class="switch" role="group" aria-label="${t('menu.scenario')}">
      ${DECK.scenarios.map((v) => `<button class="${DECK.scenario() === v ? 'on' : ''}" data-cmd="scenario-${v}">${t('cmd.scenario-' + v)}</button>`).join('')}
    </div>`;
  // Per scenario on slide 6: how many skills the toolkit holds, and the terms shown with steps 3 to 5.
  const EX = {
    meeting: { skills: 4, s3: ['skill'], s4: ['mcp'], s5: [] },
    it: { skills: 5, s3: ['skill', 'subagent'], s4: ['mcp'], s5: ['hook'] },
  };
  // Slide 7: the toolkits on the rack (each with its own colour and icon), and what each department takes.
  // Vergaderingen comes first everywhere, so the closing lines can run from rack to bench at fixed positions.
  const KITS = ['meeting', 'incident', 'onboarding', 'questions', 'reporting', 'knowledge'];
  const DEPTS = [
    { id: 'it', kits: ['meeting', 'incident', 'knowledge'] },
    { id: 'hr', kits: ['meeting', 'onboarding', 'knowledge'] },
    { id: 'support', kits: ['meeting', 'questions', 'knowledge'] },
    { id: 'finance', kits: ['meeting', 'reporting'] },
    { id: 'board', kits: ['meeting', 'reporting', 'incident'] },
  ];
  const ICON = {
    meeting: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    incident: '<path d="M12 3 22 20H2Z"/><path d="M12 10v4M12 17v.5"/>',
    onboarding: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7M19 8v6M16 11h6"/>',
    questions: '<path d="M4 4h16v12H10l-6 4Z"/><path d="M8 9h8M8 12h5"/>',
    reporting: '<path d="M3 20h18M6 20v-7M12 20V5M18 20v-4"/>',
    knowledge: '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2Z"/><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8Z"/>',
  };
  const icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
  // Closing lines: from the one Vergaderingen toolkit on the rack to its copy on each bench (px in a 1408-wide row).
  const LINKS = DEPTS.map((_, i) => `<line x1="125" y1="0" x2="${i * 286.4 + 43}" y2="64" pathLength="1"/>`).join('');
  // Slide 8: one toolkit (incident management) from an empty box to the rack. Tools per stage; '-' = removed, '+' = new.
  const BENCH1 = ['triage', 'timeline', 'cause', 'postmortem', '@ticketing'];
  const BENCH2 = ['triage', '-timeline', '+prioritise', 'cause', '+communicate', 'postmortem', '@ticketing', '+@logs', '+!nodata'];
  const LABEL = ['inspected', 'content', 'connections', 'source', 'version'];
  const tool = (x) => {
    const m = x.match(/^([+-]?)([@!]?)(.+)$/);
    const kind = m[2] === '@' ? 'conn' : m[2] === '!' ? 'check' : 'skill';
    const name = kind === 'skill' ? '/' + t('journey.t.' + m[3]) : t('journey.t.' + m[3]);
    return `<span class="tl ${kind}${m[1] === '+' ? ' new' : m[1] === '-' ? ' gone' : ''}">${name}${m[1] === '+' ? `<i>${t('journey.new')}</i>` : ''}</span>`;
  };
  const tags = (ids) => ids.map((id) => term(id, '', 'tag concept')).join('');

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
        ${['agent', 'plugin', 'marketplace'].map((k) => `<span class="tag" style="color:var(--brand);border-color:var(--brand)">${t('title.' + k)}</span>`).join('<span class="faint">·</span>')}
      </div>` },

    { id: 'craft', ch: 'why', render: (s) => `
      ${head(s)}
      <p class="lead">${t('craft.lead')}</p>
      <div class="grid g3 fill">
        ${[1, 2, 3].map((i) => `
          <div class="panel top fm" data-f="${i}">
            <span class="num">${i}</span>
            <h3>${t('craft.p' + i)}</h3>
            <p class="dim">${t('craft.p' + i + '.d')}</p>
          </div>`).join('')}
      </div>
      <div class="callout" data-f="4"><p>${t('craft.punch')}</p></div>` },

    // ===== What =====
    { id: 'plugin', ch: 'what', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1fr 1.1fr">
        <div class="stack" style="gap:22px">
          <p class="big-def">${t('plugin.def')}</p>
          <p class="dim">${t('plugin.hire')}</p>
        </div>
        <div class="stack" style="gap:16px">
          ${['without', 'with'].map((k, i) => `
            <div class="panel ${k === 'with' ? 'top' : 'soft'}" data-f="${i + 1}" style="gap:8px">
              <span class="label">${t('plugin.' + k)}</span>
              <ul class="clean small">${li([1, 2, 3].map((n) => 'plugin.' + k + n))}</ul>
            </div>`).join('')}
        </div>
      </div>
      <div class="callout sm" data-f="3"><p>${t('plugin.punch')}</p></div>` },

    { id: 'anatomy', ch: 'what', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1fr 1.05fr;gap:30px">
        <div class="file tree">
          <div class="fname"><span>${t('ex.meeting.plugin')}/</span><span>${t('kit.plugin')}</span></div>
          <pre>${t('anatomy.tree')}</pre>
        </div>
        <div class="stack" style="gap:12px">
          ${PARTS.map((id, i) => `
            <div class="part" data-f="${i + 1}">
              <div class="row" style="gap:12px"><span class="kname">${t('kit.' + id)}</span>${term(id, '', 'tag concept')}</div>
              <p class="small dim">${t('anatomy.' + id)}</p>
            </div>`).join('')}
        </div>
      </div>
      <div class="callout sm" data-f="5"><p>${t('anatomy.box')}</p></div>` },

    { id: 'market', ch: 'what', render: (s) => `
      ${head(s)}
      <div class="grid fill" style="grid-template-columns:1.02fr 1fr;gap:30px">
        <div class="stack" style="gap:12px">
          <div class="file" style="font-size:15.5px">
            <div class="fname"><span>ons-bedrijf/ons-rek · .claude-plugin/marketplace.json</span><span>${t('kit.marketplace')}</span></div>
            <pre>${t('market.json')}</pre>
          </div>
          <ul class="clean xs legend">${['n1', 'n2', 'n3'].map((k, i) => `<li><span class="n">${'①②③'[i]}</span>${t('market.' + k)}</li>`).join('')}</ul>
        </div>
        <div class="stack" style="gap:10px">
          ${[1, 2, 3].map((i) => `
            <div class="panel soft fact" data-f="${i}" style="gap:8px">
              <h3>${t('market.f' + i)}</h3>
              <p class="small dim">${t('market.f' + i + '.d')}</p>
            </div>`).join('')}
        </div>
      </div>` },

    // ===== How =====
    // Two versions, switched live: the meetings toolkit (default) or the incident toolkit (?scenario=it, S).
    { id: 'example', ch: 'how', perScenario: true, render: (s) => {
      const sc = DECK.scenario();
      const x = (k) => t('ex.' + sc + '.' + k);
      const n = Array.from({ length: EX[sc].skills }, (_, i) => i + 1);
      return `
      <div class="row" style="justify-content:space-between;align-items:flex-end">
        <div class="stack" style="gap:10px">${eyebrow(s)}<h2>${t('example.title')}</h2></div>
        ${switcher()}
      </div>
      <div class="grid fill" style="grid-template-columns:1.12fr 1fr;gap:34px">
        <div class="app">
          <div class="app-bar"><span class="dots"><i></i><i></i><i></i></span><span>Claude · Cowork</span></div>
          <div class="app-body">
            <div class="mbar" data-f="1">
              <span class="xs faint">${t('ex.mbar')} › ${t('ex.madd')} ›</span>
              <code>ons-bedrijf/${t('ex.market')}</code>
              <span class="added">✓ ${t('ex.mok')}</span>
            </div>
            <div class="pcard" data-f="2">
              <div class="row" style="gap:10px"><b class="mono">${x('plugin')}</b><span class="xs faint">${t('ex.from')} ${t('ex.market')}</span><span class="added">${t('ex.added')} ✓</span></div>
              <p class="xs dim">${x('pdesc')}</p>
              <p class="xs faint">${x('pparts')}</p>
            </div>
            <div class="chain" data-f="3">${n.map((i) => `<div class="lnk"><code>/${x('k' + i)}</code><span>${x('k' + i + '.d')}</span></div>`).join('')}</div>
            <div class="msg tools" data-f="4">${x('tools').split(' · ').map((tool) => `<span class="tool">✓ ${tool}</span>`).join('')}</div>
            <div class="msg out" data-f="5">
              <b>${x('out')}</b>
              <p class="xs">${x('outd')}</p>
              <p class="xs rule">${x('rule')}</p>
            </div>
          </div>
        </div>
        <div class="stack steps" style="gap:6px">
          ${[1, 2, 3, 4, 5].map((i) => `
            <div class="xstep" data-f="${i}">
              <span class="n">${i}</span>
              <div class="stack" style="gap:3px">
                <div class="row" style="gap:10px;align-items:baseline"><b>${t('ex.s' + i)}</b>${tags(i === 1 ? ['marketplace'] : i === 2 ? ['plugin'] : EX[sc]['s' + i])}</div>
                <p class="xs dim">${i <= 2 ? t('ex.s' + i + '.d') : x('d' + i)}</p>
                ${i === 1 ? `<p class="xs faint">${t('ex.cc')} <code>/plugin marketplace add ons-bedrijf/${t('ex.market')}</code></p>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`; } },

    { id: 'rack', ch: 'how', render: (s) => `
      ${head(s)}
      <div class="rackslide fill">
        <div class="rack">
          <span class="rack-tag mono">${t('ex.market')} · ${t('kit.marketplace').toLowerCase()}</span>
          ${KITS.map((k) => `
            <div class="kist k-${k} ${DEPTS.map((d, i) => (d.kits.includes(k) ? 'p' + (i + 1) : '')).join(' ')}">
              <div class="kbox">${icon(k)}</div>
              <h3>${t('kits.' + k)}</h3>
              <p class="xs dim">${t('kits.' + k + '.d')}</p>
            </div>`).join('')}
        </div>
        <svg class="links" viewBox="0 0 1408 64" preserveAspectRatio="none" aria-hidden="true">${LINKS}</svg>
        <div class="benches">
          ${DEPTS.map((d, i) => `
            <div class="bench b${i + 1}" data-f="${i + 1}">
              <div class="minis">${d.kits.map((k, j) => `<span class="mk k-${k}" style="--i:${j}" title="${t('kits.' + k)}">${icon(k)}</span>`).join('')}</div>
              <div class="top"></div>
              <b>${t('dept.' + d.id)}</b>
            </div>`).join('')}
        </div>
        <div class="callout sm finale" data-f="6"><p>${t('rack.punch')}</p></div>
      </div>` },

    { id: 'journey', ch: 'how', render: (s) => `
      ${head(s)}
      <div class="journey fill">
        <div class="st st0">
          <span class="label">${t('journey.h0')}</span>
          <div class="kvis"><div class="kbox empty k-incident">${icon('incident')}</div></div>
          <p class="xs dim">${t('journey.d0')}</p>
        </div>
        <div class="st" data-f="1">
          <span class="label">1 · ${t('journey.h1')}</span>
          <div class="kopen k-incident"><div class="lid"></div><div class="tools">${BENCH1.map(tool).join('')}</div></div>
          <p class="xs dim">${t('journey.d1')}</p>
        </div>
        <div class="st" data-f="2">
          <span class="label">2 · ${t('journey.h2')}</span>
          <div class="kopen k-incident"><div class="lid"></div><div class="tools">${BENCH2.map(tool).join('')}</div></div>
          <p class="xs dim">${t('journey.d2')}</p>
        </div>
        <div class="st" data-f="3">
          <span class="label">3 · ${t('journey.h3')}</span>
          <div class="itag">
            <div class="itag-head">${t('journey.tag')}</div>
            ${LABEL.map((k) => `<div class="tf"><span>${t('label.' + k)}</span><b>${t('journey.v.' + k)}</b></div>`).join('')}
          </div>
          <p class="xs dim">${t('journey.d3')}</p>
        </div>
        <div class="st" data-f="4">
          <span class="label">4 · ${t('journey.h4')}</span>
          <div class="minirack">
            ${['meeting', 'onboarding', 'incident', 'knowledge'].map((k) => `<span class="mk k-${k}${k === 'incident' ? ' here' : ''}">${icon(k)}</span>`).join('')}
          </div>
          <p class="ver mono">v1.0 · <span>↺ ${t('journey.rollback')}</span></p>
          <p class="xs dim">${t('journey.d4')}</p>
        </div>
      </div>
      <div class="callout sm" data-f="5"><p>${t('journey.punch')}</p></div>` },

    { id: 'settle', ch: 'next', dark: true, render: (s) => `
      ${mark(620).replace('class="mark"', 'class="mark slab-mark"')}
      <div class="row" style="justify-content:space-between">${eyebrow(s).replace('class="eyebrow"', 'class="eyebrow" style="color:var(--brand)"')}${logo(32)}</div>
      <h2 style="font-size:84px">${t('settle.title')}</h2>
      <div class="recap fill">
        ${['agent', 'plugin', 'marketplace'].map((k) => `<div class="r"><span>${t('settle.' + k)}</span><b>${t('settle.' + k + '.is')}</b></div>`).join('')}
      </div>
      <p class="small dim" data-f="1">${t('settle.door')}</p>` },

    // ===== Reference (not presented; the manual) =====
    { id: 'r-terms', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-terms.title')}</h2>
      <div class="xtable fill">
        <div class="th">${t('r-terms.workshop')}</div><div class="th">${t('r-terms.real')}</div><div class="th">${t('r-terms.what')}</div><div class="th">${t('r-terms.where')}</div>
        ${['agent', 'plugin', ...PARTS, 'command', 'manifest', 'marketplace'].map((id) => `
          <div><b>${t('kit.' + id)}</b></div>
          <div>${term(id)}</div>
          <div class="dim">${t('r-terms.' + id)}</div>
          <div class="mono xs faint">${WHERE[id] || ''}</div>`).join('')}
      </div>` },

    { id: 'r-files', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-files.title')}</h2>
      <div class="grid fill" style="grid-template-columns:.9fr 1.1fr;gap:22px">
        <div class="stack" style="gap:14px">
          <div class="file" style="font-size:15px">
            <div class="fname"><span>.claude-plugin/plugin.json</span><span>${t('kit.manifest')}</span></div>
            <pre>${t('r-files.manifest')}</pre>
          </div>
          <p class="xs dim">${t('r-files.note')}</p>
        </div>
        <div class="file" style="font-size:15px">
          <div class="fname"><span>skills/${t('ex.meeting.k2')}/SKILL.md</span><span>${t('kit.skill')}</span></div>
          <pre>${t('r-files.skill')}</pre>
        </div>
      </div>` },

    { id: 'r-market', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-market.title')}</h2>
      <div class="grid fill" style="grid-template-columns:.8fr 1.2fr;gap:22px">
        <div class="stack" style="gap:8px">
          <span class="label">${t('r-market.src')}</span>
          <div class="srcs">${['rel', 'github', 'subdir', 'url', 'npm', 'archive'].map((k) => `<code>${t('r-market.src.' + k)}</code><span class="dim">${t('r-market.src.' + k + '.d')}</span>`).join('')}</div>
          <p class="xs dim">${t('r-market.jsond')}</p>
        </div>
        <div class="stack" style="gap:10px">
          ${[['app', 3], ['org', 4], ['code', 4]].map(([k, n]) => `
            <div class="panel" style="padding:10px 16px;gap:4px">
              <span class="label">${t('r-market.' + k)}</span>
              <ul class="clean xs" style="gap:3px">${li(Array.from({ length: n }, (_, i) => 'r-market.' + k + (i + 1)))}</ul>
            </div>`).join('')}
        </div>
      </div>` },

    { id: 'r-public', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-public.title')}</h2>
      <div class="stack fill" style="gap:14px">
        ${[['anthropics/claude-plugins-official', 'https://github.com/anthropics/claude-plugins-official', 'official'],
           ['anthropics/knowledge-work-plugins', 'https://github.com/anthropics/knowledge-work-plugins', 'kw'],
           ['claude.com/marketplace', 'https://claude.com/marketplace', 'site'],
           ['mattpocock/skills', 'https://github.com/mattpocock/skills', 'matt']].map(([label, url, k]) => `
          <div class="panel" style="padding:14px 20px;gap:4px">
            <a class="mono" href="${url}" target="_blank" rel="noopener" style="color:var(--brand-ink);font-size:20px">${label} ↗</a>
            <p class="small dim">${t('r-public.' + k)}</p>
          </div>`).join('')}
      </div>
      <p class="xs faint">${t('r-public.asof')}</p>` },

    { id: 'r-gov', ch: 'ref', render: (s) => `
      ${eyebrow(s)}<h2 style="font-size:40px">${t('r-gov.title')}</h2>
      <div class="xtable gov fill">
        <div class="th">${t('r-gov.point')}</div><div class="th">${t('r-gov.app')}</div><div class="th">${t('r-gov.code')}</div>
        ${[['inspected', 'curate'], ['content', 'perms'], ['connections', 'data'], ['source', 'source'], ['version', 'versions']].map(([l, k]) => `
          <div><b>${t('label.' + l)}</b></div>
          <div class="dim">${t('r-gov.' + k + '.app')}</div>
          <div class="dim">${t('r-gov.' + k + '.code')}</div>`).join('')}
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
          ${[['code.claude.com/docs/en/plugins', 'https://code.claude.com/docs/en/plugins', 'src.cc'],
             ['claude.com/docs/plugins/overview', 'https://claude.com/docs/plugins/overview', 'src.app'],
             ['claude.com/docs/plugins/admin', 'https://claude.com/docs/plugins/admin', 'src.admin'],
             ['code.claude.com/docs/en/plugins/org', 'https://code.claude.com/docs/en/plugins/org', 'src.org'],
             ['code.claude.com/docs/en/plugins/create-marketplace', 'https://code.claude.com/docs/en/plugins/create-marketplace', 'src.mk'],
             ['code.claude.com/docs/en/plugins/host-marketplace', 'https://code.claude.com/docs/en/plugins/host-marketplace', 'src.host']].map(([label, url, k]) => `
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
