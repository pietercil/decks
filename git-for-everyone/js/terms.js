// Deck settings and the terms that open an explanation dialog. Text lives in i18n under term.<id>.name / .def / .origin;
// in any i18n string, [[id]] or [[id|label]] turns into a clickable term.
// Sources: the Pro Git book (git-scm.com), the Claude Code docs, the GitHub and Azure DevOps docs, read 2026-11-10.
window.DECK = window.DECK || {};
DECK.id = 'git-for-everyone';

// Two versions of the examples (the first is the default; S switches) and two platforms (G switches; ?platform=github).
DECK.scenarios = ['infra', 'policy'];
DECK.platforms = ['azure', 'github'];
DECK.defaultTheme = 'dark';

const BOOK = 'https://git-scm.com/book/en/v2/';
const book = (path, label) => ({ src: BOOK + path, srcLabel: 'Pro Git · ' + label });
const REMOTES = book('Git-Basics-Working-with-Remotes', 'Working with Remotes');

DECK.terms = {
  'repository':   book('Git-Basics-Getting-a-Git-Repository', 'Getting a Git Repository'),
  'commit':       book('Git-Basics-Recording-Changes-to-the-Repository', 'Recording Changes to the Repository'),
  'history':      book('Git-Basics-Viewing-the-Commit-History', 'Viewing the Commit History'),
  'revert':       book('Git-Basics-Undoing-Things', 'Undoing Things'),
  'branch':       book('Git-Branching-Branches-in-a-Nutshell', 'Branches in a Nutshell'),
  'main':         book('Git-Branching-Branches-in-a-Nutshell', 'Branches in a Nutshell'),
  'merge':        book('Git-Branching-Basic-Branching-and-Merging', 'Basic Branching and Merging'),
  'remote':       REMOTES,
  'clone':        REMOTES,
  'push':         REMOTES,
  'pull':         REMOTES,
  'pull-request': {
    src: () => (DECK.platform() === 'github'
      ? 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests'
      : 'https://learn.microsoft.com/en-us/azure/devops/repos/git/pull-requests'),
    srcLabel: () => (DECK.platform() === 'github' ? 'GitHub Docs · About pull requests' : 'Microsoft Learn · Pull requests'),
  },
  'claude-md':    { src: 'https://code.claude.com/docs/en/memory', srcLabel: 'Claude Code docs · Memory' },
};
