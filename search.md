---
layout: default
title: Search
permalink: /search/
---
<h1>Search the guide</h1>
<div class="search-field">
  <span class="search-field-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/></svg></span>
  <input id="searchInput" class="search-box" type="search" placeholder="Search guides&hellip;" data-index="{{ '/search.json' | relative_url }}" aria-label="Search guides" autocomplete="off">
  <button type="button" id="searchClear" class="search-clear" aria-label="Clear search" hidden>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z"/></svg>
  </button>
</div>
<div id="searchSuggest" class="search-suggest">
  <p class="search-suggest-label">Suggested topics</p>
  <div class="search-suggest-tags">
    <a class="suggest-tag" href="{{ '/topics/law-licences/' | relative_url }}">Driving licence</a>
    <a class="suggest-tag" href="{{ '/topics/rental/' | relative_url }}">Rental</a>
    <a class="suggest-tag" href="{{ '/topics/safety/' | relative_url }}">Helmet law</a>
    <a class="suggest-tag" href="{{ '/topics/electric/' | relative_url }}">Electric bikes</a>
    <a class="suggest-tag" href="{{ '/topics/maintenance/' | relative_url }}">Maintenance</a>
    <a class="suggest-tag" href="{{ '/topics/trips/' | relative_url }}">Trips from Hanoi</a>
  </div>
</div>
<ul id="searchResults" class="card-list" aria-live="polite"></ul>
