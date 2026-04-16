// Component loader — fetches shared navbar & footer HTML, injects them, then initialises navbar interactions.
(function () {
  var basePath = document.documentElement.getAttribute('data-base') || '';

  function loadComponent(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return Promise.resolve();
    return fetch(basePath + url)
      .then(function (r) { return r.text(); })
      .then(function (html) { el.innerHTML = html; });
  }

  Promise.all([
    loadComponent('#navbar-placeholder', '/components/navbar.html'),
    loadComponent('#footer-placeholder', '/components/footer.html')
  ]).then(function () {
    initNavbar();
    document.dispatchEvent(new Event('components-loaded'));
  });

  function initNavbar() {
    var menuBtn = document.querySelector('.navbar_menu-button');
    var menu = document.querySelector('.navbar_menu');
    var dropdowns = document.querySelectorAll('[data-dropdown]');
    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', function () {
      this.classList.toggle('is-open');
      menu.classList.toggle('is-open');
      document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
      var nav = document.querySelector('.navbar_component');
      if (nav) nav.classList.toggle('nav-menu-open', menu.classList.contains('is-open'));
    });

    dropdowns.forEach(function (dd) {
      var toggle = dd.querySelector('.navbar_dropdown-toggle');

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dd.classList.contains('is-open');
        dropdowns.forEach(function (other) { other.classList.remove('is-open'); });
        if (!isOpen) dd.classList.add('is-open');
        toggle.setAttribute('aria-expanded', !isOpen);
      });

      dd.addEventListener('mouseenter', function () {
        if (window.innerWidth > 991) {
          dd.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
      dd.addEventListener('mouseleave', function () {
        if (window.innerWidth > 991) {
          dd.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', function () {
      dropdowns.forEach(function (dd) {
        dd.classList.remove('is-open');
        dd.querySelector('.navbar_dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 991) {
        menuBtn.classList.remove('is-open');
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }
})();
