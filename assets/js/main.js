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

  // Header navigation: disclosure dropdowns + mobile panel
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  var groups = Array.prototype.slice.call(document.querySelectorAll('.nav-group'));
  var hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function closeGroup(group) {
    group.classList.remove('open');
    var btn = group.querySelector('.nav-drop-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  function closeAllGroups(except) {
    groups.forEach(function (g) { if (g !== except) closeGroup(g); });
  }
  function toggleGroup(group) {
    var willOpen = !group.classList.contains('open');
    closeAllGroups(group);
    group.classList.toggle('open', willOpen);
    var btn = group.querySelector('.nav-drop-btn');
    if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }

  groups.forEach(function (group) {
    var btn = group.querySelector('.nav-drop-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleGroup(group);
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!group.classList.contains('open')) toggleGroup(group);
        var first = group.querySelector('.nav-dropdown a');
        if (first) first.focus();
      }
    });
    if (hoverCapable) {
      group.addEventListener('mouseenter', function () {
        closeAllGroups(group);
        group.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      });
      group.addEventListener('mouseleave', function () { closeGroup(group); });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openGroup = groups.filter(function (g) { return g.classList.contains('open'); })[0];
    if (openGroup) {
      var b = openGroup.querySelector('.nav-drop-btn');
      closeGroup(openGroup);
      if (b) b.focus();
    } else if (nav && nav.classList.contains('open') && navToggle) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav-group')) closeAllGroups();
  });

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) closeAllGroups();
    });
  }

  // Current-section indication: hub links + their parent group
  var navPath = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.site-nav a[data-section]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '');
    if (href && (navPath === href || navPath.indexOf(href + '/') === 0)) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'true');
      var group = a.closest('.nav-group');
      if (group) group.classList.add('current');
    }
  });

  // Sticky mobile nav active state
  var path = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.mobile-nav a[data-nav]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '');
    if (href && path === href) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
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

  // ---- Status pill: open/closed by Hanoi time, updates every minute ----
  var pill = document.getElementById('statusPill');
  if (pill) {
    var openH = parseInt(pill.dataset.open, 10) || 9;
    var closeH = parseInt(pill.dataset.close, 10) || 21;
    function updateStatus() {
      // Format Hanoi wall-clock time (Asia/Ho_Chi_Minh, UTC+7)
      var now = new Date();
      var utc = now.getTime() + now.getTimezoneOffset() * 60000;
      var hn = new Date(utc + 7 * 3600000);
      var h = hn.getHours();
      var isOpen = h >= openH && h < closeH;
      pill.classList.toggle('is-open', isOpen);
      pill.classList.toggle('is-closed', !isOpen);
      pill.setAttribute('data-status', isOpen ? 'Open' : 'Closed');
      pill.setAttribute('aria-label', (isOpen ? 'Open now' : 'Closed now') + '. Hours 09:00 to 21:00 daily.');
    }
    updateStatus();
    setInterval(updateStatus, 60000);
  }

  // ---- Contact action sheet ----
  var sheet = document.getElementById('contactSheet');
  var backdrop = document.getElementById('sheetBackdrop');
  var sheetClose = document.getElementById('sheetClose');
  var lastFocused = null;
  var backdropHideTimer = null;

  function openSheet(trigger) {
    if (!sheet) return;
    if (backdropHideTimer) { window.clearTimeout(backdropHideTimer); backdropHideTimer = null; }
    lastFocused = trigger || document.activeElement;
    // Single-overlay rule: tell other overlays (Guide Assistant) to close
    document.dispatchEvent(new CustomEvent('overlay:opening', { detail: { id: 'contact' } }));
    if (backdrop) { backdrop.hidden = false; backdrop.classList.add('is-open'); }
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = sheet.querySelector('.sheet-action, .sheet-close');
    if (first) first.focus();
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      if (backdropHideTimer) window.clearTimeout(backdropHideTimer);
      backdropHideTimer = window.setTimeout(function () {
        backdropHideTimer = null;
        // Only hide if the sheet is still closed (reopened before the fade finished)
        if (backdrop && sheet && !sheet.classList.contains('is-open')) backdrop.hidden = true;
      }, 220);
    }
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  if (sheetClose) sheetClose.addEventListener('click', closeSheet);
  if (backdrop) backdrop.addEventListener('click', closeSheet);
  // Single-overlay rule: Guide Assistant opening closes the contact sheet
  document.addEventListener('overlay:opening', function (e) {
    if (e.detail && e.detail.id !== 'contact' && sheet && sheet.classList.contains('is-open')) closeSheet();
  });
  // Close after following a sheet action (so back-to-page feels clean)
  if (sheet) {
    sheet.querySelectorAll('[data-sheet-close]').forEach(function (el) {
      el.addEventListener('click', function () { setTimeout(closeSheet, 0); });
    });
  }
  // Sheet triggers: bottom-nav Contact + quick-action Contact (mobile-first enhancement)
  document.querySelectorAll('[data-sheet="contact"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      // Only intercept when the sheet is usable (mobile). Desktop falls through to /contact/.
      if (window.matchMedia('(max-width: 640px)').matches && sheet) {
        e.preventDefault();
        openSheet(el);
      }
    });
  });

  // ---- Search page: clear button + suggested topics ----
  var sInput = document.getElementById('searchInput');
  var sClear = document.getElementById('searchClear');
  var sSuggest = document.getElementById('searchSuggest');
  if (sInput && sClear) {
    function syncClear() {
      var has = sInput.value.length > 0;
      sClear.hidden = !has;
      if (sSuggest) sSuggest.style.display = has ? 'none' : '';
    }
    sClear.addEventListener('click', function () { sInput.value = ''; sInput.focus(); syncClear(); });
    sInput.addEventListener('input', syncClear);
    syncClear();
  }

  // ---- Articles library: client-side filter (enhancement only; no JS = all guides visible) ----
  var gInput = document.getElementById('guidesInput');
  var gClear = document.getElementById('guidesClear');
  var gNone = document.getElementById('guidesNoResults');
  if (gInput) {
    var gGroups = Array.prototype.slice.call(document.querySelectorAll('.topic-group'));
    function applyGuideFilter() {
      var q = gInput.value.trim().toLowerCase();
      if (gClear) gClear.hidden = q.length === 0;
      var anyVisible = false;
      gGroups.forEach(function (g) {
        var cards = g.querySelectorAll('.card');
        var visible = 0;
        Array.prototype.forEach.call(cards, function (card) {
          var hay = card.getAttribute('data-search') || '';
          var hit = !q || hay.indexOf(q) !== -1;
          card.hidden = !hit;
          if (hit) visible++;
        });
        g.hidden = q.length > 0 && visible === 0;
        if (visible > 0) anyVisible = true;
      });
      if (gNone) gNone.hidden = !(q.length > 0 && !anyVisible);
    }
    if (gClear) gClear.addEventListener('click', function () { gInput.value = ''; gInput.focus(); applyGuideFilter(); });
    gInput.addEventListener('input', applyGuideFilter);
    applyGuideFilter();
  }

  // Escape closes the contact sheet (single state flow: openSheet/closeSheet)
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var cs = document.getElementById('contactSheet');
    if (cs && cs.classList.contains('is-open') && typeof closeSheet === 'function') closeSheet();
  });

  // ============================================================
  // ARTICLE PAGE ENHANCEMENTS (progressive enhancement; no JS = plain article)
  // Owned by _layouts/article.html. ~2.5KB.
  // ============================================================

  // ---- Reading progress bar (transform-only, rAF-throttled) ----
  var progressBar = document.getElementById('readingProgressBar');
  var progressWrap = document.getElementById('readingProgress');
  var progressRaf = null;
  function updateProgress() {
    progressRaf = null;
    var body = document.body;
    var doc = document.documentElement;
    var max = (doc.scrollHeight - doc.clientHeight) || 0;
    var pct = max > 40 ? Math.min(1, Math.max(0, (window.pageYOffset || body.scrollTop) / max)) : 0;
    progressBar.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    if (progressWrap) progressWrap.classList.toggle('is-active', max > 40);
  }
  function onScrollProgress() { if (!progressRaf) progressRaf = window.requestAnimationFrame(updateProgress); }
  if (progressBar && progressWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', onScrollProgress, { passive: true });
    window.addEventListener('resize', onScrollProgress, { passive: true });
    updateProgress();
  }

  // ---- Article TOC: generated from rendered H2/H3 ----
  var tocNav = document.getElementById('articleToc');
  var railSlot = document.getElementById('tocRailSlot');
  var articleBody = document.querySelector('.article-body');
  if (tocNav && articleBody) {
    var headings = Array.prototype.slice.call(articleBody.querySelectorAll('h2, h3'));
    var used = {};
    function slugify(text) {
      return ('toc-' + String(text).toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/&[a-z]+;/gi, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-')).replace(/^-+|-+$/g, '') || 'toc-section';
    }
    var items = [];
    headings.forEach(function (h) {
      var text = (h.textContent || '').trim();
      if (!text) return;
      if (!h.id) {
        var base = slugify(text);
        var id = base; var n = 2;
        while (used[id]) { id = base + '-' + n; n++; }
        used[id] = true;
        h.id = id;
      } else {
        used[h.id] = true;
      }
      items.push({ el: h, id: h.id, text: text, level: h.tagName.toLowerCase() });
    });

    if (items.length >= 2) {
      var head = document.createElement('button');
      head.type = 'button';
      head.className = 'article-toc-head';
      head.setAttribute('aria-expanded', 'false');
      head.setAttribute('aria-controls', 'articleTocList');
      head.innerHTML = 'On this page <svg class="icon chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 15.5 5.5 9l1.4-1.4L12 12.7l5.1-5.1L18.5 9 12 15.5z"/></svg>';
      var list = document.createElement('ul');
      list.className = 'article-toc-list';
      list.id = 'articleTocList';
      items.forEach(function (it) {
        var li = document.createElement('li');
        li.className = it.level === 'h3' ? 'toc-h3' : 'toc-h2';
        var a = document.createElement('a');
        a.href = '#' + it.id;
        a.textContent = it.text;
        li.appendChild(a);
        list.appendChild(li);
      });
      tocNav.appendChild(head);
      tocNav.appendChild(list);
      tocNav.removeAttribute('hidden');

      head.addEventListener('click', function () {
        var open = tocNav.getAttribute('data-open') === 'true';
        tocNav.setAttribute('data-open', open ? 'false' : 'true');
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
      });

      // Desktop: move TOC into the sticky rail; mobile: keep inline (collapsed)
      var railMq = window.matchMedia('(min-width: 1100px)');
      function placeToc() {
        var inRail = tocNav.parentNode === railSlot;
        if (railMq.matches && !inRail) {
          railSlot.appendChild(tocNav);
          tocNav.setAttribute('data-open', 'true');
          tocNav.setAttribute('data-open-rail', 'true');
        } else if (!railMq.matches && inRail) {
          tocNav.removeAttribute('data-open-rail');
          tocNav.setAttribute('data-open', 'false');
          head.setAttribute('aria-expanded', 'false');
          // insert back where it originally sat: before .article-body inside .article-main
          articleBody.parentNode.insertBefore(tocNav, articleBody);
        }
      }
      placeToc();
      if (railMq.addEventListener) railMq.addEventListener('change', placeToc);

      // Active section highlight (rAF-throttled scroll)
      var tocLinks = Array.prototype.slice.call(list.querySelectorAll('a'));
      var tocRaf = null;
      function highlightToc() {
        tocRaf = null;
        var pos = window.pageYOffset + 120;
        var current = null;
        for (var i = 0; i < items.length; i++) {
          if (items[i].el.getBoundingClientRect().top + window.pageYOffset <= pos) current = items[i].id;
        }
        tocLinks.forEach(function (a) {
          a.classList.toggle('toc-active', a.getAttribute('href') === '#' + current);
        });
      }
      function onScrollToc() { if (!tocRaf) tocRaf = window.requestAnimationFrame(highlightToc); }
      window.addEventListener('scroll', onScrollToc, { passive: true });
      highlightToc();
    }
  }

})();
