---
layout: default
title: All Motorbike Guides
permalink: /articles/
description: "Every published guide on the Hanoi Motorbike Guide, grouped by topic: rental, licences, maintenance, safety, trips and more."
---
{% include breadcrumbs.html %}
<h1>All Motorbike Guides</h1>
<p>Every published guide on this site, grouped by topic. {{ site.articles | size }} guides so far, with more added in regular batches.</p>

<div class="search-field">
  <span class="search-field-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/></svg></span>
  <input id="guidesInput" class="search-box" type="search" placeholder="Search guides&hellip;" aria-label="Filter guides by title, description or topic" autocomplete="off">
  <button type="button" id="guidesClear" class="search-clear" aria-label="Clear filter" hidden>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z"/></svg>
  </button>
</div>

<h2>Browse by topic</h2>
<ul class="topic-grid">
{% assign clusters = "rental,monthly-rental,scooters,motorcycles,manual-clutch,50cc,electric,maintenance,parts-gear,safety,law-licences,hanoi,trips,vietnam-travel" | split: "," %}
{% for c in clusters %}
  {% assign hub_permalink = "/topics/" | append: c | append: "/" %}
  {% assign hub = site.pages | where: "permalink", hub_permalink | first %}
  {% assign cluster_articles = site.articles | where: "topic_cluster", c %}
  {% if hub %}
  <li class="topic-card">
    <a class="topic-card-link" href="{{ hub.url | relative_url }}">
      <span class="topic-name">{{ hub.title }}</span>
      <span class="topic-count">{{ cluster_articles.size }} {% if cluster_articles.size == 1 %}guide{% else %}guides{% endif %}</span>
    </a>
    {% if cluster_articles.size > 0 %}
    <p class="topic-desc">{{ hub.description }}</p>
    {% else %}
    <p class="topic-desc">Guides are being prepared for this topic.</p>
    {% endif %}
  </li>
  {% endif %}
{% endfor %}
</ul>

<h2>Published guides</h2>
<p id="guidesNoResults" class="empty-note" hidden>No guides match your search. Try a different word, or browse the topics above.</p>
{% for c in clusters %}
  {% assign hub_permalink = "/topics/" | append: c | append: "/" %}
  {% assign hub = site.pages | where: "permalink", hub_permalink | first %}
  {% assign cluster_articles = site.articles | where: "topic_cluster", c %}
  {% if hub and cluster_articles.size > 0 %}
  {% assign topic_search = hub.title | downcase %}
  <section class="topic-group" data-topic="{{ c }}">
    <h3><a href="{{ hub.url | relative_url }}">{{ hub.title }}</a></h3>
    <ul class="card-list">
      {% for a in cluster_articles %}
      <li class="card" data-search="{{ a.title | downcase | escape }} {{ a.description | downcase | escape }} {{ topic_search | escape }}">
        <a href="{{ a.url | relative_url }}">
          <span class="card-title">{{ a.title }}</span>
          <span class="card-desc">{{ a.description }}</span>
        </a>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endif %}
{% endfor %}
