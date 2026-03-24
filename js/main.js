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

// Feature accordion with auto-timer
(function() {
  var items = Array.from(document.querySelectorAll('.feature-accordion-item'));
  var demoWraps = document.querySelectorAll('.feature-tabs-demo .feature-tab-demo-wrap');
  if (!items.length) return;

  var demoMap = { 'tab-planning': 'ma-demo-wrap-planning', 'tab-metric-build': 'ma-demo-wrap-metric', 'tab-dashboards': 'ma-demo-wrap-dashboards' };
  var currentIndex = 0;
  var autoTimer = null;
  var INTERVAL = 8000;

  function activateItem(index) {
    items.forEach(function(i) { i.classList.remove('active'); });
    demoWraps.forEach(function(d) { d.classList.remove('active'); });

    items[index].classList.add('active');
    currentIndex = index;

    var panelId = items[index].getAttribute('data-panel');
    var targetDemo = document.getElementById(demoMap[panelId]);
    if (targetDemo) {
      targetDemo.classList.add('active');
      var iframeEl = targetDemo.querySelector('.feature-tab-demo-iframe');
      if (iframeEl) scaleMaIframe(targetDemo.id, iframeEl.id);
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(function() {
      var next = (currentIndex + 1) % items.length;
      activateItem(next);
    }, INTERVAL);
  }

  function stopAutoPlay() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  items.forEach(function(item, i) {
    item.querySelector('.feature-accordion-trigger').addEventListener('click', function() {
      activateItem(i);
      startAutoPlay();
    });
  });

  // Start auto-play
  activateItem(0);
  startAutoPlay();
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

// Persona recommendation tabs
function updatePersonaTabIndicator() {
  var wrap = document.querySelector('.persona-tabs-wrap');
  var active = wrap && wrap.querySelector('.p-tab.active');
  if (!wrap || !active) return;
  var wrapRect = wrap.getBoundingClientRect();
  var tabRect = active.getBoundingClientRect();
  var scrollOffset = wrap.scrollLeft;
  wrap.style.setProperty('--ptab-active-width', tabRect.width + 'px');
  wrap.style.setProperty('--ptab-active-x', (tabRect.left - wrapRect.left + scrollOffset) + 'px');
}

function switchPersonaTab(persona, btn) {
  document.querySelectorAll('.p-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.p-panel').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  var panel = document.getElementById('pp-' + persona);
  panel.classList.add('active');
  updatePersonaTabIndicator();
  // Reset skill subtabs to ROAS and update carousel arrows
  var firstSkillTab = panel.querySelector('.skill-subtab');
  if (firstSkillTab) switchSkillTab(firstSkillTab);
  // Update carousel arrow states for newly visible panel
  panel.querySelectorAll('.recs-grid').forEach(function(grid) {
    grid.scrollLeft = 0;
    grid.dispatchEvent(new Event('scroll'));
  });
}

// Init persona tab indicator on load
document.addEventListener('DOMContentLoaded', updatePersonaTabIndicator);
window.addEventListener('resize', updatePersonaTabIndicator);
(function() {
  var wrap = document.querySelector('.persona-tabs-wrap');
  if (wrap) wrap.addEventListener('scroll', updatePersonaTabIndicator);
})();

// Rec cards — wrap non-footer content for space-between layout
(function() {
  document.querySelectorAll('.rec-card').forEach(function(card) {
    var footer = card.querySelector('.rec-footer');
    if (!footer) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'rec-card-content';
    while (card.firstChild && card.firstChild !== footer) {
      wrapper.appendChild(card.firstChild);
    }
    card.insertBefore(wrapper, footer);
  });
})();

// Recs carousel — wrap grids and inject nav arrows
(function() {
  document.querySelectorAll('.recs-grid').forEach(function(grid) {
    var wrapper = document.createElement('div');
    wrapper.className = 'recs-carousel';
    grid.parentNode.insertBefore(wrapper, grid);
    wrapper.appendChild(grid);

    var nav = document.createElement('div');
    nav.className = 'recs-nav';
    nav.innerHTML = '<button class="recs-arrow recs-prev" aria-label="Previous"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/></svg></button><button class="recs-arrow recs-next" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg></button>';
    wrapper.appendChild(nav);

    var prevBtn = nav.querySelector('.recs-prev');
    var nextBtn = nav.querySelector('.recs-next');

    function getCardWidth() {
      var card = grid.querySelector('.rec-card');
      if (!card) return 300;
      return card.offsetWidth + 14;
    }

    function updateArrows() {
      prevBtn.disabled = grid.scrollLeft <= 5;
      nextBtn.disabled = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 5;
    }

    prevBtn.addEventListener('click', function() {
      grid.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function() {
      grid.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    grid.addEventListener('scroll', updateArrows);
    updateArrows();
  });
})();

// Skill sub-tabs within persona panels
function switchSkillTab(btn) {
  var panel = btn.closest('.p-panel');
  var skill = btn.getAttribute('data-skill');
  panel.querySelectorAll('.skill-subtab').forEach(function(t) { t.classList.remove('active'); });
  panel.querySelectorAll('.skill-subpanel').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  var subpanel = panel.querySelector('.skill-subpanel[data-skill="' + skill + '"]');
  subpanel.classList.add('active');
  // Reset and update carousel arrows
  subpanel.querySelectorAll('.recs-grid').forEach(function(grid) {
    grid.scrollLeft = 0;
    grid.dispatchEvent(new Event('scroll'));
  });
}

// Custom tags scroll — duplicate content for seamless loop
(function() {
  document.querySelectorAll('.custom-tags-col-inner').forEach(function(inner) {
    var clone = inner.innerHTML;
    inner.innerHTML += clone;
  });
})();


// Workflow nodes sequential loop — one active at a time
(function() {
  var container = document.querySelector('.workflow-map-nodes');
  if (!container) return;

  var nodes = Array.from(container.querySelectorAll('.wf-node'));
  var connectors = Array.from(container.querySelectorAll('.wf-connector'));
  var descs = Array.from(document.querySelectorAll('.wf-node-desc-wrap .wf-node-desc'));
  var lineDuration = 3000;
  var current = -1;
  var running = false;
  var timer = null;

  function clearAll() {
    nodes.forEach(function(n) { n.classList.remove('active'); });
    connectors.forEach(function(c) { c.classList.remove('active'); });
    descs.forEach(function(d) { d.classList.remove('active'); });
  }

  function activateNext() {
    if (!running) return;

    // Clear everything each step
    clearAll();

    // Move to next (loop)
    current = (current + 1) % nodes.length;

    // Activate current node
    nodes[current].classList.add('active');

    // Activate matching description
    if (descs[current]) descs[current].classList.add('active');

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
