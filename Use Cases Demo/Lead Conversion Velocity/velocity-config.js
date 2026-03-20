/**
 * LEAD CONVERSION VELOCITY USE CASE CONFIG
 * Lead Conversion Velocity — Inbound Segment
 *
 * To create a new use case: copy this file, rename it,
 * replace all values, then update the engine's <script src="..."> to load it.
 */

const DEMO_CONFIG = {

  // ─── META ───────────────────────────────────────────────────────────────────
  useCase: 'velocity',
  pageTitle: 'Petavue — Lead Conversion Velocity Demo',

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
    slack:       'app.slack.com/client/T0ACME/C0SOPS',
  },

  // ─── SCENE LABELS ────────────────────────────────────────────────────────────
  labels: {
    s1:           'Type your analysis prompt',
    s2Generating: 'Generating plan for your analysis…',
    s2Ready:      'Plan adapted to your data model',
    s2Refine:     'Refine the plan',
    s2b:          'Plan v2 — quality signal detection added',
    s3:           'Running velocity analysis across 5 lead sources',
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
    s5:           'Lead Velocity Dashboard — live verified metrics',
    s6First:      'Ask Sage which sources to prioritise this week',
    s6Second:     'Sage explains the quality risk signal',
    s7:           'Create weekly velocity alert → Slack',
    s8:           'Sage posts weekly lead velocity report',
    s8Context:    'Rep adds context — Sage remembers it',
    s8End:        'Measure · Benchmark · Prioritise — every week',
  },

  // ─── S1: HOME ────────────────────────────────────────────────────────────────
  home: {
    prompt: 'Analyse lead conversion velocity for our inbound leads over the last 90 days — benchmark each lead source against our historical ICP conversion patterns, flag sources where time-to-convert is trending slower than average, and recommend where reps should focus their effort this week',
  },

  // ─── S2: PLAN ────────────────────────────────────────────────────────────────
  plan: {
    title:   'Lead Conversion Velocity Analysis',
    version: 'Plan 1 · v1',
    steps: [
      'Extract all inbound leads from the last 90 days, grouped by source and segment',
      'Calculate time-to-convert (lead created → opportunity created) per source and segment',
      'Benchmark current velocity against 12-month historical ICP conversion patterns by source',
      'Rank sources by velocity gap vs. benchmark and identify where rep effort is misaligned with conversion potential',
    ],

    stepDetails: [
      {
        reqs: [
          'Query ~tbl:Leads~ — ~col:CreatedDate~ in last 90 days, group by ~col:Source~, ~col:Segment~',
          'Include ~col:LeadId~, ~col:Source~, ~col:CreatedDate~, ~col:ConvertedDate~, ~col:IsConverted~',
          'Filter to ~col:Segment~ = Enterprise + Mid-Market (exclude SMB for this analysis)',
          'Pull ~col:OwnerId~ to join rep-level conversion data from ~tbl:Users~'
        ],
        tables: ['Leads', 'Users']
      },
      {
        reqs: [
          'Calculate ~col:DaysToConvert~ = ~col:ConvertedDate~ − ~col:CreatedDate~ per lead',
          'Group by ~col:Source~ and ~col:Segment~ — compute median and P75 velocity',
          'Exclude unconverted leads from velocity calc; flag them separately as ~col:IsAtRisk~',
          'Join ~tbl:Opportunities~ to capture ~col:ICP_Score~ and ~col:Amount~ per converted lead'
        ],
        tables: ['Leads', 'Opportunities']
      },
      {
        reqs: [
          'Pull 12-month historical velocity by ~col:Source~ from ~tbl:Leads~ — same filters',
          'Compute benchmark median per source over trailing 12 months by ~col:Segment~',
          'Calculate ~col:VelocityGap~ = current median − 12-month benchmark per ~col:Source~',
          'Flag sources with gap >5 days as velocity risk; >10 days as critical'
        ],
        tables: ['Leads', 'Opportunities']
      },
      {
        reqs: [
          'Rank sources by ~col:VelocityGap~ descending — worst performers first',
          'Cross-reference rep effort: ~col:ActivityCount~ from ~tbl:Activities~ per source',
          'Flag sources where high rep activity correlates with poor velocity (misalignment signal)',
          'Output priority list with ~col:Source~, ~col:MedianDays~, ~col:Benchmark~, ~col:Gap~'
        ],
        tables: ['Leads', 'Activities', 'Users']
      }
    ],
    refineText: 'Also flag lead sources where volume is up but conversion rate is down — that\'s a quality signal, not a success signal',
  },

  // ─── S2b: PLAN V2 ────────────────────────────────────────────────────────────
  planV2: {
    diffLabel:  'Added quality signal detection · 5 sources benchmarked',
    addedSteps: [
      'Detect sources where MoM lead volume increased but conversion rate declined — surface as quality risk flags, not growth signals',
    ],
  },

  // ─── S3: ANALYSIS ────────────────────────────────────────────────────────────
  analysis: {
    title: 'Lead Source Velocity — 90 Day Analysis',
    // Step 1 & 2 output table data (shown during animation before step 3/4)
    step1Headers: ['#', 'LeadId', 'Source', 'Created', 'Converted', 'Days to Convert'],
    step1Rows: [
      ['1', 'L-20041', 'Partner Referral', 'Jul 10', 'Jul 17', '7 days'],
      ['2', 'L-20088', 'Paid Search',      'Jul 14', 'Jul 22', '8 days'],
      ['3', 'L-20102', 'Paid Social',      'Aug 1',  'Aug 19', '18 days'],
      ['4', 'L-20119', 'Content / SEO',    'Aug 5',  'Aug 27', '22 days'],
      ['5', 'L-20134', 'Webinar',          'Aug 9',  'Aug 20', '11 days'],
    ],
    step1Count: '8,214',
    step2Headers: ['#', 'Source', 'Avg Days to Convert', '12-mo Benchmark', 'Variance', 'Volume (90d)'],
    step2Rows: [
      ['1', 'Partner Referral', '7.1 days',  '7.8 days',  '−9%',  '312 leads'],
      ['2', 'Paid Search',      '8.2 days',  '9.1 days',  '−10%', '584 leads'],
      ['3', 'Webinar',          '11.4 days', '12.0 days', '−5%',  '228 leads'],
      ['4', 'Content / SEO',    '22.1 days', '16.8 days', '+32%', '441 leads'],
      ['5', 'Paid Social',      '18.7 days', '13.2 days', '+42%', '697 leads'],
    ],
    step2Count: '2,262',
    attributionTable: {
      headers: ['#', 'Lead Source', 'Avg Days to Convert', '12-mo Benchmark', 'Gap', 'Conv. Rate'],
      rows: [
        { channel: 'Partner Referral', linear: '7.1 days',  decay: '7.8 days',  delta: '−9%',  deltaDir: 'up'   },
        { channel: 'Paid Search',      linear: '8.2 days',  decay: '9.1 days',  delta: '−10%', deltaDir: 'up'   },
        { channel: 'Webinar',          linear: '11.4 days', decay: '12.0 days', delta: '−5%',  deltaDir: 'up'   },
        { channel: 'Content / SEO',    linear: '22.1 days', decay: '16.8 days', delta: '+32%', deltaDir: 'down' },
        { channel: 'Paid Social',      linear: '18.7 days', decay: '13.2 days', delta: '+42%', deltaDir: 'down' },
      ],
    },
    roiTable: {
      headers: ['#', 'Lead Source', 'Conv. Rate', 'Vol. MoM', 'Quality Signal', 'Rep Priority'],
      rows: [
        { channel: 'Partner Referral', rev: '38%',  cost: '−2%',  roi: '—',         delta: '✓ High', deltaDir: 'up'   },
        { channel: 'Paid Search',      rev: '24%',  cost: '+8%',  roi: '—',         delta: '✓ Good', deltaDir: 'up'   },
        { channel: 'Webinar',          rev: '31%',  cost: '+12%', roi: '—',         delta: '✓ Good', deltaDir: 'up'   },
        { channel: 'Content / SEO',    rev: '19%',  cost: '+5%',  roi: '—',         delta: '→ Watch', deltaDir: 'flat' },
        { channel: 'Paid Social',      rev: '12%',  cost: '+34%', roi: '⚠ Risk',   delta: '⚠ Pause', deltaDir: 'down' },
      ],
    },
  },

  // ─── S4: CHART ───────────────────────────────────────────────────────────────
  chart: {
    promptText: 'Create a bar chart comparing average days-to-convert vs. the 12-month benchmark for each lead source — sort by conversion rate descending, highlight sources more than 20% slower than benchmark in amber.',
    promptStatic: 'Create a bar chart comparing avg days-to-convert vs. benchmark per source — sort by conversion rate, highlight sources >20% slower than benchmark.',
    title:   'Lead Conversion Velocity by Source',
    legend:  ['Avg days to convert', '12-mo benchmark'],
    channels: [
      { label: 'Partner Referral', linearW: 28, linearVal: '7.1d', decayW: 31, decayVal: '7.8d', delta: '−9%',  deltaDir: 'up'   },
      { label: 'Paid Search',      linearW: 33, linearVal: '8.2d', decayW: 36, decayVal: '9.1d', delta: '−10%', deltaDir: 'up'   },
      { label: 'Webinar',          linearW: 46, linearVal: '11.4d',decayW: 48, decayVal: '12.0d',delta: '−5%',  deltaDir: 'up'   },
      { label: 'Content / SEO',    linearW: 88, linearVal: '22.1d',decayW: 67, decayVal: '16.8d',delta: '+32%', deltaDir: 'down' },
      { label: 'Paid Social',      linearW: 75, linearVal: '18.7d',decayW: 53, decayVal: '13.2d',delta: '+42%', deltaDir: 'down' },
    ],
    modal: {
      widgetTitle: 'Lead Conversion Velocity by Source',
      widgetDesc:  'Compares actual days-to-convert against the 12-month ICP benchmark per lead source — flags sources trending slower than historical patterns and surfaces quality risk signals.',
      dashboard:   'Lead Velocity Dashboard',
    },
  },

  // ─── S4b: MEMO ───────────────────────────────────────────────────────────────
  memo: {
    promptText: 'Write a concise executive memo summarising lead conversion velocity findings — include source rankings, quality risk flags, and 2–3 rep prioritisation recommendations for this week.',
    cardTitle:  'Lead Velocity — 90 Day Source Analysis',
    title:      'Lead Conversion Velocity — 90 Day Executive Summary',
    date:       'Feb 26, 2026',
    segment:    'Inbound Leads · All Segments',
    overview:   'This memo summarises lead conversion velocity across 5 inbound sources for the last 90 days. Sources were benchmarked against a 12-month historical ICP conversion baseline. Two sources — Paid Social and Content/SEO — are converting materially slower than benchmark. Paid Social shows a critical <strong>quality risk signal</strong>: volume up 34% MoM while conversion rate dropped from 18% to 12%.',
    highlights: [
      { channel: 'Partner Referral', linear: '7.1 days',  decay: '7.8d bench', roi: '38% CVR' },
      { channel: 'Paid Search',      linear: '8.2 days',  decay: '9.1d bench', roi: '24% CVR' },
      { channel: 'Webinar',          linear: '11.4 days', decay: '12.0d bench',roi: '31% CVR' },
      { channel: 'Paid Social',      linear: '18.7 days', decay: '13.2d bench',roi: '12% CVR ⚠' },
    ],
    divergenceCallout: 'Paid Social is the critical outlier: volume grew 34% month-over-month but conversion rate fell from 18% → 12%. This is a quality deterioration, not growth. High-touch rep effort on Paid Social leads is being wasted on leads that are not converting at ICP match rates.',
    recommendations: [
      { label: '1. Prioritise Partner Referral and Webinar leads.', body: 'These convert fastest (7.1d and 11.4d) at the highest rates (38% and 31%). Reps should contact Partner Referral leads within 24 hours and queue Webinar leads for Day 2–3 nurture sequences.' },
      { label: '2. Pause high-touch on Paid Social.', body: 'Redirect 40% of SDR capacity away from Paid Social until ICP match rate recovers above 16%. Flag to demand gen team — this is a targeting or creative quality issue, not a volume problem.' },
      { label: '3. Monitor Content/SEO velocity closely.', body: 'Content/SEO is 32% slower than benchmark (22.1d vs 16.8d). Conversion rate is holding at 19% — this may be a nurture gap rather than a quality issue. Test a faster SDR follow-up sequence within 48 hours of lead creation.' },
    ],
    tags: ['Lead Velocity · Inbound', '90 Days', 'Quality Signal Detected', '5 Sources'],
    widget: {
      overview:       'Partner Referral and Webinar leads convert fastest at 38% and 31% rates. Paid Social is a critical quality risk — volume up 34% but conversion rate down from 18% → 12%.',
      recommendation: 'Shift 40% SDR capacity to Partner Referral and Webinar. Pause high-touch on Paid Social until ICP match rate recovers.',
      tags:           ['Lead Velocity · Inbound', '90 Days', '3 Recommendations'],
    },
    modal: {
      widgetTitle: 'Lead Velocity Source Analysis Memo',
      dashboard:   'Lead Velocity Dashboard',
    },
  },

  // ─── S4c: DEFINITIONS ────────────────────────────────────────────────────────
  definitions: {
    promptText: 'Create metric definitions for the key velocity measures used in this analysis — time-to-convert, source conversion rate, and quality risk signal — so the team can reuse them with Sage.',
    panelTitle: 'Metric Definitions — Lead Velocity Analysis',
    cardTitle:  'Lead Velocity Metric Library — 3 definitions',
    items: [
      {
        name:  'Time-to-Convert',
        badge: 'Metric',
        desc:  'The number of calendar days between a lead\'s creation date and the date their associated opportunity was created. Measures how quickly a lead progresses from first capture to active sales engagement. Lower is better — faster conversion means reps are reaching the right leads at the right time.',
        logic: [
          'Take each lead record and find the date the lead was created (CreatedDate).',
          'Find the date the associated opportunity was created (Opportunity.CreatedDate via ConvertedOpportunityId).',
          'Calculate the difference in days. Average across all converted leads per source for the period.',
        ],
        tags:   ['Leads', 'Opportunities', 'ConvertedOpportunityId'],
        source: 'Lead Conversion Velocity Analysis',
      },
      {
        name:  'Source Conversion Rate',
        badge: 'Metric',
        desc:  'The percentage of leads from a given source that converted into an opportunity within 90 days of creation. The primary signal for lead quality by source — a high conversion rate means the source is sending leads that match your ICP and respond to outreach.',
        logic: [
          'Count all leads from the source created in the analysis window.',
          'Count how many of those leads have a non-null ConvertedOpportunityId within 90 days.',
          'Divide converted leads by total leads and express as a percentage.',
        ],
        tags:   ['Leads', 'Source', 'ConvertedOpportunityId'],
        source: 'Lead Conversion Velocity Analysis',
      },
      {
        name:  'Quality Risk Signal',
        badge: 'Dimension',
        desc:  'A flag that fires when a lead source\'s month-over-month volume increases while its conversion rate simultaneously declines. Indicates that lead quality is deteriorating even as volume grows — a common pattern when targeting criteria drift or ad creative attracts lower-intent audiences.',
        logic: [
          'Compare current month lead volume to prior month for each source.',
          'Compare current month conversion rate to prior month for each source.',
          'Flag the source if volume grew by more than 10% MoM AND conversion rate fell by more than 2 percentage points.',
        ],
        tags:   ['Lead Volume', 'Conversion Rate', 'MoM Comparison'],
        source: 'Lead Conversion Velocity Analysis',
      },
    ],
  },

  // ─── S5: DASHBOARD ───────────────────────────────────────────────────────────
  dashboard: {
    title:    'Lead Conversion Velocity Dashboard',
    subtitle: 'Last updated: Feb 26, 2026 at 08:45 AM UTC · All Inbound Sources · 90 Day Window',
    roiTableTitle:  'Source Velocity vs. 12-Month Benchmark',
    divergenceTitle:  'Quality Risk Signals by Source',
    pathsTitle:  'Fastest Converting Paths — Inbound',
    kpis: [
      { label: 'Fastest Converting Source', value: 'Partner Ref.',  delta: '↑ 7.1 days avg · 38% CVR',     dir: 'up'   },
      { label: 'Quality Risk Flags',        value: '1 Source',      delta: '⚠ Paid Social — vol↑, CVR↓',  dir: 'down' },
      { label: 'Avg Time-to-Convert',       value: '13.5 days',     delta: '↑ 2.1 days vs benchmark',      dir: 'down' },
      { label: 'SDR Realloc. Opportunity',  value: '40% capacity',  delta: '↑ from Paid Social → Referral', dir: 'up'  },
    ],
    roiTable: [
      { channel: 'Partner Referral', linearRoi: '7.1d',  decayRoi: '38% CVR', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Webinar',          linearRoi: '11.4d', decayRoi: '31% CVR', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Paid Search',      linearRoi: '8.2d',  decayRoi: '24% CVR', linearDir: 'flat', decayDir: 'flat' },
      { channel: 'Content / SEO',    linearRoi: '22.1d', decayRoi: '19% CVR', linearDir: 'down', decayDir: 'flat' },
      { channel: 'Paid Social',      linearRoi: '18.7d', decayRoi: '12% CVR', linearDir: 'down', decayDir: 'down' },
    ],
    divergence: [
      { channel: 'Paid Social',   delta: '+42%', pct: 90, dir: 'down' },
      { channel: 'Content / SEO', delta: '+32%', pct: 65, dir: 'down' },
      { channel: 'Webinar',       delta: '−5%',  pct: 25, dir: 'up'   },
      { channel: 'Paid Search',   delta: '−10%', pct: 20, dir: 'up'   },
    ],
    paths: [
      { path: 'Partner Referral → SDR → Opp',  opps: 42, color: '#4361ee' },
      { path: 'Webinar → Nurture → Opp',        opps: 31, color: '#a78bfa' },
      { path: 'Paid Search → SDR → Opp',        opps: 27, color: '#06b6d4' },
      { path: 'Content → SDR → Opp',            opps: 18, color: '#34d399' },
      { path: 'Paid Social → SDR → Opp',        opps: 9,  color: '#f59e0b' },
    ],
  },

  // ─── S6: SAGE ────────────────────────────────────────────────────────────────
  sage: {
    threadName: 'Lead Velocity Deep Dive',
    q1: 'Which lead sources should reps prioritise this week?',
    a1: {
      intro: 'Based on this week\'s velocity data, here\'s where rep effort will compound fastest:',
      bullets: [
        '<strong>Partner Referral leads convert in 7.1 days at 38%</strong> — 2.1× faster than the inbound average. Contact within 24 hours of lead creation. These leads go cold fastest when ignored.',
        '<strong>Webinar leads are on benchmark at 31% CVR</strong> — queue for Day 2–3 follow-up with a personalised sequence. They respond to nurture, not urgency.',
        '<strong>Pause high-touch on Paid Social</strong> — volume is up 34% MoM but conversion rate dropped from 18% → 12%. Reps are spending time on leads that will not convert at current ICP match rates.',
      ],
      recommendation: 'Reallocate 40% of SDR capacity from Paid Social to Partner Referral and Webinar this week. Based on current volume, this is expected to produce +12 qualified opportunities in the next 14 days.',
    },
    q2: 'How do you know the Paid Social drop is quality and not just slower conversion?',
    a2: {
      intro: 'Three signals confirm this is a quality issue, not a velocity issue:',
      bullets: [
        '<strong>Volume rose 34% MoM</strong> while conversion rate fell from 18% → 12% — if this were just slower conversion, the rate would hold while days-to-convert rose.',
        '<strong>ICP match score</strong> for Paid Social leads dropped from 0.72 → 0.54 this period, based on firmographic fields (company size, industry) at the time of lead creation.',
        '<strong>Stage 1 → disqualified rate</strong> for Paid Social leads is 44% this quarter vs. 22% historical average — leads are reaching SDRs and being immediately disqualified.',
      ],
      footer: 'All figures sourced from your <strong>Leads</strong>, <strong>Opportunities</strong>, and <strong>Campaigns</strong> tables — ICP match score computed from <strong>lead_enrichment_score</strong> custom field.',
    },
  },

  // ─── S7: WORKFLOW ────────────────────────────────────────────────────────────
  workflow: {
    name:         'Lead Velocity Monitor — Weekly',
    analysis:     'Lead Conversion Velocity by Source',
    frequency:    'Every Monday at 8:00 AM',
    slackChannel: '#sales-ops',
    include:      'Velocity rankings + Quality risk flags + Rep prioritisation list',
    confirmMsg:   'Sage will re-run lead velocity analysis each Monday, flag any source drifting from benchmark, and post a prioritised rep action list to <strong>#sales-ops</strong> before your weekly sales standup.',
  },

  // ─── S8: SLACK ───────────────────────────────────────────────────────────────
  slack: {
    workspace:   'ACME Corp',
    channel:     '#sales-ops',
    reportTitle: '⚡ Weekly Lead Velocity Report — Mar 3',
    cardTitle:   '⚡ Lead Source Velocity Rankings',
    bullets: [
      'Partner Referral: 7.1 days avg · 38% CVR · ↑ fastest this week — prioritise immediately',
      'Webinar: 11.4 days avg · 31% CVR · on benchmark — queue for Day 2–3 nurture',
      '⚠ Paid Social: 18.7 days · 12% CVR · quality risk — volume ↑34% but CVR ↓ from 18%',
      'Content/SEO: 22.1 days · 32% slower than benchmark — test faster SDR follow-up sequence',
    ],
    recommendation: 'Shift 40% SDR capacity to Partner Referral + Webinar this week. Pause high-touch on Paid Social until ICP match rate recovers above 16%. Expected: +12 qualified opps in 14 days.',
    userContext:  'Note: we\'re running a new Paid Social creative test starting Mar 10 — new ICP targeting. Should improve match rate.',
    sageContext:  'Got it — new Paid Social creative launches Mar 10 with updated ICP targeting. I\'ll compare lead ICP match scores and conversion rates before and after Mar 10, and flag whether quality is recovering week-over-week. I\'ll hold the reallocation recommendation until we have 2 weeks of post-launch data.',
  },

};
