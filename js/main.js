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

// Feature accordion
(function() {
  var items = document.querySelectorAll('.feature-accordion-item');
  var demoWraps = document.querySelectorAll('.feature-tabs-demo .feature-tab-demo-wrap');

  items.forEach(function(item) {
    item.querySelector('.feature-accordion-trigger').addEventListener('click', function() {
      var panelId = item.getAttribute('data-panel');

      // Deactivate all
      items.forEach(function(i) { i.classList.remove('active'); });
      demoWraps.forEach(function(d) { d.classList.remove('active'); });

      // Activate clicked
      item.classList.add('active');
      var demoMap = { 'tab-planning': 'ma-demo-wrap-planning', 'tab-metric-build': 'ma-demo-wrap-metric', 'tab-dashboards': 'ma-demo-wrap-dashboards' };
      var targetDemo = document.getElementById(demoMap[panelId]);
      if (targetDemo) {
        targetDemo.classList.add('active');
        // Re-scale iframe
        var iframeId = targetDemo.querySelector('.feature-tab-demo-iframe');
        if (iframeId) {
          scaleMaIframe(targetDemo.id, iframeId.id);
        }
      }
    });
  });
})();

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

// Workflow nodes sequential loop — one active at a time
(function() {
  var container = document.querySelector('.workflow-map-nodes');
  if (!container) return;

  var nodes = Array.from(container.querySelectorAll('.wf-node'));
  var connectors = Array.from(container.querySelectorAll('.wf-connector'));
  var lineDuration = 3000;
  var current = -1;
  var running = false;
  var timer = null;

  function clearAll() {
    nodes.forEach(function(n) { n.classList.remove('active'); });
    connectors.forEach(function(c) { c.classList.remove('active'); });
  }

  function activateNext() {
    if (!running) return;

    // Clear everything each step
    clearAll();

    // Move to next (loop)
    current = (current + 1) % nodes.length;

    // Activate current node
    nodes[current].classList.add('active');

    // Flow the connector OUT of this node to the next
    if (current < connectors.length) {
      connectors[current].classList.add('active');
      timer = setTimeout(activateNext, lineDuration);
    } else {
      // Last node — hold then loop back
      timer = setTimeout(activateNext, lineDuration);
    }
  }

  function start() {
    if (running) return;
    running = true;
    current = -1;
    activateNext();
  }

  function stop() {
    running = false;
    if (timer) clearTimeout(timer);
    timer = null;
    clearAll();
    current = -1;
  }

  // Start/stop based on visibility
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);
})();
