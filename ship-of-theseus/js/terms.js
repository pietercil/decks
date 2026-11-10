// Terms that open an explanation dialog. Text lives in i18n under term.<id>.name / .def / .origin;
// in any i18n string, [[id]] or [[id|label]] turns into a clickable term.
// Source: the agent-plugins repository (GLOSSARY.md, docs/adr/, plugins/ship-of-theseus), read 2026-11-10.
window.DECK = window.DECK || {};

// The two versions of the example slide; the first is the default.
DECK.scenarios = ['bugfix', 'start'];

const REPO = 'https://github.com/pietercil/agent-plugins/blob/main/';
const GLOSS = { src: REPO + 'GLOSSARY.md', srcLabel: 'agent-plugins · GLOSSARY.md' };

DECK.terms = {
  'living-doc':        GLOSS,
  'doc-drift':         GLOSS,
  'change':            GLOSS,
  'spec':              GLOSS,
  'distillation':      GLOSS,
  'change-fragment':   GLOSS,
  'adr':               { src: REPO + 'docs/adr/', srcLabel: 'agent-plugins · docs/adr/' },
  'matrix':            { src: REPO + 'plugins/ship-of-theseus/skills/setup/documentation.template.md', srcLabel: 'agent-plugins · documentation.template.md' },
  'stop-hook':         { src: 'https://code.claude.com/docs/en/hooks-guide', srcLabel: 'Claude Code docs · Hooks' },
  'agent-docs':        GLOSS,
  'issue-tracker':     { src: REPO + 'docs/adr/0003-plugin-is-issue-tracker-agnostic.md', srcLabel: 'agent-plugins · ADR 0003' },
  'mattpocock-skills': { src: REPO + 'docs/adr/0004-hard-dependency-on-mattpocock-skills.md', srcLabel: 'agent-plugins · ADR 0004' },
};
