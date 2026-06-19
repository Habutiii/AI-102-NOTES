(function () {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    return;
  }
  const storageKey = 'ai102-sidebar-collapsed';

  const sections = [
    {
      label: 'Overview',
      links: [
        { file: 'index.html', title: 'Exam Overview' }
      ]
    },
    {
      label: 'Module 1',
      links: [
        { file: 'm1.html', title: 'Azure AI Services' }
      ]
    },
    {
      label: 'Module 2',
      links: [
        { file: 'm2.html', title: 'Computer Vision' }
      ]
    },
    {
      label: 'Module 3',
      links: [
        { file: 'm3.html', title: 'Azure AI Language' },
        { file: 'translator.html', title: 'Azure AI Translator' }
      ]
    },
    {
      label: 'Module 4',
      links: [
        { file: 'm4.html', title: 'Speech Services' }
      ]
    },
    {
      label: 'Module 5',
      links: [
        { file: 'm5.html', title: 'Language Understanding (CLU)' }
      ]
    },
    {
      label: 'Module 6',
      links: [
        { file: 'm6.html', title: 'Document Intelligence' }
      ]
    },
    {
      label: 'Module 7',
      links: [
        { file: 'm7.html', title: 'Knowledge Mining & AI Search' }
      ]
    },
    {
      label: 'Module 8',
      links: [
        { file: 'm8.html', title: 'Azure OpenAI & Generative AI' }
      ]
    },
    {
      label: 'Module 9',
      links: [
        { file: 'm9.html', title: 'Content Safety & Responsible AI' }
      ]
    },
    {
      label: 'Platform',
      links: [
        { file: 'foundry.html', title: 'Azure AI Foundry' }
      ]
    },
    {
      label: 'Reference',
      links: [
        { file: 'pricing.html', title: 'Tiers & Pricing' },
        { file: 'quickref.html', title: 'Quick Reference' },
        { file: 'api-list.html', title: 'API List' },
        { file: 'test.html', title: 'Quick Test' }
      ]
    }
  ];

  sidebar.innerHTML =
    '<div class="sidebar-header"><div class="sidebar-header-content"><span class="sidebar-title">AI-102</span><span class="sidebar-subtitle">Azure AI Engineer Associate</span></div></div>' +
    '<nav>' +
    sections.map(function (section) {
      return (
        '<div class="section-label">' + section.label + '</div>' +
        section.links.map(function (link) {
          return '<a href="' + link.file + '">' + link.title + '</a>';
        }).join('')
      );
    }).join('') +
    '</nav>';

  const header = sidebar.querySelector('.sidebar-header');
  const nav = sidebar.querySelector('nav');
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function (link) {
    if (link.getAttribute('href').split('#')[0] === cur) {
      link.classList.add('active');
    }
  });

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span>Menu</span><span class="sidebar-toggle-icon" aria-hidden="true">+</span>';
  header.appendChild(toggle);

  function setCollapsed(collapsed) {
    sidebar.classList.toggle('is-collapsed', collapsed);
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Open navigation' : 'Close navigation');
    try {
      window.localStorage.setItem(storageKey, collapsed ? '1' : '0');
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function readStoredState() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function applySidebarState() {
    const stored = readStoredState();
    if (stored === '1' || stored === '0') {
      setCollapsed(stored === '1');
      return;
    }
    setCollapsed(window.matchMedia('(max-width: 768px)').matches);
  }

  toggle.addEventListener('click', function () {
    setCollapsed(!sidebar.classList.contains('is-collapsed'));
  });

  nav.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!link || !window.matchMedia('(max-width: 768px)').matches) {
      return;
    }
    setCollapsed(true);
  });

  window.addEventListener('resize', applySidebarState);
  applySidebarState();
})();
