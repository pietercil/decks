// Skill data model. Text lives in i18n under sk.<id>.purpose / .when / .out
// Source: github.com/mattpocock/skills v1.3.1 (README.md, ask-matt, skills/*/SKILL.md): engineering + productivity.
window.DECK = window.DECK || {};

DECK.stages = ['analysis', 'shaping', 'planning', 'development', 'maintenance'];

// invoker: 'user' = only when you type it; 'model' = you, or the agent when the task fits.
// uses = skills it calls; to = where the flow usually goes next.
DECK.skills = {
  // Analysis: sharpen the idea
  'grill-with-docs':  { stage: 'analysis', invoker: 'user', uses: ['grilling', 'domain-modeling'], to: ['to-spec', 'prototype', 'implement'] },
  'grill-me':         { stage: 'analysis', invoker: 'user', uses: ['grilling'], to: [] },
  'grilling':         { stage: 'analysis', invoker: 'model', uses: [], to: [] },
  'domain-modeling':  { stage: 'analysis', invoker: 'model', uses: [], to: [] },
  // Shaping: answer what a conversation alone can't
  'wayfinder':        { stage: 'shaping', invoker: 'user', uses: ['research', 'prototype', 'grilling', 'domain-modeling'], to: ['to-spec'] },
  'research':         { stage: 'shaping', invoker: 'model', uses: [], to: ['grill-with-docs'] },
  'prototype':        { stage: 'shaping', invoker: 'model', uses: [], to: ['handoff', 'grill-with-docs'] },
  'to-questionnaire': { stage: 'shaping', invoker: 'user', uses: [], to: ['grill-with-docs', 'to-spec'] },
  'wizard':           { stage: 'shaping', invoker: 'model', uses: [], to: [] },
  // Planning
  'to-spec':          { stage: 'planning', invoker: 'user', uses: [], to: ['to-tickets'] },
  'to-tickets':       { stage: 'planning', invoker: 'user', uses: [], to: ['implement', 'implement-spec'] },
  // Development
  'implement':        { stage: 'development', invoker: 'user', uses: ['tdd', 'code-review'], to: [] },
  'implement-spec':   { stage: 'development', invoker: 'user', uses: ['tdd', 'code-review'], to: [] },
  'tdd':              { stage: 'development', invoker: 'model', uses: ['codebase-design'], to: [] },
  'code-review':      { stage: 'development', invoker: 'model', uses: [], to: [] },
  'pr':               { stage: 'development', invoker: 'model', uses: [], to: [] },
  'codebase-design':  { stage: 'development', invoker: 'model', uses: [], to: [] },
  // Maintenance
  'triage':           { stage: 'maintenance', invoker: 'user', uses: ['grilling'], to: ['implement'] },
  'diagnosing-bugs':  { stage: 'maintenance', invoker: 'model', uses: [], to: ['retro', 'improve-codebase-architecture'] },
  'improve-codebase-architecture': { stage: 'maintenance', invoker: 'user', uses: ['grilling', 'codebase-design'], to: ['grill-with-docs'] },
  'retro':            { stage: 'maintenance', invoker: 'user', uses: [], to: [] },
  // Always at hand
  'setup-matt-pocock-skills': { stage: 'core', invoker: 'user', uses: [], to: [] },
  'ask-matt':         { stage: 'core', invoker: 'user', uses: [], to: [] },
  'handoff':          { stage: 'core', invoker: 'user', uses: [], to: [] },
  'wait-what':        { stage: 'core', invoker: 'user', uses: [], to: [] },
  'teach':            { stage: 'core', invoker: 'user', uses: [], to: [] },
  'writing-for-agents': { stage: 'core', invoker: 'model', uses: [], to: [] },
};

// Columns of the lifecycle map (order inside a column = order of use)
DECK.mapCols = {
  analysis:    ['grill-with-docs', 'grill-me'],
  shaping:     ['wayfinder', 'research', 'prototype', 'to-questionnaire', 'wizard'],
  planning:    ['to-spec', 'to-tickets'],
  development: ['implement', 'implement-spec', 'tdd', 'code-review', 'pr'],
  maintenance: ['triage', 'diagnosing-bugs', 'improve-codebase-architecture', 'retro'],
};
DECK.mapUnder = {
  vocab: ['grilling', 'domain-modeling', 'codebase-design'],
  hand:  ['setup-matt-pocock-skills', 'ask-matt', 'handoff', 'wait-what', 'teach', 'writing-for-agents'],
};
