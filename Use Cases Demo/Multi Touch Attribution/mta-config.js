/**
 * MTA USE CASE CONFIG
 * Multi-Touch Attribution — Enterprise Segment
 *
 * To create a new use case: copy this file, rename it (e.g. pipeline-config.js),
 * replace all values below, then update demo-engine.html to load your new file.
 * The engine HTML and all animation logic stays completely unchanged.
 */

const DEMO_CONFIG = {

  // ─── META ───────────────────────────────────────────────────────────────────
  useCase: 'mta',
  pageTitle: 'Petavue — MTA Demo',

  // ─── URLS (shown in address bar at each step) ────────────────────────────────
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
    slack:       'app.slack.com/client/T0ACME/C0MKT',
  },

  // ─── SCENE LABELS (shown in chrome bar top-right) ────────────────────────────
  labels: {
    s1:          'Type your analysis prompt',
    s2Generating:'Generating plan for your analysis…',
    s2Ready:     'Plan adapted to your data model',
    s2Refine:    'Refine the plan',
    s2b:         'Plan v2 — scoped to Enterprise + Paid Social breakdown',
    s3:          'Running MTA steps in sequence',
    s4Create:    'Create chart from analysis',
    s4Loading:   'Creating chart…',
    s4Ready:     'Chart ready — add to dashboard',
    s4Modal:     'Add chart to dashboard',
    s4bSelect:   'Select Create Memo from dropdown',
    s4bLoading:  'Creating memo…',
    s4bReady:    'Memo ready — reviewing…',
    s4bDash:     'Memo ready — add to dashboard',
    s4bModal:    'Add memo to dashboard',
    s4cSelect:   'Select Create Definition from dropdown',
    s4cLoading:  'Creating definitions…',
    s4cReady:    'Review and save metric definitions',
    s5:          'MTA Dashboard — live verified metrics',
    s6First:     'Ask Sage why Paid Search attribution dropped',
    s6Second:    'Sage explains the data lineage',
    s7:          'Create weekly MTA workflow → Slack',
    s8:          'Sage posts weekly MTA recommendations',
    s8Context:   'User adds context — Sage remembers it',
    s8End:       'Measure · Attribute · Optimise — every week',
  },

  // ─── S1: HOME ────────────────────────────────────────────────────────────────
  home: {
    prompt: 'Analyse multi-touch attribution for our Enterprise segment over the last 6 months — compare Linear vs. Time-Decay models, break out Paid Social by sub-channel, and flag channels where ROI diverges more than 20% between models',
  },

  // ─── S2: PLAN ────────────────────────────────────────────────────────────────
  plan: {
    title:   'Multi-Touch Attribution Analysis',
    version: 'Plan 1 · v1',
    steps: [
      'Extract all marketing touchpoints across paid and organic channels for leads created in the last 6 months',
      'Map touchpoints to leads, opportunities, and closed-won revenue through the full funnel',
      'Apply Linear and Time-Decay attribution models across all touchpoint paths',
      'Score channel ROI and identify top-converting multi-touch paths by segment',
    ],

    stepDetails: [
      {
        reqs: [
          'Query ~tbl:MarketingTouchpoints~ — last 6 months by ~col:TouchpointDate~',
          'Include ~col:Channel~, ~col:CampaignId~, ~col:TouchType~, ~col:LeadId~',
          'Join ~tbl:Campaigns~ — pull ~col:CampaignCost~, ~col:CampaignName~',
          'All channels: Paid Search, Paid Social, Email, Organic, Webinar, Direct'
        ],
        tables: ['MarketingTouchpoints', 'Campaigns']
      },
      {
        reqs: [
          'Join ~tbl:Leads~ on ~col:LeadId~ — capture ~col:Segment~, ~col:Region~, ~col:ConvertedOpportunityId~',
          'Join ~tbl:Opportunities~ on ~col:OpportunityId~ — pull ~col:Amount~, ~col:CloseDate~, ~col:Stage~',
          'Filter to ~col:Stage~ = Closed Won — link revenue back to each touchpoint path',
          'Preserve full touchpoint sequence per lead path for model input'
        ],
        tables: ['Leads', 'Opportunities', 'MarketingTouchpoints']
      },
      {
        reqs: [
          'Linear: distribute ~col:Amount~ equally across all touches per path',
          'Time-Decay: 7-day half-life decay, weight by recency to ~col:CloseDate~',
          'Aggregate by ~col:Channel~, ~col:Segment~, ~col:Region~',
          'Flag paths where decay weight diverges >20% from linear weight'
        ],
        tables: ['MarketingTouchpoints', 'Leads', 'Opportunities']
      },
      {
        reqs: [
          'ROI per channel: attributed revenue ÷ ~col:CampaignCost~',
          'Top 5 converting touch sequences per ~col:Segment~',
          'Flag channels where Time-Decay diverges >20% from Linear',
          'Output ranked channel table with ~col:LinearROI~, ~col:DecayROI~, ~col:Delta~'
        ],
        tables: ['MarketingTouchpoints', 'Campaigns', 'Opportunities']
      }
    ],
    // Text typed into the "refine plan" input
    refineText: 'Also include first_meaningful_touch custom field + break out LinkedIn, Meta, YouTube within Paid Social',
  },

  // ─── S2b: PLAN V2 ────────────────────────────────────────────────────────────
  planV2: {
    // Steps are same as above but with additions shown in diff callout
    diffLabel:  'Scoped to Enterprise · Added Paid Social sub-channels',
    addedSteps: [
      'Include first_meaningful_touch custom field for each lead path',
      'Break out LinkedIn, Meta, and YouTube as sub-channels within Paid Social',
    ],
  },

  // ─── S3: ANALYSIS ────────────────────────────────────────────────────────────
  analysis: {
    title: 'Channel Attribution — Enterprise',
    // Step 3 output table
    attributionTable: {
      headers: ['#', 'Channel', 'Linear Rev', 'Time-Decay Rev', 'Δ vs Linear'],
      rows: [
        { channel: 'Paid Search',  linear: '$1,840,000', decay: '$1,530,000', delta: '−17%', deltaDir: 'down' },
        { channel: 'Webinar',      linear: '$1,210,000', decay: '$1,300,000', delta: '+7%',  deltaDir: 'up'   },
        { channel: 'Paid Social',  linear: '$940,000',   decay: '$910,000',   delta: '−3%',  deltaDir: 'down' },
        { channel: 'Email',        linear: '$720,000',   decay: '$610,000',   delta: '−15%', deltaDir: 'down' },
        { channel: 'Organic',      linear: '$580,000',   decay: '$560,000',   delta: '−3%',  deltaDir: 'down' },
        { channel: 'Direct',       linear: '$460,000',   decay: '$560,000',   delta: '+22%', deltaDir: 'up'   },
      ],
    },
    // Step 4 output table
    roiTable: {
      headers: ['#', 'Channel', 'Attributed Rev (Linear)', 'Campaign Cost', 'ROI', 'Δ vs Prior Period'],
      rows: [
        { channel: 'Paid Search', rev: '$1,840,000', cost: '$210,000', roi: '8.8×',  delta: '−18%', deltaDir: 'down' },
        { channel: 'Webinar',     rev: '$1,210,000', cost: '$88,000',  roi: '13.8×', delta: '+22%', deltaDir: 'up'   },
        { channel: 'Paid Social', rev: '$940,000',   cost: '$175,000', roi: '5.4×',  delta: '+1%',  deltaDir: 'up'   },
        { channel: 'Email',       rev: '$720,000',   cost: '$42,000',  roi: '17.1×', delta: '+9%',  deltaDir: 'up'   },
        { channel: 'Organic',     rev: '$580,000',   cost: '$0',       roi: '—',     delta: '+5%',  deltaDir: 'up'   },
      ],
    },
  },

  // ─── S4: CHART ───────────────────────────────────────────────────────────────
  chart: {
    // Text typed into the bottom prompt box
    promptText: 'Can you create a grouped bar chart comparing Linear vs Time-Decay attributed revenue by channel? Group by channel on the X-axis, show both models side by side with different colors, label each bar with the dollar value, and sort by highest Linear attribution.',
    // Text shown statically in the left panel (abbreviated version)
    promptStatic: 'Can you create a grouped bar chart comparing Linear vs Time-Decay attributed revenue by channel? Group by channel, show both models side by side, label each bar with the dollar value, and sort by highest Linear attribution.',
    title:        'Attributed Pipeline by Channel',
    legend:       ['Linear attribution', 'Time-Decay attribution'],
    // widthPct: bar width as % of container (visual proportion), val: display label, delta: model gap
    channels: [
      { label: 'Paid Search', linearW: 73, linearVal: '$1.84M', decayW: 61, decayVal: '$1.53M', delta: '−17%', deltaDir: 'down' },
      { label: 'Webinar',     linearW: 48, linearVal: '$1.21M', decayW: 52, decayVal: '$1.30M', delta: '+7%',  deltaDir: 'up'   },
      { label: 'Paid Social', linearW: 37, linearVal: '$940K',  decayW: 36, decayVal: '$910K',  delta: '→',    deltaDir: 'flat' },
      { label: 'Email',       linearW: 29, linearVal: '$720K',  decayW: 24, decayVal: '$610K',  delta: '−15%', deltaDir: 'down' },
      { label: 'Organic',     linearW: 23, linearVal: '$580K',  decayW: 22, decayVal: '$560K',  delta: '→',    deltaDir: 'flat' },
      { label: 'Direct',      linearW: 18, linearVal: '$460K',  decayW: 22, decayVal: '$560K',  delta: '+22%', deltaDir: 'up'   },
    ],
    // Modal content when adding to dashboard
    modal: {
      widgetTitle: 'Attributed Pipeline by Channel',
      widgetDesc:  'Compares Linear vs. Time-Decay attributed pipeline across all marketing channels for Enterprise segment — highlights where model choice materially changes channel credit.',
      dashboard:   'MTA Dashboard',
    },
  },

  // ─── S4b: MEMO ───────────────────────────────────────────────────────────────
  memo: {
    // Text typed as the memo prompt
    promptText: 'Can you write a concise executive memo summarising the channel attribution findings? Include key highlights, model comparison, top ROI channels, and 2–3 strategic recommendations for budget allocation.',
    // Left panel card title (truncated)
    cardTitle:  'MTA Channel Performance — Q3 Summary',
    // Right panel full memo content
    title:      'MTA Channel Performance — Q3 Executive Summary',
    date:       'Feb 26, 2026',
    segment:    'Enterprise Segment',
    overview:   'This memo summarises multi-touch attribution performance across 6 channels for the Enterprise segment over the last 6 months. Two attribution models — Linear and Time-Decay — were compared to surface channel credit divergences and identify optimisation opportunities. Total attributed pipeline stands at <strong>$5.29M</strong>, up 14% versus the prior period.',
    // Key highlights table
    highlights: [
      { channel: 'Paid Search', linear: '$1.84M', decay: '$1.53M', roi: '8.8×'  },
      { channel: 'Webinar',     linear: '$1.21M', decay: '$1.30M', roi: '13.8×' },
      { channel: 'Email',       linear: '$720K',  decay: '$610K',  roi: '17.1×' },
      { channel: 'Paid Social', linear: '$940K',  decay: '$910K',  roi: '5.4×'  },
    ],
    // Callout box
    divergenceCallout: 'Paid Search shows the largest gap (−17%) between models, driven by its role as a top-of-funnel discovery channel. Webinar and Direct gain credit under Time-Decay, confirming their stronger late-stage influence on Enterprise deals.',
    // Recommendations (bold label + body text)
    recommendations: [
      { label: '1. Reallocate Paid Search budget.', body: 'Shift $40K from Brand Awareness campaigns to Webinar and Email — both appear 2× more in closing touches for Enterprise deals and deliver materially better ROI.' },
      { label: '2. Double LinkedIn within Paid Social.', body: 'LinkedIn outperforms Meta by 2.4× on a sub-channel basis. Pause underperforming Meta campaigns and consolidate spend into LinkedIn ABM targeting F500 accounts.' },
      { label: '3. Protect Email investment.', body: 'Email delivers the highest ROI at 17.1× with only $42K in campaign cost. Prioritise nurture sequence optimisation to further improve conversion from mid-funnel leads.' },
    ],
    tags: ['MTA · Enterprise', 'Q3 2025', 'Linear + Time-Decay', '6 Channels'],
    // Dashboard widget (compact version)
    widget: {
      overview:       'Total attributed pipeline stands at <strong>$5.29M</strong>, up 14% vs. prior period. Email delivers the highest ROI at 17.1× — Paid Search shows the largest model divergence at −17%.',
      recommendation: 'Shift $40K from Paid Search brand awareness to Webinar + Email — both show 2× higher closing-touch frequency for Enterprise deals.',
      tags:           ['MTA · Enterprise', 'Q3 2025', '3 Recommendations'],
    },
    // Add-to-dashboard modal
    modal: {
      widgetTitle: 'MTA Channel Performance Memo',
      dashboard:   'MTA Dashboard',
    },
  },

  // ─── S4c: DEFINITIONS ────────────────────────────────────────────────────────
  definitions: {
    // Text typed as the definitions prompt
    promptText: 'Based on this analysis, please create metric definitions for the key MTA measures we used — including attributed revenue, channel ROI, and model divergence — so our team can reuse them in future analyses and with Sage.',
    // Right panel header
    panelTitle: 'Metric Definitions — MTA Analysis',
    // Left panel card
    cardTitle:  'MTA Metric Library — 3 definitions',
    // The 3 definition cards
    items: [
      {
        name:   'Attributed Revenue (Linear)',
        badge:  'Metric',
        desc:   'The total closed-won revenue a marketing channel receives credit for, when credit is split equally across every touchpoint in the buyer\'s journey. Gives each channel a fair share of the deal regardless of when in the funnel it appeared.',
        logic: [
          'Take every closed-won opportunity and count how many marketing touchpoints were in its journey.',
          'Divide the deal value equally across all those touchpoints — each gets an equal share.',
          'Sum the shares for each channel to get that channel\'s total attributed revenue.',
        ],
        tags:   ['MarketingTouchpoints', 'Opportunities', 'Enterprise'],
        source: 'Channel Attribution Analysis',
      },
      {
        name:   'Channel ROI',
        badge:  'Metric',
        desc:   'How much pipeline revenue a channel generates for every dollar spent on it. A Channel ROI of 10× means $1 of campaign spend produced $10 in attributed revenue. Useful for comparing efficiency across channels with very different cost structures.',
        logic: [
          'Take the total attributed revenue for a channel (using Linear attribution).',
          'Divide by the total campaign spend for that channel over the same period.',
          'Channels with no direct spend (like Organic) are excluded or shown separately.',
        ],
        tags:   ['Campaigns', 'Attributed Revenue', 'Cost'],
        source: 'Channel Attribution Analysis',
      },
      {
        name:   'Model Attribution Divergence',
        badge:  'Dimension',
        desc:   'How differently a channel is credited depending on whether you use Linear or Time-Decay attribution. A large negative divergence means the channel appears early in deals but rarely at the close — so it gets far less credit when recency is weighted.',
        logic: [
          'Compare what share of total revenue the channel receives under Linear vs. Time-Decay.',
          'Subtract the Time-Decay share from the Linear share, then divide by the Linear share.',
          'A negative result means the channel loses credit under Time-Decay — it is a top-of-funnel channel. A positive result means it gains credit — it closes deals.',
        ],
        tags:   ['Linear Attribution', 'Time-Decay Attribution', 'Model Comparison'],
        source: 'Channel Attribution Analysis',
      },
    ],
  },

  // ─── S5: DASHBOARD ───────────────────────────────────────────────────────────
  dashboard: {
    title:    'Multi-Touch Attribution Dashboard',
    subtitle: 'Last updated: Feb 26, 2026 at 09:15 AM UTC · Enterprise Segment · Linear + Time-Decay models',
    roiTableTitle:  'Channel ROI by Model',
    divergenceTitle:  'Model Divergence (Linear vs T-Decay)',
    pathsTitle:  'Top Converting Paths — Enterprise',
    kpis: [
      { label: 'Attributed Revenue (Linear)', value: '$5.29M',    delta: '↑ 14% vs prior 6mo',      dir: 'up'   },
      { label: 'Top Channel ROI',             value: 'Email 17.1×', delta: '↑ highest ROI channel', dir: 'up'   },
      { label: 'Cost per Opp (Paid)',          value: '$2,840',    delta: '↑ Paid Search up 11%',    dir: 'down' },
      { label: 'Avg Touches to Close',         value: '6.2',       delta: '↑ Enterprise paths longer', dir: 'up' },
    ],
    // Channel ROI table (sorted by linear ROI desc)
    roiTable: [
      { channel: 'Email',       linearRoi: '17.1×', decayRoi: '14.6×', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Webinar',     linearRoi: '13.8×', decayRoi: '14.8×', linearDir: 'flat', decayDir: 'up'   },
      { channel: 'Organic',     linearRoi: '11.2×', decayRoi: '11.0×', linearDir: 'flat', decayDir: 'flat' },
      { channel: 'Paid Search', linearRoi: '8.8×',  decayRoi: '7.3×',  linearDir: 'flat', decayDir: 'down' },
      { channel: 'Paid Social', linearRoi: '5.4×',  decayRoi: '5.2×',  linearDir: 'flat', decayDir: 'flat' },
    ],
    // Model divergence bars
    divergence: [
      { channel: 'Paid Search', delta: '−17%', pct: 85, dir: 'down' },
      { channel: 'Email',       delta: '−15%', pct: 75, dir: 'down' },
      { channel: 'Direct',      delta: '+22%', pct: 55, dir: 'up'   },
      { channel: 'Webinar',     delta: '+7%',  pct: 35, dir: 'up'   },
    ],
    // Top converting paths
    paths: [
      { path: 'Paid Search → Webinar → Email',  opps: 38, color: '#4361ee' },
      { path: 'Organic → Webinar → Direct',     opps: 24, color: '#a78bfa' },
      { path: 'Paid Social → Email → Search',   opps: 19, color: '#06b6d4' },
      { path: 'Paid Search → Direct → Email',   opps: 15, color: '#34d399' },
      { path: 'Webinar → Email → Direct',       opps: 11, color: '#f59e0b' },
    ],
  },

  // ─── S6: SAGE ────────────────────────────────────────────────────────────────
  sage: {
    threadName: 'Attribution Deep Dive',
    // First exchange
    q1: 'Why did Paid Search attribution drop 17% under the Time-Decay model?',
    a1: {
      intro: 'Paid Search is acting primarily as a <strong>top-of-funnel discovery channel</strong> for Enterprise leads. Under Time-Decay, touches farther from conversion get exponentially less credit — and Paid Search rarely appears in the final 1–2 touches before close.',
      bullets: [
        'In <strong>79% of Enterprise paths</strong>, Paid Search is the first or second touch — well before the 7-day decay window activates',
        'The <strong>Mid-Market segment</strong> shows only a 4% drop — Paid Search closes faster there, staying within the decay window',
        'Three Brand Awareness campaigns (Oct–Nov) drove high early-touch volume; their opps closed 90+ days later, near-zero weight under Time-Decay',
      ],
      recommendation: 'Evaluate Paid Search on first-touch and pipeline influence metrics — not just time-decay attribution. Consider pausing the 3 Brand Awareness campaigns and reallocating budget to Webinar and Email which appear 2× more in closing touches.',
    },
    // Second exchange
    q2: 'How did you calculate this?',
    a2: {
      intro: 'Here\'s how the attribution was built, step by step:',
      bullets: [
        '<strong>Data join:</strong> MarketingTouchpoints → Leads on <code>LeadId</code>, then Leads → Opportunities via <code>ConvertedOpportunityId</code>.',
        '<strong>Touch ordering:</strong> Touchpoints sorted by <code>TouchpointDate ASC</code> within each opportunity path.',
        '<strong>Time-Decay weighting:</strong> Each touch weighted by <code>e^(−0.693 × days_before_close / 7)</code> — a 7-day half-life decay.',
        '<strong>Aggregation:</strong> Weighted revenue summed per channel, divided by total to get model share.',
        '<strong>Divergence calc:</strong> The −17% Paid Search gap = <code>(Linear − Time-Decay) / Linear</code>.',
      ],
      footer: 'All figures sourced from your <strong>MarketingTouchpoints</strong>, <strong>Campaigns</strong>, <strong>Leads</strong>, and <strong>Opportunities</strong> tables — no external benchmarks used.',
    },
  },

  // ─── S7: WORKFLOW ────────────────────────────────────────────────────────────
  workflow: {
    name:      'MTA Channel Performance — Weekly',
    analysis:  'Multi-Touch Attribution — Channel Performance',
    frequency: 'Every Monday at 9:00 AM',
    slackChannel: '#marketing-ops',
    include:   'Channel ROI summary + Budget recommendations + Anomaly alerts',
    confirmMsg: 'Sage will re-run the full MTA analysis each week, generate channel ROI rankings and budget shift recommendations, and post to <strong>#marketing-ops</strong> before your weekly marketing standup.',
  },

  // ─── S8: SLACK ───────────────────────────────────────────────────────────────
  slack: {
    workspace:     'ACME Corp',
    channel:       '#marketing-ops',
    reportTitle:   '📊 Weekly MTA Channel Report — Mar 3',
    cardTitle:     '📊 Channel Attribution Summary — Enterprise',
    bullets: [
      'Attributed revenue (Linear): $5.29M · ↑ 14% vs prior 6mo',
      'Paid Search: top channel by volume but ↓ 17% under Time-Decay — acting as top-of-funnel only',
      'Webinar ROI: 13.8× · ↑ 22% — highest close-touch rate this period',
      'Paid Social flat at 5.4× ROI — LinkedIn outperforming Meta by 2.4× within sub-channel',
    ],
    recommendation: 'Shift $40K from Paid Search Brand Awareness campaigns to Webinar and Email — both appear 2× more in closing touches for Enterprise. Pause Meta campaigns and double LinkedIn spend.',
    // User follow-up message
    userContext: 'Note: we\'re launching a LinkedIn ABM campaign Mar 10 targeting F500 — factor this in next week',
    // Sage reply to user context
    sageContext: 'Got it — LinkedIn ABM campaign launches Mar 10 targeting F500 accounts. Next Monday I\'ll compare Enterprise touchpoint paths before and after Mar 10, isolate LinkedIn sub-channel performance for F500 accounts, and surface whether the new campaign is influencing Webinar or Email follow-through rates.',
  },

};
