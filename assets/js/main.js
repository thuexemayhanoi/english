(function () {
  // Theme toggle: light / dark / auto
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var current = localStorage.getItem('theme') || 'auto';
  function apply(t) {
    if (t === 'dark' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }
  apply(current);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (current === 'auto') apply('auto');
  });
  if (btn) {
    btn.addEventListener('click', function () {
      current = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
      localStorage.setItem('theme', current);
      apply(current);
    });
  }

  // Mobile nav
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Sticky mobile nav active state
  var path = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.mobile-nav a[data-nav]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '');
    if (href && path === href) a.classList.add('active');
  });

  // Client-side search
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  if (input && results) {
    fetch(input.dataset.index)
      .then(function (r) { return r.json(); })
      .then(function (index) {
        function render(q) {
          results.innerHTML = '';
          if (q.length < 2) return;
          var terms = q.split(/\s+/);
          index.forEach(function (item) {
            var hay = (item.title + ' ' + item.description).toLowerCase();
            if (terms.every(function (t) { return hay.indexOf(t) !== -1; })) {
              var li = document.createElement('li');
              li.className = 'card';
              var a = document.createElement('a');
              a.href = item.url;
              var s1 = document.createElement('span');
              s1.className = 'card-title';
              s1.textContent = item.title;
              var s2 = document.createElement('span');
              s2.className = 'card-desc';
              s2.textContent = item.description;
              a.appendChild(s1); a.appendChild(s2);
              li.appendChild(a);
              results.appendChild(li);
            }
          });
          if (!results.children.length && q.length >= 2) {
            results.innerHTML = '<li>No matching guides.</li>';
          }
        }
        var initial = new URLSearchParams(location.search).get('q');
        if (initial) { input.value = initial; render(initial.trim().toLowerCase()); }
        input.addEventListener('input', function () {
          render(input.value.trim().toLowerCase());
        });
      });
  }
})();
