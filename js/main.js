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
    if (targetDemo) targetDemo.classList.add('active');
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

// Skill pills marquee — triplicate for seamless loop with 3 items
(function() {
  document.querySelectorAll('.skill-pills-track').forEach(function(track) {
    var original = track.innerHTML;
    track.innerHTML = original + original + original;
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


// FAQ accordion
(function() {
  document.querySelectorAll('[data-faq] .mktg-faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.mktg-faq-item');
      var isOpen = item.classList.contains('is-open');
      // Close all others
      document.querySelectorAll('.mktg-faq-item.is-open').forEach(function(other) {
        other.classList.remove('is-open');
        other.querySelector('.mktg-faq-question').setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


// Capabilities accordion with auto-timer
(function() {
  var items = Array.from(document.querySelectorAll('.cap-accordion-item'));
  var demoPanels = document.querySelectorAll('.cap-demo-panel');
  if (!items.length) return;

  var currentIndex = 0;
  var autoTimer = null;
  var INTERVAL = 8000;

  function activateItem(index) {
    items.forEach(function(i) { i.classList.remove('active'); });
    demoPanels.forEach(function(d) { d.classList.remove('active'); });
    items[index].classList.add('active');
    currentIndex = index;
    var panelId = items[index].getAttribute('data-cap-panel');
    var target = document.getElementById(panelId);
    if (target) target.classList.add('active');
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
    item.querySelector('.cap-accordion-trigger').addEventListener('click', function() {
      activateItem(i);
      startAutoPlay();
    });
  });

  activateItem(0);
  startAutoPlay();
})();


// Navbar dark mode over dark sections
(function() {
  var isDark = false;

  function updateNavDark() {
    var nav = document.querySelector('.navbar_component');
    var logo = nav && nav.querySelector('.navbar_logo');
    if (!nav || !logo) return;

    var darkSections = document.querySelectorAll('.mktg-role-section');
    var navBottom = nav.getBoundingClientRect().bottom;
    var inDark = false;

    darkSections.forEach(function(section) {
      // Skip hidden sections
      if (section.style.display === 'none') return;
      var rect = section.getBoundingClientRect();
      if (rect.top < navBottom && rect.bottom > navBottom) {
        inDark = true;
      }
    });

    if (inDark && !isDark) {
      isDark = true;
      nav.classList.add('nav-dark');
      logo.src = 'assets/petavue-logo-white.svg';
    } else if (!inDark && isDark) {
      isDark = false;
      nav.classList.remove('nav-dark');
      logo.src = 'assets/petavue-icon.svg';
    }
  }

  window.addEventListener('scroll', updateNavDark, { passive: true });
  document.addEventListener('components-loaded', function() {
    updateNavDark();
  });
})();


// Navbar transparent → filled on scroll
(function() {
  function updateNav() {
    var nav = document.querySelector('.navbar_component');
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  // Also run after components load in case navbar is injected late
  document.addEventListener('components-loaded', updateNav);
  updateNav();
})();


// Capabilities panel accordion
(function() {
  document.querySelectorAll('.cap-acc-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var item = trigger.closest('.cap-acc-item');
      var accordion = item.closest('.cap-panel-accordion');
      if (item.classList.contains('is-open')) return;
      accordion.querySelectorAll('.cap-acc-item').forEach(function(i) { i.classList.remove('is-open'); });
      item.classList.add('is-open');
    });
  });
})();

// Capabilities tab switching with sliding indicator
(function() {
  var strip = document.querySelector('.cap-tabs-strip');
  var tabs = document.querySelectorAll('.cap-tab');
  var panels = document.querySelectorAll('.cap-tab-panel');
  if (!strip || !tabs.length || !panels.length) return;

  function updateIndicator(tab) {
    var x = tab.offsetLeft;
    var w = tab.offsetWidth;
    strip.style.setProperty('--cap-active-x', x + 'px');
    strip.style.setProperty('--cap-active-width', w + 'px');
  }

  // Set initial position
  var activeTab = strip.querySelector('.cap-tab.is-active');
  if (activeTab) updateIndicator(activeTab);

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.getAttribute('data-cap-tab');
      tabs.forEach(function(t) { t.classList.remove('is-active'); });
      panels.forEach(function(p) { p.classList.remove('is-active'); });
      tab.classList.add('is-active');
      updateIndicator(tab);
      // Pause and reset all cap videos
      panels.forEach(function(p) {
        var v = p.querySelector('video');
        if (v) { v.pause(); v.currentTime = 0; }
        var b = p.querySelector('.video-play-btn');
        if (b) b.classList.remove('is-paused');
      });
      var panel = document.querySelector('.cap-tab-panel[data-cap-panel="' + target + '"]');
      if (panel) {
        panel.classList.add('is-active');
        // Play the new panel's video
        var newVideo = panel.querySelector('video');
        if (newVideo) { newVideo.currentTime = 0; newVideo.play(); }
      }
    });
  });
})();

// Video play/pause + play only when in view
(function() {
  var userPaused = new Map();

  function togglePlay(video, btn) {
    if (video.paused) {
      video.play();
      userPaused.set(video, false);
      if (btn) btn.classList.remove('is-paused');
    } else {
      video.pause();
      userPaused.set(video, true);
      if (btn) btn.classList.add('is-paused');
    }
  }

  // IntersectionObserver — play when in view, pause when out
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var video = entry.target.querySelector('video');
      var btn = entry.target.querySelector('.video-play-btn');
      if (!video) return;
      if (entry.isIntersecting) {
        if (!userPaused.get(video)) {
          video.play();
          if (btn) btn.classList.remove('is-paused');
        }
      } else {
        video.pause();
        video.currentTime = 0;
        userPaused.set(video, false);
        if (btn) btn.classList.remove('is-paused');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.video-wrap').forEach(function(wrap) {
    var video = wrap.querySelector('video');
    var btn = wrap.querySelector('.video-play-btn');
    if (!video) return;

    // Don't autoplay — let observer handle it
    video.pause();

    video.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(video);
    });

    if (btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlay(video, btn);
      });
    }

    // Inject fullscreen hint button
    var fsBtn = document.createElement('button');
    fsBtn.className = 'video-fs-btn';
    fsBtn.setAttribute('aria-label', 'View fullscreen');
    fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,48V96a8,8,0,0,1-16,0V67.31l-50.34,50.35a8,8,0,0,1-11.32-11.32L188.69,56H160a8,8,0,0,1,0-16h48A8,8,0,0,1,216,48ZM106.34,138.34,56,188.69V160a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16H67.31l50.35-50.34a8,8,0,0,0-11.32-11.32Z"/></svg><span>View fullscreen</span>';
    wrap.appendChild(fsBtn);
    fsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox(video);
    });

    observer.observe(wrap);
  });

  // Lightbox
  var lightbox, lightboxVideo, lastInlineVideo;

  function buildLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'video-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = '' +
      '<div class="video-lightbox-inner">' +
      '  <button class="video-lightbox-close" aria-label="Close">' +
      '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>' +
      '  </button>' +
      '  <video class="video-lightbox-video" controls playsinline></video>' +
      '</div>';
    document.body.appendChild(lightbox);
    lightboxVideo = lightbox.querySelector('video');

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.querySelector('.video-lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  function openLightbox(sourceVideo) {
    if (!lightbox) buildLightbox();
    var src = sourceVideo.querySelector('source') ? sourceVideo.querySelector('source').src : sourceVideo.src;
    if (!src) return;
    lastInlineVideo = sourceVideo;
    sourceVideo.pause();
    lightboxVideo.src = src;
    lightboxVideo.currentTime = 0;
    lightbox.classList.add('is-open');
    document.body.classList.add('video-lightbox-open');
    lightboxVideo.play().catch(function() {});
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('video-lightbox-open');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    if (lastInlineVideo) {
      var wrap = lastInlineVideo.closest('.video-wrap');
      var rect = wrap ? wrap.getBoundingClientRect() : null;
      var inView = rect && rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !userPaused.get(lastInlineVideo)) lastInlineVideo.play().catch(function() {});
    }
  }
})();

// Hero media scroll reveal — scale + opacity
(function() {
  var heroMedia = document.querySelector('.hero-media');
  if (!heroMedia) return;

  function updateTransform() {
    if (window.innerWidth <= 991) {
      heroMedia.style.transform = 'none';
      heroMedia.style.opacity = '1';
      return;
    }
    var rect = heroMedia.getBoundingClientRect();
    var windowH = window.innerHeight;
    var progress = Math.min(Math.max((windowH - rect.top) / (windowH * 0.6), 0), 1);
    var scale = 0.7 + 0.3 * progress;
    var opacity = progress;
    heroMedia.style.transform = 'scale(' + scale + ')';
    heroMedia.style.opacity = opacity;
  }

  window.addEventListener('scroll', updateTransform, { passive: true });
  window.addEventListener('resize', updateTransform, { passive: true });
  updateTransform();
})();

// How-it-works step badges (static — no animation)
