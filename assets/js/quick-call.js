/* English Quick Call — measured collision avoidance for dock and chat.
   No dependencies, no mutation of other floating UI, no polling. */
(function () {
  'use strict';
  var root = document.getElementById('quickCall');
  var toggle = document.getElementById('quickCallToggle');
  var actions = document.getElementById('quickCallActions');
  if (!root || !toggle || !actions) return;

  var gap = 14;
  var raf = 0;
  var ro = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  var tracked = [];
  var obstacleSelector = [
    '.assistant-fab', '#assistantFab', '.chat-fab', '#chat-fab',
    '[data-floating-widget]', '.floating-widget', '.chat-widget-launcher'
  ].join(', ');

  function expanded() { return root.dataset.open === 'true'; }
  function setOpen(open) {
    root.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', String(!!open));
    actions.hidden = !open;
    schedule();
  }
  function visible(el) {
    if (!el || el === root || root.contains(el) || el.hidden) return false;
    var style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    var b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0 &&
      b.right > 0 && b.left < window.innerWidth && b.bottom > 0 && b.top < window.innerHeight;
  }
  function intersects(a, b) {
    return a.left < b.right + gap && a.right > b.left - gap &&
      a.top < b.bottom + gap && a.bottom > b.top - gap;
  }
  function observeElements(elements) {
    if (!ro) return;
    tracked.forEach(function (el) { if (elements.indexOf(el) === -1) ro.unobserve(el); });
    elements.forEach(function (el) { if (tracked.indexOf(el) === -1) ro.observe(el); });
    tracked = elements;
  }
  function sync() {
    raf = 0;
    var assistantPanel = document.getElementById('assistantPanel');
    var contactSheet = document.getElementById('contactSheet');
    var focus = document.activeElement;
    var editing = focus && /^(INPUT|TEXTAREA|SELECT)$/.test(focus.tagName);
    var viewport = window.visualViewport;
    var keyboard = viewport && window.innerHeight - viewport.height > 140;
    var blocked = (assistantPanel && assistantPanel.classList.contains('is-open')) ||
      (contactSheet && contactSheet.classList.contains('is-open')) ||
      (editing && keyboard);
    if (blocked) {
      if (expanded()) setOpen(false);
      root.hidden = true;
      return;
    }
    root.hidden = false;
    var nav = document.querySelector('.mobile-nav');
    var elements = Array.prototype.slice.call(document.querySelectorAll(obstacleSelector));
    if (nav) elements.push(nav);
    observeElements(elements);
    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var size = toggle.getBoundingClientRect().width || 56;
    var base = vw <= 640 ? 90 : 24;
    if (visible(nav)) base = Math.max(base, vh - nav.getBoundingClientRect().top + 18);
    var obstacles = elements.filter(function (el) { return el !== nav && visible(el); })
      .map(function (el) { return el.getBoundingClientRect(); });
    var menuH = expanded() ? (actions.offsetHeight + 12) : 0;
    var menuW = expanded() ? actions.offsetWidth : size;
    var choices = ['left', 'right'].map(function (side) {
      var left = side === 'left' ? 16 : vw - size - 16;
      var leftEdge = side === 'left' ? left : left + size - menuW;
      var rightEdge = side === 'left' ? left + menuW : left + size;
      var bottom = base;
      var viable = false;
      for (var i = 0; i < 12; i++) {
        var rect = { left: leftEdge, right: rightEdge, bottom: vh - bottom,
          top: vh - bottom - size - menuH };
        var hits = obstacles.filter(function (b) { return intersects(rect, b); });
        if (!hits.length && rect.top >= 68) { viable = true; break; }
        if (!hits.length) break;
        bottom = Math.max(bottom + 8, vh - Math.min.apply(null, hits.map(function (b) { return b.top; })) + gap);
        if (vh - bottom - size - menuH < 68) break;
      }
      return { side: side, bottom: bottom, viable: viable };
    });
    var pick = choices.filter(function (x) { return x.viable; })
      .sort(function (a, b) { return a.bottom - b.bottom; })[0];
    if (!pick) {
      root.hidden = true; // never obscure dock or floating controls on a cramped viewport
      return;
    }
    root.dataset.side = pick.side;
    root.style.setProperty('--quick-call-bottom', pick.bottom + 'px');
  }
  function schedule() {
    if (!raf) raf = requestAnimationFrame(sync);
  }
  toggle.addEventListener('click', function () { setOpen(!expanded()); });
  document.addEventListener('click', function (event) {
    if (expanded() && !root.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && expanded()) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('overlay:opening', function () { if (expanded()) setOpen(false); schedule(); });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedule, { passive: true });
    window.visualViewport.addEventListener('scroll', schedule, { passive: true });
  }
  if (typeof MutationObserver === 'function') {
    new MutationObserver(function (records) {
      if (records.some(function (m) { return m.target !== root && !root.contains(m.target); })) schedule();
    }).observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['class', 'hidden', 'style'] });
  }
  schedule();
})();
