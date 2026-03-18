/**
 * PIPELINE & FORECAST USE CASE CONFIG
 * Pipeline Coverage & Forecast Confidence
 *
 * To create a new use case: copy this file, rename it,
 * replace all values, then update the engine's <script src="..."> to load it.
 */

const DEMO_CONFIG = {

  // ─── META ────────────────────────────────────────────────────────────────────
  useCase: 'pipeline',
  pageTitle: 'Petavue — Pipeline & Forecast Demo',

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
    slack:       'app.slack.com/client/T0ACME/C0REVOPS',
  },

  // ─── SCENE LABELS ────────────────────────────────────────────────────────────
  labels: {
    s1:           'Type your analysis prompt',
    s2Generating: 'Generating plan for your analysis…',
    s2Ready:      'Plan adapted to your data model',
    s2Refine:     'Refine the plan',
    s2b:          'Plan v2 — stage-stall detection added',
    s3:           'Running pipeline coverage analysis by segment',
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
    s5:           'Pipeline & Forecast Dashboard — live verified metrics',
    s6First:      'Ask Sage how to protect Enterprise quota',
    s6Second:     'Sage explains the stall root cause',
    s7:           'Create bi-weekly pipeline review → Slack',
    s8:           'Sage posts pipeline health report',
    s8Context:    'RevOps adds context — Sage remembers it',
    s8End:        'Monitor · Intervene · Hit the Number — every week',
  },

  // ─── S1: HOME ────────────────────────────────────────────────────────────────
  home: {
    prompt: 'Analyse pipeline coverage against Q2 quota for Enterprise and Mid-Market segments — benchmark current deal stage and age against our historical close rates, identify where we are at risk of missing quota, and recommend specific actions to close the gap before end of quarter',
  },

  // ─── S2: PLAN ────────────────────────────────────────────────────────────────
  plan: {
    title:   'Pipeline Coverage & Forecast Analysis',
    version: 'Plan 1 · v1',
    steps: [
      'Pull all open opportunities by segment, rep, and stage — calculate current pipeline coverage ratios vs. Q2 quota',
      'Apply historical close rate benchmarks by stage, deal age, and segment to produce weighted pipeline confidence scores',
      'Identify coverage gaps: segments and reps where weighted pipeline falls below the historical quota-achievement threshold',
      'Surface actionable interventions: which deals to accelerate, where to generate more pipeline, and where to cut losses',
    ],

    stepDetails: [
      {
        reqs: [
          'Query ~tbl:Opportunities~ — ~col:IsClosed~ = false, pull ~col:Segment~, ~col:Stage~, ~col:Amount~',
          'Include ~col:OwnerId~, ~col:StageEnteredDate~, ~col:NextStepDate~, ~col:LastActivityDate~',
          'Join ~tbl:Quota~ on ~col:OwnerId~ and ~col:Quarter~ = Q2 2026 — pull ~col:QuotaAmount~',
          'Compute ~col:DaysInStage~ = today − ~col:StageEnteredDate~ per opportunity'
        ],
        tables: ['Opportunities', 'Quota', 'Users']
      },
      {
        reqs: [
          'Apply stage-level close rate benchmarks from ~tbl:HistoricalWinRates~ by ~col:Segment~',
          'Compute ~col:WeightedAmount~ = ~col:Amount~ × ~col:CloseRateBenchmark~ per opportunity',
          'Aggregate ~col:WeightedAmount~ by ~col:Segment~ and ~col:OwnerId~',
          'Calculate ~col:CoverageRatio~ = sum(~col:WeightedAmount~) ÷ ~col:QuotaAmount~'
        ],
        tables: ['Opportunities', 'HistoricalWinRates', 'Quota']
      },
      {
        reqs: [
          'Flag ~col:Segment~ where ~col:CoverageRatio~ < threshold (Enterprise: 2.5×, Mid-Market: 2.8×)',
          'Identify stalled deals: ~col:DaysInStage~ > benchmark from ~tbl:StageBenchmarks~',
          'Cross-reference stalled deals with ~tbl:SupportTickets~ — flag open tickets ±14 days',
          'Flag reps where weighted pipeline < 60% of ~col:QuotaAmount~'
        ],
        tables: ['Opportunities', 'StageBenchmarks', 'SupportTickets']
      },
      {
        reqs: [
          'Prioritise Stage 3 Enterprise deals with open ~tbl:SupportTickets~ for CSM outreach',
          'Identify deals with no ~col:NextStepDate~ and no ~col:LastActivityDate~ in 14+ days',
          'Model SDR reallocation: Mid-Market surplus ÷ Enterprise gap = reallocation opportunity',
          'Output action list ranked by ~col:WeightedAmount~ at risk with owner and recommended action'
        ],
        tables: ['Opportunities', 'SupportTickets', 'Quota', 'Users']
      }
    ],
    refineText: 'Focus on Enterprise and Mid-Market — exclude SMB this quarter. Also flag deals that have been in their current stage more than 2× the median duration for that stage',
  },

  // ─── S2b: PLAN V2 ────────────────────────────────────────────────────────────
  planV2: {
    diffLabel:  'Scoped to Enterprise + Mid-Market · Stage-stall detection added',
    addedSteps: [
      'Flag deals where time-in-current-stage exceeds 2× the median duration for that stage and segment — surface as pipeline health risks requiring intervention',
    ],
  },

  // ─── S3: ANALYSIS ────────────────────────────────────────────────────────────
  analysis: {
    title: 'Pipeline Coverage by Segment — Q2',
    // Step 1 & 2 output table data
    step1Headers: ['#', 'Opportunity', 'Segment', 'Stage', 'Amount', 'Days in Stage'],
    step1Rows: [
      ['1', 'Acme Corp',      'Enterprise', 'Stage 3', '$148,000', '22 days'],
      ['2', 'GlobalTech Inc.','Enterprise', 'Stage 4', '$210,000', '8 days'],
      ['3', 'NovaCo',         'Mid-Market', 'Stage 3', '$72,000',  '11 days'],
      ['4', 'BlueLine Ltd.',  'Enterprise', 'Stage 2', '$94,000',  '31 days'],
      ['5', 'Apex Data',      'Mid-Market', 'Stage 4', '$58,000',  '5 days'],
    ],
    step1Count: '3,841',
    step2Headers: ['#', 'Segment', 'Q2 Quota', 'Raw Pipeline', 'Weighted Pipeline', 'Coverage Ratio'],
    step2Rows: [
      ['1', 'Enterprise', '$3.2M quota', '$7.8M raw', '$6.1M wtd', '1.9× ⚠'],
      ['2', 'Mid-Market', '$2.1M quota', '$9.2M raw', '$6.8M wtd', '3.2× ✓'],
    ],
    step2Count: '142',
    attributionTable: {
      headers: ['#', 'Segment', 'Q2 Quota', 'Raw Pipeline', 'Weighted Pipeline', 'Coverage Ratio'],
      rows: [
        { channel: 'Enterprise',   linear: '$3.2M quota', decay: '$7.8M raw',  delta: '$6.1M wtd · 1.9×', deltaDir: 'down' },
        { channel: 'Mid-Market',   linear: '$2.1M quota', decay: '$9.2M raw',  delta: '$6.8M wtd · 3.2×', deltaDir: 'up'   },
      ],
    },
    roiTable: {
      headers: ['#', 'Segment', 'Stalled Deals', 'Avg Days Stalled', 'Stage Benchmark', 'Risk Level'],
      rows: [
        { channel: 'Enterprise · Stage 3', rev: '14 deals', cost: '38 days',  roi: '17 day bench', delta: '⚠ Critical', deltaDir: 'down' },
        { channel: 'Enterprise · Stage 2', rev: '6 deals',  cost: '24 days',  roi: '12 day bench', delta: '⚠ At risk',  deltaDir: 'down' },
        { channel: 'Mid-Market · Stage 3', rev: '3 deals',  cost: '19 days',  roi: '17 day bench', delta: '→ Monitor',  deltaDir: 'flat' },
      ],
    },
  },

  // ─── S4: CHART ───────────────────────────────────────────────────────────────
  chart: {
    promptText: 'Create a coverage ratio chart showing weighted pipeline vs. quota for each segment — display the historical threshold line at 2.5× for Enterprise and 2.8× for Mid-Market, and highlight Enterprise in amber since it\'s below threshold.',
    promptStatic: 'Create a coverage ratio chart — weighted pipeline vs. quota per segment, with historical threshold lines. Highlight Enterprise below threshold.',
    title:   'Pipeline Coverage vs. Quota — Q2',
    legend:  ['Weighted pipeline coverage', 'Historical threshold to hit quota'],
    channels: [
      { label: 'Enterprise',   linearW: 76,  linearVal: '1.9× coverage', decayW: 100, decayVal: '2.5× target', delta: '⚠ Below',   deltaDir: 'down' },
      { label: 'Mid-Market',   linearW: 100, linearVal: '3.2× coverage', decayW: 89,  decayVal: '2.8× target', delta: '✓ Healthy', deltaDir: 'up'   },
      { label: 'SMB',          linearW: 88,  linearVal: '2.8× coverage', decayW: 84,  decayVal: '2.5× target', delta: '✓ Healthy', deltaDir: 'up'   },
      { label: 'Strategic',    linearW: 62,  linearVal: '1.5× coverage', decayW: 100, decayVal: '3.0× target', delta: '⚠ Critical', deltaDir: 'down' },
    ],
    modal: {
      widgetTitle: 'Pipeline Coverage vs. Quota — Q2',
      widgetDesc:  'Weighted pipeline coverage ratio by segment, benchmarked against historical close-rate thresholds needed to hit quota. Highlights segments at risk before it\'s too late to intervene.',
      dashboard:   'Pipeline & Forecast Dashboard',
    },
  },

  // ─── S4b: MEMO ───────────────────────────────────────────────────────────────
  memo: {
    promptText: 'Write an executive memo summarising pipeline coverage and forecast risk for Q2 — include coverage ratios, stall analysis, and 3 specific intervention recommendations.',
    cardTitle:  'Pipeline Coverage & Forecast — Q2 Risk Brief',
    title:      'Pipeline Coverage & Forecast — Q2 Executive Brief',
    date:       'Feb 26, 2026',
    segment:    'Enterprise + Mid-Market · Q2 2026',
    overview:   'This brief summarises Q2 pipeline coverage across Enterprise and Mid-Market segments as of Feb 26. Enterprise pipeline is at <strong>1.9× weighted coverage</strong> — below the 2.5× historically required to hit quota. 14 Enterprise deals are stalled in Stage 3 at an average of 38 days (benchmark: 17 days). Mid-Market is healthy at 3.2× coverage. Without intervention, Enterprise quota is at risk.',
    highlights: [
      { channel: 'Enterprise',   linear: '1.9× coverage', decay: '2.5× needed', roi: '⚠ At risk' },
      { channel: 'Mid-Market',   linear: '3.2× coverage', decay: '2.8× needed', roi: '✓ Healthy' },
      { channel: 'Stage 3 Stalls', linear: '14 deals',   decay: '38d avg',      roi: '⚠ Critical' },
      { channel: 'Gap to target', linear: '$1.92M',       decay: 'weighted pipe', roi: 'needed now' },
    ],
    divergenceCallout: 'Enterprise has 14 deals stalled in Stage 3 at an average of 38 days — more than 2× the 17-day stage benchmark. Analysis of these deals shows 8 have an open support ticket filed in the last 30 days. Unresolved support issues are the primary stall driver — CSM-led outreach historically resolves 60% of these within one week.',
    recommendations: [
      { label: '1. CSM outreach to 8 support-flagged Enterprise accounts this week.', body: 'Assign a CSM to each of the 8 Stage 3 deals with an open support ticket. Historical data shows 60% of these stalls resolve within 7 days when a CSM engages. This alone could unlock $2.1M in weighted pipeline.' },
      { label: '2. Manager review of 4 long-stalled Enterprise deals by Friday.', body: 'Four deals have been in Stage 3 for 50+ days with no next step logged and no contact in the last 14 days. These are likely pushes or losses — a manager decision on each is needed to clean the forecast and stop wasting SDR time.' },
      { label: '3. Reallocate 2 Mid-Market SDRs to Enterprise prospecting for 3 weeks.', body: 'Mid-Market pipeline is at 3.2× — well above the 2.8× threshold. A temporary SDR reallocation to Enterprise can rebuild top-of-funnel within the Q2 window. Projected coverage improvement: 1.9× → 2.4× by end of March.' },
    ],
    tags: ['Pipeline Coverage · Q2', 'Enterprise + Mid-Market', 'Stage Stall Analysis', '3 Interventions'],
    widget: {
      overview:       'Enterprise pipeline at 1.9× — below 2.5× threshold. 14 deals stalled in Stage 3 at 38 days avg (2.2× benchmark). Mid-Market healthy at 3.2×.',
      recommendation: 'CSM outreach to 8 support-flagged accounts, manager review of 4 dormant deals, and 2 SDRs reallocated from Mid-Market to Enterprise for 3 weeks.',
      tags:           ['Pipeline Coverage · Q2', 'Enterprise Risk', '3 Interventions'],
    },
    modal: {
      widgetTitle: 'Pipeline Coverage & Forecast Brief',
      dashboard:   'Pipeline & Forecast Dashboard',
    },
  },

  // ─── S4c: DEFINITIONS ────────────────────────────────────────────────────────
  definitions: {
    promptText: 'Create metric definitions for weighted pipeline coverage, stage-stall rate, and forecast confidence score — so the RevOps team can reuse these in future analyses and with Sage.',
    panelTitle: 'Metric Definitions — Pipeline & Forecast Analysis',
    cardTitle:  'Pipeline & Forecast Metric Library — 3 definitions',
    items: [
      {
        name:  'Weighted Pipeline Coverage',
        badge: 'Metric',
        desc:  'The total open pipeline value adjusted by the historical close probability for each deal\'s stage, age, and segment — divided by the quota for the period. A coverage ratio of 2.5× means that for every $1 of quota, you have $2.50 in pipeline with confidence-weighted value. Historically, 2.5× coverage is the threshold for hitting Enterprise quota.',
        logic: [
          'Pull all open opportunities by segment — filter to current quarter close date.',
          'Apply historical win rate by stage × deal age bucket (e.g., Stage 3 deals aged 0–20 days close at 42%; 40+ days close at 18%).',
          'Multiply each deal\'s amount by its weighted probability. Sum per segment. Divide by quota.',
        ],
        tags:   ['Opportunities', 'Stage', 'Quota', 'Win Rate'],
        source: 'Pipeline Coverage & Forecast Analysis',
      },
      {
        name:  'Stage-Stall Rate',
        badge: 'Metric',
        desc:  'The percentage of open deals in a given stage whose time-in-stage has exceeded 2× the median duration for that stage and segment. A high stage-stall rate is an early warning signal for pipeline health — stalled deals are significantly less likely to close in the current quarter.',
        logic: [
          'For each open deal, calculate days since it entered its current stage (today − stage entry date).',
          'Compare to the median days-in-stage for closed-won deals at the same stage and segment.',
          'Flag deals where current duration > 2× median. Stage-stall rate = flagged deals / total deals in stage.',
        ],
        tags:   ['Opportunities', 'Stage Entry Date', 'Segment'],
        source: 'Pipeline Coverage & Forecast Analysis',
      },
      {
        name:  'Forecast Confidence Score',
        badge: 'Metric',
        desc:  'A composite score (0–100) measuring how likely the current weighted pipeline is to convert to closed-won revenue by end of quarter. Factors in coverage ratio, stage-stall rate, average deal age, and historical quarter-end close velocity. Scores below 65 indicate the segment is at material risk of missing quota.',
        logic: [
          'Start with the weighted pipeline coverage ratio — normalise to a 0–100 scale where 2.5× = 70 points.',
          'Penalise for stage-stall rate: subtract 2 points per 1% of pipeline stalled beyond the benchmark.',
          'Adjust for deal age distribution and historical Q-end close velocity in the final 30 days of the quarter.',
        ],
        tags:   ['Pipeline Coverage', 'Stage-Stall Rate', 'Close Velocity'],
        source: 'Pipeline Coverage & Forecast Analysis',
      },
    ],
  },

  // ─── S5: DASHBOARD ───────────────────────────────────────────────────────────
  dashboard: {
    title:    'Pipeline & Forecast Dashboard',
    subtitle: 'Last updated: Feb 26, 2026 at 07:30 AM UTC · Enterprise + Mid-Market · Q2 2026',
    roiTableTitle:  'Pipeline Coverage by Segment',
    divergenceTitle:  'Stage Stall Risk by Segment',
    pathsTitle:  'Top Coverage Recovery Actions',
    kpis: [
      { label: 'Enterprise Coverage',    value: '1.9×',     delta: '⚠ Below 2.5× target',          dir: 'down' },
      { label: 'Mid-Market Coverage',    value: '3.2×',     delta: '↑ Above 2.8× target',           dir: 'up'   },
      { label: 'Stage 3 Stalled Deals',  value: '14',       delta: '⚠ 38 days avg · 2.2× benchmark', dir: 'down' },
      { label: 'Forecast Confidence',    value: '61 / 100', delta: '↓ Enterprise at risk',          dir: 'down' },
    ],
    roiTable: [
      { channel: 'Enterprise · Stage 3', linearRoi: '1.9×',  decayRoi: '61% conf.', linearDir: 'down', decayDir: 'down' },
      { channel: 'Enterprise · Stage 2', linearRoi: '2.1×',  decayRoi: '68% conf.', linearDir: 'flat', decayDir: 'flat' },
      { channel: 'Mid-Market · Stage 3', linearRoi: '3.2×',  decayRoi: '82% conf.', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Mid-Market · Stage 2', linearRoi: '2.9×',  decayRoi: '79% conf.', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'SMB · Stage 3',        linearRoi: '2.8×',  decayRoi: '77% conf.', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Strategic · Stage 3',  linearRoi: '1.5×',  decayRoi: '44% conf.', linearDir: 'down', decayDir: 'down' },
    ],
    divergence: [
      { channel: 'Enterprise Stage 3 stalls',  delta: '14 deals', pct: 90, dir: 'down' },
      { channel: 'Strategic Stage 3 stalls',   delta: '7 deals',  pct: 70, dir: 'down' },
      { channel: 'Enterprise Stage 2 stalls',  delta: '6 deals',  pct: 55, dir: 'down' },
      { channel: 'Mid-Market Stage 3 stalls',  delta: '3 deals',  pct: 25, dir: 'flat' },
      { channel: 'SMB Stage 3 stalls',         delta: '2 deals',  pct: 18, dir: 'flat' },
    ],
    paths: [
      { path: 'Enterprise: CSM unblocks 8 support-stalled deals',  opps: 8,  color: '#4361ee' },
      { path: 'Enterprise: Manager closes 4 dormant deals',         opps: 4,  color: '#a78bfa' },
      { path: 'Mid-Market → Enterprise SDR reallocation (2 reps)',  opps: 12, color: '#06b6d4' },
      { path: 'Enterprise Stage 2 → Stage 3 acceleration',          opps: 6,  color: '#34d399' },
    ],
  },

  // ─── S6: SAGE ────────────────────────────────────────────────────────────────
  sage: {
    threadName: 'Q2 Pipeline Health Review',
    q1: 'What should we do right now to protect Enterprise quota?',
    a1: {
      intro: 'Enterprise pipeline needs two things urgently — unblocking stalled Stage 3 deals and generating net-new pipeline within the next 3 weeks:',
      bullets: [
        '<strong>8 of the 14 stalled Stage 3 deals</strong> have an open support ticket filed in the last 30 days. Assign CSM outreach immediately — historically this resolves 60% of Stage 3 stalls within 7 days and could unlock $2.1M in weighted pipeline.',
        '<strong>4 deals are 50+ days in Stage 3</strong> with no next step logged and no contact in 14 days. Escalate to manager review by Friday — these need a push/loss decision to clean the forecast.',
        '<strong>Mid-Market pipeline is at 3.2×</strong> — above its 2.8× threshold. Moving 2 SDRs to Enterprise prospecting for 3 weeks can rebuild top-of-funnel in time for Q2 close velocity.',
      ],
      recommendation: 'Immediate actions: (1) CSM outreach to 8 support-flagged accounts this week. (2) Manager review of 4 dormant deals by Friday. (3) Shift 2 SDRs to Enterprise for 3 weeks. Projected: Enterprise coverage improves from 1.9× → 2.4× by end of March.',
    },
    q2: 'Why are so many Enterprise deals stalling in Stage 3 specifically?',
    a2: {
      intro: 'Stage 3 is your technical evaluation stage — and the pattern here is specific:',
      bullets: [
        '<strong>Support tickets are the primary blocker:</strong> 8 of 14 stalls correlate with a support case opened ±14 days of entering Stage 3. Prospects encountering a product issue during evaluation are pausing the process rather than disqualifying.',
        '<strong>Champion disengagement is the secondary driver:</strong> 4 deals show no email or meeting activity from the primary contact in 20+ days — likely a champion who has lost internal momentum.',
        '<strong>This is not a pricing or competitive issue:</strong> Zero of the 14 stalls show competitor activity logged in the last 30 days. The deals are not being lost — they are waiting.',
      ],
      footer: 'Sourced from <strong>Opportunities</strong>, <strong>Cases</strong>, and <strong>ActivityHistory</strong> tables — no assumptions or external benchmarks used in this analysis.',
    },
  },

  // ─── S7: WORKFLOW ────────────────────────────────────────────────────────────
  workflow: {
    name:         'Enterprise Pipeline Health Monitor',
    analysis:     'Pipeline Coverage & Forecast Confidence — Enterprise',
    frequency:    'Every Monday and Thursday at 7:00 AM',
    slackChannel: '#revenue-ops',
    include:      'Coverage ratios + Stage stall alerts + Rep-level gap list',
    confirmMsg:   'Sage will monitor Enterprise pipeline continuously, alert on new stalls and coverage drops, and post a prioritised intervention list to <strong>#revenue-ops</strong> twice a week — before your pipeline review meetings.',
  },

  // ─── S8: SLACK ───────────────────────────────────────────────────────────────
  slack: {
    workspace:   'ACME Corp',
    channel:     '#revenue-ops',
    reportTitle: '◎ Enterprise Pipeline Health — Mar 3',
    cardTitle:   '◎ Pipeline Coverage Summary — Enterprise Q2',
    bullets: [
      'Coverage: 1.9× against 2.5× target · gap = $1.92M weighted pipeline needed',
      '14 deals stalled in Stage 3 · avg 38 days vs 17-day benchmark · 8 have open support tickets',
      'Forecast confidence: 61/100 · ↓ 4 points vs last week',
      'Mid-Market healthy at 3.2× — SDR reallocation window open now',
    ],
    recommendation: 'Assign CSM outreach to 8 support-flagged accounts today. Move 2 SDRs to Enterprise prospecting through end of month. Manager review of 4 dormant deals by Friday. Projected: Enterprise coverage 1.9× → 2.4× by Mar 31.',
    userContext:  'Update: we just closed a $480K Enterprise deal this morning — should improve coverage.',
    sageContext:  'Great — that $480K close moves Enterprise weighted coverage from 1.9× to 2.1×. Still below the 2.5× threshold, but improving. I\'ll update the forecast confidence score and recalculate which remaining stalled deals are most critical to accelerate. I\'ll have a revised intervention list ready in Thursday\'s report.',
  },

};
