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

  // Client-side search
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  if (input && results) {
    fetch(input.dataset.index)
      .then(function (r) { return r.json(); })
      .then(function (index) {
        input.addEventListener('input', function () {
          var q = input.value.trim().toLowerCase();
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
          if (!results.children.length) {
            results.innerHTML = '<li>No matching guides.</li>';
          }
        });
      });
  }
})();
