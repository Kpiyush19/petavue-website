/**
 * SOURCE MIX OPTIMIZATION USE CASE CONFIG
 * Lead Source Mix & Marketing Channel Optimization
 *
 * To create a new use case: copy this file, rename it,
 * replace all values, then update the engine's <script src="..."> to load it.
 */

const DEMO_CONFIG = {

  // ─── META ────────────────────────────────────────────────────────────────────
  useCase: 'mix',
  pageTitle: 'Petavue — Source Mix Optimization Demo',

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
    slack:       'app.slack.com/client/T0ACME/C0DEMAND',
  },

  // ─── SCENE LABELS ────────────────────────────────────────────────────────────
  labels: {
    s1:           'Type your analysis prompt',
    s2Generating: 'Generating plan for your analysis…',
    s2Ready:      'Plan adapted to your data model',
    s2Refine:     'Refine the plan',
    s2b:          'Plan v2 — ICP match rate scoring added',
    s3:           'Running source mix analysis across 6 channels',
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
    s5:           'Source Mix Dashboard — live verified metrics',
    s6First:      'Ask Sage where to reallocate budget',
    s6Second:     'Sage explains the ICP drift signal',
    s7:           'Create monthly source mix review → Slack',
    s8:           'Sage posts monthly source mix recommendations',
    s8Context:    'Demand gen adds context — Sage remembers it',
    s8End:        'Measure · Optimise · Reallocate — every month',
  },

  // ─── S1: HOME ────────────────────────────────────────────────────────────────
  home: {
    prompt: 'Analyse our current lead source mix against the past 18 months of historical ICP conversion data — flag channels where our current spend allocation is misaligned with actual conversion performance, identify where ICP match rates are drifting, and recommend where to reallocate budget this quarter',
  },

  // ─── S2: PLAN ────────────────────────────────────────────────────────────────
  plan: {
    title:   'Lead Source Mix & Channel Optimization Analysis',
    version: 'Plan 1 · v1',
    steps: [
      'Pull current channel spend allocation and lead volume by source for the last 90 days',
      'Calculate ICP match rate, conversion rate, and cost-per-qualified-lead for each source over the same period',
      'Compare current source mix to the 18-month historical mix that produced the highest closed-won revenue',
      'Identify channels where spend is misaligned with conversion performance and surface reallocation opportunities',
    ],

    stepDetails: [
      {
        reqs: [
          'Query ~tbl:LeadSources~ — ~col:CreatedDate~ last 90 days, group by ~col:Source~',
          'Join ~tbl:CampaignSpend~ on ~col:Source~ — pull ~col:SpendAmount~ per source per month',
          'Include ~col:LeadVolume~, ~col:ConvertedLeads~, ~col:CostPerLead~ per ~col:Source~',
          'Filter to active sources with >20 leads in period (exclude micro-sources)'
        ],
        tables: ['LeadSources', 'CampaignSpend']
      },
      {
        reqs: [
          'Calculate ~col:ICPMatchRate~ from ~tbl:Leads~ — % leads per source matching ICP criteria',
          'Compute ~col:ConversionRate~ = ~col:ConvertedLeads~ ÷ ~col:LeadVolume~ per ~col:Source~',
          'Calculate ~col:CostPerQualifiedLead~ = ~col:SpendAmount~ ÷ (volume × ~col:ICPMatchRate~)',
          'Pull ~col:ICPMatchRate~ trend over last 3 quarters from ~tbl:Leads~ for drift detection'
        ],
        tables: ['Leads', 'CampaignSpend', 'LeadSources']
      },
      {
        reqs: [
          'Pull 18-month historical source mix from ~tbl:LeadSources~ — filter to highest-revenue quarters',
          'Compute optimal ~col:SpendAllocation~ percentages from high-revenue quarters by ~col:Source~',
          'Compare current mix to optimal mix — calculate ~col:SpendDelta~ per source (over/under)',
          'Flag sources where current spend >20% above optimal as overspend; >20% below as underspend'
        ],
        tables: ['LeadSources', 'CampaignSpend', 'Opportunities']
      },
      {
        reqs: [
          'Rank reallocation opportunities by: overspend amount × (~col:ICPMatchRate~ gap vs optimal source)',
          'Compute projected improvement: reallocate $X from overspend → projected ~col:QualifiedLeadGain~',
          'Flag sources with ICP match drift >10pp over last 3 quarters as structural risk',
          'Output reallocation plan: from ~col:Source~, to ~col:Source~, ~col:Amount~, projected impact'
        ],
        tables: ['LeadSources', 'CampaignSpend', 'Leads', 'Opportunities']
      }
    ],
    refineText: 'Also calculate ICP match rate drift — show how each channel\'s ICP match score has changed over the last 3 quarters. I want to see which channels are getting better or worse at hitting our ICP',
  },

  // ─── S2b: PLAN V2 ────────────────────────────────────────────────────────────
  planV2: {
    diffLabel:  'ICP match rate drift added · 3-quarter trend included',
    addedSteps: [
      'Calculate quarter-over-quarter ICP match score change per channel — surface channels where match rate is trending down despite flat or increasing spend',
    ],
  },

  // ─── S3: ANALYSIS ────────────────────────────────────────────────────────────
  analysis: {
    title: 'Lead Source Mix Analysis — 90 Day vs. 18-Month Optimal',
    // Step 1 & 2 output table data
    step1Headers: ['#', 'Channel', 'Monthly Spend', 'Spend Share', 'ICP Match Rate', 'Conv. Rate'],
    step1Rows: [
      ['1', 'Paid Search',     '$38,400',  '32%', '58%', '14%'],
      ['2', 'Paid Social',     '$22,800',  '19%', '44%', '9%'],
      ['3', 'Content / SEO',   '$16,800',  '14%', '69%', '21%'],
      ['4', 'LinkedIn',        '$21,600',  '18%', '71%', '28%'],
      ['5', 'Webinar / Event', '$14,400',  '12%', '74%', '24%'],
    ],
    step1Count: '6,440',
    step2Headers: ['#', 'Channel', 'Current Share', 'Optimal Share (18-mo)', 'ICP Match Gap', 'Recommendation'],
    step2Rows: [
      ['1', 'Paid Social',     '19%', '11%', '−20pp ICP drop', '⚠ Reduce $22K/mo'],
      ['2', 'LinkedIn',        '18%', '27%', '+7pp ICP gain',  '✓ Increase $22K/mo'],
      ['3', 'Webinar / Event', '12%', '16%', '+5pp ICP gain',  '✓ Increase modestly'],
      ['4', 'Paid Search',     '32%', '28%', '−6pp ICP drop',  '→ Trim $8K/mo'],
      ['5', 'Content / SEO',   '14%', '14%', 'Aligned',        '→ Maintain'],
    ],
    step2Count: '18',
    attributionTable: {
      headers: ['#', 'Channel', 'Current Spend Share', 'Optimal Share (18mo)', 'ICP Match Rate', 'Conv. Rate'],
      rows: [
        { channel: 'Paid Search',    linear: '32%',  decay: '28%',  delta: '+4% overspend', deltaDir: 'down' },
        { channel: 'LinkedIn',       linear: '18%',  decay: '27%',  delta: '−9% underspend',deltaDir: 'up'   },
        { channel: 'Webinar / Event',linear: '12%',  decay: '16%',  delta: '−4% underspend',deltaDir: 'up'   },
        { channel: 'Content / SEO',  linear: '14%',  decay: '14%',  delta: '→ Aligned',     deltaDir: 'flat' },
        { channel: 'Paid Social',    linear: '19%',  decay: '11%',  delta: '+8% overspend', deltaDir: 'down' },
        { channel: 'Partner / Ref.', linear: '5%',   decay: '4%',   delta: '→ Aligned',     deltaDir: 'flat' },
      ],
    },
    roiTable: {
      headers: ['#', 'Channel', 'ICP Match Q4', 'ICP Match Q3', 'ICP Match Q2', 'Drift Trend'],
      rows: [
        { channel: 'LinkedIn',        rev: '71%',  cost: '68%',  roi: '64%',  delta: '↑ Improving', deltaDir: 'up'   },
        { channel: 'Content / SEO',   rev: '69%',  cost: '70%',  roi: '68%',  delta: '→ Stable',    deltaDir: 'flat' },
        { channel: 'Webinar / Event', rev: '74%',  cost: '73%',  roi: '71%',  delta: '↑ Improving', deltaDir: 'up'   },
        { channel: 'Paid Search',     rev: '58%',  cost: '61%',  roi: '64%',  delta: '↓ Declining', deltaDir: 'down' },
        { channel: 'Paid Social',     rev: '44%',  cost: '53%',  roi: '62%',  delta: '↓ Declining', deltaDir: 'down' },
        { channel: 'Partner / Ref.',  rev: '81%',  cost: '80%',  roi: '79%',  delta: '↑ Improving', deltaDir: 'up'   },
      ],
    },
  },

  // ─── S4: CHART ───────────────────────────────────────────────────────────────
  chart: {
    promptText: 'Create a dual-axis chart showing current spend allocation vs. optimal spend allocation per channel — add a second line showing ICP match rate trend over 3 quarters. Highlight Paid Social and LinkedIn in contrasting colours since they show the biggest misalignment.',
    promptStatic: 'Dual-axis chart: current vs. optimal spend allocation per channel, with ICP match rate trend overlay. Highlight Paid Social and LinkedIn misalignment.',
    title:   'Spend Allocation vs. Optimal Mix — with ICP Match Drift',
    legend:  ['Current spend allocation', 'Optimal allocation (18-mo historical)'],
    channels: [
      { label: 'Paid Social',    linearW: 76, linearVal: '19% spend', decayW: 44, decayVal: '11% optimal', delta: '+8% over',  deltaDir: 'down' },
      { label: 'Paid Search',    linearW: 80, linearVal: '32% spend', decayW: 70, decayVal: '28% optimal', delta: '+4% over',  deltaDir: 'down' },
      { label: 'Content / SEO',  linearW: 56, linearVal: '14% spend', decayW: 56, decayVal: '14% optimal', delta: '→ Aligned', deltaDir: 'flat' },
      { label: 'Partner / Ref.', linearW: 20, linearVal: '5% spend',  decayW: 16, decayVal: '4% optimal',  delta: '→ Aligned', deltaDir: 'flat' },
      { label: 'Webinar / Event',linearW: 48, linearVal: '12% spend', decayW: 64, decayVal: '16% optimal', delta: '−4% under', deltaDir: 'up'   },
      { label: 'LinkedIn',       linearW: 72, linearVal: '18% spend', decayW: 100,linearVal2:'27% optimal', delta: '−9% under', deltaDir: 'up'   },
    ],
    modal: {
      widgetTitle: 'Spend Allocation vs. Optimal Mix',
      widgetDesc:  'Compares current channel spend allocation against the 18-month historical mix that produced the highest closed-won conversion rates — with ICP match rate trend to surface quality drift.',
      dashboard:   'Source Mix Dashboard',
    },
  },

  // ─── S4b: MEMO ───────────────────────────────────────────────────────────────
  memo: {
    promptText: 'Write an executive memo summarising the source mix misalignment findings — include the key reallocation opportunity, the ICP drift signals, and 3 specific budget recommendations for this quarter.',
    cardTitle:  'Lead Source Mix — Q2 Reallocation Brief',
    title:      'Lead Source Mix & Budget Reallocation — Q2 Executive Brief',
    date:       'Feb 26, 2026',
    segment:    'All Inbound Channels · 90 Day Analysis vs. 18-Month Optimal',
    overview:   'This memo identifies misalignment between our current marketing spend allocation and the 18-month historical mix that produced the highest ICP conversion rates. The primary finding: we are <strong>over-investing in Paid Social by 8 percentage points</strong> while <strong>under-investing in LinkedIn by 9 points</strong> — despite LinkedIn showing consistently improving ICP match rates (64% → 71% over 3 quarters) and Paid Social showing the reverse (62% → 44%).',
    highlights: [
      { channel: 'Paid Social',     linear: '19% spend',  decay: '11% optimal', roi: '⚠ Over by 8pp' },
      { channel: 'LinkedIn',        linear: '18% spend',  decay: '27% optimal', roi: '↑ Under by 9pp' },
      { channel: 'Webinar / Event', linear: '12% spend',  decay: '16% optimal', roi: '↑ Under by 4pp' },
      { channel: 'Paid Search',     linear: '32% spend',  decay: '28% optimal', roi: '→ Over by 4pp'  },
    ],
    divergenceCallout: 'Paid Social is the most urgent reallocation target. Its ICP match rate has declined from 62% → 44% over 3 quarters while spend held flat at ~19%. The channel is producing more leads but fewer of the right leads — a quality-volume inversion that will compound over time if not corrected.',
    recommendations: [
      { label: '1. Reallocate $22K/month from Paid Social to LinkedIn.', body: 'LinkedIn\'s ICP match rate is improving quarter-over-quarter (64% → 71%) and it is 9 percentage points underfunded vs. the optimal mix. Shift $18K from Paid Social creative/targeting and $4K from Brand Awareness campaigns. Expected impact: +31 ICP-qualified leads/month based on LinkedIn\'s current conversion efficiency.' },
      { label: '2. Increase Webinar/Event budget by $8K/month.', body: 'Webinars produce the highest close-touch frequency of any channel — they appear in 74% of Enterprise Stage 3+ wins. Current budget is 4 percentage points below optimal. An additional $8K/month funds 1–2 additional targeted webinars per quarter with Enterprise-relevant topics.' },
      { label: '3. Audit Paid Search Brand Awareness campaigns.', body: 'Paid Search ICP match rate has slipped from 64% → 58% over 3 quarters, suggesting keyword or audience drift in Brand Awareness campaigns specifically. Performance Max campaigns are the likely driver. Pause Performance Max, shift to manual CPC on highest-ICP intent keywords. This can be done within the existing Paid Search budget.' },
    ],
    tags: ['Source Mix · Q2 2026', '6 Channels', 'ICP Match Drift', '3 Reallocation Recommendations'],
    widget: {
      overview:       'Paid Social overfunded by 8pp with declining ICP match rate (62% → 44%). LinkedIn underfunded by 9pp with improving match rate (64% → 71%). Reallocation opportunity: $22K/month.',
      recommendation: 'Shift $22K/month from Paid Social to LinkedIn. Add $8K to Webinar budget. Audit Paid Search Brand Awareness campaigns for ICP drift.',
      tags:           ['Source Mix · Q2 2026', 'ICP Match Drift', '3 Actions'],
    },
    modal: {
      widgetTitle: 'Source Mix Reallocation Brief',
      dashboard:   'Source Mix Dashboard',
    },
  },

  // ─── S4c: DEFINITIONS ────────────────────────────────────────────────────────
  definitions: {
    promptText: 'Create metric definitions for ICP match rate, channel spend alignment, and source mix optimization score — so the demand gen team can track these consistently each quarter.',
    panelTitle: 'Metric Definitions — Source Mix Analysis',
    cardTitle:  'Source Mix Metric Library — 3 definitions',
    items: [
      {
        name:  'ICP Match Rate',
        badge: 'Metric',
        desc:  'The percentage of leads from a given channel whose firmographic and behavioural profile matches your Ideal Customer Profile at the time of lead creation. Computed using a weighted score across company size, industry vertical, technology stack signals, and intent data — normalised to a 0–100 scale. A score above 65 indicates a high-quality lead source for your ICP.',
        logic: [
          'Pull lead enrichment data (company size, industry, tech stack) from the lead_enrichment_score custom field at lead creation.',
          'Score each lead against ICP criteria: company size band (20 pts), industry match (30 pts), tech signals (30 pts), intent tier (20 pts).',
          'ICP Match Rate = avg score for all leads from that channel / 100. Track by channel and by quarter.',
        ],
        tags:   ['Leads', 'lead_enrichment_score', 'ICP Criteria'],
        source: 'Source Mix Analysis',
      },
      {
        name:  'Channel Spend Alignment',
        badge: 'Metric',
        desc:  'The difference between a channel\'s current share of total marketing spend and its "optimal share" — defined as the spend allocation that historically produced the highest closed-won conversion rate, calculated from 18 months of historical data. Positive alignment gaps indicate overspend; negative gaps indicate underspend relative to historical performance.',
        logic: [
          'Calculate each channel\'s share of total marketing spend in the current period.',
          'Calculate the historical optimal share: the average spend allocation in quarters where closed-won revenue per dollar was highest, over the last 18 months.',
          'Channel Spend Alignment = current share − optimal share. Positive = overfunded vs. historical performance.',
        ],
        tags:   ['Campaign Spend', 'Closed-Won Revenue', 'Historical Optimal'],
        source: 'Source Mix Analysis',
      },
      {
        name:  'Source Mix Optimization Score',
        badge: 'Metric',
        desc:  'A composite score (0–100) measuring how closely the current channel spend allocation matches the historically optimal mix, weighted by ICP match rate for each channel. A score of 100 means spend is perfectly allocated across channels in proportion to their historical ICP conversion efficiency. Scores below 70 indicate material misalignment with significant reallocation opportunity.',
        logic: [
          'For each channel, calculate the squared deviation of current spend share from optimal share.',
          'Weight each deviation by that channel\'s ICP match rate (channels with higher ICP quality have more impact on the score).',
          'Source Mix Optimization Score = 100 − sum of weighted deviations, normalised to 0–100.',
        ],
        tags:   ['Channel Spend Alignment', 'ICP Match Rate', 'Historical Optimal'],
        source: 'Source Mix Analysis',
      },
    ],
  },

  // ─── S5: DASHBOARD ───────────────────────────────────────────────────────────
  dashboard: {
    title:    'Source Mix Optimization Dashboard',
    subtitle: 'Last updated: Feb 26, 2026 at 10:00 AM UTC · All Channels · 90 Day vs. 18-Month Optimal',
    roiTableTitle:  'Channel Mix — Actual vs. Optimal Spend',
    divergenceTitle:  'ICP Match Rate Drift by Channel',
    pathsTitle:  'Top Reallocation Opportunities',
    kpis: [
      { label: 'Mix Optimization Score', value: '64 / 100',  delta: '↓ Material misalignment detected',    dir: 'down' },
      { label: 'Largest Overspend',      value: 'Paid Social', delta: '⚠ +8pp vs optimal · ICP↓ 62→44%', dir: 'down' },
      { label: 'Largest Underspend',     value: 'LinkedIn',   delta: '↑ −9pp vs optimal · ICP↑ 64→71%',  dir: 'up'   },
      { label: 'Realloc. Opportunity',   value: '$22K/mo',    delta: '↑ From Paid Social to LinkedIn',     dir: 'up'   },
    ],
    roiTable: [
      { channel: 'Partner / Referral',  linearRoi: '81% ICP match', decayRoi: '↑ Improving', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Webinar / Event',     linearRoi: '74% ICP match', decayRoi: '↑ Improving', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'LinkedIn',            linearRoi: '71% ICP match', decayRoi: '↑ Improving', linearDir: 'up',   decayDir: 'up'   },
      { channel: 'Content / SEO',       linearRoi: '69% ICP match', decayRoi: '→ Stable',    linearDir: 'flat', decayDir: 'flat' },
      { channel: 'Paid Search',         linearRoi: '58% ICP match', decayRoi: '↓ Declining', linearDir: 'down', decayDir: 'down' },
      { channel: 'Paid Social',         linearRoi: '44% ICP match', decayRoi: '↓ Declining', linearDir: 'down', decayDir: 'down' },
    ],
    divergence: [
      { channel: 'Paid Social: −18pp ICP match over 3 qtrs',  delta: '⚠ Urgent', pct: 90, dir: 'down' },
      { channel: 'LinkedIn: −9pp underfunded vs optimal',      delta: '↑ Shift',  pct: 70, dir: 'up'   },
      { channel: 'Webinar: −4pp underfunded vs optimal',       delta: '↑ Add',    pct: 45, dir: 'up'   },
      { channel: 'Paid Search: −6pp ICP match over 3 qtrs',   delta: '→ Audit',  pct: 35, dir: 'down' },
    ],
    paths: [
      { path: 'Shift $22K/mo: Paid Social → LinkedIn',      opps: 31, color: '#4361ee' },
      { path: 'Add $8K/mo to Webinar budget',               opps: 12, color: '#a78bfa' },
      { path: 'Audit Paid Search Brand Awareness campaigns', opps: 8,  color: '#06b6d4' },
      { path: 'Maintain Partner Referral at current level',  opps: 6,  color: '#34d399' },
    ],
  },

  // ─── S6: SAGE ────────────────────────────────────────────────────────────────
  sage: {
    threadName: 'Source Mix Deep Dive',
    q1: 'Where should we reallocate budget this quarter?',
    a1: {
      intro: 'The data is clear — three moves will materially improve your source mix score and ICP quality:',
      bullets: [
        '<strong>Shift $22K/month from Paid Social to LinkedIn.</strong> LinkedIn ICP match rate has improved from 64% → 71% over 3 quarters and the channel is 9 percentage points underfunded vs. the historical optimal mix. Paid Social is the inverse — 8pp overfunded with ICP match dropping from 62% → 44%.',
        '<strong>Add $8K/month to Webinar/Event budget.</strong> Webinars produce the highest close-touch frequency of any channel (appear in 74% of Enterprise Stage 3+ wins) and are currently 4pp below optimal allocation. This funds 1–2 additional targeted webinars per quarter.',
        '<strong>Audit Paid Search Brand Awareness campaigns — pause Performance Max.</strong> Paid Search ICP match rate has slipped from 64% → 58%. Performance Max campaigns are likely the driver — they optimise for clicks, not ICP quality. Shift to manual CPC on high-intent keywords within the existing budget.',
      ],
      recommendation: 'Implement these three changes for Q2. Expected outcome: Source Mix Optimization Score improves from 64 → 79, ICP-qualified lead volume increases by an estimated +43 leads/month at current channel conversion rates, with no increase in total spend.',
    },
    q2: 'Why has Paid Social ICP match rate dropped so much?',
    a2: {
      intro: 'Three things are happening simultaneously in Paid Social:',
      bullets: [
        '<strong>Audience expansion in Q3:</strong> The targeting was broadened from 500–5000 employee companies to 100–10000 employees last August. The lower end of that range (100–500 employees) has an ICP match rate of 31% vs. 68% for the 500–5000 band — this diluted the overall match rate significantly.',
        '<strong>Performance Max campaigns launched in Q2:</strong> These campaigns optimise for click volume and conversion events (form fills), not lead quality. They have produced 34% more leads at 28% lower ICP match rates than the manual campaigns they partially replaced.',
        '<strong>Creative has not been refreshed since Q2:</strong> The top-performing creative assets are from March 2025. Ad fatigue is driving broader audience algorithms to serve to lower-quality audiences to maintain impression targets.',
      ],
      footer: 'Sourced from <strong>Campaigns</strong>, <strong>Leads</strong>, and <strong>lead_enrichment_score</strong> fields — audience and creative data pulled from your Paid Social integration. No external benchmarks used.',
    },
  },

  // ─── S7: WORKFLOW ────────────────────────────────────────────────────────────
  workflow: {
    name:         'Source Mix Monitor — Monthly Review',
    analysis:     'Lead Source Mix & ICP Match Rate by Channel',
    frequency:    'First Monday of every month at 9:00 AM',
    slackChannel: '#demand-gen',
    include:      'Mix optimization score + ICP match rate trends + Reallocation recommendations',
    confirmMsg:   'Sage will re-run the source mix analysis at the start of each month, track ICP match rate trends by channel, and post reallocation recommendations to <strong>#demand-gen</strong> before your monthly planning meeting.',
  },

  // ─── S8: SLACK ───────────────────────────────────────────────────────────────
  slack: {
    workspace:   'ACME Corp',
    channel:     '#demand-gen',
    reportTitle: '◈ Monthly Source Mix Review — Mar 3',
    cardTitle:   '◈ Channel Mix & ICP Match Rate — Q2 Update',
    bullets: [
      'Mix Optimization Score: 64/100 — material misalignment between spend and ICP conversion performance',
      '⚠ Paid Social: 19% spend · 44% ICP match (↓ from 62% in Q2) — urgent reallocation target',
      '↑ LinkedIn: 18% spend · 71% ICP match (↑ from 64%) — underfunded by 9pp vs optimal',
      'Webinar/Event: highest close-touch frequency · underfunded by 4pp vs optimal mix',
    ],
    recommendation: 'Shift $22K/month from Paid Social to LinkedIn for Q2. Add $8K to Webinar budget. Pause Performance Max on Paid Search — audit creative fatigue. Expected: Mix score improves 64 → 79, +43 ICP-qualified leads/month at no additional spend.',
    userContext:  'We just refreshed our Paid Social creative this week with new ICP-targeted assets — should change things.',
    sageContext:  'Good timing — new Paid Social creative launching this week with updated ICP targeting is exactly the right intervention. I\'ll start tracking ICP match rate for leads generated from the new creative vs. the old assets from week 1. If the new creative lifts match rate back above 55% within 30 days, I\'ll revise the reallocation recommendation — the $22K shift to LinkedIn may be reduced. I\'ll flag this in the April review.',
  },

};
