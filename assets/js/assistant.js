(function () {
  // Guide Assistant UI — overlay + rendering around AssistantCore (assets/js/assistant-core.js).
  // Retrieval, business answers, multi-turn context and answer composition live in the core.
  // Deterministic and browser-only: no external AI/API, no persistence, page-memory context.
  var fab = document.getElementById('assistantFab');
  var panel = document.getElementById('assistantPanel');
  var backdrop = document.getElementById('assistantBackdrop');
  var closeBtn = document.getElementById('assistantClose');
  var msgs = document.getElementById('assistantMsgs');
  var suggest = document.getElementById('assistantSuggest');
  var form = document.getElementById('assistantForm');
  var input = document.getElementById('assistantInput');
  var indexUrl = document.querySelector('script[data-assistant-index]');
  var indexPromise = null;
  var biz = window.ASSISTANT_BUSINESS || null;
  var isOpen = false;
  var lastFocused = null;
  // Lightweight multi-turn session context (page memory only, never persisted or sent).
  var sessionCtx = {};

  function loadIndex() {
    if (!indexPromise) {
      var url = indexUrl ? indexUrl.getAttribute('data-assistant-index') : null;
      indexPromise = fetch(url).then(function (r) { return r.json(); }).then(function (idx) {
        // v2 format: {v:2, chunks:[...]}; older/flat arrays are accepted as-is.
        return (idx && idx.chunks) ? idx.chunks : idx;
      });
    }
    return indexPromise;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function msg(role, html) {
    var div = document.createElement('div');
    div.className = 'amsg amsg-' + role;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function sourceLine(recs) {
    var h = '<div class="amsg-sources"><span class="amsg-src-label">Read the guide:</span><ul>';
    recs.forEach(function (r) {
      h += '<li><a href="' + esc(r.url) + '">' + esc(r.title) + '</a></li>';
    });
    h += '</ul></div>';
    return h;
  }

  function contactBlock() {
    var b = biz || {};
    return '<div class="amsg-contact">' +
      '<a href="tel:' + esc(b.phone_href || '') + '">Call</a>' +
      '<a href="' + esc(b.whatsapp || '#') + '" rel="noopener">WhatsApp</a>' +
      '<a href="' + esc(b.zalo || '#') + '" rel="noopener">Zalo</a>' +
      '<a href="' + esc((window.ASSISTANT_LINKS && window.ASSISTANT_LINKS.contact) || '/english/contact/') + '">Contact page</a>' +
      '<a href="' + esc((window.ASSISTANT_LINKS && window.ASSISTANT_LINKS.search) || '/english/search/') + '">Search guides</a></div>';
  }

  function chips(items) {
    if (!items || !items.length || !suggest) return;
    var row = document.createElement('div');
    row.className = 'amsg-followups';
    items.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-q', q);
      b.textContent = q;
      row.appendChild(b);
    });
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function respond(q) {
    loadIndex().then(function (chunks) {
      var res = AssistantCore.answer(q, { chunks: chunks, biz: biz, ctx: sessionCtx });
      sessionCtx = res.ctx || {};
      msg('bot', res.html + (res.sources && res.sources.length ? sourceLine(res.sources) : '') +
        (res.fallback ? contactBlock() : ''));
      chips(res.followUps);
    }).catch(function () {
      msg('bot', "<p>I couldn't load the guide index right now.</p>" + contactBlock());
    });
  }

  // ---- Overlay management (mirrors hardened contact-sheet pattern) ----
  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = fab;
    // Only one overlay at a time: tell the contact sheet to close.
    document.dispatchEvent(new CustomEvent('overlay:opening', { detail: { id: 'assistant' } }));
    if (backdrop) { backdrop.hidden = false; backdrop.classList.add('is-open'); }
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (input) input.focus();
    if (!msgs.childElementCount) {
      msg('bot', "Hi! I can help you find information from Nguyen Tu\u2019s motorbike guides. Ask about rentals, prices, licences, 50cc bikes, safety, maintenance or trips.");
    }
  }
  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (backdrop) {
      backdrop.classList.remove('is-open');
      window.setTimeout(function () {
        if (backdrop && !isOpen) backdrop.hidden = true;
      }, 220);
    }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (fab) fab.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (backdrop) backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (panel.classList.contains('is-open')) closePanel();
  });
  // Contact sheet opens -> close assistant (single-overlay rule)
  document.addEventListener('overlay:opening', function (e) {
    if (e.detail && e.detail.id !== 'assistant' && isOpen) closePanel();
  });

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = (input.value || '').trim();
    if (!q) return;
    msg('user', '<p>' + esc(q) + '</p>');
    input.value = '';
    respond(q);
  });
  // Suggested chips inside the message list (follow-ups) use the same flow.
  if (msgs) msgs.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-q]');
    if (!b) return;
    var q = b.getAttribute('data-q');
    msg('user', '<p>' + esc(q) + '</p>');
    respond(q);
  });
  if (suggest) suggest.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-q]');
    if (!b) return;
    input.value = b.getAttribute('data-q');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  });
})();
