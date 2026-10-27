// Terms that open an explanation dialog. Text lives in i18n under term.<id>.name / .def / .origin;
// in any i18n string, [[id]] or [[id|label]] turns into a clickable term.
// Sources: code.claude.com/docs (plugins, marketplaces, org) and claude.com/docs/plugins, checked 2026-10-26.
window.DECK = window.DECK || {};

// The two versions of the "one toolkit up close" slide; the first is the default.
DECK.scenarios = ['meeting', 'it'];

DECK.terms = {
  'agent':            {},
  'plugin':           { src: 'https://code.claude.com/docs/en/plugins', srcLabel: 'Claude Code docs · Plugins overview' },
  'marketplace':      { src: 'https://code.claude.com/docs/en/plugins/create-marketplace', srcLabel: 'Claude Code docs · Create a marketplace' },
  'skill':            { src: 'https://code.claude.com/docs/en/skills', srcLabel: 'Claude Code docs · Skills' },
  'command':          { src: 'https://claude.com/docs/plugins/overview', srcLabel: 'claude.com docs · Plugins' },
  'subagent':         { src: 'https://code.claude.com/docs/en/sub-agents', srcLabel: 'Claude Code docs · Subagents' },
  'mcp':              { src: 'https://modelcontextprotocol.io', srcLabel: 'modelcontextprotocol.io' },
  'hook':             { src: 'https://code.claude.com/docs/en/hooks-guide', srcLabel: 'Claude Code docs · Hooks' },
  'manifest':         { src: 'https://code.claude.com/docs/en/plugins/manifest-reference', srcLabel: 'Claude Code docs · Manifest reference' },
  'cowork':           { src: 'https://claude.com/docs/plugins/overview', srcLabel: 'claude.com docs · Plugins' },
  'claude-code':      { src: 'https://code.claude.com/docs', srcLabel: 'code.claude.com/docs' },
  'managed-settings': { src: 'https://code.claude.com/docs/en/plugins/org', srcLabel: 'Claude Code docs · Manage plugins for your organization' },
};
