---
layout: default
title: All Motorbike Guides
permalink: /articles/
description: "Every published guide on the Hanoi Motorbike Guide, grouped by topic: rental, licences, maintenance, safety, trips and more."
---
{% include breadcrumbs.html %}
<h1>All Motorbike Guides</h1>
<p>Every published guide on this site, grouped by topic. {{ site.articles | size }} guides so far.</p>
{% assign clusters = "rental,monthly-rental,scooters,motorcycles,manual-clutch,50cc,electric,maintenance,parts-gear,safety,law-licences,hanoi,trips,vietnam-travel" | split: "," %}
{% for c in clusters %}
  {% assign hub_permalink = "/topics/" | append: c | append: "/" %}
  {% assign hub = site.pages | where: "permalink", hub_permalink | first %}
  {% assign cluster_articles = site.articles | where: "topic_cluster", c %}
  {% if hub and cluster_articles.size > 0 %}
<h2><a href="{{ hub.url | relative_url }}">{{ hub.title }}</a></h2>
<ul class="card-list">
    {% for a in cluster_articles %}
  <li class="card">
    <a href="{{ a.url | relative_url }}">
      <span class="card-title">{{ a.title }}</span>
      <span class="card-desc">{{ a.description }}</span>
    </a>
  </li>
    {% endfor %}
</ul>
  {% endif %}
{% endfor %}
