(function () {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    return;
  }

  const header = sidebar.querySelector('.sidebar-header');
  const nav = sidebar.querySelector('nav');
  if (!header || !nav) {
    return;
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span>Menu</span><span class="sidebar-toggle-icon" aria-hidden="true">+</span>';
  header.appendChild(toggle);

  function applyMobileState() {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    if (!mobile) {
      sidebar.classList.remove('is-collapsed');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Navigation visible');
      return;
    }

    if (!sidebar.classList.contains('is-collapsed') && toggle.getAttribute('data-ready') !== 'true') {
      sidebar.classList.add('is-collapsed');
    }
    toggle.setAttribute('aria-expanded', String(!sidebar.classList.contains('is-collapsed')));
    toggle.setAttribute('aria-label', sidebar.classList.contains('is-collapsed') ? 'Open navigation' : 'Close navigation');
    toggle.setAttribute('data-ready', 'true');
  }

  toggle.addEventListener('click', function () {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      return;
    }
    sidebar.classList.toggle('is-collapsed');
    const expanded = !sidebar.classList.contains('is-collapsed');
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  });

  nav.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!link || !window.matchMedia('(max-width: 768px)').matches) {
      return;
    }
    sidebar.classList.add('is-collapsed');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  });

  window.addEventListener('resize', applyMobileState);
  applyMobileState();
})();
