/**
 * ACCOUNT JOURNEY USE CASE CONFIG
 * Mid-Funnel Account Journey & Marketing Influence
 *
 * To create a new use case: copy this file, rename it,
 * replace all values, then update the engine's <script src="..."> to load it.
 */

const DEMO_CONFIG = {

  // ─── META ────────────────────────────────────────────────────────────────────
  useCase: 'journey',
  pageTitle: 'Petavue — Account Journey Demo',

  // ─── URLS ────────────────────────────────────────────────────────────────────
  urls: {
    home:        'app.petavue.com/workbook',
    plan:        'app.petavue.com/workbook/plan',
    planV2:      'app.petavue.com/workbook/plan?v=2',
    analysis:    'app.petavue.com/workbook/run',
    chart:       'app.petavue.com/workbook/chart',
    memo:        'app.petavue.com/workbook/memo',
    definitions: 'app.petavue.com/workbook/definitions',
    dashboard:   'app.petavue.com/dashboard',
    workflows:   'app.petavue.com/workflows',
    slack:       'app.slack.com/client/T0ACME/C0MKTOPS',
  },

  // ─── SCENE LABELS ────────────────────────────────────────────────────────────
  labels: {
    s1:           'Type your analysis prompt',
    s2Generating: 'Generating plan for your analysis…',
    s2Ready:      'Plan adapted to your data model',
    s2Refine:     'Refine the plan',
    s2b:          'Plan v2 — winning touch pattern comparison added',
    s3:           'Running account journey analysis across open pipeline',
    s4Create:     'Create chart from analysis',
    s4Loading:    'Creating chart…',
    s4Ready:      'Chart ready — add to dashboard',
    s4Modal:      'Add chart to dashboard',
    s4bSelect:    'Select Create Memo from dropdown',
    s4bLoading:   'Creating memo…',
    s4bReady:     'Memo ready — reviewing…',
    s4bDash:      'Memo ready — add to dashboard',
    s4bModal:     'Add memo to dashboard',
    s4cSelect:    'Select Create Definition from dropdown',
    s4cLoading:   'Creating definitions…',
    s4cReady:     'Review and save metric definitions',
    s5:           'Account Journey Dashboard — live verified metrics',
    s6First:      'Ask Sage what marketing should do for open deals',
    s6Second:     'Sage explains the winning touch pattern',
    s7:           'Create weekly account journey review → Slack',
    s8:           'Sage posts weekly account influence actions',
    s8Context:    'Marketing adds context — Sage remembers it',
    s8End:        'Influence · Intervene · Close — every week',
  },

  // ─── S1: HOME ────────────────────────────────────────────────────────────────
  home: {
    prompt: 'For all open Enterprise opportunities in Stage 3 and above, map the marketing touchpoints that have occurred at each stage and compare them against the touchpoint patterns in our historical closed-won deals — then recommend what marketing actions should happen right now for each at-risk account',
  },

  // ─── S2: PLAN ────────────────────────────────────────────────────────────────
  plan: {
    title:   'Account Journey & Marketing Influence Analysis',
    version: 'Plan 1 · v1',
    steps: [
      'Pull all open Enterprise opportunities in Stage 3+ — map every marketing touchpoint that has occurred to date per account',
      'Retrieve historical closed-won deal journeys for Enterprise accounts — identify the touchpoint patterns that appear in winning deals at each stage',
      'Compare each open deal\'s current touchpoint pattern against the winning pattern for its stage and segment',
      'Identify marketing coverage gaps and recommend specific actions for each account to increase closing probability',
    ],

    stepDetails: [
      {
        reqs: [
          'Query ~tbl:Opportunities~ — Stage 3+, ~col:Segment~ = Enterprise, ~col:IsClosed~ = false',
          'Join ~tbl:MarketingTouchpoints~ on ~col:AccountId~ — pull all touches per account',
          'Include ~col:TouchType~, ~col:Channel~, ~col:TouchDate~, ~col:ContentAsset~ per touchpoint',
          'Compute ~col:DaysSinceLastTouch~ per account as of today'
        ],
        tables: ['Opportunities', 'MarketingTouchpoints', 'Accounts']
      },
      {
        reqs: [
          'Pull closed-won Enterprise opportunities from last 18 months from ~tbl:Opportunities~',
          'Join ~tbl:MarketingTouchpoints~ on ~col:AccountId~ — extract touchpoint sequence per won deal',
          'Identify the 5 most common touchpoint patterns in deals that closed at Stage 3 and Stage 4',
          'Compute ~col:WinPatternCoverageScore~ = % of win-pattern touches present per open deal'
        ],
        tables: ['Opportunities', 'MarketingTouchpoints']
      },
      {
        reqs: [
          'Compare each open deal touchpoint sequence to the winning pattern',
          'Flag missing ~col:ContentAsset~ types (case study, ROI calc, reference call) vs win pattern',
          'Score each account on ~col:WinPatternCoverage~ (0–100%) — flag accounts below 50% as loss-risk',
          'Cross-reference ~col:DaysSinceLastTouch~ — accounts with 20+ days no touch flagged critical'
        ],
        tables: ['MarketingTouchpoints', 'Opportunities', 'Accounts']
      },
      {
        reqs: [
          'Rank accounts by loss-risk: ~col:WinPatternCoverage~ ascending × ~col:DaysSinceLastTouch~ descending',
          'Match each gap to a specific action: missing case study → schedule, missing ROI calc → send asset',
          'Pull ~col:OwnerId~ from ~tbl:Opportunities~ — assign action to rep or marketing',
          'Output weekly action list: account, stage, gap, recommended touch, owner, deadline'
        ],
        tables: ['Opportunities', 'MarketingTouchpoints', 'Accounts', 'Users']
      }
    ],
    refineText: 'Also compare against closed-lost journeys — I want to know which touchpoint gaps correlate with losses, not just which patterns appear in wins',
  },

  // ─── S2b: PLAN V2 ────────────────────────────────────────────────────────────
  planV2: {
    diffLabel:  'Added closed-lost comparison · Gap-to-loss signals included',
    addedSteps: [
      'Cross-reference open deal touchpoint gaps against closed-lost deal patterns — surface gaps that are predictive of loss, not just absent from wins',
    ],
  },

  // ─── S3: ANALYSIS ────────────────────────────────────────────────────────────
  analysis: {
    title: 'Account Journey Analysis — Stage 3+ Enterprise Pipeline',
    // Step 1 & 2 output table data
    step1Headers: ['#', 'Account', 'Stage', 'Owner', 'Last Touch', 'Days Since Touch'],
    step1Rows: [
      ['1', 'Acme Corp',       'Stage 3', 'J. Rivera',  'Email — Nurture',    '18 days'],
      ['2', 'GlobalTech Inc.', 'Stage 4', 'S. Park',    'Webinar — Q3 demo',  '3 days'],
      ['3', 'Nexus Systems',   'Stage 3', 'A. Chen',    'No recent touch',    '31 days'],
      ['4', 'Apex Financial',  'Stage 3', 'M. Torres',  'LinkedIn ABM',       '7 days'],
      ['5', 'VertaCo',         'Stage 4', 'L. Johnson', 'Case Study share',   '1 day'],
    ],
    step1Count: '47',
    step2Headers: ['#', 'Account', 'Win-Pattern Coverage', 'Missing Touches', 'Loss-Risk Signal', 'Priority'],
    step2Rows: [
      ['1', 'Acme Corp',       '45%', 'Case study, ROI calc', '⚠ Matches 4 recent losses', '🔴 High'],
      ['2', 'GlobalTech Inc.', '80%', 'ROI calculator',       '→ None detected',            '🟡 Medium'],
      ['3', 'Nexus Systems',   '20%', '31-day gap — all',     '⚠ Champion disengagement',  '🔴 High'],
      ['4', 'Apex Financial',  '65%', 'Peer reference call',  '→ None detected',            '🟡 Medium'],
      ['5', 'VertaCo',         '92%', 'On track',             '✓ Matches win pattern',      '✓ Good'],
    ],
    step2Count: '47',
    attributionTable: {
      headers: ['#', 'Account', 'Stage', 'Days in Stage', 'Last Marketing Touch', 'Gap vs Win Pattern'],
      rows: [
        { channel: 'Acme Corp',       linear: 'Stage 3', decay: '22 days', delta: '18 days ago · Email',    deltaDir: 'down' },
        { channel: 'GlobalTech Inc.', linear: 'Stage 4', decay: '8 days',  delta: '3 days ago · Webinar',   deltaDir: 'up'   },
        { channel: 'Nexus Systems',   linear: 'Stage 3', decay: '31 days', delta: '31 days ago · none',     deltaDir: 'down' },
        { channel: 'Apex Financial',  linear: 'Stage 3', decay: '14 days', delta: '7 days ago · LinkedIn',  deltaDir: 'flat' },
        { channel: 'VertaCo',         linear: 'Stage 4', decay: '5 days',  delta: 'Yesterday · Case Study', deltaDir: 'up'   },
      ],
    },
    roiTable: {
      headers: ['#', 'Account', 'Missing Win-Pattern Touch', 'Loss-Risk Signal', 'Recommended Action', 'Priority'],
      rows: [
        { channel: 'Acme Corp',       rev: 'Deployment case study', cost: '⚠ Similar to 4 recent losses', roi: 'Send case study + LinkedIn', delta: '🔴 High',  deltaDir: 'down' },
        { channel: 'GlobalTech Inc.', rev: 'ROI calculator',         cost: '→ None detected',              roi: 'Share ROI calc this week',   delta: '🟡 Medium', deltaDir: 'flat' },
        { channel: 'Nexus Systems',   rev: 'Any touch — 31d gap',    cost: '⚠ Champion disengagement',    roi: 'Executive outreach + event', delta: '🔴 High',  deltaDir: 'down' },
        { channel: 'Apex Financial',  rev: 'Peer reference call',     cost: '→ None detected',              roi: 'Schedule reference call',    delta: '🟡 Medium', deltaDir: 'flat' },
        { channel: 'VertaCo',         rev: 'On track',                cost: '✓ Matches win pattern',       roi: 'Maintain current cadence',   delta: '✓ Good',   deltaDir: 'up'   },
      ],
    },
  },

  // ─── S4: CHART ───────────────────────────────────────────────────────────────
  chart: {
    promptText: 'Create a heatmap-style chart showing marketing touch coverage for each open deal compared to the winning touch pattern — use green for touches that match the winning pattern, amber for gaps, and red for gaps that also appear in closed-lost deals.',
    promptStatic: 'Heatmap: marketing touch coverage vs. winning pattern per open deal — green for matches, amber for gaps, red for loss-risk gaps.',
    title:   'Marketing Touch Coverage vs. Winning Pattern',
    legend:  ['Matches win pattern', 'Gap vs win pattern'],
    channels: [
      { label: 'Acme Corp',       linearW: 45, linearVal: '45% coverage', decayW: 100, decayVal: '100% target', delta: '⚠ Gap', deltaDir: 'down' },
      { label: 'GlobalTech Inc.', linearW: 80, linearVal: '80% coverage', decayW: 100, decayVal: '100% target', delta: '→ Close', deltaDir: 'flat' },
      { label: 'Nexus Systems',   linearW: 20, linearVal: '20% coverage', decayW: 100, decayVal: '100% target', delta: '⚠ Risk', deltaDir: 'down' },
      { label: 'Apex Financial',  linearW: 65, linearVal: '65% coverage', decayW: 100, decayVal: '100% target', delta: '→ Gap',  deltaDir: 'flat' },
      { label: 'VertaCo',         linearW: 95, linearVal: '95% coverage', decayW: 100, decayVal: '100% target', delta: '✓ Good', deltaDir: 'up'   },
    ],
    modal: {
      widgetTitle: 'Marketing Touch Coverage vs. Win Pattern',
      widgetDesc:  'Shows how closely each open Enterprise deal\'s marketing touchpoint history matches the patterns seen in historical closed-won deals at the same stage — identifies specific gaps and loss-risk signals.',
      dashboard:   'Account Journey Dashboard',
    },
  },

  // ─── S4b: MEMO ───────────────────────────────────────────────────────────────
  memo: {
    promptText: 'Write a concise marketing action memo for the Enterprise pipeline — summarise the touch coverage gaps, the 2 highest-risk accounts, and specific recommended actions for each open deal this week.',
    cardTitle:  'Enterprise Pipeline — Marketing Action Plan',
    title:      'Enterprise Pipeline Marketing Influence — Action Memo',
    date:       'Feb 26, 2026',
    segment:    'Enterprise · Stage 3+ Open Pipeline',
    overview:   'This memo summarises marketing influence gaps across 5 open Enterprise opportunities in Stage 3 and above. Two accounts — Acme Corp and Nexus Systems — show critical touch coverage gaps that match patterns in recent closed-lost deals. Three recommended marketing actions can be taken this week with high expected impact on closing probability.',
    highlights: [
      { channel: 'Acme Corp',       linear: 'Stage 3 · 22 days', decay: '45% win coverage', roi: '🔴 High risk' },
      { channel: 'Nexus Systems',   linear: 'Stage 3 · 31 days', decay: '20% win coverage', roi: '🔴 High risk' },
      { channel: 'GlobalTech Inc.', linear: 'Stage 4 · 8 days',  decay: '80% win coverage', roi: '🟡 Medium'    },
      { channel: 'VertaCo',         linear: 'Stage 4 · 5 days',  decay: '95% win coverage', roi: '✓ On track'   },
    ],
    divergenceCallout: 'Nexus Systems has had zero marketing contact in 31 days — the longest gap in the current pipeline. In 4 of the last 6 comparable Enterprise losses, the deal went dark for 25+ days before the close date. This is a loss-risk pattern, not just a coverage gap.',
    recommendations: [
      { label: '1. Acme Corp — send deployment case study + LinkedIn touch this week.', body: 'Acme is missing the deployment case study touch that appears in 78% of Enterprise Stage 3 wins. Send the Acme-relevant case study (financial services vertical) via email and add a LinkedIn connection from an AE to the CFO stakeholder identified in the deal.' },
      { label: '2. Nexus Systems — executive outreach + invite to upcoming roundtable.', body: 'Nexus has been dark for 31 days. A CSO-level email from your Head of Revenue this week, combined with a personal invitation to the March 12 executive roundtable, matches the re-engagement pattern that rescued 3 similar stalled deals in the last 2 quarters.' },
      { label: '3. GlobalTech Inc. — share ROI calculator before Stage 4 review.', body: 'GlobalTech is 80% aligned to the winning touch pattern. The one missing element is the ROI calculator — which appears in 91% of Enterprise Stage 4 wins. Share this week before their internal review meeting next Wednesday.' },
    ],
    tags: ['Account Journey · Enterprise', 'Stage 3+ Pipeline', 'Feb 26 2026', '3 High-Impact Actions'],
    widget: {
      overview:       'Acme Corp and Nexus Systems show loss-risk touch patterns. VertaCo on track. GlobalTech needs ROI calculator before Stage 4 review.',
      recommendation: 'Deploy case study to Acme, executive re-engagement to Nexus, and ROI calculator to GlobalTech — all this week.',
      tags:           ['Account Journey · Enterprise', 'Feb 26 2026', '3 Actions'],
    },
    modal: {
      widgetTitle: 'Enterprise Pipeline Marketing Action Memo',
      dashboard:   'Account Journey Dashboard',
    },
  },

  // ─── S4c: DEFINITIONS ────────────────────────────────────────────────────────
  definitions: {
    promptText: 'Create metric definitions for win-pattern touch coverage, marketing influence gap, and loss-risk signal — so the team can track these consistently in future analyses and with Sage.',
    panelTitle: 'Metric Definitions — Account Journey Analysis',
    cardTitle:  'Account Journey Metric Library — 3 definitions',
    items: [
      {
        name:  'Win-Pattern Touch Coverage',
        badge: 'Metric',
        desc:  'The percentage of touchpoint types that appear in historical closed-won deals at the same stage and segment that have also occurred in an open deal\'s account journey. A score of 100% means the open deal has received every category of marketing touch that winning deals received at this stage.',
        logic: [
          'Identify all touchpoint types (e.g., case study, webinar, ROI calculator, reference call) present in closed-won Enterprise deals at Stage 3+.',
          'Check which of those touchpoint types have occurred in the open deal\'s account journey to date.',
          'Win-pattern coverage = matched touchpoint types / total winning touchpoint types × 100.',
        ],
        tags:   ['MarketingTouchpoints', 'Opportunities', 'ClosedWon'],
        source: 'Account Journey Analysis',
      },
      {
        name:  'Marketing Influence Gap',
        badge: 'Dimension',
        desc:  'A specific touchpoint type that appears in historical winning deals at the account\'s current stage but has NOT yet occurred in the open deal\'s journey. Each gap is a specific, actionable missing piece — not just a generic coverage shortfall.',
        logic: [
          'Pull the winning touchpoint set for the deal\'s stage and segment from closed-won history.',
          'Subtract the touchpoint types that have already occurred in the open deal\'s journey.',
          'Each remaining item is a specific influence gap — sorted by the frequency with which it appears in winning deals.',
        ],
        tags:   ['Touchpoint Types', 'Stage', 'Closed-Won Pattern'],
        source: 'Account Journey Analysis',
      },
      {
        name:  'Loss-Risk Signal',
        badge: 'Dimension',
        desc:  'A flag indicating that an open deal\'s current marketing coverage gap matches a pattern observed in historical closed-lost deals — not just an absence from winning deals. Loss-risk signals are higher priority than generic gaps because they are predictive of deal loss, not just suboptimal.',
        logic: [
          'Identify touchpoint gap patterns that appear in closed-lost Enterprise deals at the same stage.',
          'Cross-reference with the open deal\'s current gap profile.',
          'If the gap pattern matches a closed-lost pattern with frequency > 40%, flag as a loss-risk signal.',
        ],
        tags:   ['Closed-Lost Patterns', 'Touch Gaps', 'Stage'],
        source: 'Account Journey Analysis',
      },
    ],
  },

  // ─── S5: DASHBOARD ───────────────────────────────────────────────────────────
  dashboard: {
    title:    'Account Journey Dashboard',
    subtitle: 'Last updated: Feb 26, 2026 at 09:00 AM UTC · Enterprise Stage 3+ · Open Pipeline',
    roiTableTitle:  'Account Touch Coverage vs. Win Pattern',
    divergenceTitle:  'Loss-Risk Signals by Account',
    pathsTitle:  'Recommended Marketing Actions',
    kpis: [
      { label: 'High-Risk Accounts',     value: '2 accounts',  delta: '⚠ Acme + Nexus · loss-risk pattern', dir: 'down' },
      { label: 'Avg Win-Pattern Coverage', value: '61%',       delta: '↓ vs 78% for winning deals at close', dir: 'down' },
      { label: 'Accounts On Track',      value: '2 of 5',      delta: '↑ VertaCo + GlobalTech aligned',       dir: 'up'   },
      { label: 'Actions This Week',      value: '3 high-impact', delta: '↑ expected to lift close prob.',    dir: 'up'   },
    ],
    roiTable: [
      { channel: 'Acme Corp',       linearRoi: '45% coverage', decayRoi: '🔴 High risk', linearDir: 'down', decayDir: 'down' },
      { channel: 'Nexus Systems',   linearRoi: '20% coverage', decayRoi: '🔴 High risk', linearDir: 'down', decayDir: 'down' },
      { channel: 'Apex Financial',  linearRoi: '65% coverage', decayRoi: '🟡 Medium',    linearDir: 'flat', decayDir: 'flat' },
      { channel: 'GlobalTech Inc.', linearRoi: '80% coverage', decayRoi: '🟡 Medium',    linearDir: 'up',   decayDir: 'flat' },
      { channel: 'VertaCo',         linearRoi: '95% coverage', decayRoi: '✓ On track',   linearDir: 'up',   decayDir: 'up'   },
    ],
    divergence: [
      { channel: 'Nexus Systems — 31d no touch',   delta: '⚠ Loss risk', pct: 95, dir: 'down' },
      { channel: 'Acme — missing case study',       delta: '⚠ Loss risk', pct: 80, dir: 'down' },
      { channel: 'GlobalTech — missing ROI calc',   delta: '→ Gap',       pct: 45, dir: 'flat' },
      { channel: 'Apex — missing reference call',   delta: '→ Gap',       pct: 35, dir: 'flat' },
    ],
    paths: [
      { path: 'Acme Corp: Case study + LinkedIn this week',           opps: 1, color: '#4361ee' },
      { path: 'Nexus Systems: Executive outreach + roundtable invite', opps: 1, color: '#a78bfa' },
      { path: 'GlobalTech: ROI calculator before Stage 4 review',     opps: 1, color: '#06b6d4' },
      { path: 'Apex Financial: Schedule peer reference call',          opps: 1, color: '#34d399' },
    ],
  },

  // ─── S6: SAGE ────────────────────────────────────────────────────────────────
  sage: {
    threadName: 'Enterprise Account Journey Review',
    q1: 'What should marketing do for our open Enterprise deals this week?',
    a1: {
      intro: 'Three accounts need specific marketing actions this week — two are at loss-risk, one needs a single touch before a critical internal review:',
      bullets: [
        '<strong>Acme Corp (Stage 3, 22 days):</strong> Missing the deployment case study that appears in 78% of Enterprise Stage 3 wins. Send the financial services case study by email today, and add a LinkedIn connection from an AE to the CFO stakeholder. This combination appears in the last 4 Acme-equivalent wins.',
        '<strong>Nexus Systems (Stage 3, 31 days, zero touch):</strong> This matches a loss pattern — 4 of the last 6 comparable Enterprise losses went dark for 25+ days before close. Executive re-engagement this week plus an invite to the March 12 roundtable matches the rescue pattern for 3 similar stalled deals.',
        '<strong>GlobalTech Inc. (Stage 4):</strong> One gap remaining — the ROI calculator, which appears in 91% of Stage 4 wins. Share before their internal review Wednesday. After this, GlobalTech is fully aligned to the win pattern.',
      ],
      recommendation: 'Deploy these three actions by end of day Thursday: (1) Acme case study + LinkedIn, (2) Nexus executive email + roundtable invite, (3) GlobalTech ROI calculator. Combined estimated close probability uplift: +18 percentage points across the three accounts.',
    },
    q2: 'What specific touchpoint pattern do Enterprise deals that close tend to have?',
    a2: {
      intro: 'Across 47 Enterprise closed-won deals in the last 12 months, the following pattern appears in 83% of wins:',
      bullets: [
        '<strong>Stage 2:</strong> At least one Webinar or event attendance from a technical stakeholder (product/IT). Stage 2 deals with no technical stakeholder touch close at 31% — versus 67% when this touch is present.',
        '<strong>Stage 3:</strong> A deployment or customer case study relevant to the prospect\'s vertical, followed by a peer reference call within 14 days. This sequence appears in 78% of Stage 3→4 progressions.',
        '<strong>Stage 4:</strong> An ROI or business case document shared with a VP or C-level stakeholder, delivered at least 5 business days before the expected close date to allow internal review cycles.',
      ],
      footer: 'Pattern derived from <strong>MarketingTouchpoints</strong>, <strong>Opportunities</strong>, and <strong>Contacts</strong> tables — analysis covers 47 Enterprise closed-won deals from Mar 2025 – Feb 2026.',
    },
  },

  // ─── S7: WORKFLOW ────────────────────────────────────────────────────────────
  workflow: {
    name:         'Enterprise Account Journey — Weekly Review',
    analysis:     'Account Journey & Marketing Influence — Enterprise Stage 3+',
    frequency:    'Every Monday at 9:00 AM',
    slackChannel: '#marketing-ops',
    include:      'Touch coverage scores + Loss-risk flags + Weekly action list per account',
    confirmMsg:   'Sage will review every open Enterprise deal each Monday, compare marketing touch coverage to winning patterns, flag loss-risk signals, and post a specific action list for each account to <strong>#marketing-ops</strong> before your weekly pipeline review.',
  },

  // ─── S8: SLACK ───────────────────────────────────────────────────────────────
  slack: {
    workspace:   'ACME Corp',
    channel:     '#marketing-ops',
    reportTitle: '→ Enterprise Account Journey — Mar 3',
    cardTitle:   '→ Marketing Influence Actions — This Week',
    bullets: [
      '🔴 Acme Corp (Stage 3): Send deployment case study + LinkedIn touch today — missing win-pattern touch',
      '🔴 Nexus Systems (Stage 3): 31 days no touch — loss risk. Executive outreach + roundtable invite urgently',
      '🟡 GlobalTech Inc. (Stage 4): Share ROI calculator before Wednesday internal review — last gap',
      '✓ VertaCo (Stage 4): On track — maintain current cadence, no action needed this week',
    ],
    recommendation: 'Three actions before Thursday: Acme case study, Nexus executive re-engagement, GlobalTech ROI calc. Combined estimated close probability uplift: +18 percentage points across the three accounts.',
    userContext:  'Note: we\'re hosting an executive roundtable Mar 12 — should we invite any of these accounts?',
    sageContext:  'Nexus Systems is the top priority for the Mar 12 roundtable — they\'re 31 days dark and executive peer access is exactly the re-engagement pattern that works for stalled Stage 3 deals. Apex Financial is a secondary candidate — they\'re missing a peer reference call and the roundtable can serve that purpose. I\'d suggest personalised invitations from your Head of Revenue to both accounts by end of this week.',
  },

};
