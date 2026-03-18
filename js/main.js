// Navbar & Dropdown Logic
(function() {
  const menuBtn = document.querySelector('.navbar_menu-button');
  const menu = document.querySelector('.navbar_menu');
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  // Mobile menu toggle
  menuBtn.addEventListener('click', function() {
    this.classList.toggle('is-open');
    menu.classList.toggle('is-open');
    document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
  });

  // Dropdown toggle (click for mobile, hover for desktop)
  dropdowns.forEach(function(dd) {
    const toggle = dd.querySelector('.navbar_dropdown-toggle');

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = dd.classList.contains('is-open');
      // Close all other dropdowns
      dropdowns.forEach(function(other) { other.classList.remove('is-open'); });
      if (!isOpen) dd.classList.add('is-open');
      toggle.setAttribute('aria-expanded', !isOpen);
    });

    // Desktop hover
    dd.addEventListener('mouseenter', function() {
      if (window.innerWidth > 991) {
        dd.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
    dd.addEventListener('mouseleave', function() {
      if (window.innerWidth > 991) {
        dd.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function() {
    dropdowns.forEach(function(dd) {
      dd.classList.remove('is-open');
      dd.querySelector('.navbar_dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991) {
      menuBtn.classList.remove('is-open');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
})();

// Use Case Tabs & iframe scaling
  function switchTab(e, tabId) {
    const wrapper = e.target.closest('.feature-tabs-wrapper');
    wrapper.querySelectorAll('.feature-tab-btn').forEach(btn => btn.classList.remove('active'));
    wrapper.querySelectorAll('.feature-tab-panel').forEach(panel => panel.classList.remove('active'));
    e.target.classList.add('active');
    wrapper.querySelector('#' + tabId).classList.add('active');
    // Re-scale the metrics agent iframe for the newly visible tab
    const maIframeMap = {
      'tab-planning':    ['ma-demo-wrap-planning',   'ma-iframe-planning'],
      'tab-metric-build':['ma-demo-wrap-metric',     'ma-iframe-metric'],
      'tab-dashboards':  ['ma-demo-wrap-dashboards',  'ma-iframe-dashboards'],
    };
    if (maIframeMap[tabId]) {
      scaleMaIframe(maIframeMap[tabId][0], maIframeMap[tabId][1]);
    }
  }

  // ── Metrics Agent iframe scaling ──
  function scaleMaIframe(wrapId, iframeId) {
    const wrap   = document.getElementById(wrapId);
    const iframe = document.getElementById(iframeId);
    if (!wrap || !iframe) return;
    const scale = wrap.offsetWidth / 1080;
    iframe.style.transform       = 'scale(' + scale + ')';
    iframe.style.transformOrigin = 'top left';
    wrap.style.height            = (660 * scale) + 'px';
  }

  function scaleAllMaIframes() {
    scaleMaIframe('ma-demo-wrap-planning',   'ma-iframe-planning');
    scaleMaIframe('ma-demo-wrap-metric',     'ma-iframe-metric');
    scaleMaIframe('ma-demo-wrap-dashboards', 'ma-iframe-dashboards');
  }

  window.addEventListener('resize', scaleAllMaIframes);
  window.addEventListener('load',   scaleAllMaIframes);
  // Also scale once DOM is ready (before full load)
  document.addEventListener('DOMContentLoaded', scaleAllMaIframes);
